// src/app/(app)/leagues/actions.ts
'use server' // ¡Importante! Esto lo marca como código de servidor

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache' // Para refrescar la página

export async function joinLeagueAction(leagueId: string) {
  // Usamos el helper del servidor (ya no pasamos 'cookies()')
  const supabase = createClient()

  // 1. Obtenemos el ID del usuario que está logueado
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No estás autenticado.' }
  }

  // --- ¡CAMBIO IMPORTANTE! ---
  // 2. Ya no hacemos .from('league_members').insert()
  // Ahora llamamos a nuestra nueva función RPC 'fn_join_league'
  const { error: rpcError } = await supabase
    .rpc('fn_join_league', { p_league_id: leagueId }) // Pasamos el argumento

  if (rpcError) {
    // 3. Manejamos errores (como unirse dos veces)
    
    // El código '23505' es el error de "unicidad" (ya está en la liga)
    // La función RPC fallará si el INSERT en league_members falla.
    if (rpcError.code === '23505') { 
      return { error: '¡Ya estás en esta liga!' }
    }

    console.error('Error al unirse a la liga (RPC):', rpcError.message)
    return { error: 'Error de base de datos, no se pudo unir.' }
  }
  // --- FIN DEL CAMBIO ---

  // 4. ¡Éxito!
  // La función 'revalidatePath' le dice a Next.js que la página de ligas
  // está "sucia" (stale) y debe recargar los datos.
  revalidatePath('/leagues') 
  return { success: true }
}