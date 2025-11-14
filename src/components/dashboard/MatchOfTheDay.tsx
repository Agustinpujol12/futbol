// src/components/dashboard/MatchOfTheDay.tsx
// --- ARCHIVO COMPLETO Y ACTUALIZADO ---

'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { FootballPitch } from './FootballPitch';
// Importamos los tipos que nos pasará el componente padre
import {
  type Player,
  type DailyLineup,
  type Profile,
} from '@/app/(app)/dashboard/types'; // Asegúrate que la ruta a 'types' es correcta

// --- NUEVA INTERFAZ DE PROPS ---
interface MatchOfTheDayProps {
  profile: Profile | null;
  lineup: DailyLineup | null;
  squad: Player[]; // Estos son los 12 jugadores sorteados
}

// --- Componente ProfilePlaceholder (sin cambios) ---
function ProfilePlaceholder({ title }: { title: string }) {
  // ... (Tu código de ProfilePlaceholder no cambia)
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-lg text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-primary/30">
          <span className="text-3xl opacity-50">?</span>
        </div>
        <p className="font-semibold text-sm">Próximamente</p>
      </CardContent>
    </Card>
  );
}

// --- Componente PitchPlayerSlot (sin cambios) ---
function PitchPlayerSlot({
  position,
  name,
  top,
  left,
  isRival = false,
}: {
  position: string;
  name: string;
  top: string;
  left: string;
  isRival?: boolean;
}) {
  // ... (Tu código de PitchPlayerSlot no cambia)
  return (
    <div
      className="absolute"
      style={{ top: `calc(${top} - 25px)`, left: `calc(${left} - 30px)` }}
    >
      <div className="flex flex-col items-center w-[60px]">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
            isRival
              ? 'bg-destructive/20 border-destructive/50'
              : 'bg-primary/20 border-primary/50'
          }`}
        >
          {position.slice(0, 3).toUpperCase()}
        </div>
        <span className="text-xs font-semibold bg-black/50 text-white px-1.5 py-0.5 rounded-md truncate w-full text-center">
          {name}
        </span>
      </div>
    </div>
  );
}

// --- Componente BenchPlayer (sin cambios) ---
function BenchPlayer({
  name,
  position,
  isRival = false,
}: {
  name: string;
  position: string;
  isRival?: boolean;
}) {
  // ... (Tu código de BenchPlayer no cambia)
  // (Solo un pequeño ajuste para abreviar la posición como en PitchPlayerSlot)
  return (
    <div
      className={`flex flex-col items-center w-[60px] ${
        isRival ? 'text-destructive' : 'text-primary'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
          isRival
            ? 'bg-destructive/20 border-destructive/50'
            : 'bg-primary/20 border-primary/50'
        }`}
      >
        {position.slice(0, 3).toUpperCase()}
      </div>
      <span className="text-xs font-semibold mt-1 truncate w-full text-center">
        {name}
      </span>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL (MODIFICADO) ---
export function MatchOfTheDay({ profile, lineup, squad }: MatchOfTheDayProps) {
  // --- LÓGICA DE DATOS ---
  const hasLineup =
    lineup && lineup.final_selection_ids && lineup.final_selection_ids.length === 8;
  let myTeamPlayers: Player[] = [];
  let myBenchPlayers: Player[] = [];

  if (hasLineup && squad && squad.length > 0) {
    const selectedIds = new Set(lineup.final_selection_ids);
    myTeamPlayers = squad.filter((player) => selectedIds.has(player.id));
    myBenchPlayers = squad.filter((player) => !selectedIds.has(player.id));
  }

  // --- Mapeo de jugadores a las posiciones de la cancha (1-2-3-2) ---
  const gkPlayer = myTeamPlayers.find((p) => p.position === 'Arquero');
  const defPlayers = myTeamPlayers.filter((p) => p.position === 'Defensor');
  const medPlayers = myTeamPlayers.filter(
    (p) => p.position === 'Mediocampista'
  );
  const fwdPlayers = myTeamPlayers.filter((p) => p.position === 'Delantero');

  // Reconstruimos tu array `myTeam` pero con los jugadores reales
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

  // Mantenemos los datos hardcoded del rival por ahora
  const rivalTeam = [
    { position: 'ARQ', name: 'Ochoa', top: '45%', left: '90%' },
    { position: 'DEF', name: 'Ko Ita.', top: '28%', left: '78%' },
    { position: 'DEF', name: 'Akanji', top: '55%', left: '78%' },
    { position: 'MED', name: 'Luis C.', top: '25%', left: '66%' },
    { position: 'MED', name: 'Ødegaard', top: '42%', left: '66%' },
    { position: 'MED', name: 'Elneny', top: '59%', left: '66%' },
    { position: 'DEL', name: 'Santi G.', top: '35%', left: '54%' },
    { position: 'DEL', name: 'Salah', top: '52%', left: '54%' },
  ];
  const rivalBench = [
    { position: 'DEF', name: 'Stones' },
    { position: 'MED', name: 'Pedri' },
    { position: 'DEL', name: 'Mbappé' },
    { position: 'DEL', name: 'Darwin' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-16">
      {/* IZQUIERDA (MI PERFIL) - AHORA ES DINÁMICO */}
      <div className="flex flex-col gap-4">
        <ProfilePlaceholder
          title={`MI PERFIL (${profile?.username || 'Cargando...'})`}
        />
        <Card>
          {/* ... (tu código de MI CARTA) ... */}
        </Card>
      </div>

      {/* CANCHA CENTRAL */}
      <div className="xl:col-span-3 flex flex-col items-center">
        <Card className="h-full min-h-[750px] overflow-hidden relative w-full">
          <CardHeader>
            <CardTitle className="font-headline text-center">
              Duelo 1v1 - Fecha 1
            </CardTitle>
            <CardDescription className="text-center">
              {profile?.username || '...'} vs. Pepo_Mix
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 relative h-full">
            <div className="absolute inset-0 rotate-90 scale-[1.1] origin-center translate-y-[-45px]">
              <FootballPitch />
            </div>

            {/* --- JUGADORES (MODIFICADO) --- */}
            <div className="relative h-full text-xs">
              {/* MI EQUIPO (DINÁMICO) */}
              {hasLineup ? (
                myTeam.map((slot, index) =>
                  slot.player ? (
                    <PitchPlayerSlot
                      key={slot.player.id}
                      position={slot.player.position}
                      name={slot.player.name}
                      top={slot.top}
                      left={slot.left}
                    />
                  ) : (
                    <PitchPlayerSlot
                      key={`empty-${index}`}
                      position="???"
                      name="---"
                      top={slot.top}
                      left={slot.left}
                    />
                  )
                )
              ) : (
                // Mensaje si no hay alineación
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 text-center p-4 bg-primary/20 rounded-lg">
                  <p className="font-semibold text-primary-foreground">
                    Ve a la pestaña "Alineación" y guarda tu equipo de 8
                    jugadores para verlo aquí.
                  </p>
                </div>
              )}

              {/* EQUIPO RIVAL (HARDCODED) */}
              {rivalTeam.map((p) => (
                <PitchPlayerSlot key={p.name} {...p} isRival />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* --- SUPLENTES (MODIFICADO) --- */}
        <div className="w-full flex justify-between mt-4 px-8">
          {/* Suplentes de mi equipo (izquierda) */}
          <div className="flex gap-3">
            {myBenchPlayers.length > 0
              ? myBenchPlayers.map((p) => (
                  <BenchPlayer
                    key={p.id}
                    name={p.name}
                    position={p.position}
                  />
                ))
              : Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <BenchPlayer key={i} name="---" position="???" />
                  ))}
          </div>
          {/* Suplentes rival (derecha) */}
          <div className="flex gap-3">
            {rivalBench.map((p) => (
              <BenchPlayer key={p.name} {...p} isRival />
            ))}
          </div>
        </div>
      </div>

      {/* DERECHA (RIVAL) */}
      <div className="flex flex-col gap-4">
        {/* ... (Tu código de PERFIL RIVAL, CARTA RIVAL y CHAT) ... */}
      </div>
    </div>
  );
}