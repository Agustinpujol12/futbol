import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

// 🔐 Mercado Pago
const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

// 🔐 Supabase ADMIN (BYPASS RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    // MP manda muchos eventos → solo pagos
    if (body?.type !== 'payment') {
      return Response.json({ ok: true })
    }

    const paymentId = body.data.id
    console.log('🔔 Webhook recibido. Pago:', paymentId)

    const payment = new Payment(mp)
    const mpPayment = await payment.get({ id: paymentId })

    console.log('Estado MP:', mpPayment.status)

    if (mpPayment.status !== 'approved') {
      return Response.json({ ok: true })
    }

    // 🔗 Datos propios
    const { userId, leagueId } = JSON.parse(
      mpPayment.external_reference || '{}'
    )

    if (!userId || !leagueId) {
      console.error('❌ external_reference inválido')
      return Response.json({ error: 'Invalid reference' }, { status: 400 })
    }

    // 🧠 Insert ADMIN → ignora RLS
    const { error } = await supabaseAdmin
      .from('league_members')
      .insert({
        league_id: leagueId,
        user_id: userId,
      })

    if (error) {
      if (error.code === '23505') {
        console.log('⚠️ Usuario ya inscrito (webhook duplicado)')
        return Response.json({ ok: true })
      }

      console.error('❌ Error insertando en DB:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Usuario agregado correctamente')
    return Response.json({ success: true })

  } catch (err: any) {
    console.error('❌ Webhook crash:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
