// src/app/(app)/dashboard/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategyCardManager } from "@/components/strategy/strategy-cards";
import { CircleDollarSign } from "lucide-react";
import { LineupBuilder } from "@/components/lineup/lineup-builder";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  type Player,
  type GameDay,
  type DailySquad,
  type DailyLineup,
} from "./types";

// --- NUEVOS IMPORTS ---
import { LeagueStandingsTable } from "@/components/dashboard/LeagueStandingsTable";
import { MatchOfTheDay } from "@/components/dashboard/MatchOfTheDay";
// --- FIN NUEVOS IMPORTS ---

export const dynamic = "force-dynamic";

// --- Función Helper para obtener los datos ---
// --- Función Helper para obtener los datos (VERSIÓN LIMPIA - SIN HACK) ---
async function getDashboardData(supabase: any, userId: string) {

  const GAME_DAY_ID = 'c77cd2ef-2c05-4e52-9c62-69496a39903b'; // <-- ¡TU ID DE GAME_DAY!

  // 1. Buscamos el día de partido
  const { data: gameDay } = await supabase
    .from('game_days')
    .select('*')
    .eq('id', GAME_DAY_ID)
    .single();

  // 2. Buscamos el perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single();

  if (!gameDay) {
    // Si no hay día de partido, no podemos hacer nada más
    return { profile, squad: null, squadWithDetails: [], gameDay: null, savedLineup: null };
  }

  // 3. Obtener la plantilla (squad) sorteada (los 12 jugadores)
  const { data: squad } = await supabase
    .from('daily_squads')
    .select('player_ids, league_id') // Pedimos la league_id
    .eq('user_id', userId)
    .eq('game_day_id', gameDay.id)
    .single();

  if (!squad) {
    // El sorteo aún no se ha corrido
    console.warn("No se encontró 'daily_squad' (sorteo).");
    return { profile, squad: null, squadWithDetails: [], gameDay, savedLineup: null };
  }

  // 4. Buscar la ALINEACIÓN GUARDADA (los 8 jugadores elegidos)
  const { data: savedLineup } = await supabase
    .from('daily_lineups')
    .select('final_selection_ids') // Solo queremos el array de 8 IDs
    .eq('user_id', userId)
    .eq('game_day_id', gameDay.id)
    .eq('league_id', squad.league_id) // Para esta liga específica
    .single();

  // 5. Buscar los detalles de los 12 jugadores
  const playerIds = squad.player_ids;
  const { data: squadWithDetails } = await supabase
    .from('players')
    .select('*, teams ( name, pot, logo_url )') // Pedimos el logo_url
    .in('id', playerIds);

  // Devolvemos todo
  return {
    profile,
    squad,
    squadWithDetails: squadWithDetails || [],
    gameDay,
    savedLineup
  };
}

// --- Componente principal ---
export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ⬇️ Agregamos "squad" a la desestructuración
  const { profile, squad, squadWithDetails, gameDay, savedLineup } =
    await getDashboardData(supabase, user.id);

  if (!profile) {
    return <div>Error: No se encontró el perfil. Contacta a soporte.</div>;
  }

  if (profile.username === null) {
    const WelcomeForm = (await import("./WelcomeForm")).default;
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold">¡Bienvenido a Global GoalGetters!</h1>
        <p className="text-muted-foreground mb-4">
          Necesitas crear un nombre de usuario para continuar.
        </p>
        <WelcomeForm userId={user.id} />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-2 sm:mb-0">
          ¡Hola, {profile.username}!
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg">
            <CircleDollarSign className="h-6 w-6 text-accent" />
            <span className="font-semibold text-foreground">100,000</span>
            <span className="text-sm text-muted-foreground">Budget</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lineup" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="lineup">Alineación (Día 1)</TabsTrigger>
          <TabsTrigger value="table">Tabla</TabsTrigger>
          <TabsTrigger value="matchday">Partido del Día</TabsTrigger>
          <TabsTrigger value="strategy">Cartas de Estrategia</TabsTrigger>
        </TabsList>

        {/* Pestaña 1: Alineación */}
        <TabsContent value="lineup" className="mt-6">
          <LineupBuilder
            availablePlayers={squadWithDetails}
            gameDay={gameDay}
            userId={user.id}
            leagueId={squad?.league_id || null}
            initialSelectedIds={savedLineup?.final_selection_ids || []}
          />
        </TabsContent>

        {/* Pestaña 2: Tabla */}
        <TabsContent value="table" className="mt-6">
          <LeagueStandingsTable />
        </TabsContent>

        {/* Pestaña 3: Partido del Día */}
        <TabsContent value="matchday" className="mt-6">
          <MatchOfTheDay
            profile={profile}
            lineup={savedLineup}
            squad={squadWithDetails}
          />
        </TabsContent>

        {/* Pestaña 4: Estrategia */}
        <TabsContent value="strategy" className="mt-6">
          <StrategyCardManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
