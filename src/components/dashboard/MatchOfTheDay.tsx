'use client';

import { useState, useEffect } from 'react';
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
import { saveBoostedPlayerAction } from '@/app/(app)/dashboard/actions'; // ⚠️ IMPORTANTE: La acción
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

// --- COMPONENTE: CURSOR MÁGICO (AUREOLA) ---
function MagicCursor({ active }: { active: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    if (active) {
      window.addEventListener('mousemove', updatePosition);
    }
    return () => window.removeEventListener('mousemove', updatePosition);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 flex items-center justify-center"
      style={{ 
        left: position.x, 
        top: position.y, 
        transform: 'translate(-50%, -50%)' 
      }}
    >
      <div className="w-12 h-12 rounded-full border-2 border-yellow-400 animate-ping opacity-75 absolute"></div>
      <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]"></div>
    </div>
  );
}

// --- COMPONENTE: PLACEHOLDER PERFIL ---
function ProfilePlaceholder({ title, avatarUrl }: { title: string; avatarUrl?: string | null }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-lg text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground flex flex-col items-center">
        {avatarUrl ? (
          // Si hay avatar, mostramos la imagen
          <img 
            src={avatarUrl} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/30 shadow-sm mb-2"
          />
        ) : (
          // Si no, mostramos el placeholder original
          <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-primary/30">
            <span className="text-3xl opacity-50">?</span>
          </div>
        )}
        {/* Quitamos el texto "Próximamente" si ya hay avatar, o lo dejamos como prefieras. 
            Lo dejaré condicional. */}
        {!avatarUrl && <p className="font-semibold text-sm">Próximamente</p>}
      </CardContent>
    </Card>
  );
}

