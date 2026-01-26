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


// --- 2. LÓGICA EXISTENTE: CALCULAR POSICIONES DE LA LIGA ---

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

// --- 3. LÓGICA EXISTENTE: GUARDAR JUGADOR POTENCIADO (ESTRATEGIA) ---

export async function saveBoostedPlayerAction(
  lineupId: string, 
  playerId: string | null
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('daily_lineups')
    .update({ boosted_player_id: playerId })
    .eq('id', lineupId);

  if (error) {
    console.error('Error saving boosted player:', error);
    return { error: 'No se pudo guardar la selección.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

// --- 4. NUEVA LÓGICA: REPORTAR PARTIDO (DISCORD + DB) ---

export async function reportMatchAction(matchupId: string, reason: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'No autenticado' };

  // A. Marcar el partido en Supabase para proteger la evidencia (has_report = true)
  const { error } = await supabase
    .from('league_matchups')
    .update({ has_report: true })
    .eq('id', matchupId);

  if (error) {
    console.error('Error marcando reporte:', error);
    return { success: false, message: 'Error al guardar el reporte en DB.' };
  }

  // B. Enviar notificación al Webhook de Discord
  await sendDiscordAlert(matchupId, user.id, user.email || 'Sin email', reason);

  return { success: true, message: 'Reporte enviado.' };
}


// --- FUNCIONES AUXILIARES (Privadas) ---

// Auxiliar: Calcula la suma de puntajes de los titulares
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

    // 2. Sumar los puntajes de esos jugadores
    const { data: scores } = await supabase
        .from('player_scores')
        .select('score')
        .in('player_id', lineup.final_selection_ids);
    
    if (!scores) return 0;

    return scores.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
}

// Auxiliar: Actualiza estadísticas de miembro
async function updateMemberStats(supabase: any, leagueId: string, userId: string, stats: any) {
    const { data: current } = await supabase
        .from('league_members')
        .select('*')
        .eq('league_id', leagueId)
        .eq('user_id', userId)
        .single();

    if (!current) return;

    const newPj = (current.pj || 0) + 1;
    const newPts = (current.pts || 0) + stats.pts;
    const newV = (current.v || 0) + stats.v;
    const newE = (current.e || 0) + stats.e;
    const newD = (current.d || 0) + stats.d; 
    const newPf = (current.pf || 0) + stats.pf;
    const newPc = (current.pc || 0) + stats.pc;
    const newDf = newPf - newPc;

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
            df: newDf
        })
        .eq('league_id', leagueId)
        .eq('user_id', userId);
}

// Auxiliar: Envía alerta a Discord
async function sendDiscordAlert(matchupId: string, userId: string, userEmail: string, reason: string) {
  const webhookUrl = process.env.DISCORD_REPORT_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn("No se ha configurado DISCORD_REPORT_WEBHOOK_URL en .env");
    return;
  }

  const embed = {
    title: "🚨 REPORTE DE CONDUCTA",
    description: "Un usuario ha reportado un chat abusivo o comportamiento antideportivo.",
    color: 15548997, // Rojo
    fields: [
      { name: "Motivo", value: reason, inline: false },
      { name: "Reportado por", value: `${userEmail}`, inline: true },
      { name: "User ID", value: `\`${userId}\``, inline: true },
      { name: "Match ID", value: `\`${matchupId}\``, inline: false },
      { name: "Acción Automática", value: "✅ El chat ha sido preservado en la base de datos (no será borrado).", inline: false }
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "Global GoalGetters Admin System" }
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "Árbitro Bot",
        embeds: [embed],
      }),
    });
  } catch (err) {
    console.error('Error enviando a Discord:', err);
  }
}