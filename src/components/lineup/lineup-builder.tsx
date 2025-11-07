'use client'; 

import { type Player, type GameDay } from '@/app/(app)/dashboard/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveLineupAction } from '@/app/(app)/dashboard/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils'; // Para clases condicionales

interface LineupBuilderProps {
  availablePlayers: Player[];
  gameDay: GameDay | null;
  userId: string;
  leagueId: string | null;
  initialSelectedIds: string[];
}

// --- Componente Card Grande (para la columna izquierda) ---
function FullPlayerCard({ player, onSelect, isSelected }: { player: Player, onSelect: () => void, isSelected: boolean }) {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer relative", 
        isSelected ? "border-primary ring-2 ring-primary" : "border-border",
        isSelected && "opacity-60" // Un poco más tenue si ya está seleccionado
      )}
      onClick={onSelect}
    >
      <p className="font-bold">{player.name}</p>
      <p className="text-sm text-muted-foreground">{player.teams?.name || 'Equipo'}</p>
      <p className="text-sm font-semibold">{player.position}</p>
      <span className={cn(
        "text-xs p-1 rounded absolute top-2 right-2",
        player.teams?.pot === 1 && 'bg-amber-200 text-amber-900', 
        player.teams?.pot === 2 && 'bg-gray-200 text-gray-900',
        !player.teams?.pot && 'bg-zinc-200 text-zinc-900'
      )}>
        Bombo {player.teams?.pot || 'N/A'}
      </span>
    </Card>
  );
}

// --- ¡NUEVO COMPONENTE: TARJETA PARA EL CAMPO! ---
function PitchPlayerCard({ player, onRemove }: { player: Player, onRemove: () => void }) {
  return (
    <div 
      className="bg-white text-gray-900 p-1 rounded-md text-center text-xs font-semibold cursor-pointer hover:bg-red-200 transition-colors"
      onClick={onRemove}
    >
      <p>{player.name.split(' ')[0]}</p> {/* Solo el primer nombre */}
      <p className="text-gray-600 text-[10px]">{player.position.slice(0, 3).toUpperCase()}</p> {/* ARQ, DEF, MED, DEL */}
    </div>
  );
}


