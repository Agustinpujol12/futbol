// src/components/dashboard/FootballPitch.tsx
// Este componente es solo el fondo de la cancha de fútbol (SVG).
// Usa 'currentColor' para las líneas, así que se adaptará
// a tu tema claro/oscuro (si las líneas son blancas).

export function FootballPitch() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      {/* Fondo de la cancha (césped) - un verde oscuro semitransparente */}
      <rect width="400" height="600" fill="#059669" fillOpacity="0.4" />
      
      {/* Líneas de la cancha (usando 'currentColor' para que sea blanco en tema oscuro) */}
      <g
        fill="none"
        stroke="currentColor" // ¡Clave!
        strokeWidth="2"
        strokeOpacity="0.7"
      >
        {/* Borde exterior */}
        <rect x="5" y="5" width="390" height="590" />
        
        {/* Línea de medio campo */}
        <line x1="5" y1="300" x2="395" y2="300" />
        {/* Círculo central */}
        <circle cx="200" cy="300" r="40" />
        {/* Punto central */}
        <circle cx="200" cy="300" r="2" fill="currentColor" stroke="none" />
        
        {/* Área Local (Arriba) */}
        <rect x="75" y="5" width="250" height="100" />
        <rect x="135" y="5" width="130" height="35" />
        <path d="M 160 105 A 40 40 0 0 1 240 105" />
        
        {/* Área Visitante (Abajo) */}
        <rect x="75" y="495" width="250" height="100" />
        <rect x="135" y="560" width="130" height="35" />
        <path d="M 160 495 A 40 40 0 0 0 240 495" />
      </g>
    </svg>
  );
}