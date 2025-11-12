'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LeagueStandingsTable } from '@/components/dashboard/LeagueStandingsTable';
import { MatchOfTheDay } from '@/components/dashboard/MatchOfTheDay';
import { StrategyCardManager } from '@/components/strategy/strategy-cards';
import { LineupBuilder } from '@/components/lineup/lineup-builder';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Coins, Users } from 'lucide-react'


export default function DashboardPage() {
  const [selectedLeague, setSelectedLeague] = useState<any>(null);
  const [leagues, setLeagues] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchLeagues = async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .order('entry_fee', { ascending: true });
      if (!error && data) setLeagues(data);
      else if (error) console.error('Error fetchLeagues:', error);
    };
    fetchLeagues();
  }, [supabase]);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Tu Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          Selecciona una liga para ver tu progreso, estadísticas y estrategias.
        </p>
      </div>


{/* Grid de Ligas */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
  {leagues.length > 0 ? (
    leagues.map((league) => (
      <motion.div
        key={league.id}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          onClick={() => setSelectedLeague(league)}
          className={`cursor-pointer transition-all rounded-xl ${
            selectedLeague?.id === league.id
              ? 'border-2 border-primary shadow-lg bg-primary/5'
              : 'hover:shadow-md hover:border-primary/30 border border-muted'
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-headline text-center">
              {league.name || `Liga`}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-3">
            <div className="flex justify-center items-center gap-2">
              <Coins className="w-6 h-6 text-amber-400" />
              <p className="text-4xl font-bold text-primary">
                ${league.entry_fee}
              </p>
            </div>

            <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-sky-400" />
              <span>
                Participantes:{' '}
                <span className="font-semibold text-foreground">
                  {league.max_participants ?? 34}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))
  ) : (
    <p className="col-span-full text-center text-muted-foreground">
      No hay ligas disponibles.
    </p>
  )}
</div>


      {/* Panel dinámico */}
      <AnimatePresence mode="wait">
        {selectedLeague ? (
          <motion.div
            key={selectedLeague.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-center">
                  {selectedLeague.name || `Liga ${selectedLeague.entry_fee ? `$${selectedLeague.entry_fee}` : ''}`}
                </CardTitle>
              </CardHeader>

<CardContent>
  <Tabs defaultValue="alineacion" className="w-full">
    <TabsList className="flex justify-center mb-10 bg-muted/40 p-3 rounded-xl gap-3">
      {[
        { value: 'alineacion', label: 'Alineación' },
        { value: 'tabla', label: 'Tabla' },
        { value: 'partido', label: 'Partido del Día' },
        { value: 'estrategia', label: 'Estrategia' },
      ].map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary
                     text-muted-foreground font-semibold text-base rounded-lg px-6 py-3 transition-all
                     hover:text-foreground hover:bg-muted/60"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>

    {/* --- Alineación --- */}
    <TabsContent value="alineacion">
      <LineupSection leagueId={selectedLeague.id} />
    </TabsContent>

    {/* --- Tabla --- */}
    <TabsContent value="tabla">
      <LeagueStandingsTable />
    </TabsContent>

    {/* --- Partido del Día --- */}
    <TabsContent value="partido">
      <MatchOfTheDay />
    </TabsContent>

    {/* --- Estrategia --- */}
    <TabsContent value="estrategia">
      <StrategyCardManager />
    </TabsContent>
  </Tabs>

  <div className="flex justify-center mt-10">
    <Button variant="outline" onClick={() => setSelectedLeague(null)}>
      Volver a seleccionar liga
    </Button>
  </div>
</CardContent>


            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="no-league"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-xl"
          >
            <h2 className="text-2xl font-semibold font-headline mb-2">
              Selecciona una liga para ver tu información
            </h2>
            <p>Elige una liga del listado superior para comenzar.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -----------------------------
   LineupSection: fetch y passthrough
   ----------------------------- */
function LineupSection({ leagueId }: { leagueId: string }) {
  const [gameDay, setGameDay] = useState<any | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [initialSelectedIds, setInitialSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        // 1) obtener user cliente
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr) {
          console.error('getUser error:', userErr);
          if (mounted) setErrorMsg('No autorizado (auth).');
          setLoading(false);
          return;
        }
        if (!user) {
          if (mounted) setErrorMsg('Usuario no autenticado.');
          setLoading(false);
          return;
        }
        if (mounted) setUserId(user.id);

        // 2) traer game_day (usa tu ID fijo)
        const GAME_DAY_ID = 'c77cd2ef-2c05-4e52-9c62-69496a39903b';
        const { data: gameDayData, error: gdErr } = await supabase
          .from('game_days')
          .select('*')
          .eq('id', GAME_DAY_ID)
          .single();

        if (gdErr || !gameDayData) {
          console.error('game_day error:', gdErr);
          if (mounted) setErrorMsg('No se encontró la jornada (game_day).');
          setLoading(false);
          return;
        }

        // 3) daily_squad del usuario para ese game_day y league
        const { data: squad, error: squadErr } = await supabase
          .from('daily_squads')
          .select('*')
          .eq('user_id', user.id)
          .eq('game_day_id', GAME_DAY_ID)
          .eq('league_id', leagueId)
          .single();

        if (squadErr || !squad) {
          // Si no hay squad, devolvemos el gameDay y availablePlayers vacío => LineupBuilder mostrará su mensaje
          if (mounted) {
            setGameDay(gameDayData);
            setAvailablePlayers([]);
            setInitialSelectedIds([]);
            setErrorMsg(null);
          }
          setLoading(false);
          return;
        }

        // 4) players desde player_ids
        const playerIds: string[] = squad.player_ids || [];
        const { data: playersData, error: playersErr } = await supabase
          .from('players')
          .select('*, teams ( name, pot, logo_url )')
          .in('id', playerIds);

        if (playersErr) {
          console.error('players error:', playersErr);
          if (mounted) setErrorMsg('No se pudieron cargar los jugadores.');
          setLoading(false);
          return;
        }

        // 5) saved lineup (opcional)
        const { data: savedLineupData, error: lineupErr } = await supabase
          .from('daily_lineups')
          .select('final_selection_ids')
          .eq('user_id', user.id)
          .eq('game_day_id', GAME_DAY_ID)
          .eq('league_id', leagueId)
          .single();

        if (mounted) {
          setGameDay(gameDayData);
          setAvailablePlayers(playersData || []);
          setInitialSelectedIds(savedLineupData?.final_selection_ids || []);
          setErrorMsg(null);
        }
      } catch (err) {
        console.error('LineupSection error:', err);
        if (mounted) setErrorMsg('Error cargando la alineación.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [leagueId, supabase]);

  if (loading) return <p className="text-center text-muted-foreground py-10">Cargando alineación...</p>;
  if (errorMsg) return <p className="text-center text-destructive py-6">{errorMsg}</p>;

  return (
    <div className="py-6">
      <LineupBuilder
        availablePlayers={availablePlayers}
        gameDay={gameDay}
        userId={userId ?? 'unknown_user'}
        leagueId={leagueId}
        initialSelectedIds={initialSelectedIds}
      />
    </div>
  );
}
