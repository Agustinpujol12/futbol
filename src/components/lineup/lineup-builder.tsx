'use client';

import { type Player, type GameDay } from '@/app/(app)/dashboard/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveLineupAction } from '@/app/(app)/dashboard/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface LineupBuilderProps {
  availablePlayers: Player[];
  gameDay: GameDay | null;
  userId: string;
  leagueId: string | null;
  initialSelectedIds: string[];
}

// --- Card de Jugador en la lista ---
function FullPlayerCard({
  player,
  onSelect,
  isSelected,
}: {
  player: Player;
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <Card
      className={cn(
        'p-4 cursor-pointer relative transition-all',
        isSelected ? 'border-primary ring-2 ring-primary opacity-60' : 'border-border'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">

        {/* 1. LA FOTO DEL JUGADOR O LA SILUETA DEFAULT */}
        <img
          src={player.photo_url || "/assets/player_silhouette.png"}
          alt={player.name || "Silueta de jugador"}
          className="w-12 h-12 rounded-full bg-gray-700 object-cover"
        />

        {/* 2. Contenedor para el texto (sin cambios) */}
        <div className="flex-1">
          <p className="font-bold">{player.name}</p>
          <p className="text-sm text-muted-foreground">{player.teams?.name || "Equipo"}</p>
          <p className="text-sm font-semibold">{player.position}</p>
        </div>
      </div>

      <div className="absolute top-3 right-2 flex flex-col items-center gap-2">
        <span
          className={cn(
            'text-xs px-2 py-1 rounded-md shadow-sm',
            player.teams?.pot === 1 && 'bg-amber-200 text-amber-900',
            player.teams?.pot === 2 && 'bg-gray-200 text-gray-900',
            player.teams?.pot === 3 && 'bg-yellow-700 text-yellow-100',
            player.teams?.pot === 4 && 'bg-lime-900 text-lime-100',
            !player.teams?.pot && 'bg-zinc-200 text-zinc-900'
          )}
        >
          Bombo {player.teams?.pot || 'N/A'}
        </span>

        <img
          src={player.teams?.logo_url || 'https://placehold.co/24x24/27272A/FFF?text=?'}
          alt={player.teams?.name || 'Equipo'}
          className="w-10 h-10 rounded-full bg-gray-700 border shadow-md mt-1"
        />
      </div>
    </Card>
  );
}

// --- Card para jugador dentro del campo ---
function PitchPlayerCard({ player, onRemove }: { player: Player; onRemove: () => void }) {
  // 👉 Lógica para abreviar el nombre si es largo
  const formatName = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}. ${parts.slice(1).join(' ')}`; // "R. Villagra"
    }
    return name;
  };

  return (
    <div
      className="relative flex flex-col items-center w-16 cursor-pointer group"
      onClick={onRemove}
    >
      {/* Foto o silueta */}
      <img
        src={player.photo_url || '/assets/player_silhouette.png'}
        alt={player.name}
        className="w-10 h-10 rounded-full bg-gray-700 object-cover border-2 border-white shadow-md group-hover:border-red-500 transition-all"
      />

      {/* Nombre y posición */}
      <div className="mt-1 text-center">
        <p
          className="text-white text-[11px] font-semibold bg-black/50 px-1.5 py-0.5 rounded w-full"
          style={{ whiteSpace: 'nowrap' }}
        >
          {formatName(player.name)}
        </p>
        <p className="text-white text-[10px] font-bold" style={{ textShadow: '0 0 2px black' }}>
          {player.position.slice(0, 3).toUpperCase()}
        </p>
      </div>
    </div>
  );
}


export function LineupBuilder({
  availablePlayers,
  gameDay,
  userId,
  leagueId,
  initialSelectedIds,
}: LineupBuilderProps) {
  const MAX_PLAYERS = 8;
  const MAX_GK = 1;
  const MAX_DEF = 2;
  const MAX_MID = 3;
  const MAX_FWD = 2;

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(initialSelectedIds);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayerIds((prevSelected) => {
      const isSelected = prevSelected.includes(player.id);
      if (isSelected) {
        return prevSelected.filter((id) => id !== player.id);
      } else {
        if (prevSelected.length >= MAX_PLAYERS) {
          toast({ title: `Límite de ${MAX_PLAYERS} jugadores alcanzado.`, variant: 'destructive' });
          return prevSelected;
        }

        const currentSelectedPlayers = availablePlayers.filter((p) => prevSelected.includes(p.id));
        const gkCount = currentSelectedPlayers.filter((p) => p.position === 'Arquero').length;
        const defCount = currentSelectedPlayers.filter((p) => p.position === 'Defensor').length;
        const midCount = currentSelectedPlayers.filter((p) => p.position === 'Mediocampista').length;
        const fwdCount = currentSelectedPlayers.filter((p) => p.position === 'Delantero').length;

        if (player.position === 'Arquero' && gkCount >= MAX_GK) {
          toast({ title: `Máximo ${MAX_GK} Arquero(s).`, variant: 'destructive' });
          return prevSelected;
        }
        if (player.position === 'Defensor' && defCount >= MAX_DEF) {
          toast({ title: `Máximo ${MAX_DEF} Defensor(es).`, variant: 'destructive' });
          return prevSelected;
        }
        if (player.position === 'Mediocampista' && midCount >= MAX_MID) {
          toast({ title: `Máximo ${MAX_MID} Mediocampista(s).`, variant: 'destructive' });
          return prevSelected;
        }
        if (player.position === 'Delantero' && fwdCount >= MAX_FWD) {
          toast({ title: `Máximo ${MAX_FWD} Delantero(s).`, variant: 'destructive' });
          return prevSelected;
        }

        return [...prevSelected, player.id];
      }
    });
  };

  const handleSaveLineup = async () => {
    if (selectedPlayerIds.length !== MAX_PLAYERS) {
      toast({ title: `Debes seleccionar exactamente ${MAX_PLAYERS} jugadores.`, variant: 'destructive' });
      return;
    }

    const currentSelectedPlayers = availablePlayers.filter((p) => selectedPlayerIds.includes(p.id));
    const gkCount = currentSelectedPlayers.filter((p) => p.position === 'Arquero').length;
    const defCount = currentSelectedPlayers.filter((p) => p.position === 'Defensor').length;
    const midCount = currentSelectedPlayers.filter((p) => p.position === 'Mediocampista').length;
    const fwdCount = currentSelectedPlayers.filter((p) => p.position === 'Delantero').length;

    if (gkCount !== MAX_GK || defCount !== MAX_DEF || midCount !== MAX_MID || fwdCount !== MAX_FWD) {
      toast({
        title: 'Alineación inválida',
        description: `Necesitas 1 ARQ, 2 DEF, 3 MED, 2 DEL para guardar.`,
        variant: 'destructive',
      });
      return;
    }

    if (!gameDay || !leagueId) {
      alert('Error: falta información del día de partido o de la liga.');
      return;
    }

    startTransition(async () => {
      const payload = {
        selectedPlayerIds,
        gameDayId: gameDay.id,
        leagueId,
        userId,
      };

      const result = await saveLineupAction(payload);

      if (result?.error) {
        toast({
          title: 'Error al guardar',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: '¡Alineación guardada!',
          description: 'Tu equipo de 8 jugadores está listo.',
        });
      }
    });
  };

  if (!gameDay) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alineación del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay un día de partido activo.</p>
        </CardContent>
      </Card>
    );
  }

  if (availablePlayers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alineación del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El sorteo para el {gameDay.match_date} aún no se ha realizado. ¡Vuelve más tarde!
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedPlayers = availablePlayers.filter((p) => selectedPlayerIds.includes(p.id));
  const gkSelected = selectedPlayers.filter((p) => p.position === 'Arquero');
  const defSelected = selectedPlayers.filter((p) => p.position === 'Defensor');
  const midSelected = selectedPlayers.filter((p) => p.position === 'Mediocampista');
  const fwdSelected = selectedPlayers.filter((p) => p.position === 'Delantero');

  const gkCount = gkSelected.length;
  const defCount = defSelected.length;
  const midCount = midSelected.length;
  const fwdCount = fwdSelected.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* --- Columna Izquierda: Lista de Jugadores --- */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Tu Plantilla Sorteada ({availablePlayers.length})
            </CardTitle>
            <CardDescription>
              Estos son los 12 jugadores que te tocaron para el {gameDay.match_date}. Haz clic para moverlos a tu
              alineación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {availablePlayers.map((player) => (
                  <FullPlayerCard
                    key={player.id}
                    player={player}
                    onSelect={() => handleSelectPlayer(player)}
                    isSelected={selectedPlayerIds.includes(player.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* --- Columna Derecha: Campo --- */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline">
              Tu Alineación Táctica ({selectedPlayerIds.length}/{MAX_PLAYERS})
            </CardTitle>
            <CardDescription>Necesitas 1 ARQ, 2 DEF, 3 MED, 2 DEL.</CardDescription>
          </CardHeader>
          <Separator />
<CardContent className="p-0">
  <div
    className="relative h-[520px] rounded-xl overflow-hidden shadow-lg"
    style={{
      background: `
        repeating-linear-gradient(
          to bottom,
          #166534,
          #166534 20px,
          #15803d 20px,
          #15803d 40px
        )
      `,
      border: '3px solid white',
    }}
  >
    {/* Líneas principales */}
<div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/90 -translate-y-1/2"></div>
<div className="absolute top-1/2 left-1/2 w-28 h-28 border-[3px] border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>

{/* ÁREA RIVAL */}
<div className="absolute top-0 left-1/2 w-[80%] h-[120px] border-b-[3px] border-l-[3px] border-r-[3px] border-white -translate-x-1/2 rounded-b-[10px]"></div>
<div className="absolute top-0 left-1/2 w-[40%] h-[60px] border-b-[3px] border-l-[3px] border-r-[3px] border-white -translate-x-1/2 rounded-b-[6px]"></div>

{/* Arco rival */}
<div className="absolute top-[0px] left-1/2 w-[16%] h-[12px] bg-neutral-900 border-[2px] border-white -translate-x-1/2 rounded-b-[4px]"></div>

{/* Círculo penal rival */}
<div className="absolute top-[120px] left-1/2 w-[80px] h-[40px] border-b-[3px] border-white border-t-0 rounded-b-[80px] -translate-x-1/2"></div>

{/* ÁREA PROPIA */}
<div className="absolute bottom-0 left-1/2 w-[80%] h-[120px] border-t-[3px] border-l-[3px] border-r-[3px] border-white -translate-x-1/2 rounded-t-[10px]"></div>
<div className="absolute bottom-0 left-1/2 w-[40%] h-[60px] border-t-[3px] border-l-[3px] border-r-[3px] border-white -translate-x-1/2 rounded-t-[6px]"></div>

{/* Arco propio */}
<div className="absolute bottom-[0px] left-1/2 w-[16%] h-[12px] bg-neutral-900 border-[2px] border-white -translate-x-1/2 rounded-t-[4px]"></div>

{/* Círculo penal propio */}
<div className="absolute bottom-[120px] left-1/2 w-[80px] h-[40px] border-t-[3px] border-white border-b-0 rounded-t-[80px] -translate-x-1/2"></div>


    {/* 🧤 ARQUERO */}
    <div className="absolute bottom-[25px] left-1/2 -translate-x-1/2 flex justify-center items-center">
      {gkSelected[0] ? (
        <PitchPlayerCard player={gkSelected[0]} onRemove={() => handleSelectPlayer(gkSelected[0])} />
      ) : (
        <div className="bg-white/20 text-white p-1 rounded-md text-center text-xs w-20 h-10 flex items-center justify-center">
          ARQ ({gkCount}/{MAX_GK})
        </div>
      )}
    </div>

    {/* DEFENSORES */}
    <div className="absolute bottom-[120px] left-0 right-0 flex justify-center items-center gap-6">
      {defSelected.map((player) => (
        <PitchPlayerCard key={player.id} player={player} onRemove={() => handleSelectPlayer(player)} />
      ))}
      {Array(MAX_DEF - defCount)
        .fill(0)
        .map((_, i) => (
          <div
            key={`def-slot-${i}`}
            className="bg-white/20 text-white p-1 rounded-md text-center text-xs w-20 h-10 flex items-center justify-center"
          >
            DEF ({defCount}/{MAX_DEF})
          </div>
        ))}
    </div>

    {/* MEDIOCAMPISTAS */}
    <div className="absolute bottom-[260px] left-0 right-0 flex justify-center items-center gap-6">
      {midSelected.map((player) => (
        <PitchPlayerCard key={player.id} player={player} onRemove={() => handleSelectPlayer(player)} />
      ))}
      {Array(MAX_MID - midCount)
        .fill(0)
        .map((_, i) => (
          <div
            key={`mid-slot-${i}`}
            className="bg-white/20 text-white p-1 rounded-md text-center text-xs w-20 h-10 flex items-center justify-center"
          >
            MED ({midCount}/{MAX_MID})
          </div>
        ))}
    </div>

    {/* DELANTEROS */}
    <div className="absolute bottom-[410px] left-0 right-0 flex justify-center items-center gap-6">
      {fwdSelected.map((player) => (
        <PitchPlayerCard key={player.id} player={player} onRemove={() => handleSelectPlayer(player)} />
      ))}
      {Array(MAX_FWD - fwdCount)
        .fill(0)
        .map((_, i) => (
          <div
            key={`fwd-slot-${i}`}
            className="bg-white/20 text-white p-1 rounded-md text-center text-xs w-20 h-10 flex items-center justify-center"
          >
            DEL ({fwdCount}/{MAX_FWD})
          </div>
        ))}
    </div>
  </div>
</CardContent>


          <Separator />
          <CardFooter className="p-4">
            <Button
              className="w-full"
              onClick={handleSaveLineup}
              disabled={
                selectedPlayerIds.length !== MAX_PLAYERS ||
                isPending ||
                gkCount !== MAX_GK ||
                defCount !== MAX_DEF ||
                midCount !== MAX_MID ||
                fwdCount !== MAX_FWD
              }
            >
              {isPending ? 'Guardando...' : `Guardar Alineación (${selectedPlayerIds.length}/${MAX_PLAYERS})`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
