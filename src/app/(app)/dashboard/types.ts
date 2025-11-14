// --- Tabla 'teams' ---
export type Team = {
  id: string;
  name: string;
  pot: number;
  photo_url: string | null; // Logo del equipo (opcional)
  logo_url: string | null;
};

// --- Tabla 'players' ---
export type Player = {
  id: string;
  created_at: string;
  name: string;
  position: 'Arquero' | 'Defensor' | 'Mediocampista' | 'Delantero';
  status: 'Titular' | 'Suplente';
  team_id: string;
  photo_url: string | null; // ✅ Agregada: imagen del jugador
  teams: Team; // Relación: equipo del jugador
};

// --- Tabla 'game_days' ---
export type GameDay = {
  id: string;
  match_date: string;
  teams_playings: string[];
  match_day_number: number; // <-- ¡AÑADE ESTA LÍNEA!
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
  
};

export type Profile = {
  id: string;
  username: string | null;
  // ... (cualquier otro campo que tengas)
};