export function LineupBuilder({ 
  availablePlayers, 
  gameDay, 
  userId, 
  leagueId, 
  initialSelectedIds 
}: LineupBuilderProps) {
  
  // --- Constantes de Reglas de Posición ---
  const MAX_PLAYERS = 8;
  const MAX_GK = 1;
  const MAX_DEF = 2;
  const MAX_MID = 3;
  const MAX_FWD = 2;

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(initialSelectedIds);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // --- Lógica de Selección (con reglas de posición) ---
  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayerIds((prevSelected) => {
      const isSelected = prevSelected.includes(player.id);
      let newSelected = [...prevSelected];

      if (isSelected) {
        // Remover jugador
        return prevSelected.filter((id) => id !== player.id);
      } else {
        // Añadir jugador
        if (prevSelected.length >= MAX_PLAYERS) {
          toast({ title: `Límite de ${MAX_PLAYERS} jugadores alcanzado.`, variant: "destructive" });
          return prevSelected;
        }

        const currentSelectedPlayers = availablePlayers.filter(p => prevSelected.includes(p.id));
        const gkCount = currentSelectedPlayers.filter(p => p.position === 'Arquero').length;
        const defCount = currentSelectedPlayers.filter(p => p.position === 'Defensor').length;
        const midCount = currentSelectedPlayers.filter(p => p.position === 'Mediocampista').length;
        const fwdCount = currentSelectedPlayers.filter(p => p.position === 'Delantero').length;

        // Validar límites por posición
        if (player.position === 'Arquero' && gkCount >= MAX_GK) {
          toast({ title: `Máximo ${MAX_GK} Arquero(s).`, variant: "destructive" });
          return prevSelected;
        }
        if (player.position === 'Defensor' && defCount >= MAX_DEF) {
          toast({ title: `Máximo ${MAX_DEF} Defensor(es).`, variant: "destructive" });
          return prevSelected;
        }
        if (player.position === 'Mediocampista' && midCount >= MAX_MID) {
          toast({ title: `Máximo ${MAX_MID} Mediocampista(s).`, variant: "destructive" });
          return prevSelected;
        }
        if (player.position === 'Delantero' && fwdCount >= MAX_FWD) {
          toast({ title: `Máximo ${MAX_FWD} Delantero(s).`, variant: "destructive" });
          return prevSelected;
        }
        
        return [...prevSelected, player.id];
      }
    });
  };

  const handleSaveLineup = async () => {
    if (selectedPlayerIds.length !== MAX_PLAYERS) {
      toast({ title: `Debes seleccionar exactamente ${MAX_PLAYERS} jugadores.`, variant: "destructive" });
      return;
    }
    // --- NUEVA VALIDACIÓN: Asegurar que las posiciones cumplen los mínimos/máximos ---
    const currentSelectedPlayers = availablePlayers.filter(p => selectedPlayerIds.includes(p.id));
    const gkCount = currentSelectedPlayers.filter(p => p.position === 'Arquero').length;
    const defCount = currentSelectedPlayers.filter(p => p.position === 'Defensor').length;
    const midCount = currentSelectedPlayers.filter(p => p.position === 'Mediocampista').length;
    const fwdCount = currentSelectedPlayers.filter(p => p.position === 'Delantero').length;

    if (gkCount !== MAX_GK || defCount !== MAX_DEF || midCount !== MAX_MID || fwdCount !== MAX_FWD) {
      toast({
        title: "Alineación Inválida",
        description: `Necesitas 1 ARQ, 2 DEF, 3 MED, 2 DEL para guardar.`,
        variant: "destructive"
      });
      return;
    }
    // --- FIN NUEVA VALIDACIÓN ---

    if (!gameDay || !leagueId) {
      alert("Error: Falta información del día de partido o de la liga.");
      return;
    }

    startTransition(async () => {
      const payload = {
        selectedPlayerIds: selectedPlayerIds,
        gameDayId: gameDay.id,
        leagueId: leagueId,
        userId: userId
      };

      const result = await saveLineupAction(payload);

      if (result?.error) {
        toast({
          title: "Error al guardar",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "¡Alineación Guardada!",
          description: "Tu equipo de 8 jugadores está listo."
        });
      }
    });
  };

  if (!gameDay) {
    return (
      <Card><CardHeader><CardTitle>Alineación del Día</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">No hay un día de partido activo.</p></CardContent>
      </Card>
    );
  }

  if (availablePlayers.length === 0) {
    return (
      <Card><CardHeader><CardTitle>Alineación del Día</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El sorteo para el {gameDay.match_date} aún no se ha realizado. ¡Vuelve más tarde!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const selectedPlayers = availablePlayers.filter(p => selectedPlayerIds.includes(p.id));
  const benchPlayers = availablePlayers.filter(p => !selectedPlayerIds.includes(p.id));

  // Filtrar jugadores seleccionados por posición para el campo
  const gkSelected = selectedPlayers.filter(p => p.position === 'Arquero');
  const defSelected = selectedPlayers.filter(p => p.position === 'Defensor');
  const midSelected = selectedPlayers.filter(p => p.position === 'Mediocampista');
  const fwdSelected = selectedPlayers.filter(p => p.position === 'Delantero');

  // Contadores para mostrar en la interfaz
  const gkCount = gkSelected.length;
  const defCount = defSelected.length;
  const midCount = midSelected.length;
  const fwdCount = fwdSelected.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* --- COLUMNA IZQUIERDA (Banco / Plantilla) --- */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Tu Plantilla Sorteada ({availablePlayers.length})</CardTitle>
            <CardDescription>
              Estos son los 12 jugadores que te tocaron para el {gameDay.match_date}. 
              Haz clic para moverlos a tu alineación.
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

      {/* --- COLUMNA DERECHA (Campo de Fútbol) --- */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline">Tu Alineación Táctica ({selectedPlayerIds.length}/{MAX_PLAYERS})</CardTitle>
            <CardDescription>
              Necesitas 1 Arquero, 2 Defensores, 3 Mediocampistas y 2 Delanteros.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className='p-0'>
            {/* --- LAYOUT DEL CAMPO DE FÚTBOL --- */}
            <div className="relative h-[520px] bg-green-700/80 border-b-2 border-white">
              {/* Línea de medio campo */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white -translate-y-1/2"></div>
              {/* Círculo central (mitad) */}
              <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              {/* Área grande */}
              <div className="absolute bottom-0 left-1/2 w-[80%] h-[100px] border-t-2 border-l-2 border-r-2 border-white -translate-x-1/2 rounded-t-lg"></div>
              {/* Área chica */}
              <div className="absolute bottom-0 left-1/2 w-[40%] h-[40px] border-t-2 border-l-2 border-r-2 border-white -translate-x-1/2 rounded-t-lg"></div>
              {/* Arco */}
              <div className="absolute bottom-0 left-1/2 w-[20%] h-[10px] border-t-2 border-l-2 border-r-2 border-white -translate-x-1/2 rounded-t-lg bg-gray-900"></div>

              {/* Zonas de Posición y Jugadores */}

              {/* ARQUERO */}
              <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-24 h-16 flex justify-center items-center">
                {gkSelected[0] ? (
                  <PitchPlayerCard player={gkSelected[0]} onRemove={() => handleSelectPlayer(gkSelected[0])} />
                ) : (
                  <div className="bg-white/20 text-white p-1 rounded-md text-center text-xs w-20 h-10 flex items-center justify-center">
                    ARQ ({gkCount}/{MAX_GK})
                  </div>
                )}
              </div>

              {/* DEFENSORES */}
              <div className="absolute bottom-[100px] left-0 right-0 h-16 flex justify-center items-center gap-4">
                {defSelected.map((player) => (
                  <PitchPlayerCard key={player.id} player={player} onRemove={() => handleSelectPlayer(player)} />
                ))}
                {Array(MAX_DEF - defCount).fill(0).map((_, i) => (
                  <div key={`def-slot-${i}`} className="bg-white/20 text-white p-1 rounded-md text-center text-xs w-20 h-10 flex items-center justify-center">
                    DEF ({defCount}/{MAX_DEF})
                  </div>
                ))}
              </div>

              {/* MEDIOCAMPISTAS */}
              <div className="absolute bottom-[250px] left-0 right-0 h-16 flex justify-center items-center gap-4">
                {midSelected.map((player) => (
                  <PitchPlayerCard key={player.id} player={player} onRemove={() => handleSelectPlayer(player)} />
                ))}
                {Array(MAX_MID - midCount).fill(0).map((_, i) => (
                  <div key={`mid-slot-${i}`} className="bg-white/20 text-white p-1 rounded-md text-center text-xs w-20 h-10 flex items-center justify-center">
                    MED ({midCount}/{MAX_MID})
                  </div>
                ))}
              </div>

              {/* DELANTEROS */}
              <div className="absolute bottom-[400px] left-0 right-0 h-16 flex justify-center items-center gap-4">
                {fwdSelected.map((player) => (
                  <PitchPlayerCard key={player.id} player={player} onRemove={() => handleSelectPlayer(player)} />
                ))}
                {Array(MAX_FWD - fwdCount).fill(0).map((_, i) => (
                  <div key={`fwd-slot-${i}`} className="bg-white/20 text-white p-1 rounded-md text-center text-xs w-20 h-10 flex items-center justify-center">
                    DEL ({fwdCount}/{MAX_FWD})
                  </div>
                ))}
              </div>

            </div>
            {/* --- FIN LAYOUT CAMPO DE FÚTBOL --- */}
          </CardContent>
          <Separator />
          <CardFooter className="p-4">
            <Button 
              className="w-full"
              onClick={handleSaveLineup} 
              disabled={selectedPlayerIds.length !== MAX_PLAYERS || isPending || gkCount !== MAX_GK || defCount !== MAX_DEF || midCount !== MAX_MID || fwdCount !== MAX_FWD}
            >
              {isPending ? "Guardando..." : `Guardar Alineación (${selectedPlayerIds.length}/${MAX_PLAYERS})`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}