import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js'; // 👈 Importamos el cliente básico

// 1. Configurar Mercado Pago
const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// 2. Configurar Supabase ADMIN (Para poder escribir sin estar logueado)
// Necesitas agregar SUPABASE_SERVICE_ROLE_KEY en tu .env.local y en Vercel
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: Request) {
  try {
    // A veces MP manda el body como texto, aseguramos que sea JSON
    const body = await req.json().catch(() => null);
    
    // Verificamos que sea un evento de pago
    if (body?.type !== 'payment') {
        // Respondemos 200 para que MP deje de insistir
        return Response.json({ ok: true }); 
    }

    // Obtenemos el ID del pago
    const paymentId = body.data.id;
    console.log("🔔 WEBHOOK RECIBIDO. Pago ID:", paymentId);

    // Consultamos a Mercado Pago el estado REAL del pago
    const payment = new Payment(mp);
    const mpPayment = await payment.get({ id: paymentId });

    console.log("Estado del pago:", mpPayment.status);

    // Si no está aprobado, chau
    if (mpPayment.status !== 'approved') {
      return Response.json({ ok: true });
    }

    // Extraemos datos (UserId y LeagueId)
    const { userId, leagueId } = JSON.parse(
      mpPayment.external_reference || '{}'
    );

    if (!userId || !leagueId) {
        console.error("❌ Falta userId o leagueId en external_reference");
        return Response.json({ error: "Missing data" }, { status: 400 });
    }

    // 🚀 INSERTAMOS EN SUPABASE (Usando el admin)
    const { error } = await supabaseAdmin
      .from('league_members')
      .insert({
        league_id: leagueId,
        user_id: userId,
      });

    if (error) {
        // Si el error es código 23505, es que ya existe (duplicado). No es grave.
        if (error.code === '23505') {
            console.log("⚠️ El usuario ya estaba inscrito (Evento duplicado de MP)");
            return Response.json({ ok: true });
        }
        console.error("❌ Error insertando en DB:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ USUARIO INSCRITO EXITOSAMENTE VÍA WEBHOOK");
    return Response.json({ success: true });

  } catch (error: any) {
    console.error("❌ Webhook crash:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}