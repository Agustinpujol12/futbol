// src/components/dashboard/MatchOfTheDay.tsx
// --- ARCHIVO FINAL: ESTRUCTURA ORIGINAL + LÓGICA WIN/LOSE ---

'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FootballPitch } from './FootballPitch';
import { StrategyCardManager } from '@/components/strategy/strategy-cards';
import {
  type Player,
  type DailyLineup,
  type Profile,
  type GameDay,
} from '@/app/(app)/dashboard/types';

// --- UTILIDADES ---
const formatName = (name: string) => {
  if (!name) return '---';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) { return `${parts[0][0]}. ${parts.slice(1).join(' ')}`; }
  return name;
};

// --- COMPONENTES AUXILIARES ---
function ProfilePlaceholder({ title }: { title: string }) {
  return (
    <Card className="h-full">
      <CardHeader><CardTitle className="font-headline text-lg text-center">{title}</CardTitle></CardHeader>
      <CardContent className="text-center text-muted-foreground flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-primary/30">
          <span className="text-3xl opacity-50">?</span>
        </div>
        <p className="font-semibold text-sm">Próximamente</p>
      </CardContent>
    </Card>
  );
}

// --- PitchPlayerSlot ---
function PitchPlayerSlot({ 
  position, name, photo_url, top, left, isRival = false, teamLogoUrl, score 
}: { 
  position: string; name: string; photo_url: string | null | undefined; top: string; left: string; isRival?: boolean; teamLogoUrl: string | null | undefined; score: number | null | undefined;
}) {
  const scoreValue = (score !== null && score !== undefined) ? score : null;
  const scoreColor = 
    scoreValue === null ? 'bg-zinc-600 border-zinc-400' :
    scoreValue >= 8 ? 'bg-green-600 border-green-400' :
    scoreValue >= 6 ? 'bg-yellow-600 border-yellow-400' :
    'bg-red-600 border-red-400';

  return (
    <div className="absolute" style={{ top: `calc(${top} - 25px)`, left: `${left}`, transform: 'translateX(-50%)' }}>
      <div className="flex flex-col items-center">
        <div className="relative">
          {teamLogoUrl && (
              <img src={teamLogoUrl} alt="Team Logo" className="absolute -top-1 -left-1 w-4 h-4 rounded-full object-cover border border-gray-300 bg-white shadow-sm z-10" />
          )}
          <div className={`absolute -top-2 -right-2 min-w-[1.6rem] h-5 px-1 rounded-full ${scoreColor} text-white text-[11px] font-bold flex items-center justify-center z-10 border shadow-md`}>
            {scoreValue !== null ? scoreValue.toFixed(1) : '-'}
          </div>
          {photo_url ? (
            <img src={photo_url} alt={name} className={`w-10 h-10 rounded-full object-cover border-2 ${isRival ? 'border-destructive/50' : 'border-primary/50'}`} />
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border ${isRival ? 'bg-destructive/20 border-destructive/50' : 'bg-primary/20 border-primary/50'}`}>
              {position.slice(0, 3).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-xs font-semibold bg-black/50 text-white px-1.5 py-0.5 rounded-md text-center whitespace-nowrap">
          {formatName(name)}
        </span>
      </div>
    </div>
  );
}

// --- BenchPlayer ---
function BenchPlayer({ 
  name, position, photo_url, isRival = false, teamLogoUrl, score 
}: { 
  name: string; position: string; photo_url: string | null | undefined; isRival?: boolean; teamLogoUrl: string | null | undefined; score: number | null | undefined;
}) {
  const scoreValue = (score !== null && score !== undefined) ? score : null;
  const scoreColor = 
    scoreValue === null ? 'bg-zinc-600 border-zinc-400' :
    scoreValue >= 8 ? 'bg-green-600 border-green-400' :
    scoreValue >= 6 ? 'bg-yellow-600 border-yellow-400' :
    'bg-red-600 border-red-400';

  return (
    <div className={`flex flex-col items-center text-center ${isRival ? 'text-destructive' : 'text-primary'}`}>
      <div className="relative">
        {teamLogoUrl && (
              <img src={teamLogoUrl} alt="Team Logo" className="absolute -top-1 -left-1 w-4 h-4 rounded-full object-cover border border-gray-300 bg-white shadow-sm z-10" />
          )}
        <div className={`absolute -top-2 -right-2 min-w-[1.6rem] h-5 px-1 rounded-full ${scoreColor} text-white text-[11px] font-bold flex items-center justify-center z-10 border shadow-md`}>
            {scoreValue !== null ? scoreValue.toFixed(1) : '-'}
        </div>
        {photo_url ? (
          <img src={photo_url} alt={name} className={`w-10 h-10 rounded-full object-cover border-2 ${isRival ? 'border-destructive/50' : 'border-primary/50'}`} />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border ${isRival ? 'bg-destructive/20 border-destructive/50' : 'bg-primary/20 border-primary/50'}`}>
            {position.slice(0, 3).toUpperCase()}
          </div>
        )}
      </div>
      <span className="text-xs font-semibold mt-1 whitespace-nowrap px-1">
        {formatName(name)}
      </span>
    </div>
  );
}

