// src/app/(app)/dashboard/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- 1. LÓGICA EXISTENTE: GUARDAR ALINEACIÓN ---

interface SaveLineupPayload {
  selectedPlayerIds: string[];
  gameDayId: string;
  leagueId: string;
  userId: string;
}

export async function saveLineupAction(payload: SaveLineupPayload) {
  const { selectedPlayerIds, gameDayId, leagueId, userId } = payload
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) {
    return { error: 'Error de autenticación.' }
  }

  const { error } = await supabase
    .from('daily_lineups')
    .upsert({
      user_id: userId,
      league_id: leagueId,
      game_day_id: gameDayId,
      final_selection_ids: selectedPlayerIds,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id, league_id, game_day_id'
    })

  if (error) {
    console.error('Error al guardar la alineación:', error)
    return { error: 'Error al guardar la alineación. Inténtalo de nuevo.' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}


// --- 2. NUEVA LÓGICA: CALCULAR POSICIONES DE LA LIGA ---
// Esta función se llamará cuando quieras procesar una fecha terminada.

export async function calculateLeagueStandings(leagueId: string, gameDayId: string) {
  const supabase = createClient();

  // A. Obtener los enfrentamientos (matchups) de esa fecha y liga
  const { data: matchups, error: matchError } = await supabase
    .from('league_matchups')
    .select('*')
    .eq('league_id', leagueId)
    .eq('game_day_id', gameDayId);

  if (matchError || !matchups) return { error: 'Error al buscar partidos' };

  // B. Iterar por cada partido para calcular y actualizar
  for (const match of matchups) {
    // Calcular puntaje real sumando los jugadores titulares
    const score1 = await calculateTeamScore(supabase, match.user_1, gameDayId);
    const score2 = await calculateTeamScore(supabase, match.user_2, gameDayId);

    // Determinar puntos de liga (3 ganar, 1 empatar, 0 perder)
    const points1 = score1 > score2 ? 3 : (score1 === score2 ? 1 : 0);
    const points2 = score2 > score1 ? 3 : (score2 === score1 ? 1 : 0);

    // Determinar estadísticas (Ganado/Empatado/Perdido)
    const result1 = {
        v: score1 > score2 ? 1 : 0,
        e: score1 === score2 ? 1 : 0,
        d: score1 < score2 ? 1 : 0
    };
    const result2 = {
        v: score2 > score1 ? 1 : 0,
        e: score2 === score1 ? 1 : 0,
        d: score2 < score1 ? 1 : 0
    };

    // Actualizar tabla de posiciones (Usuario 1)
    await updateMemberStats(supabase, leagueId, match.user_1, {
        pts: points1,
        pf: score1, 
        pc: score2, 
        ...result1
    });

    // Actualizar tabla de posiciones (Usuario 2)
    await updateMemberStats(supabase, leagueId, match.user_2, {
        pts: points2,
        pf: score2,
        pc: score1,
        ...result2
    });
  }

  revalidatePath('/dashboard'); 
  return { success: true };
}

// --- FUNCIONES AUXILIARES (Privadas para este archivo) ---

// Calcula la suma de puntajes de los titulares de un usuario
async function calculateTeamScore(supabase: any, userId: string, gameDayId: string) {
    // 1. Buscar la alineación guardada
    const { data: lineup } = await supabase
        .from('daily_lineups')
        .select('final_selection_ids')
        .eq('user_id', userId)
        .eq('game_day_id', gameDayId)
        .single();

    if (!lineup || !lineup.final_selection_ids || lineup.final_selection_ids.length === 0) {
        return 0; // Si no hizo alineación, tiene 0 puntos
    }

    // 2. Sumar los puntajes de esos jugadores desde la tabla player_scores
    // Asumimos que player_scores tiene registros vinculados a los IDs de los jugadores
    const { data: scores } = await supabase
        .from('player_scores')
        .select('score')
        .in('player_id', lineup.final_selection_ids);
    
    if (!scores) return 0;

    // Suma simple de los scores encontrados
    return scores.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
}

// Actualiza la fila en league_members sumando lo nuevo a lo que ya tenía
async function updateMemberStats(supabase: any, leagueId: string, userId: string, stats: any) {
    // 1. Obtener datos actuales
    const { data: current } = await supabase
        .from('league_members')
        .select('*')
        .eq('league_id', leagueId)
        .eq('user_id', userId)
        .single();

    if (!current) return; // Si no existe el miembro, salimos (o podrías crearlo)

    // 2. Calcular nuevos acumulados
    const newPj = (current.pj || 0) + 1;
    const newPts = (current.pts || 0) + stats.pts;
    const newV = (current.v || 0) + stats.v;
    const newE = (current.e || 0) + stats.e;
    const newD = (current.d || 0) + stats.d; 
    const newPf = (current.pf || 0) + stats.pf;
    const newPc = (current.pc || 0) + stats.pc;
    const newDf = newPf - newPc; // Diferencia de puntos total

    // 3. Guardar en DB
    await supabase
        .from('league_members')
        .update({
            pj: newPj,
            pts: newPts,
            v: newV,
            e: newE,
            d: newD,
            pf: newPf,
            pc: newPc,
            df: newDf // Columna 'df' según tu imagen del types.ts o DB
        })
        .eq('league_id', leagueId)
        .eq('user_id', userId);
}