// src/app/(app)/fixturemundial/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Trophy, MapPin, Shield, Star } from 'lucide-react';

// --- TIPOS ---
type Team = { name: string; code: string; };
type Match = { team1: Team; team2: Team; date: string; time: string; stadium?: string };
type Group = { name: string; teams: Team[]; matches: Match[]; color: string };

// --- UTILIDADES ---
const getFlagUrl = (code: string) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

// --- DATOS MOCK GRUPOS (Colores más vivos) ---
const groupColors = [
  "from-blue-600 to-cyan-400", "from-red-600 to-orange-500", "from-emerald-600 to-green-400", "from-amber-500 to-yellow-400",
  "from-purple-600 to-pink-500", "from-indigo-600 to-violet-400", "from-teal-600 to-emerald-400", "from-rose-600 to-red-500",
  "from-sky-600 to-blue-400", "from-lime-600 to-green-500", "from-fuchsia-600 to-purple-500", "from-orange-600 to-amber-500"
];

const mockGroups: Group[] = Array.from({ length: 12 }, (_, i) => {
    const groupLetter = String.fromCharCode(65 + i);
    const mockTeams: Team[] = [
        { name: `Cabeza ${groupLetter}`, code: ['mx', 'us', 'ca', 'br', 'ar', 'fr', 'de', 'es', 'gb-eng', 'pt', 'nl', 'be'][i] || 'un' },
        { name: `Equipo 2`, code: ['jp', 'kr', 'au', 'ir', 'sa', 'sn', 'ma', 'tn', 'cm', 'gh', 'ng', 'eg'][i] || 'un' },
        { name: `Equipo 3`, code: ['uy', 'co', 'pe', 'cl', 'ec', 'py', 've', 'bo', 'cr', 'pa', 'jm', 'hn'][i] || 'un' },
        { name: `Equipo 4`, code: ['it', 'hr', 'ch', 'se', 'pl', 'dk', 'ua', 'rs', 'tr', 'gr', 'cz', 'no'][i] || 'un' },
    ];
    return {
        name: `GRUPO ${groupLetter}`,
        color: groupColors[i],
        teams: mockTeams,
        matches: [
            { team1: mockTeams[0], team2: mockTeams[1], date: '11/06', time: '15:00' },
            { team1: mockTeams[2], team2: mockTeams[3], date: '11/06', time: '18:00' },
            { team1: mockTeams[0], team2: mockTeams[2], date: '16/06', time: '15:00' },
            { team1: mockTeams[1], team2: mockTeams[3], date: '16/06', time: '21:00' },
            { team1: mockTeams[3], team2: mockTeams[0], date: '21/06', time: '18:00' },
            { team1: mockTeams[1], team2: mockTeams[2], date: '21/06', time: '18:00' },
        ]
    };
});

// --- COMPONENTE PARTIDO (GRUPOS) ---
function MatchItem({ match }: { match: Match }) {
  return (
    <div className="flex flex-col py-3 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-md group cursor-default">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3 w-[45%]">
            <img src={getFlagUrl(match.team1.code)} alt={match.team1.name} className="w-6 h-4 object-cover rounded shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-bold truncate text-zinc-200 group-hover:text-white">{match.team1.name}</span>
        </div>
        <span className="text-[10px] font-black text-zinc-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">VS</span>
        <div className="flex items-center gap-3 w-[45%] justify-end">
            <span className="text-xs font-bold truncate text-right text-zinc-200 group-hover:text-white">{match.team2.name}</span>
            <img src={getFlagUrl(match.team2.code)} alt={match.team2.name} className="w-6 h-4 object-cover rounded shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="flex justify-between items-center px-1">
         <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <CalendarDays className="w-3 h-3 text-primary" />
            <span>{match.date} • {match.time}</span>
         </div>
         {match.stadium && (
             <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                <MapPin className="w-3 h-3" />
                <span>{match.stadium}</span>
             </div>
         )}
      </div>
    </div>
  );
}

