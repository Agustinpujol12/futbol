// src/components/lineup/lineup-builder.tsx
'use client'; 

import { type Player, type GameDay } from '@/app/(app)/dashboard/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast'; // Importamos el toast

// --- 1. Importamos la nueva Server Action ---
import { saveLineupAction } from '@/app/(app)/dashboard/actions';

// --- 2. Actualizamos las Props ---
interface LineupBuilderProps {
  availablePlayers: Player[];
  gameDay: GameDay | null;
  userId: string;
  leagueId: string | null; // <-- Recibimos la leagueId
}

export function LineupBuilder({ availablePlayers, gameDay, userId, leagueId }: LineupBuilderProps) {
  
  const TEAM_SIZE = 8;
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  
  // --- 3. Añadimos useToast y useTransition ---
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSelectPlayer = (playerId: string) => {
    // ... (la lógica de selección sigue igual)
    setSelectedPlayerIds((prevSelected) => {
      if (prevSelected.includes(playerId)) {
        return prevSelected.filter((id) => id !== playerId);
      } else {
        if (prevSelected.length >= TEAM_SIZE) {
          toast({ title: `Límite de ${TEAM_SIZE} jugadores alcanzado.`, variant: "destructive" });
          return prevSelected;
        }
        return [...prevSelected, playerId];
      }
    });
  };

  // --- 4. ¡ACTUALIZAMOS EL MANEJADOR DE GUARDADO! ---
  const handleSaveLineup = async () => {
    if (selectedPlayerIds.length !== TEAM_SIZE) {
      alert(`Debes seleccionar exactamente ${TEAM_SIZE} jugadores.`);
      return;
    }
    // Verificamos que tengamos todos los IDs necesarios
    if (!gameDay || !leagueId) {
      alert("Error: Falta información del día de partido o de la liga.");
      return;
    }

    // Usamos startTransition para el estado de "cargando"
    startTransition(async () => {
      const payload = {
        selectedPlayerIds: selectedPlayerIds,
        gameDayId: gameDay.id,
        leagueId: leagueId,
        userId: userId
      };

      // ¡Llamamos a la Server Action!
      const result = await saveLineupAction(payload);

      // Manejamos la respuesta
      if (result?.error) {
        toast({
          title: "Error al guardar",
          description: result.error,
          variant: "destructive",
        });
      } else {
        // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
        // (Quitamos la línea 'variant: "success"')
        toast({
          title: "¡Alineación Guardada!",
          description: "Tu equipo de 8 jugadores está listo."
        });
        // --- FIN DE LA CORRECCIÓN ---
      }
    });
  };

  // --- 5. Renderizado del Componente ---

  if (!gameDay || availablePlayers.length === 0) {
    // ... (El estado de "Cargando" o "Sorteo pendiente" sigue igual)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alineación del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {gameDay 
              ? "El sorteo para este día de partido aún no se ha realizado. ¡Vuelve más tarde!"
              : "No hay un día de partido activo."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  // Si el sorteo SÍ ocurrió, mostramos los 12 jugadores
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Plantilla Sorteada ({selectedPlayerIds.length}/{TEAM_SIZE})</CardTitle>
        <p className="text-muted-foreground">
          Estos son tus {availablePlayers.length} jugadores para el {gameDay?.match_date}. 
          Elige tus {TEAM_SIZE} titulares.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {availablePlayers.map((player) => {
            const isSelected = selectedPlayerIds.includes(player.id);
            return (
              <Card 
                key={player.id}
                className={`p-4 cursor-pointer ${isSelected ? 'border-primary ring-2 ring-primary' : 'border-border'}`}
                onClick={() => handleSelectPlayer(player.id)}
              >
                <p className="font-bold">{player.name}</p>
                <p className="text-sm text-muted-foreground">{player.teams?.name || 'Equipo no encontrado'}</p>
                <p className="text-sm font-semibold">{player.position}</p>
                <span className={`text-xs p-1 rounded ${player.teams?.pot === 1 ? 'bg-amber-200 text-amber-900' : 'bg-gray-200 text-gray-900'}`}>
                  Bombo {player.teams?.pot || 'N/A'}
                </span>
              </Card>
            );
          })}
        </div>
        <Button 
          className="w-full"
          onClick={handleSaveLineup} 
          disabled={selectedPlayerIds.length !== TEAM_SIZE || isPending}
        >
          {isPending ? "Guardando..." : `Guardar Alineación (${selectedPlayerIds.length}/${TEAM_SIZE})`}
        </Button>
      </CardContent>
    </Card>
  );
}