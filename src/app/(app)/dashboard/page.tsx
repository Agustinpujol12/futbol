// src/app/(app)/dashboard/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategyCardManager } from "@/components/strategy/strategy-cards";
import { CircleDollarSign } from "lucide-react";
import { LineupBuilder } from "@/components/lineup/lineup-builder"; 
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { type Player, type GameDay, type DailySquad } from './types'; 

export const dynamic = 'force-dynamic';

// --- Función Helper para obtener los datos ---
async function getDashboardData(supabase: any, userId: string) {
  
  // ⚠️ ¡RECUERDA QUE ESTE ID ESTÁ HARCODEADO!
  const GAME_DAY_ID = 'd782fc04-c04b-471a-a687-aa24ac6af184'; // <-- ¡TU ID DE GAME_DAY!

  const { data: gameDay } = await supabase
    .from('game_days')
    .select('*')
    .eq('id', GAME_DAY_ID) 
    .single();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single();

  if (!gameDay) {
    return { profile, squad: null, squadWithDetails: [], gameDay: null }; 
  }

  // --- ¡CAMBIO IMPORTANTE AQUÍ! ---
  // 3. Obtener la plantilla (squad) completa, no solo los player_ids
  const { data: squad } = await supabase
    .from('daily_squads')
    .select('player_ids, league_id') // <-- AHORA PEDIMOS TAMBIÉN LA LEAGUE_ID
    .eq('user_id', userId)
    .eq('game_day_id', gameDay.id)
    .single();
  // --- FIN DEL CAMBIO ---

  if (!squad) {
    // El sorteo aún no se ha corrido
    return { profile, squad: null, squadWithDetails: [], gameDay };
  }

  // 4. Buscar los detalles de los 12 jugadores
  const playerIds = squad.player_ids;
  const { data: squadWithDetails } = await supabase
    .from('players')
    .select('*, teams ( name, pot )')
    .in('id', playerIds);

  // Devolvemos el 'squad' completo (que incluye league_id)
  return { profile, squad, squadWithDetails: squadWithDetails || [], gameDay };
}


// --- El Componente de la Página ---
export default async function DashboardPage() {
  
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Ahora recibimos 'squad' (con league_id)
  const { profile, squad, squadWithDetails, gameDay } = await getDashboardData(supabase, user.id);

  if (!profile) {
    return <div>Error: No se encontró el perfil. Contacta a soporte.</div>
  }

  if (profile.username === null) {
    const WelcomeForm = (await import('./WelcomeForm')).default; 
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

  // --- Si el usuario tiene perfil, muestra el Dashboard ---
  return (
    <div className="container mx-auto">
      {/* (El resto del header del dashboard sigue igual...) */}
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

      <Tabs defaultValue="lineup" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="lineup">Alineación (Día 1)</TabsTrigger>
          <TabsTrigger value="strategy">Cartas de Estrategia</TabsTrigger>
        </TabsList>
        <TabsContent value="lineup" className="mt-6">
            <LineupBuilder 
              availablePlayers={squadWithDetails} 
              gameDay={gameDay}
              userId={user.id}
              // --- ¡CAMBIO IMPORTANTE AQUÍ! ---
              // Le pasamos la league_id (o null si el squad no existe)
              leagueId={squad?.league_id || null}
              // --- FIN DEL CAMBIO ---
            />
        </TabsContent>
        <TabsContent value="strategy" className="mt-6">
            <StrategyCardManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}