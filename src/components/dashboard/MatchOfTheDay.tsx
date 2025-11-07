// src/components/dashboard/MatchOfTheDay.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FootballPitch } from "./FootballPitch"; // ¡Importamos la cancha SVG!

// --- Componente de Marcador de Posición para Perfil ---
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

// --- Componente de Marcador de Posición para Jugador en Cancha ---
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
          {/* ¡CORRECCIÓN AQUÍ! Usamos 'position' y lo cortamos */}
          {position.slice(0, 3).toUpperCase()}
        </div>
        <span className="text-xs font-semibold bg-black/50 text-white px-1.5 py-0.5 rounded-md truncate w-full text-center">
          {name}
        </span>
      </div>
    </div>
  );
}

// --- Componente Principal ---
export function MatchOfTheDay() {
  
  // --- ¡INICIO DE LA CORRECCIÓN EN DATOS DE MAQUETA! ---
  // (Cambiamos 'pos:' por 'position:')
  const myTeam = [
    { position: "ARQ", name: "Dibu", top: "90%", left: "50%" },
    { position: "DEF", name: "Cuti", top: "75%", left: "30%" },
    { position: "DEF", name: "Nico T.", top: "75%", left: "70%" },
    { position: "MED", name: "Enzo", top: "60%", left: "20%" },
    { position: "MED", name: "Alexis", top: "60%", left: "50%" },
    { position: "MED", name: "Wataru", top: "60%", left: "80%" },
    { position: "DEL", name: "Messi", top: "52%", left: "35%" },
    { position: "DEL", name: "Jamal", top: "52%", left: "65%" },
  ];

  const rivalTeam = [
    { position: "ARQ", name: "Ochoa", top: "10%", left: "50%" },
    { position: "DEF", name: "Ko Ita.", top: "25%", left: "30%" },
    { position: "DEF", name: "Akanji", top: "25%", left: "70%" },
    { position: "MED", name: "Luis C.", top: "40%", left: "20%" },
    { position: "MED", name: "Ødegaard", top: "40%", left: "50%" },
    { position: "MED", name: "Elneny", top: "40%", left: "80%" },
    { position: "DEL", name: "Santi G.", top: "48%", left: "35%" },
    { position: "DEL", name: "Salah", top: "48%", left: "65%" },
  ];
  // --- FIN DE LA CORRECCIÓN ---

  return (
    // Grid principal de 3 columnas (se colapsa en móvil)
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

      {/* --- 1. COLUMNA IZQUIERDA (MI PERFIL Y SUPLENTES) --- */}
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

      {/* --- 2. COLUMNA CENTRAL (LA CANCHA) --- */}
      <div className="xl:col-span-3">
        <Card className="h-full min-h-[700px] overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-center">Duelo 1v1 - Fecha 1</CardTitle>
            <CardDescription className="text-center">
              Agus95_Talleres vs. Pepo_Mix
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 relative h-full">
            {/* El fondo de la cancha SVG */}
            <div className="absolute inset-0">
              <FootballPitch />
            </div>
            
            {/* Contenedor de jugadores (se pone encima del SVG) */}
            <div className="relative h-full text-xs">
              
              {/* ¡CORRECCIÓN AQUÍ! 
                  Ahora usamos 'p' directamente, pero el error
                  real estaba en los datos de maqueta.
              */}
              {myTeam.map(p => (
                <PitchPlayerSlot key={p.name} {...p} />
              ))}
              
              {rivalTeam.map(p => (
                <PitchPlayerSlot key={p.name} {...p} isRival />
              ))}

            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- 3. COLUMNA DERECHA (RIVAL Y CHAT) --- */}
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
        {/* El chat ocupa el espacio restante */}
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