// --- INTERFAZ DE PROPS ---
interface MatchOfTheDayProps {
  profile: Profile | null;
  lineup: DailyLineup | null;
  squad: Player[];
  opponentProfile: Profile | null;
  opponentLineup: DailyLineup | null;
  opponentSquad: Player[];
  matchup: any | null;
  leagueId: string | null; 
  gameDay: GameDay | null;
}

// --- COMPONENTE PRINCIPAL ---
export function MatchOfTheDay({
  profile,
  lineup,
  squad,
  opponentProfile,
  opponentLineup,
  opponentSquad,
  matchup,
  leagueId,
  gameDay,
}: MatchOfTheDayProps) {
  
  // (Lógica de mi equipo)
  const hasLineup = lineup && lineup.final_selection_ids && lineup.final_selection_ids.length === 8;
  let myTeamPlayers: Player[] = [];
  let myBenchPlayers: Player[] = [];
  if (hasLineup && squad && squad.length > 0) {
    const selectedIds = new Set(lineup.final_selection_ids);
    myTeamPlayers = squad.filter((player) => selectedIds.has(player.id));
    myBenchPlayers = squad.filter((player) => !selectedIds.has(player.id));
  }
  const gkPlayer = myTeamPlayers.find((p) => p.position === 'Arquero');
  const defPlayers = myTeamPlayers.filter((p) => p.position === 'Defensor');
  const medPlayers = myTeamPlayers.filter((p) => p.position === 'Mediocampista');
  const fwdPlayers = myTeamPlayers.filter((p) => p.position === 'Delantero');
  const myTeam = [
    { player: gkPlayer, top: '45%', left: '10%' },
    { player: defPlayers[0], top: '28%', left: '22%' },
    { player: defPlayers[1], top: '55%', left: '22%' },
    { player: medPlayers[0], top: '25%', left: '34%' },
    { player: medPlayers[1], top: '42%', left: '34%' },
    { player: medPlayers[2], top: '59%', left: '34%' },
    { player: fwdPlayers[0], top: '35%', left: '46%' },
    { player: fwdPlayers[1], top: '52%', left: '46%' },
  ];
  
  // (Lógica del rival)
  const hasRivalLineup = opponentLineup && opponentLineup.final_selection_ids && opponentLineup.final_selection_ids.length === 8;
  let rivalTeamPlayers: Player[] = [];
  let rivalBenchPlayers: Player[] = [];
  if (hasRivalLineup && opponentSquad && opponentSquad.length > 0) {
    const rivalSelectedIds = new Set(opponentLineup.final_selection_ids);
    rivalTeamPlayers = opponentSquad.filter((player) => rivalSelectedIds.has(player.id));
    rivalBenchPlayers = opponentSquad.filter((player) => !rivalSelectedIds.has(player.id));
  }
  const rivalGkPlayer = rivalTeamPlayers.find((p) => p.position === 'Arquero');
  const rivalDefPlayers = rivalTeamPlayers.filter((p) => p.position === 'Defensor');
  const rivalMedPlayers = rivalTeamPlayers.filter((p) => p.position === 'Mediocampista');
  const rivalFwdPlayers = rivalTeamPlayers.filter((p) => p.position === 'Delantero');
  const rivalTeam = [
    { player: rivalGkPlayer, top: '45%', left: '90%' },
    { player: rivalDefPlayers[0], top: '28%', left: '78%' },
    { player: rivalDefPlayers[1], top: '55%', left: '78%' },
    { player: rivalMedPlayers[0], top: '25%', left: '66%' },
    { player: rivalMedPlayers[1], top: '42%', left: '66%' },
    { player: rivalMedPlayers[2], top: '59%', left: '66%' },
    { player: rivalFwdPlayers[0], top: '35%', left: '54%' },
    { player: rivalFwdPlayers[1], top: '52%', left: '54%' },
  ];

  // --- CÁLCULO DE PUNTAJES TOTALES ---
  // Usamos una validación segura por si el array player_scores viene vacío
  const myTotalScore = myTeamPlayers.reduce((acc, player) => {
    const score = (player.player_scores && player.player_scores.length > 0) 
      ? player.player_scores[0].score 
      : 0;
    return acc + score;
  }, 0);

  const rivalTotalScore = rivalTeamPlayers.reduce((acc, player) => {
    const score = (player.player_scores && player.player_scores.length > 0) 
      ? player.player_scores[0].score 
      : 0;
    return acc + score;
  }, 0);

  // --- LÓGICA WIN / LOSE (PROVISORIA) ---
  // Se mostrará el resultado cuando la suma de puntajes sea mayor a 0.
  // Esto simula que la fecha "ha comenzado/terminado".
  const showResult = myTotalScore > 0 || rivalTotalScore > 0;
  
  const iWin = myTotalScore > rivalTotalScore;
  const isDraw = myTotalScore === rivalTotalScore;

  if (!matchup) {
    return (
      <Card className="xl:col-span-5">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p className="text-lg font-semibold">No tienes un partido programado para esta fecha.</p>
          <p>Esto puede suceder si la liga tiene un número impar de jugadores o si el administrador aún no ha generado la fecha.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-16">
      
      {/* IZQUIERDA (MI PERFIL) */}
      <div className="flex flex-col gap-4">
        <ProfilePlaceholder
          title={`MI PERFIL (${profile?.username || 'Cargando...'})`}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg text-center">
              MI CARTA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4"> 
            <StrategyCardManager
              profile={profile}
              matchup={matchup}
              gameDay={gameDay}
              leagueId={leagueId}
              size="small" 
            />
            <Button className="w-full mt-4 font-bold shadow-md transition-all">
              APLICAR
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CANCHA CENTRAL */}
      <div className="xl:col-span-3 flex flex-col items-center">
        <Card className="h-full min-h-[750px] overflow-hidden relative w-full">
          
          {/* ⬇️ HEADER CON PUNTAJES Y LÓGICA WIN/LOSE ⬇️ */}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full px-2 sm:px-6">
              
              {/* PUNTAJE MÍO (IZQUIERDA) */}
              <div className="flex flex-col items-center w-24">
                <span className="text-3xl font-bold text-primary">
                  {myTotalScore > 0 ? myTotalScore.toFixed(1) : '0.0'}
                </span>
                {/* LOGICA VISUAL WIN/LOSE */}
                {showResult ? (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 text-white ${isDraw ? 'bg-gray-500' : (iWin ? 'bg-green-600' : 'bg-red-600')}`}>
                    {isDraw ? 'EMPATE' : (iWin ? 'WIN' : 'LOSE')}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Total
                  </span>
                )}
              </div>

              {/* TÍTULO CENTRAL */}
              <div className="flex flex-col items-center mx-4">
                <CardTitle className="font-headline text-center text-xl">
                  Duelo 1v1 - Fecha {matchup.match_day_number}
                </CardTitle>
                <CardDescription className="text-center">
                  {profile?.username || '...'} vs. {opponentProfile?.username || 'Rival...'}
                </CardDescription>
                {showResult && (
                   <span className="text-[10px] text-muted-foreground mt-1 font-medium border px-2 rounded-full">RESULTADO PARCIAL</span>
                )}
              </div>

              {/* PUNTAJE RIVAL (DERECHA) */}
              <div className="flex flex-col items-center w-24">
                <span className="text-3xl font-bold text-destructive">
                   {rivalTotalScore > 0 ? rivalTotalScore.toFixed(1) : '0.0'}
                </span>
                {/* LOGICA VISUAL WIN/LOSE (INVERTIDA PARA RIVAL) */}
                {showResult ? (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 text-white ${isDraw ? 'bg-gray-500' : (!iWin ? 'bg-green-600' : 'bg-red-600')}`}>
                    {isDraw ? 'EMPATE' : (!iWin ? 'WIN' : 'LOSE')}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Rival
                  </span>
                )}
              </div>

            </div>
          </CardHeader>
          {/* ⬆️ FIN DEL HEADER ⬆️ */}

          <CardContent className="p-0 relative h-full">
            <div className="absolute inset-0 rotate-90 scale-[1.1] origin-center translate-y-[-45px]">
              <FootballPitch />
            </div>

            <div className="relative h-full text-xs">
              {/* MI EQUIPO */}
              {hasLineup ? (
                myTeam.map((slot, index) => {
                  const score = slot.player?.player_scores?.[0]?.score;
                  return slot.player ? (
                    <PitchPlayerSlot
                      key={slot.player.id}
                      position={slot.player.position}
                      name={slot.player.name}
                      photo_url={slot.player.photo_url}
                      top={slot.top}
                      left={slot.left}
                      teamLogoUrl={slot.player.teams?.logo_url}
                      score={score}
                    />
                  ) : (
                    <PitchPlayerSlot key={`empty-mine-${index}`} position="???" name="---" photo_url={null} top={slot.top} left={slot.left} teamLogoUrl={null} score={null} />
                  );
                })
              ) : (
                <div className="absolute top-1/4 left-1/4 w-48 text-center p-4 bg-primary/20 rounded-lg">
                  <p className="font-semibold text-primary-foreground">
                    Guarda tu alineación de 8 jugadores para verla aquí.
                  </p>
                </div>
              )}

              {/* EQUIPO RIVAL */}
              {hasRivalLineup ? (
                rivalTeam.map((slot, index) => {
                  const score = slot.player?.player_scores?.[0]?.score;
                  return slot.player ? (
                    <PitchPlayerSlot
                      key={slot.player.id}
                      position={slot.player.position}
                      name={slot.player.name}
                      photo_url={slot.player.photo_url}
                      top={slot.top}
                      left={slot.left}
                      isRival
                      teamLogoUrl={slot.player.teams?.logo_url}
                      score={score}
                    />
                  ) : (
                      <PitchPlayerSlot key={`empty-rival-${index}`} position="???" name="---" photo_url={null} top={slot.top} left={slot.left} isRival teamLogoUrl={null} score={null} />
                  );
                })
              ) : (
                  <div className="absolute top-1/4 right-1/4 w-48 text-center p-4 bg-destructive/20 rounded-lg">
                  <p className="font-semibold text-destructive-foreground">
                    Tu rival ({opponentProfile?.username || '...'}) aún no ha guardado su alineación.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Suplentes */}
        <div className="w-full flex justify-between mt-4 px-8">
          {/* Suplentes de mi equipo */}
          <div className="flex gap-3">
            {myBenchPlayers.length > 0
              ? myBenchPlayers.map((p) => (
                  <BenchPlayer
                    key={p.id}
                    name={p.name}
                    position={p.position}
                    photo_url={p.photo_url}
                    teamLogoUrl={p.teams?.logo_url}
                    score={p.player_scores?.[0]?.score}
                  />
                ))
              : Array(4).fill(0).map((_, i) => (
                  <BenchPlayer key={`bench-mine-${i}`} name="---" position="???" photo_url={null} teamLogoUrl={null} score={null} />
                ))}
          </div>
          {/* Suplentes rival */}
          <div className="flex gap-3">
              {rivalBenchPlayers.length > 0
              ? rivalBenchPlayers.map((p) => (
                  <BenchPlayer
                    key={p.id}
                    name={p.name}
                    position={p.position}
                    photo_url={p.photo_url}
                    isRival
                    teamLogoUrl={p.teams?.logo_url}
                    score={p.player_scores?.[0]?.score}
                  />
                ))
              : Array(4).fill(0).map((_, i) => (
                  <BenchPlayer key={`bench-rival-${i}`} name="---" position="???" photo_url={null} isRival teamLogoUrl={null} score={null} />
                ))}
          </div>
        </div>
      </div>

      {/* DERECHA (PERFIL RIVAL) */}
      <div className="flex flex-col gap-4">
        <ProfilePlaceholder title={`PERFIL RIVAL (${opponentProfile?.username || 'Rival...'})`} />
        <Card>
          <CardHeader><CardTitle className="font-headline text-lg text-center">CARTA RIVAL</CardTitle></CardHeader>
          <CardContent className="text-center text-muted-foreground"><p>(Aquí irá la carta rival)</p></CardContent>
        </Card>
        <Card className="flex-grow min-h-[150px]">
          <CardHeader><CardTitle className="font-headline text-lg text-center">CHAT DEL DUELO</CardTitle></CardHeader>
          <CardContent className="text-center text-muted-foreground"><p>Próximamente...</p></CardContent>
        </Card>
      </div>
      
    </div>
  );
}