// src/components/dashboard/FootballPitch.tsx

export function FootballPitch() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full text-white"
    >
      {/* 🌱 Césped base */}
      <rect width="400" height="600" fill="#065f46" />

      {/* ⚽ Líneas de la cancha (Centradas Simétricamente) */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.85"
      >
        {/* CANVAS: 400 x 600 
           MARGEN: 25px por lado
           ANCHO CANCHA: 350px (400 - 25 - 25)
           ALTO CANCHA: 550px (600 - 25 - 25)
        */}

        {/* Borde de juego */}
        <rect x="25" y="25" width="350" height="550" />

        {/* Medio campo */}
        <line x1="25" y1="300" x2="375" y2="300" />
        <circle cx="200" cy="300" r="45" />
        <circle cx="200" cy="300" r="3" fill="currentColor" stroke="none" />

        {/* --- ÁREA SUPERIOR (Arriba) --- */}
        {/* Área Grande (Centrada: 350 ancho -> centro en 175. Ancho área 220 -> x = 200 - 110 = 90) */}
        <rect x="90" y="25" width="220" height="90" />
        {/* Área Chica (Ancho 100 -> x = 200 - 50 = 150) */}
        <rect x="150" y="25" width="100" height="35" />
        {/* Media Luna */}
        <path d="M 160 115 A 40 40 0 0 1 240 115" />

        {/* --- ÁREA INFERIOR (Abajo) --- */}
        {/* Área Grande */}
        <rect x="90" y="485" width="220" height="90" /> {/* 575 (borde) - 90 (alto) = 485 */}
        {/* Área Chica */}
        <rect x="150" y="540" width="100" height="35" /> {/* 575 - 35 = 540 */}
        {/* Media Luna */}
        <path d="M 160 485 A 40 40 0 0 0 240 485" />

        {/* --- CÓRNERS --- */}
        <path d="M 25 40 A 15 15 0 0 0 40 25" />   {/* Arriba Izq */}
        <path d="M 360 25 A 15 15 0 0 0 375 40" /> {/* Arriba Der */}
        <path d="M 25 560 A 15 15 0 0 1 40 575" /> {/* Abajo Izq */}
        <path d="M 375 560 A 15 15 0 0 0 360 575" /> {/* Abajo Der */}
      </g>
    </svg>
  );
}