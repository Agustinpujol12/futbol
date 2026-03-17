'use server'

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/lib/supabase/server';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN!
});

export async function createLeaguePreference(
  leagueId: string,
  leagueName: string,
  price: number
) {
  console.log("🔥 GENERANDO LINK PAGO - ID:", leagueId);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

  // ✅ ESTA ES LA FORMA CORRECTA
  const isProduction = process.env.NODE_ENV === 'production';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Debes iniciar sesión.');

  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: leagueId,
            title: `Inscripción: ${leagueName}`,
            unit_price: Number(price),
            quantity: 1,
            currency_id: 'ARS',
          },
        ],

        back_urls: {
          success: `${baseUrl}/leagues?payment=success&leagueId=${leagueId}`,
          failure: `${baseUrl}/leagues?payment=failure&leagueId=${leagueId}`,
          pending: `${baseUrl}/leagues?payment=pending&leagueId=${leagueId}`,
        },

        // ✅ SOLO EN PRODUCCIÓN REAL
        ...(isProduction && {
          auto_return: 'approved',
        }),

        external_reference: JSON.stringify({
          userId: user.id,
          leagueId,
        }),
      },
    });

    console.log("✅ LINK CREADO:", result.init_point);
    return result.init_point;

  } catch (error: any) {
    console.error("❌ ERROR MP:", error);
    throw new Error(error.message);
  }
}