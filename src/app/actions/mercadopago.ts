'use server'

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function createLeaguePreference(leagueId: string, leagueName: string, price: number) {
  console.log("🔥 NUEVO INTENTO DE PAGO - ID:", leagueId);

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Debes iniciar sesión.');

  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: String(leagueId),
            title: `Inscripción: ${leagueName}`,
            unit_price: Number(price),
            quantity: 1,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          // Las URLs están bien, las dejamos así
          success: `http://localhost:9002/leagues?payment=success&leagueId=${leagueId}`,
          failure: `http://localhost:9002/leagues?payment=failure&leagueId=${leagueId}`,
          pending: `http://localhost:9002/leagues?payment=pending&leagueId=${leagueId}`,
        },
        // 👇 COMENTAMOS ESTA LÍNEA (Ponemos // al principio)
        // auto_return: 'approved', 
        
        external_reference: JSON.stringify({
          userId: user.id,
          leagueId: leagueId
        }),
      },
    });

    console.log("✅ LINK GENERADO:", result.init_point);
    return result.init_point;

  } catch (error: any) {
    console.error("❌ ERROR MP:", error);
    throw new Error(`Error MP: ${error.message}`);
  }
}