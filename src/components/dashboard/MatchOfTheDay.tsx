'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FootballPitch } from './FootballPitch';

import { StrategyCardManager } from '@/components/strategy/strategy-cards';
import { saveBoostedPlayerAction } from '@/app/(app)/dashboard/actions';
import {
  type Player,
  type DailyLineup,
  type Profile,
  type GameDay,
} from '@/app/(app)/dashboard/types';
import { 
  EyeOff, 
  Zap, 
  Star, 
  TrendingDown, 
  MessageSquare, 
  Flag, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import DuelChat from '@/app/(app)/dashboard/components/DuelChat';

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

// --- COMPONENTE: MODAL DE REPORTE ---
function ReportDialog({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md border-destructive/50 shadow-2xl bg-zinc-950">
        <CardHeader className="relative border-b border-border/50 pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Denunciar Comportamiento
          </CardTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas denunciar este chat? Nuestro equipo de moderación revisará el historial y tomará medidas si es necesario.
          </p>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">Motivo de la denuncia</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Insultos, spam, comportamiento antideportivo..."
              className="w-full min-h-[100px] p-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50 resize-none text-white placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button 
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={!reason.trim()}
              onClick={() => {
                onConfirm(reason);
                setReason('');
              }}
            >
              Enviar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- COMPONENTE: LEYENDA FAIR PLAY (TARJETAS SÓLIDAS) ---
function FairPlayLegend() {
  return (
    <div className="w-full flex flex-wrap justify-center gap-4 sm:gap-8 py-4 px-4 bg-black/20 rounded-lg border border-white/5 mb-2">
      
      {/* Tarjeta Verde (Sólida) */}
      <div className="flex items-center gap-3 group cursor-help select-none">
        <div className="w-6 h-8 bg-green-500 rounded-[3px] shadow-[0_0_10px_rgba(34,197,94,0.5)] transform group-hover:-translate-y-1 transition-transform duration-200"></div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Verde</span>
          <span className="text-[9px] text-muted-foreground hidden sm:block">Juego Limpio</span>
        </div>
      </div>

      {/* Tarjeta Amarilla (Sólida) */}
      <div className="flex items-center gap-3 group cursor-help select-none">
        <div className="w-6 h-8 bg-yellow-400 rounded-[3px] shadow-[0_0_10px_rgba(250,204,21,0.5)] transform group-hover:-translate-y-1 transition-transform duration-200"></div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Amarilla</span>
          <span className="text-[9px] text-muted-foreground hidden sm:block">Advertencia</span>
        </div>
      </div>

      {/* Tarjeta Roja (Sólida) */}
      <div className="flex items-center gap-3 group cursor-help select-none">
        <div className="w-6 h-8 bg-red-600 rounded-[3px] shadow-[0_0_10px_rgba(220,38,38,0.5)] transform group-hover:-translate-y-1 transition-transform duration-200"></div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Roja</span>
          <span className="text-[9px] text-muted-foreground hidden sm:block">Penalización</span>
        </div>
      </div>

      {/* Tarjeta Negra (Sólida) */}
      <div className="flex items-center gap-3 group cursor-help select-none">
        <div className="w-6 h-8 bg-zinc-950 border border-zinc-800 rounded-[3px] shadow-[0_0_10px_rgba(0,0,0,0.8)] transform group-hover:-translate-y-1 transition-transform duration-200"></div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Negra</span>
          <span className="text-[9px] text-muted-foreground hidden sm:block">Expulsión</span>
        </div>
      </div>

    </div>
  );
}

// --- COMPONENTE: PLACEHOLDER PERFIL (ACTUALIZADO) ---
function ProfilePlaceholder({ 
  title, 
  avatarUrl, 
  planType = 'free',
  reputation = 'clean' // ✅ NUEVO: Recibe el estado de comportamiento
}: { 
  title: string; 
  avatarUrl?: string | null; 
  planType?: 'free' | 'plus' | 'premium';
  reputation?: 'clean' | 'warning' | 'danger' | 'banned'; // Tipado
}) {
  
  // Badge de Suscripción (Derecha - Estrella)
  const StatusBadge = () => {
    if (planType === 'premium') {
      return (
        <div className="absolute -top-1 -right-1 bg-black/50 rounded-full p-1 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.5)] z-20" title="Usuario Premium">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      );
    }
    if (planType === 'plus') {
      return (
        <div className="absolute -top-1 -right-1 bg-black/50 rounded-full p-1 border border-slate-400/50 shadow-[0_0_10px_rgba(203,213,225,0.5)] z-20" title="Usuario Plus">
          <Star className="w-4 h-4 text-slate-300 fill-slate-300" />
        </div>
      );
    }
    return null;
  };

  // ✅ NUEVO: Badge de Reputación (Izquierda - Tarjeta Sólida)
  const ReputationBadge = () => {
    // Definimos colores según el estado
    let colorClass = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"; // Clean
    let titleText = "Juego Limpio";

    if (reputation === 'warning') {
      colorClass = "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]";
      titleText = "Advertencia (Tarjeta Amarilla)";
    } else if (reputation === 'danger') {
      colorClass = "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]";
      titleText = "Penalizado (Tarjeta Roja)";
    } else if (reputation === 'banned') {
      colorClass = "bg-zinc-950 border border-zinc-700 shadow-[0_0_8px_rgba(0,0,0,0.8)]";
      titleText = "Expulsión (Tarjeta Negra)";
    }

    return (
      <div 
        className="absolute -top-1 -left-1 z-20 group cursor-help" 
        title={`Conducta: ${titleText}`}
      >
        {/* Contenedor circular oscuro para resaltar la tarjeta */}
        <div className="bg-black/60 rounded-full p-1.5 border border-white/5 backdrop-blur-sm">
           {/* La Tarjeta Sólida */}
           <div className={`w-3 h-4 rounded-[2px] ${colorClass}`}></div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full relative overflow-visible"> 
      <CardHeader>
        <CardTitle className="font-headline text-lg text-center truncate px-2" title={title}>
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-center text-muted-foreground flex flex-col items-center">
        <div className="relative inline-block">
          
          {/* ✅ AQUI SE RENDERIZA LA TARJETA */}
          <ReputationBadge />

          {/* AQUI LA ESTRELLA */}
          <StatusBadge />

          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className={`
                w-24 h-24 rounded-full object-cover shadow-lg mb-2
                ${planType === 'premium' ? 'border-4 border-yellow-500/70 shadow-yellow-500/20' : 
                  planType === 'plus' ? 'border-4 border-slate-400/70 shadow-slate-400/20' : 
                  'border-4 border-primary/30'}
              `}
            />
          ) : (
            <div className={`
              w-24 h-24 rounded-full mx-auto mb-2 flex items-center justify-center border-4 
              ${planType === 'premium' ? 'bg-yellow-500/10 border-yellow-500/50' : 
                planType === 'plus' ? 'bg-slate-400/10 border-slate-400/50' : 
                'bg-primary/10 border-primary/30'}
            `}>
              <span className="text-3xl opacity-50 font-bold uppercase">
                {title.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>

        {/* Etiqueta de Plan Texto (Opcional, ya la tenías) */}
        {planType !== 'free' && (
          <span className={`
            text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1
            ${planType === 'premium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' : 'bg-slate-500/20 text-slate-300 border border-slate-500/20'}
          `}>
            {planType}
          </span>
        )}

        {!avatarUrl && planType === 'free' && <p className="font-semibold text-sm">Próximamente</p>}
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

  const cursorStyle = isSelectionMode && !isRival ? 'cursor-pointer' : 'cursor-default';
  
  const outerStyles = isSelected 
    ? 'z-50 scale-110 transition-all duration-300' 
    : 'transition-all duration-300';

  const innerCircleStyles = isSelected
    ? 'ring-[3px] ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]'
    : isSelectionMode && !isRival 
      ? 'group-hover:ring-2 group-hover:ring-yellow-200/60' 
      : '';

  return (
    <div 
      className={`absolute ${cursorStyle} ${outerStyles} group rounded-full`}
      style={{ top: `calc(${top} - 25px)`, left: `${left}`, transform: 'translateX(-50%)' }}
      onClick={() => {
        if (isSelectionMode && !isRival && onSelect) {
          onSelect();
        }
      }}
    >
      <div className="flex flex-col items-center">
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

function RivalCardDisplay({ card }: { card: any }) {
  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-muted-foreground border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900/30">
        <EyeOff className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs">Sin carta</p>
      </div>
    );
  }

  const tier = card.tier || 'red'; 

  const themes: any = {
      gold: { 
          border: "border-yellow-400", 
          text: "text-yellow-400", 
          bg: "from-yellow-500/40 via-yellow-500/20 to-yellow-500/10", 
          iconColor: "text-amber-500",
          Icon: Star
      },
      emerald: { 
          border: "border-emerald-500", 
          text: "text-emerald-400", 
          bg: "from-emerald-500/40 via-emerald-500/20 to-emerald-500/10", 
          iconColor: "text-emerald-400",
          Icon: Zap
      },
      red: { 
          border: "border-red-600",    
          text: "text-red-500",     
          bg: "from-red-600/40 via-red-600/20 to-red-600/10",       
          iconColor: "text-red-500",
          Icon: TrendingDown
      }
  };

  const theme = themes[tier] || themes.red;
  const IconComponent = theme.Icon;

  return (
    <Card className={`
       w-full h-full p-3 mx-auto text-center rounded-2xl flex flex-col justify-between
       border ${theme.border} bg-gradient-to-b ${theme.bg} backdrop-blur-sm shadow-lg
    `}>
       <div className="flex flex-col items-center">
         <div className={`${theme.text} text-3xl leading-none mb-1`}>★</div>
         <h3 className={`${theme.text} font-extrabold text-lg leading-tight`}>
           {card.name.toUpperCase()}
         </h3>
       </div>

       <div className="flex-grow flex items-center justify-center py-2">
          <IconComponent className={`w-8 h-8 ${theme.iconColor}`} />
       </div>

       <p className="text-gray-300 text-xs leading-tight line-clamp-3">
           {card.description}
       </p>
    </Card>
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
  activeCardMultiplier?: number;
  opponentStrategyCard?: any;
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
  activeCardMultiplier = 1,
  opponentStrategyCard
}: MatchOfTheDayProps) {

  const [isApplyingCard, setIsApplyingCard] = useState(false);
  const [selectedCardPlayerId, setSelectedCardPlayerId] = useState<string | null>(null);
  
  // Estado para el modal de reporte
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    if (lineup && lineup.boosted_player_id) {
        setSelectedCardPlayerId(lineup.boosted_player_id);
    }
  }, [lineup]);

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

  const myTotalScore = myTeamPlayers.reduce((acc, player) => {
    let score = (player.player_scores && player.player_scores.length > 0) 
      ? player.player_scores[0].score 
      : 0;

    if (player.id === selectedCardPlayerId) {
       score = score * activeCardMultiplier;
    }

    return acc + score;
  }, 0);

  const rivalTotalScore = rivalTeamPlayers.reduce((acc, player) => {
    const score = (player.player_scores && player.player_scores.length > 0) 
      ? player.player_scores[0].score 
      : 0;
    return acc + score;
  }, 0);

  const showResult = myTotalScore > 0 || rivalTotalScore > 0;
  const iWin = myTotalScore > rivalTotalScore;
  const isDraw = myTotalScore === rivalTotalScore;

  const handleApplyClick = () => {
    if (isApplyingCard) {
      setIsApplyingCard(false); 
      setSelectedCardPlayerId(lineup?.boosted_player_id || null);
    } else {
      setIsApplyingCard(true); 
    }
  };

  const handlePlayerSelect = async (playerId: string) => {
    if (isApplyingCard && lineup) {
      const newSelection = selectedCardPlayerId === playerId ? null : playerId;
      setSelectedCardPlayerId(newSelection);
      setIsApplyingCard(false); 

      console.log(`🪄 Guardando carta para el jugador: ${playerId}...`);
      const result = await saveBoostedPlayerAction(lineup.id, newSelection);

      if (!result.success) {
        console.error("❌ Error al guardar carta");
        setSelectedCardPlayerId(lineup.boosted_player_id || null);
      } else {
        console.log("✅ Carta guardada exitosamente");
      }
    }
  };

  // Handler para el reporte (Conectado al Modal)
  const handleReportSubmit = (reason: string) => {
    console.log("Reportando chat por:", reason);
    setIsReportOpen(false);
    // Aquí conectarías con tu backend real en el futuro
    alert("¡Reporte enviado! Gracias por ayudarnos a mantener el juego limpio.");
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
    <div className="flex flex-col gap-6 mb-16 relative">
      
      {/* AUREOLA MÁGICA */}
      <MagicCursor active={isApplyingCard} />
      
      {/* MODAL DE REPORTE (Controlado por estado isReportOpen) */}
      <ReportDialog 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        onConfirm={handleReportSubmit} 
      />

      {/* --- SECCIÓN SUPERIOR: PERFILES, CANCHA Y CARTAS --- */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* IZQUIERDA (MI PERFIL + MI CARTA) */}
        <div className="flex flex-col gap-4">
          <div className="h-52"> 
<ProfilePlaceholder 
  title={`${profile?.username || '...'}`} 
  avatarUrl={profile?.avatar_url} 
  planType={profile?.plan_type as 'free' | 'plus' | 'premium'}
  // 👇 Conectamos tu reputación (asegúrate de agregar el campo a tu type Profile)
  reputation={profile?.reputation as 'clean' | 'warning' | 'danger' | 'banned'} 
/>
          </div>
          
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

        {/* CENTRO (CANCHA CENTRAL + SUPLENTES + CHAT) */}
        <div className="xl:col-span-3 flex flex-col items-center gap-6">
          
          {/* BLOQUE 1: CANCHA (INDEPENDIENTE Y FIJA) */}
          <Card className="h-[750px] w-full shrink-0 overflow-hidden relative">
            
            {/* HEADER CANCHA */}
            <CardHeader className="pb-6 pt-8">
              <div className="flex items-start justify-between w-full px-4 sm:px-12">
                
                {/* MI SCORE */}
                <div className="flex flex-col items-center min-w-[120px]">
                  <span className={`
                      text-6xl font-black tracking-tighter drop-shadow-lg mb-2
                      ${isDraw ? 'text-slate-200' : (iWin ? 'text-emerald-500' : 'text-red-500')}
                  `}>
                    {myTotalScore > 0 ? myTotalScore.toFixed(1) : '0.0'}
                  </span>
                  {showResult ? (
                    <span className={`
                        px-4 py-1 rounded-md text-sm font-black uppercase tracking-widest border-2 shadow-[0_0_10px_rgba(0,0,0,0.5)]
                        ${isDraw 
                          ? 'bg-slate-800 border-slate-600 text-slate-400' 
                          : (iWin 
                              ? 'bg-emerald-950/50 border-emerald-500 text-emerald-500' 
                              : 'bg-red-950/50 border-red-600 text-red-600')
                        }
                    `}>
                      {isDraw ? 'DRAW' : (iWin ? 'WIN' : 'LOSE')}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">Yo</span>
                  )}
                </div>

                {/* VS */}
                <div className="flex flex-col items-center justify-center pt-2 gap-1">
                  <span className="text-3xl font-black text-slate-600 italic opacity-50">VS</span>
                  <div className="px-3 py-1 bg-slate-800/80 rounded border border-slate-700 mt-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">
                          FECHA {matchup ? matchup.match_day_number : '1'}
                      </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                      <span className="text-[9px] font-bold text-green-500/80 uppercase tracking-wider">En Vivo</span>
                  </div>
                </div>

                {/* SCORE RIVAL */}
                <div className="flex flex-col items-center min-w-[120px]">
                  <span className={`
                      text-6xl font-black tracking-tighter drop-shadow-lg mb-2
                      ${isDraw ? 'text-slate-200' : (!iWin ? 'text-emerald-500' : 'text-red-500')}
                  `}>
                     {rivalTotalScore > 0 ? rivalTotalScore.toFixed(1) : '0.0'}
                  </span>
                  {showResult ? (
                    <span className={`
                        px-4 py-1 rounded-md text-sm font-black uppercase tracking-widest border-2 shadow-[0_0_10px_rgba(0,0,0,0.5)]
                        ${isDraw 
                          ? 'bg-slate-800 border-slate-600 text-slate-400' 
                          : (!iWin 
                              ? 'bg-emerald-950/50 border-emerald-500 text-emerald-500' 
                              : 'bg-red-950/50 border-red-600 text-red-600')
                        }
                    `}>
                      {isDraw ? 'DRAW' : (!iWin ? 'WIN' : 'LOSE')}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">Rival</span>
                  )}
                </div>

              </div>
            </CardHeader>

            <CardContent className="p-0 relative h-full">
              <div className="absolute inset-0 rotate-90 scale-[1.1] origin-center translate-y-[-45px]">
                <FootballPitch />
              </div>

              {isApplyingCard && (
                 <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none transition-all duration-500" />
              )}

              <div className="relative h-full text-xs z-20">
                {/* MI EQUIPO */}
                {hasLineup ? (
                  myTeam.map((slot, index) => {
                    let score = slot.player?.player_scores?.[0]?.score;
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
                        score={score}
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

                {/* RIVAL */}
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
          
          {/* BLOQUE 2: SUPLENTES */}
          <div className="w-full flex justify-between px-8">
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

          {/* DIVISOR VISUAL */}
          <div className="w-full flex items-center gap-4 px-12 opacity-50 my-2">
             <div className="h-[1px] bg-border flex-1"></div>
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span>Zona de Interacción</span>
             </div>
             <div className="h-[1px] bg-border flex-1"></div>
          </div>

          {/* ✨ NUEVO: BARRA DE FAIR PLAY (SÓLIDA) */}
          <FairPlayLegend />

          {/* BLOQUE 3: CHAT CON BOTÓN DE REPORTE */}
          <Card className="w-full h-[450px] shrink-0 flex flex-col shadow-lg border-t-4 border-primary/20 overflow-hidden">
            {/* Header con botón de bandera */}
            <CardHeader className="py-2 border-b border-border/50 bg-muted/20 shrink-0 relative flex items-center justify-center">
              <CardTitle className="font-headline text-xs text-center uppercase tracking-wider text-muted-foreground">
                Chat del Duelo en Vivo
              </CardTitle>
              
              {/* Botón de Denuncia (Abre Modal) */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Denunciar comportamiento"
                onClick={() => setIsReportOpen(true)}
              >
                <Flag className="w-3 h-3" />
              </Button>
            </CardHeader>

            <CardContent className="p-0 flex-grow relative bg-black/20">
                <div className="absolute inset-0 p-0">
                  <DuelChat 
                    userAvatar={profile?.avatar_url} 
                    rivalAvatar={opponentProfile?.avatar_url} 
                  />
                </div>
            </CardContent>
          </Card>

        </div>

        {/* DERECHA (PERFIL RIVAL + CARTA RIVAL) */}
        <div className="flex flex-col gap-4 h-full"> 
          
          <div className="h-52 shrink-0">
<ProfilePlaceholder 
  title={`${opponentProfile?.username || '...'}`} 
  avatarUrl={opponentProfile?.avatar_url}
  planType={opponentProfile?.plan_type as 'free' | 'plus' | 'premium'} 
  // 👇 Conectamos la reputación del rival
  reputation={opponentProfile?.reputation as 'clean' | 'warning' | 'danger' | 'banned'} 
/>
          </div>

          <Card className="shrink-0"> 
            <CardHeader>
              <CardTitle className="font-headline text-lg text-center">
                CARTA RIVAL
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="w-48 h-64"> 
                <RivalCardDisplay card={opponentStrategyCard} />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    
    </div>
  );
}