// src/lib/scoringRules.ts

// Definimos las posiciones para poder dar puntos diferentes
export type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Attacker';

// REGLAS GENERALES (Aplican a todos)
const generalRules = {
  MINUTES_PLAYED: (minutes: number) => (minutes > 60 ? 2 : (minutes > 0 ? 1 : 0)),
  ASSIST: 5,
  YELLOW_CARD: -2,
  RED_CARD: -7,
  PENALTY_MISSED: -5,
  PENALTY_COMMITTED: -3,
  PENALTY_SAVED: 8, // (Para Arqueros)
  PENALTY_SCORED: 4, // (No cuenta como gol normal)
  OWN_GOAL: -5, // Gol en contra
};

// REGLAS POR POSICIÓN (Se suman a las generales)
const positionRules = {
  Goalkeeper: {
    GOAL_SCORED: 12,
    CLEAN_SHEET: 5, // Valla invicta (si jugó +60 min y no recibió goles)
    SAVES: 0.5, // Puntos por cada atajada
    GOALS_CONCEDED: -1, // Puntos por cada gol recibido
  },
  Defender: {
    GOAL_SCORED: 8,
    CLEAN_SHEET: 4, // Valla invicta
    GOALS_CONCEDED: -0.5, // (Menos penalización que el arquero)
  },
  Midfielder: {
    GOAL_SCORED: 6,
    CLEAN_SHEET: 1, // (Una pequeña bonificación)
  },
  Attacker: {
    GOAL_SCORED: 5, // (Gana menos por gol, pero se espera que haga más)
  },
};

// Exportamos todo para que el "Robot" (Edge Function) pueda usarlo
export const scoringRules = {
  general: generalRules,
  positions: positionRules,
};