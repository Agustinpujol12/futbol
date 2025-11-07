// src/app/(app)/dashboard/types.ts

// Definición de la tabla 'teams'
export type Team = {
  id: string;
  name: string;
  pot: number;
}

// Definición de la tabla 'players' (con el equipo anidado)
export type Player = {
  id: string;
  created_at: string;
  name: string;
  position: 'Arquero' | 'Defensor' | 'Mediocampista' | 'Delantero';
  status: 'Titular' | 'Suplente';
  team_id: string;
  teams: Team; // El objeto 'team' anidado que pedimos
}

// Definición de la tabla 'game_days'
export type GameDay = {
  id: string;
  match_date: string;
  teams_playings: string[]; // Array de IDs de equipos
}

// Definición de la tabla 'daily_squads'
export type DailySquad = {
  id: string;
  created_at: string;
  user_id: string;
  league_id: string;
  game_day_id: string;
  player_ids: string[]; // Array de IDs de jugadores
}

// --- ¡ESTO ES LO QUE FALTABA! ---
// Definición de la tabla 'daily_lineups'
export type DailyLineup = {
  id: string;
  created_at: string;
  user_id: string;
  league_id: string;
  game_day_id: string;
  final_selection_ids: string[]; // Array de 8 IDs
  updated_at?: string; // (La columna que agregaste, es opcional)
}