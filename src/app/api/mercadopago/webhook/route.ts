import { MercadoPagoConfig, Payment } from 'mercadopago';
// 👇 IMPORTANTE: Usamos la librería base, NO la de @/lib/supabase/server
import { createClient } from '@supabase/supabase-js'; 

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// 👇 AQUÍ ESTÁ EL TRUCO: Creamos un cliente ADMIN explícito
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (body?.type !== 'payment') {
      return Response.json({ ok: true });
    }

    const paymentId = body.data.id;
    console.log("🔔 WEBHOOK: Verificando pago ID:", paymentId);

    const payment = new Payment(mp);
    const mpPayment = await payment.get({ id: paymentId });

    if (mpPayment.status !== 'approved') {
      console.log("⚠️ Pago no aprobado todavía:", mpPayment.status);
      return Response.json({ ok: true });
    }

    const { userId, leagueId } = JSON.parse(
      mpPayment.external_reference || '{}'
    );

    if (!userId || !leagueId) {
       console.error("❌ Faltan datos en external_reference");
       return Response.json({ error: "Missing metadata" }, { status: 400 });
    }

    // 🚀 USAMOS 'supabaseAdmin' (El que tiene la llave maestra)
    const { error } = await supabaseAdmin
      .from('league_members')
      .insert({
        league_id: leagueId,
        user_id: userId,
      });

    if (error) {
      // Ignoramos si ya estaba inscrito (Código 23505)
      if (error.code === '23505') {
          console.log("✅ Usuario ya estaba inscrito.");
          return Response.json({ ok: true });
      }
      console.error("❌ Error insertando en DB:", error);
      throw error; // Esto lanzará el error 500 para que lo veamos en logs si falla
    }

    console.log("✅ ¡INSCRIPCIÓN EXITOSA POR WEBHOOK!");
    return Response.json({ success: true });

  } catch (error: any) {
    console.error("❌ CRASH WEBHOOK:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}