// --- TARJETA DE GRUPO ---
function GroupCard({ group }: { group: Group }) {
    return (
        <Card className="border-0 bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xl ring-1 ring-white/10 hover:ring-primary/50 transition-all duration-500 group">
            <div className={`h-1.5 w-full bg-gradient-to-r ${group.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}></div>
            
            <CardHeader className="py-4 px-5 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-headline tracking-wide text-white flex items-center gap-2 drop-shadow-md">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${group.color}`}></div>
                        {group.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {group.teams.map((team) => (
                            <div key={team.code} className="relative group/flag transition-transform hover:-translate-y-1">
                                <img 
                                    src={getFlagUrl(team.code)} 
                                    alt={team.name} 
                                    className="w-8 h-6 object-cover rounded shadow-lg ring-1 ring-black/50 hover:ring-white transition-all duration-300 cursor-help" 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-2">
                {group.matches.map((match, index) => (
                    <MatchItem key={index} match={match} />
                ))}
            </CardContent>
        </Card>
    );
}

// --- COMPONENTES BRACKET (CORREGIDOS Y ALINEADOS) ---

// 1. Slot de Partido (Tarjeta individual del bracket)
function BracketMatch({ id, round }: { id: number, round: string }) {
    return (
        <div className="w-40 bg-zinc-900/90 border border-white/10 rounded-lg overflow-hidden shadow-lg hover:border-primary/50 transition-all relative z-10">
            <div className="bg-white/5 px-2 py-1 flex justify-between items-center border-b border-white/5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">{round} #{id}</span>
            </div>
            <div className="p-2 flex flex-col gap-1.5">
                {/* Equipo 1 */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-3.5 bg-zinc-800 rounded border border-zinc-700"></div>
                        <span className="text-[10px] font-semibold text-zinc-300">TBD</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">-</span>
                </div>
                {/* Equipo 2 */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-3.5 bg-zinc-800 rounded border border-zinc-700"></div>
                        <span className="text-[10px] font-semibold text-zinc-300">TBD</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">-</span>
                </div>
            </div>
        </div>
    )
}

// 2. Columna del Bracket (Usa flex-col y justify-around para alineación perfecta)
function BracketColumn({ count, roundName, title }: { count: number, roundName: string, title?: string }) {
    return (
        <div className="flex flex-col justify-around h-full relative px-4">
            {title && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-center w-max">
                    <Badge variant="outline" className="bg-zinc-950 text-zinc-400 border-zinc-800 text-[10px] uppercase tracking-wider">
                        {title}
                    </Badge>
                </div>
            )}
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="relative flex items-center">
                    <BracketMatch id={i + 1} round={roundName} />
                </div>
            ))}
        </div>
    );
}

// 3. Conectores (Líneas entre columnas)
function BracketConnector({ count, side = 'left' }: { count: number, side?: 'left' | 'right' }) {
    // Generamos la mitad de conectores porque 2 partidos se unen en 1
    const connectorCount = count / 2;
    
    return (
        <div className="flex flex-col justify-around h-full w-8">
            {Array.from({ length: connectorCount }).map((_, i) => (
                <div key={i} className={`h-[50%] border-white/20 w-full relative ${side === 'left' ? 'border-r rounded-r-lg' : 'border-l rounded-l-lg'}`}>
                    {/* Línea horizontal central */}
                    <div className={`absolute top-1/2 w-4 h-px bg-white/20 ${side === 'left' ? 'right-[-16px]' : 'left-[-16px]'}`}></div>
                </div>
            ))}
        </div>
    );
}

function KnockoutStage2026() {
  return (
    <div className="mt-24 pt-10 border-t border-white/10 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
        
        <div className="text-center mb-20 relative z-10">
            <Badge className="mb-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 px-4 py-1 text-xs shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                FASE FINAL 2026
            </Badge>
            <h2 className="text-4xl font-bold font-headline text-white flex items-center justify-center gap-4">
                <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                El Camino a la Gloria
            </h2>
        </div>

        {/* CONTENEDOR BRACKET CON SCROLL */}
        <div className="overflow-x-auto pb-12 custom-scrollbar">
            {/* Altura fija min-h-[800px] es CLAVE para que el justify-around funcione y alinee todo verticalmente */}
            <div className="flex justify-center min-w-[1800px] h-[900px] gap-0 px-10">
                
                {/* --- LADO IZQUIERDO --- */}
                {/* Round of 32 (8 partidos) */}
                <BracketColumn count={8} roundName="R32" title="32avos" />
                <BracketConnector count={8} side="left" />
                
                {/* Round of 16 (4 partidos) */}
                <BracketColumn count={4} roundName="R16" title="Octavos" />
                <BracketConnector count={4} side="left" />

                {/* Quarter Finals (2 partidos) */}
                <BracketColumn count={2} roundName="CF" title="Cuartos" />
                <BracketConnector count={2} side="left" />

                {/* Semi Finals (1 partido) */}
                <BracketColumn count={1} roundName="SF" title="Semis" />
                
                {/* --- CENTRO (FINAL) --- */}
                <div className="flex flex-col justify-center items-center w-80 px-4 relative">
                    {/* Conectores hacia la final */}
                    <div className="absolute top-1/2 left-0 w-8 h-px bg-white/20 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-8 h-px bg-white/20 -translate-y-1/2"></div>

                    <div className="relative scale-125 z-20">
                        <div className="absolute -inset-4 bg-yellow-500/20 blur-2xl rounded-full animate-pulse"></div>
                        <Card className="border-yellow-500/50 bg-black/80 w-56 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                            <CardHeader className="py-3 bg-yellow-500/10 border-b border-yellow-500/20 text-center">
                                <CardTitle className="text-sm text-yellow-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Star className="w-3 h-3 fill-yellow-400" />
                                    Gran Final
                                    <Star className="w-3 h-3 fill-yellow-400" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex flex-col gap-3 items-center">
                                <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-md" />
                                <div className="w-full h-px bg-white/10"></div>
                                <div className="flex justify-between w-full text-sm font-bold">
                                    <span>TBD</span>
                                    <span className="text-zinc-500">vs</span>
                                    <span>TBD</span>
                                </div>
                                <div className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-1 rounded border border-yellow-500/20 w-full text-center">
                                    19 de Julio • New York
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* --- LADO DERECHO --- */}
                <BracketColumn count={1} roundName="SF" title="Semis" />
                <BracketConnector count={2} side="right" />

                <BracketColumn count={2} roundName="CF" title="Cuartos" />
                <BracketConnector count={4} side="right" />

                <BracketColumn count={4} roundName="R16" title="Octavos" />
                <BracketConnector count={8} side="right" />

                <BracketColumn count={8} roundName="R32" title="32avos" />

            </div>
        </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function MundialPage() {
  return (
    <div className="container mx-auto py-10">
      {/* HEADER */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <h1 className="text-7xl font-black font-headline text-white tracking-tighter drop-shadow-2xl">
          MUNDIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-pulse">2026</span>
        </h1>
        <p className="text-zinc-400 mt-4 text-lg max-w-2xl mx-auto">
          Canadá, México y Estados Unidos. <br />
          <span className="text-white font-semibold">48 Selecciones. 104 Partidos. Un sueño eterno.</span>
        </p>
      </div>

      {/* GRID DE GRUPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mockGroups.map((group) => (
            <GroupCard key={group.name} group={group} />
        ))}
      </div>
      
      {/* CUADRO DE ELIMINATORIAS (Formato Real 2026) */}
      <KnockoutStage2026 />
      
    </div>
  );
}