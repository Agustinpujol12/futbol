// src/app/(app)/dashboard/page.tsx
// --- ARCHIVO COMPLETO Y FINAL ---

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LeagueStandingsTable } from '@/components/dashboard/LeagueStandingsTable';
import { MatchOfTheDay } from '@/components/dashboard/MatchOfTheDay';
import { StrategyCardManager } from '@/components/strategy/strategy-cards';
import { LineupBuilder } from '@/components/lineup/lineup-builder';
import { FixtureTab } from "@/components/dashboard/FixtureTab";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Coins, Users, AlarmClock } from 'lucide-react'; 
import {
  type Player,
  type GameDay,
  type DailyLineup,
  type Profile,
} from './types';

type League = {
  id: string;
  name: string | null;
  entry_fee: number;
  max_participants: number;
};

type Matchup = {
  id: string;
  home_user_id: string;
  away_user_id: string;
  match_day_number: number;
};

function AestheticCountdownTimer() {
  return (
    <div className="flex items-center gap-2">
      <AlarmClock className="h-5 w-5 text-destructive animate-pulse" />
      <div className="text-right">
        <span className="text-xl font-bold font-mono text-destructive">
          23:15:42
        </span>
        <p className="text-xs text-muted-foreground -mt-1">
          Cierre de Alineación
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  
  // --- DATOS DEL USUARIO ---
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gameDay, setGameDay] = useState<GameDay | null>(null);
  const [squad, setSquad] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<DailyLineup | null>(null);

  // --- DATOS DEL RIVAL ---
  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [opponentProfile, setOpponentProfile] = useState<Profile | null>(null);
  const [opponentSquad, setOpponentSquad] = useState<Player[]>([]);
  const [opponentLineup, setOpponentLineup] = useState<DailyLineup | null>(null);

  // --- ESTRATEGIA (Nuevo Estado) ---
  const [activeCardValue, setActiveCardValue] = useState<number>(1); // Multiplicador de carta (1 por defecto)

  // --- ESTADOS DE CARGA ---
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingLeagueData, setLoadingLeagueData] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [standings, setStandings] = useState<any[]>([]); 
  const [leagueFixture, setLeagueFixture] = useState<any[]>([]);

  const supabase = createClient();

  // --- EFECTO 1: Cargar usuario y sus ligas ---
  useEffect(() => {
    const fetchUserAndLeagues = async () => {
      setLoadingLeagues(true);
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        console.error('Error fetching user:', userErr);
        setErrorMsg('No se pudo autenticar al usuario.');
        setLoadingLeagues(false);
        return;
      }
      setUserId(user.id);
      const { data: profileData, error: profileErr } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileErr) console.error('Error fetching profile:', profileErr);
      else setProfile(profileData);
      const { data: memberData, error: memberErr } = await supabase.from('league_members').select('league_id').eq('user_id', user.id);
      if (memberErr) {
        console.error('Error fetching league_members:', memberErr);
        setErrorMsg('No se pudieron cargar tus ligas.');
        setLoadingLeagues(false);
        return;
      }
      if (memberData.length === 0) {
        setLeagues([]);
        setLoadingLeagues(false);
        return;
      }
      const leagueIds = memberData.map((m: any) => m.league_id);
      const { data: leaguesData, error: leaguesErr } = await supabase.from('leagues').select('id, name, entry_fee, max_participants').in('id', leagueIds).order('entry_fee', { ascending: true });
      if (leaguesErr) {
        console.error('Error fetching leagues:', leaguesErr);
        setErrorMsg('Error al cargar los detalles de las ligas.');
      } else {
        setLeagues(leaguesData as League[]);
      }
      setLoadingLeagues(false);
    };
    fetchUserAndLeagues();
  }, [supabase]);

  // --- EFECTO 2: Cargar datos de la liga seleccionada ---
  useEffect(() => {
    if (!selectedLeague || !userId) return;

    const fetchLeagueData = async () => {
      setLoadingLeagueData(true);
      setErrorMsg(null);
      // Resetear datos
      setGameDay(null); setSquad([]); setLineup(null);
      setMatchup(null); setOpponentProfile(null); setOpponentSquad([]); setOpponentLineup(null);
      setLeagueFixture([]);
      setActiveCardValue(1); // Resetear multiplicador

      try {
        const GAME_DAY_ID = 'c77cd2ef-2c05-4e52-9c62-69496a39903b'; // Tu ID fijo

        // 1. Traer game_day
        const { data: gameDayData, error: gdErr } = await supabase
          .from('game_days')
          .select('*')
          .eq('id', GAME_DAY_ID)
          .single();
        if (gdErr || !gameDayData) throw new Error('Jornada no encontrada.');
        setGameDay(gameDayData);

        // 1.5. Traer Tabla de Posiciones (con *)
        const { data: standingsData, error: standingsErr } = await supabase
          .from('league_members')
          .select('*, profiles ( username )') // <--- IMPORTANTE: Traer todo
          .eq('league_id', selectedLeague.id);
        
        if (standingsErr) {
          console.error("Error standings", standingsErr) 
          throw new Error('No se pudo cargar la tabla de posiciones.');
        }
        setStandings(standingsData || []);

        // 1.8. Traer Fixture
        const { data: fixtureData, error: fixtureErr } = await supabase
          .from('league_matchups')
          .select(`
            match_day_number,
            home_score, away_score,
            home_user:profiles!home_user_id ( username ),
            away_user:profiles!away_user_id ( username )
          `)
          .eq('league_id', selectedLeague.id)
          .order('match_day_number', { ascending: true });
        
        if (fixtureErr) {
          console.error("Error fetching fixture:", fixtureErr);
          throw new Error('No se pudo cargar el fixture.');
        }
        setLeagueFixture(fixtureData || []);

        // 2. Encontrar Partido y Rival
        const { data: matchupData, error: matchupErr } = await supabase
          .from('league_matchups')
          .select('*') 
          .eq('league_id', selectedLeague.id)
          .eq('game_day_id', GAME_DAY_ID)
          .or(`home_user_id.eq.${userId},away_user_id.eq.${userId}`)
          .single();
        
        let opponentUserId: string | null = null;
        if (matchupErr || !matchupData) {
          console.warn('No se encontró un partido para este usuario en esta fecha.');
        } else {
          setMatchup(matchupData);
          opponentUserId = matchupData.home_user_id === userId 
            ? matchupData.away_user_id 
            : matchupData.home_user_id;
        }

        // 3. Datos del Rival
        if (opponentUserId) {
          const { data: oppProfileData } = await supabase.from('profiles').select('*').eq('id', opponentUserId).single();
          setOpponentProfile(oppProfileData);

          const { data: oppSquadData } = await supabase.from('daily_squads').select('player_ids').eq('user_id', opponentUserId).eq('game_day_id', GAME_DAY_ID).eq('league_id', selectedLeague.id).single();
          
          if (oppSquadData && oppSquadData.player_ids) {
            const { data: oppPlayersData, error: oppPlayersErr } = await supabase
              .from('players')
              .select('*, teams ( name, pot, logo_url ), player_scores ( score )')
              .eq('player_scores.game_day_id', GAME_DAY_ID)
              .in('id', oppSquadData.player_ids);
            
            if (oppPlayersErr) {
              console.error("Error fetching rival players/scores:", oppPlayersErr);
              throw new Error('No se pudieron cargar los jugadores del rival.');
            }
            setOpponentSquad(oppPlayersData || []);
            
            const { data: oppLineupData } = await supabase.from('daily_lineups').select('*').eq('user_id', opponentUserId).eq('game_day_id', GAME_DAY_ID).eq('league_id', selectedLeague.id).single();
            setOpponentLineup(oppLineupData || null);
          }
        }

        // 4. Datos del USUARIO LOGUEADO
        const { data: squadData, error: squadErr } = await supabase
          .from('daily_squads')
          .select('player_ids')
          .eq('user_id', userId)
          .eq('game_day_id', GAME_DAY_ID)
          .eq('league_id', selectedLeague.id)
          .single();

        if (squadErr || !squadData || !squadData.player_ids) {
          console.warn('No se encontró daily_squad para el usuario logueado.');
        } else {
          const playerIds: string[] = squadData.player_ids || [];
          
          const { data: playersData, error: playersErr } = await supabase
            .from('players')
            .select('*, teams ( name, pot, logo_url ), player_scores ( score )')
            .eq('player_scores.game_day_id', GAME_DAY_ID)
            .in('id', playerIds);
            
          if (playersErr) {
            console.error("Error fetching user players/scores:", playersErr);
            throw new Error('No se pudieron cargar los jugadores del usuario.');
          }
          setSquad(playersData || []);

          const { data: lineupData } = await supabase
            .from('daily_lineups')
            .select('*')
            .eq('user_id', userId)
            .eq('game_day_id', GAME_DAY_ID)
            .eq('league_id', selectedLeague.id)
            .single();
          setLineup(lineupData || null);
        }

// 5. 🃏 BUSCAR CARTA ACTIVA (MULTIPLICADOR) - CORREGIDO
        const { data: activeCardData } = await supabase
          .from('user_match_cards')
          .select(`
             card_id,
             strategy_cards ( effect_value )
          `)
          .eq('user_id', userId)
          .eq('game_day_id', GAME_DAY_ID)
          .single();

        if (activeCardData && activeCardData.strategy_cards) {
           // ⚠️ CORRECCIÓN AQUÍ:
           // Supabase a veces devuelve esto como array. Verificamos y accedemos al primero [0].
           const strategies = activeCardData.strategy_cards as any; 
           const effect = Array.isArray(strategies) ? strategies[0]?.effect_value : strategies?.effect_value;
           
           setActiveCardValue(Number(effect || 1));
        } else {
           setActiveCardValue(1); 
        }

      } catch (err: any) {
        console.error('Error loading league data:', err);
        setErrorMsg(err.message);
      } finally {
        setLoadingLeagueData(false);
      }
    };
    fetchLeagueData();
  }, [selectedLeague, userId, supabase]);

  // --- RENDERIZADO ---
  return (
    <div className="container mx-auto py-8">
      
      {/* Header y Grid de Ligas */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Tu Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          {selectedLeague ? `Gestionando la liga: ${selectedLeague.name}` : 'Selecciona una liga para ver tu progreso, estadísticas y estrategias.'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loadingLeagues ? (
          <p className="col-span-full text-center text-muted-foreground">Cargando tus ligas...</p>
        ) : leagues.length > 0 ? (
          leagues.map((league) => (
            <motion.div key={league.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Card
                onClick={() => setSelectedLeague(league)}
                className={`cursor-pointer transition-all rounded-xl ${selectedLeague?.id === league.id ? 'border-2 border-primary shadow-lg bg-primary/5' : 'hover:shadow-md hover:border-primary/30 border border-muted'}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-headline text-center">{league.name || `Liga`}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="flex justify-center items-center gap-2">
                    <Coins className="w-6 h-6 text-amber-400" />
                    <p className="text-4xl font-bold text-primary">${league.entry_fee}</p>
                  </div>
                  <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>Participantes: <span className="font-semibold text-foreground">{league.max_participants ?? 34}</span></span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">Aún no te has unido a ninguna liga.</p>
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
              
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-headline text-center flex items-center justify-center gap-2">
                  <span>{selectedLeague.name || `Liga`}</span>
                  {!loadingLeagueData && gameDay && (
                    <span className="text-lg text-primary/80 font-medium">
                      (Fecha {gameDay.match_day_number})
                    </span>
                  )}
                </CardTitle>
                
                <div className="absolute top-6 right-6">
                  {!loadingLeagueData && gameDay && (
                    <AestheticCountdownTimer />
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {loadingLeagueData ? (
                  <p className="text-center text-muted-foreground py-10">Cargando datos de la liga...</p>
                ) : errorMsg ? (
                  <p className="text-center text-destructive py-6">{errorMsg}</p>
                ) : (
                  <Tabs defaultValue="alineacion" className="w-full">
                    
                    <TabsList className="flex justify-center mb-10 bg-muted/40 p-3 rounded-xl gap-3">
                      {[
                        { value: 'alineacion', label: 'Alineación' },
                        { value: 'tabla', label: 'Tabla' },
                        { value: 'partido', label: 'Partido del Día' },
                        { value: 'fixture', label: 'Fixture' },
                        { value: 'estrategia', label: 'Estrategia' },
                      ].map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground font-semibold text-base rounded-lg px-6 py-3 transition-all hover:text-foreground hover:bg-muted/60"
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="alineacion">
                      <div className="py-6">
                        <LineupBuilder
                          availablePlayers={squad}
                          gameDay={gameDay}
                          userId={userId ?? 'unknown_user'}
                          leagueId={selectedLeague.id}
                          initialSelectedIds={lineup?.final_selection_ids || []}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="tabla">
                      <LeagueStandingsTable
                        standings={standings}
                        currentUserProfile={profile}
                        leagueName={selectedLeague.name}
                      />
                    </TabsContent>
                    
                    <TabsContent value="fixture">
                      <FixtureTab 
                        leagueFixture={leagueFixture} 
                        gameDay={gameDay} 
                      />
                    </TabsContent>

                    {/* --- PARTIDO DEL DÍA (CON EL MULTIPLICADOR NUEVO) --- */}
                    <TabsContent value="partido">
                      <MatchOfTheDay
                        profile={profile}
                        lineup={lineup}
                        squad={squad}
                        opponentProfile={opponentProfile}
                        opponentLineup={opponentLineup}
                        opponentSquad={opponentSquad}
                        matchup={matchup}
                        leagueId={selectedLeague?.id || null}
                        gameDay={gameDay}
                        activeCardMultiplier={activeCardValue} // ⚠️ AQUÍ SE PASA LA MAGIA
                      />
                    </TabsContent>

                    <TabsContent value="estrategia">
                      <StrategyCardManager
                        profile={profile}
                        matchup={matchup}
                        gameDay={gameDay}
                        leagueId={selectedLeague?.id || null}
                      />
                    </TabsContent>
                  </Tabs>
                )}

                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedLeague(null)}
                  >
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