// src/app/(app)/dashboard/page.tsx
// --- ARCHIVO PRINCIPAL ACTUALIZADO (CON LÓGICA DE RIVAL) ---

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
import { Coins, Users } from 'lucide-react';
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

// --- TIPO PARA EL PARTIDO (NUEVO) ---
type Matchup = {
  id: string;
  home_user_id: string;
  away_user_id: string;
  match_day_number: number;
  // ... (cualquier otro campo de matchup)
};

export default function DashboardPage() {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  
  // --- DATOS DEL USUARIO ---
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gameDay, setGameDay] = useState<GameDay | null>(null);
  const [squad, setSquad] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<DailyLineup | null>(null);

  // --- DATOS DEL RIVAL (NUEVOS ESTADOS) ---
  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [opponentProfile, setOpponentProfile] = useState<Profile | null>(null);
  const [opponentSquad, setOpponentSquad] = useState<Player[]>([]);
  const [opponentLineup, setOpponentLineup] = useState<DailyLineup | null>(null);

  // --- ESTADOS DE CARGA ---
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingLeagueData, setLoadingLeagueData] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [standings, setStandings] = useState<any[]>([]); // Guardará la lista de equipos

  const supabase = createClient();

  // --- EFECTO 1: Cargar usuario y sus ligas inscritas (sin cambios) ---
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

  // --- EFECTO 2: Cargar datos de la liga seleccionada (MODIFICADO) ---
  useEffect(() => {
    if (!selectedLeague || !userId) return;

    const fetchLeagueData = async () => {
      setLoadingLeagueData(true);
      setErrorMsg(null);
      // Resetea TODOS los datos
      setGameDay(null); setSquad([]); setLineup(null);
      setMatchup(null); setOpponentProfile(null); setOpponentSquad([]); setOpponentLineup(null);

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

        // --- INICIO DE NUEVA LÓGICA ---
        // 1.5. Traer la tabla de posiciones (miembros y sus perfiles)
const { data: standingsData, error: standingsErr } = await supabase
        .from('league_members')
        .select(`
          user_id,
          profiles ( username )
        `)
        .eq('league_id', selectedLeague.id);
      
      if (standingsErr) {
        console.error("Error standings", standingsErr) // Añadimos un log para ver el error si persiste
        throw new Error('No se pudo cargar la tabla de posiciones.');
      }
      setStandings(standingsData || []);
        // --- FIN DE NUEVA LÓGICA ---

        // --- INICIO: LÓGICA DEL RIVAL ---
        
        // 2. Encontrar el partido y el ID del rival
        const { data: matchupData, error: matchupErr } = await supabase
          .from('league_matchups')
          .select('*') // Get everything
          .eq('league_id', selectedLeague.id)
          .eq('game_day_id', GAME_DAY_ID)
          .or(`home_user_id.eq.${userId},away_user_id.eq.${userId}`)
          .single();
        
        let opponentUserId: string | null = null;
        if (matchupErr || !matchupData) {
          console.warn('No se encontró un partido para este usuario en esta fecha.');
          // No lanzamos error, puede que solo quiera ver la pestaña "Alineación"
        } else {
          setMatchup(matchupData);
          opponentUserId = matchupData.home_user_id === userId 
            ? matchupData.away_user_id 
            : matchupData.home_user_id;
        }

        // 3. Si encontramos un rival, buscar sus datos
        if (opponentUserId) {
          // Perfil del Rival
          const { data: oppProfileData } = await supabase.from('profiles').select('*').eq('id', opponentUserId).single();
          setOpponentProfile(oppProfileData);

          // Plantilla (Squad) del Rival
          const { data: oppSquadData } = await supabase.from('daily_squads').select('player_ids').eq('user_id', opponentUserId).eq('game_day_id', GAME_DAY_ID).eq('league_id', selectedLeague.id).single();
          
          if (oppSquadData && oppSquadData.player_ids) {
            // Detalles de jugadores del Rival
            const { data: oppPlayersData } = await supabase.from('players').select('*, teams ( name, pot, logo_url )').in('id', oppSquadData.player_ids);
            setOpponentSquad(oppPlayersData || []);
            
            // Alineación (Lineup) guardada del Rival
            const { data: oppLineupData } = await supabase.from('daily_lineups').select('*').eq('user_id', opponentUserId).eq('game_day_id', GAME_DAY_ID).eq('league_id', selectedLeague.id).single();
            setOpponentLineup(oppLineupData || null);
          }
        }
        // --- FIN: LÓGICA DEL RIVAL ---


        // 4. Traer datos del USUARIO LOGUEADO (como antes)
        const { data: squadData, error: squadErr } = await supabase
          .from('daily_squads')
          .select('player_ids')
          .eq('user_id', userId)
          .eq('game_day_id', GAME_DAY_ID)
          .eq('league_id', selectedLeague.id)
          .single();

        if (squadErr || !squadData || !squadData.player_ids) {
          console.warn('No se encontró daily_squad para el usuario logueado.');
          // Esto es normal si el sorteo no se corrió
        } else {
           // 5. Traer detalles de los 12 jugadores (USUARIO)
          const playerIds: string[] = squadData.player_ids || [];
          const { data: playersData, error: playersErr } = await supabase
            .from('players')
            .select('*, teams ( name, pot, logo_url )')
            .in('id', playerIds);
          if (playersErr) throw new Error('No se pudieron cargar los jugadores del usuario.');
          setSquad(playersData || []);

          // 6. Traer daily_lineup (USUARIO)
          const { data: lineupData } = await supabase
            .from('daily_lineups')
            .select('*')
            .eq('user_id', userId)
            .eq('game_day_id', GAME_DAY_ID)
            .eq('league_id', selectedLeague.id)
            .single();
          setLineup(lineupData || null);
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
      
      {/* ... Tu código de Header y Grid de Ligas ... */}
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
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-center flex items-center justify-center gap-2">
                  <span>{selectedLeague.name || `Liga`}</span>
                  {!loadingLeagueData && gameDay && (
                    <span className="text-lg text-primary/80 font-medium">
                      (Fecha {gameDay.match_day_number})
                    </span>
                  )}
                </CardTitle>
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

                    {/* --- Alineación (Pasa props) --- */}
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

                    {/* --- Tabla --- */}
<TabsContent value="tabla">
                  <LeagueStandingsTable
                    standings={standings}
                    currentUserProfile={profile}
                    leagueName={selectedLeague.name}
                  />
                </TabsContent>

                    {/* --- Partido del Día (Pasa TODAS las props) --- */}
                    <TabsContent value="partido">
                      <MatchOfTheDay
                        profile={profile}
                        lineup={lineup}
                        squad={squad}
                        // --- PROPS DEL RIVAL ---
                        opponentProfile={opponentProfile}
                        opponentLineup={opponentLineup}
                        opponentSquad={opponentSquad}
                        matchup={matchup}
                      />
                    </TabsContent>

                    {/* --- Estrategia --- */}
                    <TabsContent value="estrategia">
                      <StrategyCardManager />
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