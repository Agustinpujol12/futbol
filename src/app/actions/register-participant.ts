'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function registerLeagueParticipant(leagueId: string) {
  // Nota: Agregamos await a createClient() por reglas de Next.js
  const supabase = await createClient()
  
  // 1. Verificamos quién es el usuario actual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  // 2. Insertamos en TU tabla existente 'league_members'
  const { error } = await supabase
    .from('league_members') 
    .insert({
      user_id: user.id,
      league_id: leagueId
    })

  // Si da error de "duplicado", es que ya estaba inscrito. Lo ignoramos.
  if (error && error.code !== '23505') {
    console.error("Error al inscribir:", error)
    return { success: false, error: error.message }
  }

  // 3. También guardamos el registro en la tabla de pagos (historial)
  await supabase.from('payments').insert({
    user_id: user.id,
    league_id: leagueId,
    amount: 100, 
    status: 'approved',
    mp_payment_id: 'sandbox_simulated' 
  })

  // --- 👇 NUEVO: CREAMOS LA NOTIFICACIÓN SI TODO SALIÓ BIEN ---
  // Solo la enviamos si no hubo error de duplicado (es decir, si es su primera vez pagando)
  if (!error) {
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'league',
      title: '¡Inscripción Confirmada!',
      message: 'Tu lugar en la liga está asegurado. ¡Ve a Mi Equipo para empezar a planear tu estrategia!'
    })
  }
  // ------------------------------------------------------------

  // 4. Refrescamos la página para que se vea el cambio
  revalidatePath('/leagues')
  
  return { success: true }
}