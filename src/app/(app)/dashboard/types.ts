// src/app/(app)/dashboard/types.ts
// --- ARCHIVO COMPLETO Y ACTUALIZADO ---

// --- Tabla 'teams' ---
export type Team = {
  id: string;
  name: string;
  pot: number;
  photo_url: string | null;
  logo_url: string | null;
};

// --- Tabla 'player_scores' ---
export type PlayerScore = {
  score: number;
};

// --- Tabla 'players' ---
export type Player = {
  id: string;
  created_at: string;
  name: string;
  position: 'Arquero' | 'Defensor' | 'Mediocampista' | 'Delantero';
  status: 'Titular' | 'Suplente';
  team_id: string;
  photo_url: string | null;
  teams: Team;
  player_scores: PlayerScore[];
};

// --- Tabla 'game_days' ---
export type GameDay = {
  id: string;
  match_date: string;
  teams_playings: string[];
  match_day_number: number;
};

// --- Tabla 'daily_squads' ---
export type DailySquad = {
  id: string;
  created_at: string;
  user_id: string;
  league_id: string;
  game_day_id: string;
  player_ids: string[];
};

// --- Tabla 'daily_lineups' ---
export type DailyLineup = {
  id: string;
  created_at: string;
  user_id: string;
  league_id: string;
  game_day_id: string;
  final_selection_ids: string[];
  updated_at?: string;
  boosted_player_id?: string | null;
};

// --- Tabla 'profiles' ---
export type Profile = {
  id: string;
  username: string | null;
  avatar_url?: string | null;
  // ✅ MODIFICADO: Ya no existe 'plus', ahora es binario (Free o Premium)
  plan_type: 'free' | 'premium';
  reputation: 'clean' | 'warning' | 'danger' | 'banned';
};