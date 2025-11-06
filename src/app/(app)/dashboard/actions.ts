// src/app/(app)/dashboard/actions.ts
'use server' // ¡Importante!

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Definimos los tipos de los argumentos que esperamos
interface SaveLineupPayload {
  selectedPlayerIds: string[];
  gameDayId: string;
  leagueId: string;
  userId: string;
}

export async function saveLineupAction(payload: SaveLineupPayload) {
  const { selectedPlayerIds, gameDayId, leagueId, userId } = payload
  const supabase = createClient()

  // Verificación simple (aunque RLS también nos protege)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) {
    return { error: 'Error de autenticación.' }
  }

  // --- ¡LA LÓGICA DE GUARDADO! ---
  // Usamos "upsert" (actualizar o insertar)
  // Esto es inteligente: si el usuario guarda, y luego cambia de opinión
  // y vuelve a guardar, "upsert" actualizará la fila existente en lugar
  // de crear una nueva, basándose en el user_id y game_day_id.
  
  const { error } = await supabase
    .from('daily_lineups')
    .upsert({
      // Debemos especificar las columnas de conflicto
      // (la combinación única que identifica una fila)
      user_id: userId,
      league_id: leagueId,
      game_day_id: gameDayId,
      
      // Los datos que queremos insertar/actualizar
      final_selection_ids: selectedPlayerIds,
      updated_at: new Date().toISOString(), // Actualizamos la fecha
    }, {
      onConflict: 'user_id, league_id, game_day_id' // Las columnas de conflicto
    })

  if (error) {
    console.error('Error al guardar la alineación:', error)
    return { error: 'Error al guardar la alineación. Inténtalo de nuevo.' }
  }

  // Refrescamos el dashboard para que pueda mostrar un estado "Guardado" (en el futuro)
  revalidatePath('/dashboard')
  return { success: true }
}