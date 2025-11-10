// src/components/dashboard/MatchOfTheDay.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { FootballPitch } from "./FootballPitch";

function ProfilePlaceholder({ title }: { title: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-lg text-center">{title}</CardTitle>
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

function PitchPlayerSlot({ 
  position, 
  name, 
  top, 
  left, 
  isRival = false 
}: { 
  position: string, 
  name: string, 
  top: string, 
  left: string, 
  isRival?: boolean 
}) {
  return (
    <div 
      className="absolute" 
      style={{ top: `calc(${top} - 25px)`, left: `calc(${left} - 30px)` }}
    >
      <div className="flex flex-col items-center w-[60px]">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
          isRival 
            ? 'bg-destructive/20 border-destructive/50' 
            : 'bg-primary/20 border-primary/50'
        }`}>
          {position.slice(0, 3).toUpperCase()}
        </div>
        <span className="text-xs font-semibold bg-black/50 text-white px-1.5 py-0.5 rounded-md truncate w-full text-center">
          {name}
        </span>
      </div>
    </div>
  );
}

// 🧤 Suplentes
function BenchPlayer({ name, position, isRival = false }: { name: string; position: string; isRival?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center w-[60px] ${
        isRival ? "text-destructive" : "text-primary"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
          isRival
            ? "bg-destructive/20 border-destructive/50"
            : "bg-primary/20 border-primary/50"
        }`}
      >
        {position}
      </div>
      <span className="text-xs font-semibold mt-1">{name}</span>
    </div>
  );
}

export function MatchOfTheDay() {

  // ⚽ Cada equipo ahora ocupa solo su mitad del campo
  const myTeam = [
    { position: "ARQ", name: "Dibu", top: "50%", left: "11%" },
    { position: "DEF", name: "Cuti", top: "35%", left: "23%" },
    { position: "DEF", name: "Nico T.", top: "65%", left: "23%" },
    { position: "MED", name: "Enzo", top: "30%", left: "35%" },
    { position: "MED", name: "Alexis", top: "50%", left: "35%" },
    { position: "MED", name: "Wataru", top: "70%", left: "35%" },
    { position: "DEL", name: "Messi", top: "40%", left: "46%" },
    { position: "DEL", name: "Jamal", top: "60%", left: "46%" },
  ];

  const rivalTeam = [
    { position: "ARQ", name: "Ochoa", top: "50%", left: "89%" },
    { position: "DEF", name: "Ko Ita.", top: "35%", left: "77%" },
    { position: "DEF", name: "Akanji", top: "65%", left: "77%" },
    { position: "MED", name: "Luis C.", top: "30%", left: "65%" },
    { position: "MED", name: "Ødegaard", top: "50%", left: "65%" },
    { position: "MED", name: "Elneny", top: "70%", left: "65%" },
    { position: "DEL", name: "Santi G.", top: "40%", left: "54%" },
    { position: "DEL", name: "Salah", top: "60%", left: "54%" },
  ];

  const myBench = [
    { position: "DEF", name: "Tagliafico" },
    { position: "MED", name: "Lo Celso" },
    { position: "DEL", name: "Garnacho" },
    { position: "DEL", name: "Lautaro" },
  ];

  const rivalBench = [
    { position: "DEF", name: "Stones" },
    { position: "MED", name: "Pedri" },
    { position: "DEL", name: "Mbappé" },
    { position: "DEL", name: "Darwin" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

      {/* IZQUIERDA */}
      <div className="flex flex-col gap-4">
        <ProfilePlaceholder title="MI PERFIL (Agus95_Talleres)" />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg text-center">MIS SUPLENTES (4)</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>(Aquí irán los 4 suplentes)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg text-center">MI CARTA</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>(Aquí irá tu carta)</p>
          </CardContent>
        </Card>
      </div>

      {/* CANCHA CENTRAL */}
      <div className="xl:col-span-3">
        <Card className="h-full min-h-[750px] overflow-hidden relative">
          <CardHeader>
            <CardTitle className="font-headline text-center">Duelo 1v1 - Fecha 1</CardTitle>
            <CardDescription className="text-center">
              Agus95_Talleres vs. Pepo_Mix
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 relative h-full">
            {/* Cancha horizontal */}
            <div className="absolute inset-0 rotate-90 scale-[1.1] origin-center">
              <FootballPitch />
            </div>

            {/* Jugadores */}
            <div className="relative h-full text-xs">
              {myTeam.map(p => (
                <PitchPlayerSlot key={p.name} {...p} />
              ))}
              {rivalTeam.map(p => (
                <PitchPlayerSlot key={p.name} {...p} isRival />
              ))}
            </div>

            {/* 🧤 Suplentes fuera del campo */}
            <div className="absolute bottom-2 left-0 w-full flex justify-between px-6">
              {/* Suplentes de mi equipo (izquierda) */}
              <div className="flex gap-3">
                {myBench.map(p => (
                  <BenchPlayer key={p.name} {...p} />
                ))}
              </div>

              {/* Suplentes rival (derecha) */}
              <div className="flex gap-3">
                {rivalBench.map(p => (
                  <BenchPlayer key={p.name} {...p} isRival />
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* DERECHA */}
      <div className="flex flex-col gap-4">
        <ProfilePlaceholder title="PERFIL RIVAL (Pepo_Mix)" />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg text-center">SUPLENTES RIVAL (4)</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>(Aquí irán los suplentes)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg text-center">CARTA RIVAL</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>(Aquí irá la carta rival)</p>
          </CardContent>
        </Card>
        <Card className="flex-grow min-h-[150px]">
          <CardHeader>
            <CardTitle className="font-headline text-lg text-center">CHAT DEL DUELO</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>Próximamente...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