// --- COMPONENTE: SLOT DE JUGADOR EN CANCHA ---
function PitchPlayerSlot({ 
  position, 
  name, 
  photo_url, 
  top, 
  left, 
  isRival = false, 
  teamLogoUrl, 
  score,
  // Props de interacción
  isSelectionMode = false,
  isSelected = false,
  onSelect
}: { 
  position: string; 
  name: string; 
  photo_url: string | null | undefined; 
  top: string; 
  left: string; 
  isRival?: boolean; 
  teamLogoUrl: string | null | undefined; 
  score: number | null | undefined;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const scoreValue = (score !== null && score !== undefined) ? score : null;
  const scoreColor = 
    scoreValue === null ? 'bg-zinc-600 border-zinc-400' :
    scoreValue >= 8 ? 'bg-green-600 border-green-400' :
    scoreValue >= 6 ? 'bg-yellow-600 border-yellow-400' :
    'bg-red-600 border-red-400';

  // Estilos del cursor
  const cursorStyle = isSelectionMode && !isRival ? 'cursor-pointer' : 'cursor-default';
  
  // ⚡ CAMBIO 1: Estilos para el contenedor EXTERNO (Solo z-index y escala ligera)
  // Ya NO aplicamos el 'ring' aquí.
  const outerStyles = isSelected 
    ? 'z-50 scale-110 transition-all duration-300' // Un pequeño aumento de tamaño general para destacar
    : 'transition-all duration-300';

  // ⚡ CAMBIO 2: Estilos para el CÍRCULO INTERNO (Aquí va la aureola)
  // Aplicamos el anillo y la sombra directamente sobre el círculo.
  const innerCircleStyles = isSelected
    // Ring amarillo fuerte + sombra brillante
    ? 'ring-[3px] ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]'
    : isSelectionMode && !isRival 
      // Hover sutil si estamos eligiendo
      ? 'group-hover:ring-2 group-hover:ring-yellow-200/60' 
      : '';

  return (
    <div 
      // ⚡ Usamos 'group' para coordinar el hover
      className={`absolute ${cursorStyle} ${outerStyles} group rounded-full`}
      style={{ top: `calc(${top} - 25px)`, left: `${left}`, transform: 'translateX(-50%)' }}
      onClick={() => {
        if (isSelectionMode && !isRival && onSelect) {
          onSelect();
        }
      }}
    >
      <div className="flex flex-col items-center">
        {/* ⚡ CAMBIO 3: Aplicamos los estilos al contenedor RELATIVE que envuelve la foto.
            Añadimos 'rounded-full' y una transición suave.
        */}
        <div className={`relative rounded-full transition-all duration-300 ${innerCircleStyles}`}>
          
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
        
        {/* Etiqueta del nombre (fuera del anillo) */}
        <span className={`text-xs font-semibold ${isSelected ? 'bg-yellow-500 text-black' : 'bg-black/50 text-white'} px-1.5 py-0.5 rounded-md text-center whitespace-nowrap transition-colors mt-1`}>
          {formatName(name)}
        </span>
      </div>
    </div>
  );
}

// --- COMPONENTE: JUGADOR BANCA ---
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
  activeCardMultiplier?: number; // ⚠️ NUEVA PROP: Valor del multiplicador (x2, x3, etc.)
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
  activeCardMultiplier = 1, // Valor por defecto es 1 (sin efecto)
}: MatchOfTheDayProps) {

  // 1. ESTADOS PARA LA CARTA
  const [isApplyingCard, setIsApplyingCard] = useState(false);
  
  // Inicializar el estado con lo que venga de la DB (si ya guardó uno)
  const [selectedCardPlayerId, setSelectedCardPlayerId] = useState<string | null>(null);

  // Efecto para sincronizar estado inicial cuando carga 'lineup'
  useEffect(() => {
    if (lineup && lineup.boosted_player_id) {
        setSelectedCardPlayerId(lineup.boosted_player_id);
    }
  }, [lineup]);


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

  // --- CÁLCULO DE PUNTAJES TOTALES (MODIFICADO CON MULTIPLICADOR) ---
  const myTotalScore = myTeamPlayers.reduce((acc, player) => {
    let score = (player.player_scores && player.player_scores.length > 0) 
      ? player.player_scores[0].score 
      : 0;

    // ⚡ LÓGICA DE MULTIPLICACIÓN EN FRONTEND
    if (player.id === selectedCardPlayerId) {
       score = score * activeCardMultiplier;
    }

    return acc + score;
  }, 0);

  const rivalTotalScore = rivalTeamPlayers.reduce((acc, player) => {
    const score = (player.player_scores && player.player_scores.length > 0) 
      ? player.player_scores[0].score 
      : 0;
    
    // NOTA: Aquí podrías replicar la lógica para el rival si tuvieras su `boosted_player_id`
    // Por ahora lo dejamos simple.
    return acc + score;
  }, 0);

  // --- LÓGICA WIN / LOSE ---
  const showResult = myTotalScore > 0 || rivalTotalScore > 0;
  const iWin = myTotalScore > rivalTotalScore;
  const isDraw = myTotalScore === rivalTotalScore;

  // 2. HANDLER PARA EL CLICK EN "APLICAR"
  const handleApplyClick = () => {
    if (isApplyingCard) {
      setIsApplyingCard(false); // Cancelar
      // Si cancela, volvemos al estado original guardado (o null)
      setSelectedCardPlayerId(lineup?.boosted_player_id || null);
    } else {
      setIsApplyingCard(true); // Activar modo magia
    }
  };

  // 3. HANDLER PARA SELECCIONAR JUGADOR Y GUARDAR
  const handlePlayerSelect = async (playerId: string) => {
    if (isApplyingCard && lineup) {
      // Optimistic UI Update
      const newSelection = selectedCardPlayerId === playerId ? null : playerId;
      setSelectedCardPlayerId(newSelection);
      setIsApplyingCard(false); // Terminar modo selección

      // Guardar en Servidor
      console.log(`🪄 Guardando carta para el jugador: ${playerId}...`);
      const result = await saveBoostedPlayerAction(lineup.id, newSelection);

      if (!result.success) {
        console.error("❌ Error al guardar carta");
        // Revertir si falla
        setSelectedCardPlayerId(lineup.boosted_player_id || null);
      } else {
        console.log("✅ Carta guardada exitosamente");
      }
    }
  };


  if (!matchup) {
    return (
      <Card className="xl:col-span-5">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p className="text-lg font-semibold">No tienes un partido programado para esta fecha.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-16 relative">
      
      {/* AUREOLA MÁGICA */}
      <MagicCursor active={isApplyingCard} />

{/* IZQUIERDA (MI PERFIL) */}
      <div className="flex flex-col gap-4">
        <ProfilePlaceholder 
          title={`MI PERFIL (${profile?.username || 'Cargando...'})`} 
          avatarUrl={profile?.avatar_url} // <--- PASAMOS TU AVATAR
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg text-center">
              MI CARTA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-2"> 
            <StrategyCardManager
              profile={profile}
              matchup={matchup}
              gameDay={gameDay}
              leagueId={leagueId}
              size="small" 
            />
            
            {/* BOTÓN DE APLICAR CARTA */}
            <Button 
              onClick={handleApplyClick}
              className={`w-full mt-4 font-bold shadow-md transition-all ${isApplyingCard ? 'ring-2 ring-yellow-400 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20' : ''}`}
              variant={isApplyingCard ? 'outline' : 'default'}
            >
              {isApplyingCard 
                ? (selectedCardPlayerId ? "JUGADOR ELEGIDO" : "SELECCIONA UN JUGADOR...") 
                : (selectedCardPlayerId ? "CAMBIAR SELECCIÓN" : "APLICAR")}
            </Button>

            {selectedCardPlayerId && (
               <p className="text-xs text-center text-yellow-600 font-semibold animate-pulse">
                 ¡Carta activa sobre un jugador!
               </p>
            )}

          </CardContent>
        </Card>
      </div>

      {/* CANCHA CENTRAL */}
      <div className="xl:col-span-3 flex flex-col items-center">
        <Card className="h-full min-h-[750px] overflow-hidden relative w-full">
          
          {/* HEADER */}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full px-2 sm:px-6">
              <div className="flex flex-col items-center w-24">
                <span className="text-3xl font-bold text-primary">
                  {myTotalScore > 0 ? myTotalScore.toFixed(1) : '0.0'}
                </span>
                {showResult ? (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 text-white ${isDraw ? 'bg-gray-500' : (iWin ? 'bg-green-600' : 'bg-red-600')}`}>
                    {isDraw ? 'EMPATE' : (iWin ? 'WIN' : 'LOSE')}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</span>
                )}
              </div>

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

              <div className="flex flex-col items-center w-24">
                <span className="text-3xl font-bold text-destructive">
                   {rivalTotalScore > 0 ? rivalTotalScore.toFixed(1) : '0.0'}
                </span>
                {showResult ? (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 text-white ${isDraw ? 'bg-gray-500' : (!iWin ? 'bg-green-600' : 'bg-red-600')}`}>
                    {isDraw ? 'EMPATE' : (!iWin ? 'WIN' : 'LOSE')}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Rival</span>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 relative h-full">
            <div className="absolute inset-0 rotate-90 scale-[1.1] origin-center translate-y-[-45px]">
              <FootballPitch />
            </div>

            {/* DIMMER DE SELECCIÓN */}
            {isApplyingCard && (
               <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none transition-all duration-500" />
            )}

            <div className="relative h-full text-xs z-20">
              {/* MI EQUIPO (Interactuable) */}
              {hasLineup ? (
                myTeam.map((slot, index) => {
                  let score = slot.player?.player_scores?.[0]?.score;

                  // ⚡ LÓGICA VISUAL EN CADA SLOT
                  if (score !== undefined && score !== null && slot.player?.id === selectedCardPlayerId) {
                    score = score * activeCardMultiplier;
                  }

                  return slot.player ? (
                    <PitchPlayerSlot
                      key={slot.player.id}
                      position={slot.player.position}
                      name={slot.player.name}
                      photo_url={slot.player.photo_url}
                      top={slot.top}
                      left={slot.left}
                      teamLogoUrl={slot.player.teams?.logo_url}
                      
                      score={score} // <--- Score multiplicado

                      // Props de interacción
                      isSelectionMode={isApplyingCard}
                      isSelected={selectedCardPlayerId === slot.player.id}
                      onSelect={() => handlePlayerSelect(slot.player!.id)}
                    />
                  ) : (
                    <PitchPlayerSlot key={`empty-mine-${index}`} position="???" name="---" photo_url={null} top={slot.top} left={slot.left} teamLogoUrl={null} score={null} />
                  );
                })
              ) : (
                <div className="absolute top-1/4 left-1/4 w-48 text-center p-4 bg-primary/20 rounded-lg">
                  <p className="font-semibold text-primary-foreground">Guarda tu alineación para verla aquí.</p>
                </div>
              )}

              {/* EQUIPO RIVAL (NO Interactuable) */}
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
                  <p className="font-semibold text-destructive-foreground">Tu rival aún no ha guardado su alineación.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Suplentes */}
        <div className="w-full flex justify-between mt-4 px-8">
          <div className="flex gap-3">
            {myBenchPlayers.length > 0
              ? myBenchPlayers.map((p) => <BenchPlayer key={p.id} name={p.name} position={p.position} photo_url={p.photo_url} teamLogoUrl={p.teams?.logo_url} score={p.player_scores?.[0]?.score} />)
              : Array(4).fill(0).map((_, i) => <BenchPlayer key={`bench-mine-${i}`} name="---" position="???" photo_url={null} teamLogoUrl={null} score={null} />)}
          </div>
          <div className="flex gap-3">
              {rivalBenchPlayers.length > 0
              ? rivalBenchPlayers.map((p) => <BenchPlayer key={p.id} name={p.name} position={p.position} photo_url={p.photo_url} isRival teamLogoUrl={p.teams?.logo_url} score={p.player_scores?.[0]?.score} />)
              : Array(4).fill(0).map((_, i) => <BenchPlayer key={`bench-rival-${i}`} name="---" position="???" photo_url={null} isRival teamLogoUrl={null} score={null} />)}
          </div>
        </div>
      </div>

{/* DERECHA (PERFIL RIVAL) */}
      <div className="flex flex-col gap-4">
        <ProfilePlaceholder 
          title={`PERFIL RIVAL (${opponentProfile?.username || 'Rival...'})`} 
          avatarUrl={opponentProfile?.avatar_url} // <--- PASAMOS AVATAR RIVAL
        />
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