'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function registerLeagueParticipant(leagueId: string) {
  const supabase = await createClient()

  // 1. Verificamos el usuario logueado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No estás autenticado')

  // 2. Lo metemos a la liga con tu función
  const { error: rpcError } = await supabase
    .rpc('fn_join_league', { p_league_id: leagueId })

  if (rpcError) {
    if (rpcError.code === '23505') throw new Error('¡Ya estás en esta liga!')
    throw new Error('Error al unirse a la base de datos')
  }

  // 3. Revisamos cómo quedó la capacidad de la sala actual
  const { data: league } = await supabase
    .from('leagues')
    .select('participant_count, max_participants')
    .eq('id', leagueId)
    .single()

  // 4. Si con este usuario se llegó al tope, cerramos la sala
  if (league && league.participant_count >= league.max_participants) {
    await supabase
      .from('leagues')
      .update({ status: 'ready' }) // 'ready' la saca de la página principal
      .eq('id', leagueId)
  }

  // 5. Refrescamos la pantalla para todos
  revalidatePath('/leagues')
  return { success: true }
}