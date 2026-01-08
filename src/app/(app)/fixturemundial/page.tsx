'use client';

import { useRef, useState, MouseEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Trophy, MapPin, Star, Medal, Clock, List, ArrowLeftRight } from 'lucide-react';

// --- TIPOS ---
type Team = { name: string; code: string; };
type Match = { team1: Team; team2: Team; date: string; time: string; stadium: string };
type Group = { name: string; teams: Team[]; matches: Match[]; color: string };

// --- UTILIDADES ---
const getFlagUrl = (code: string) => {
    if (code === 'fifa') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_FIFA.svg/64px-Flag_of_FIFA.svg.png';
    if (code === 'gb-eng') return 'https://flagcdn.com/w80/gb-eng.png';
    if (code === 'gb-sct') return 'https://flagcdn.com/w80/gb-sct.png';
    if (code === 'gb-wls') return 'https://flagcdn.com/w80/gb-wls.png';
    return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
};

// --- COLORES DE GRUPOS ---
const groupColors = [
  "from-green-700 to-red-600",      // A (México)
  "from-red-600 to-white",          // B (Canadá)
  "from-yellow-400 to-green-600",   // C (Brasil)
  "from-blue-800 to-red-600",       // D (USA)
  "from-gray-800 to-yellow-500",    // E (Alemania)
  "from-orange-500 to-white",       // F (Holanda)
  "from-red-600 to-yellow-500",     // G (Bélgica)
  "from-red-700 to-yellow-400",     // H (España)
  "from-blue-700 to-red-500",       // I (Francia)
  "from-sky-400 to-white",          // J (Argentina)
  "from-red-700 to-green-600",      // K (Portugal)
  "from-white to-red-600"           // L (Inglaterra)
];

// --- EQUIPOS ---
const teams = {
    mx: { name: 'México', code: 'mx' },
    ca: { name: 'Canadá', code: 'ca' },
    us: { name: 'USA', code: 'us' },
    ht: { name: 'Haití', code: 'ht' },
    cw: { name: 'Curazao', code: 'cw' },
    pa: { name: 'Panamá', code: 'pa' },
    cr: { name: 'Costa Rica', code: 'cr' },

    br: { name: 'Brasil', code: 'br' },
    py: { name: 'Paraguay', code: 'py' },
    ec: { name: 'Ecuador', code: 'ec' },
    uy: { name: 'Uruguay', code: 'uy' },
    ar: { name: 'Argentina', code: 'ar' },
    co: { name: 'Colombia', code: 'co' },

    ch: { name: 'Suiza', code: 'ch' },
    sct: { name: 'Escocia', code: 'gb-sct' },
    de: { name: 'Alemania', code: 'de' },
    nl: { name: 'Países Bajos', code: 'nl' },
    be: { name: 'Bélgica', code: 'be' },
    es: { name: 'España', code: 'es' },
    fr: { name: 'Francia', code: 'fr' },
    no: { name: 'Noruega', code: 'no' },
    at: { name: 'Austria', code: 'at' },
    pt: { name: 'Portugal', code: 'pt' },
    eng: { name: 'Inglaterra', code: 'gb-eng' },
    hr: { name: 'Croacia', code: 'hr' },

    za: { name: 'Sudáfrica', code: 'za' },
    ma: { name: 'Marruecos', code: 'ma' },
    ci: { name: 'Costa de Marfil', code: 'ci' },
    tn: { name: 'Túnez', code: 'tn' },
    eg: { name: 'Egipto', code: 'eg' },
    cv: { name: 'Cabo Verde', code: 'cv' },
    sn: { name: 'Senegal', code: 'sn' },
    dz: { name: 'Argelia', code: 'dz' },
    gh: { name: 'Ghana', code: 'gh' },

    kr: { name: 'Corea del Sur', code: 'kr' },
    qa: { name: 'Qatar', code: 'qa' },
    au: { name: 'Australia', code: 'au' },
    jp: { name: 'Japón', code: 'jp' },
    ir: { name: 'Irán', code: 'ir' },
    sa: { name: 'Arabia Saudita', code: 'sa' },
    jo: { name: 'Jordania', code: 'jo' },
    uz: { name: 'Uzbekistán', code: 'uz' },

    nz: { name: 'Nueva Zelanda', code: 'nz' },

    euA: { name: 'Europa A', code: 'fifa' },
    euB: { name: 'Europa B', code: 'fifa' },
    euC: { name: 'Europa C', code: 'fifa' },
    euD: { name: 'Europa D', code: 'fifa' },
    rep1: { name: 'Repechaje 1', code: 'fifa' },
    rep2: { name: 'Repechaje 2', code: 'fifa' },
};

// --- FIXTURE OFICIAL ---
const officialGroups: Group[] = [
    {
        name: "GRUPO A",
        color: groupColors[0],
        teams: [teams.mx, teams.za, teams.kr, teams.euD],
        matches: [
            { team1: teams.mx, team2: teams.za, date: "Jue 11/06", time: "16:00", stadium: "Estadio Ciudad de México" },
            { team1: teams.kr, team2: teams.euD, date: "Jue 11/06", time: "23:00", stadium: "Estadio Guadalajara" },
            { team1: teams.euD, team2: teams.za, date: "Jue 18/06", time: "13:00", stadium: "Atlanta Stadium" },
            { team1: teams.mx, team2: teams.kr, date: "Jue 18/06", time: "22:00", stadium: "Estadio Guadalajara" },
            { team1: teams.euD, team2: teams.mx, date: "Mié 24/06", time: "22:00", stadium: "Estadio Ciudad de México" },
            { team1: teams.za, team2: teams.kr, date: "Mié 24/06", time: "22:00", stadium: "Estadio Monterrey" },
        ]
    },
    {
        name: "GRUPO B",
        color: groupColors[1],
        teams: [teams.ca, teams.euA, teams.qa, teams.ch],
        matches: [
            { team1: teams.ca, team2: teams.euA, date: "Vie 12/06", time: "16:00", stadium: "Toronto Stadium" },
            { team1: teams.qa, team2: teams.ch, date: "Sáb 13/06", time: "16:00", stadium: "SF Bay Area Stadium" },
            { team1: teams.ch, team2: teams.euA, date: "Jue 18/06", time: "16:00", stadium: "Los Angeles Stadium" },
            { team1: teams.ca, team2: teams.qa, date: "Jue 18/06", time: "19:00", stadium: "BC Place Vancouver" },
            { team1: teams.ch, team2: teams.ca, date: "Mié 24/06", time: "16:00", stadium: "BC Place Vancouver" },
            { team1: teams.euA, team2: teams.qa, date: "Mié 24/06", time: "16:00", stadium: "Seattle Stadium" },
        ]
    },
    {
        name: "GRUPO C",
        color: groupColors[2],
        teams: [teams.br, teams.ma, teams.ht, teams.sct],
        matches: [
            { team1: teams.br, team2: teams.ma, date: "Sáb 13/06", time: "19:00", stadium: "Boston Stadium" },
            { team1: teams.ht, team2: teams.sct, date: "Sáb 13/06", time: "22:00", stadium: "NY / NJ Stadium" },
            { team1: teams.br, team2: teams.ht, date: "Vie 19/06", time: "19:00", stadium: "Philadelphia Stadium" },
            { team1: teams.sct, team2: teams.ma, date: "Vie 19/06", time: "22:00", stadium: "Boston Stadium" },
            { team1: teams.sct, team2: teams.br, date: "Mié 24/06", time: "19:00", stadium: "Miami Stadium" },
            { team1: teams.ma, team2: teams.ht, date: "Mié 24/06", time: "19:00", stadium: "Atlanta Stadium" },
        ]
    },
    {
        name: "GRUPO D",
        color: groupColors[3],
        teams: [teams.us, teams.euC, teams.au, teams.py],
        matches: [
            { team1: teams.us, team2: teams.euC, date: "Vie 12/06", time: "22:00", stadium: "Los Angeles Stadium" },
            { team1: teams.au, team2: teams.py, date: "Sáb 13/06", time: "01:00", stadium: "BC Place Vancouver" },
            { team1: teams.euC, team2: teams.py, date: "Vie 19/06", time: "16:00", stadium: "SF Bay Area Stadium" },
            { team1: teams.us, team2: teams.au, date: "Vie 19/06", time: "01:00", stadium: "Seattle Stadium" },
            { team1: teams.euC, team2: teams.us, date: "Jue 25/06", time: "23:00", stadium: "Los Angeles Stadium" },
            { team1: teams.py, team2: teams.au, date: "Jue 25/06", time: "23:00", stadium: "SF Bay Area Stadium" },
        ]
    },
    {
        name: "GRUPO E",
        color: groupColors[4],
        teams: [teams.de, teams.cw, teams.ci, teams.ec],
        matches: [
            { team1: teams.de, team2: teams.cw, date: "Dom 14/06", time: "14:00", stadium: "Philadelphia Stadium" },
            { team1: teams.ci, team2: teams.ec, date: "Dom 14/06", time: "20:00", stadium: "Houston Stadium" },
            { team1: teams.de, team2: teams.ci, date: "Sáb 20/06", time: "17:00", stadium: "Toronto Stadium" },
            { team1: teams.cw, team2: teams.ec, date: "Sáb 20/06", time: "21:00", stadium: "Kansas City Stadium" },
            { team1: teams.ec, team2: teams.de, date: "Jue 25/06", time: "17:00", stadium: "Philadelphia Stadium" },
            { team1: teams.cw, team2: teams.ci, date: "Jue 25/06", time: "17:00", stadium: "NY / NJ Stadium" },
        ]
    },
    {
        name: "GRUPO F",
        color: groupColors[5],
        teams: [teams.nl, teams.jp, teams.euB, teams.tn],
        matches: [
            { team1: teams.nl, team2: teams.jp, date: "Dom 14/06", time: "17:00", stadium: "Dallas Stadium" },
            { team1: teams.euB, team2: teams.tn, date: "Dom 14/06", time: "23:00", stadium: "Estadio Monterrey" },
            { team1: teams.nl, team2: teams.euB, date: "Sáb 20/06", time: "14:00", stadium: "Houston Stadium" },
            { team1: teams.jp, team2: teams.tn, date: "Sáb 20/06", time: "01:00", stadium: "Estadio Monterrey" },
            { team1: teams.tn, team2: teams.nl, date: "Jue 25/06", time: "20:00", stadium: "Dallas Stadium" },
            { team1: teams.jp, team2: teams.euB, date: "Jue 25/06", time: "20:00", stadium: "Kansas City Stadium" },
        ]
    },
    {
        name: "GRUPO G",
        color: groupColors[6],
        teams: [teams.be, teams.eg, teams.ir, teams.nz],
        matches: [
            { team1: teams.be, team2: teams.eg, date: "Lun 15/06", time: "---", stadium: "Los Angeles Stadium" },
            { team1: teams.ir, team2: teams.nz, date: "Lun 15/06", time: "22:00", stadium: "Seattle Stadium" },
            { team1: teams.be, team2: teams.ir, date: "Dom 21/06", time: "16:00", stadium: "Los Angeles Stadium" },
            { team1: teams.eg, team2: teams.nz, date: "Dom 21/06", time: "22:00", stadium: "BC Place Vancouver" },
            { team1: teams.nz, team2: teams.be, date: "Vie 26/06", time: "00:00", stadium: "Seattle Stadium" },
            { team1: teams.eg, team2: teams.ir, date: "Vie 26/06", time: "00:00", stadium: "BC Place Vancouver" },
        ]
    },
    {
        name: "GRUPO H",
        color: groupColors[7],
        teams: [teams.es, teams.cv, teams.sa, teams.uy],
        matches: [
            { team1: teams.es, team2: teams.cv, date: "Lun 15/06", time: "13:00", stadium: "Miami Stadium" },
            { team1: teams.sa, team2: teams.uy, date: "Lun 15/06", time: "19:00", stadium: "Atlanta Stadium" },
            { team1: teams.es, team2: teams.sa, date: "Dom 21/06", time: "13:00", stadium: "Miami Stadium" },
            { team1: teams.cv, team2: teams.uy, date: "Dom 21/06", time: "19:00", stadium: "Atlanta Stadium" },
            { team1: teams.uy, team2: teams.es, date: "Vie 26/06", time: "21:00", stadium: "Houston Stadium" },
            { team1: teams.cv, team2: teams.sa, date: "Vie 26/06", time: "21:00", stadium: "Estadio Guadalajara" },
        ]
    },
    {
        name: "GRUPO I",
        color: groupColors[8],
        teams: [teams.fr, teams.sn, teams.rep2, teams.no],
        matches: [
            { team1: teams.fr, team2: teams.sn, date: "Mar 16/06", time: "16:00", stadium: "NY / NJ Stadium" },
            { team1: teams.rep2, team2: teams.no, date: "Mar 16/06", time: "19:00", stadium: "Boston Stadium" },
            { team1: teams.fr, team2: teams.rep2, date: "Lun 22/06", time: "18:00", stadium: "NY / NJ Stadium" },
            { team1: teams.no, team2: teams.sn, date: "Lun 22/06", time: "21:00", stadium: "Philadelphia Stadium" },
            { team1: teams.no, team2: teams.fr, date: "Vie 26/06", time: "16:00", stadium: "Boston Stadium" },
            { team1: teams.sn, team2: teams.rep2, date: "Vie 26/06", time: "16:00", stadium: "Toronto Stadium" },
        ]
    },
    {
        name: "GRUPO J",
        color: groupColors[9],
        teams: [teams.ar, teams.dz, teams.at, teams.jo],
        matches: [
            { team1: teams.ar, team2: teams.dz, date: "Mar 16/06", time: "22:00", stadium: "Kansas City Stadium" },
            { team1: teams.at, team2: teams.jo, date: "Mar 16/06", time: "01:00", stadium: "SF Bay Area Stadium" },
            { team1: teams.ar, team2: teams.at, date: "Lun 22/06", time: "14:00", stadium: "Dallas Stadium" },
            { team1: teams.jo, team2: teams.dz, date: "Lun 22/06", time: "00:00", stadium: "SF Bay Area Stadium" },
            { team1: teams.jo, team2: teams.ar, date: "Sáb 27/06", time: "23:00", stadium: "Kansas City Stadium" },
            { team1: teams.dz, team2: teams.at, date: "Sáb 27/06", time: "23:00", stadium: "Dallas Stadium" },
        ]
    },
    {
        name: "GRUPO K",
        color: groupColors[10],
        teams: [teams.pt, teams.rep1, teams.uz, teams.co],
        matches: [
            { team1: teams.pt, team2: teams.rep1, date: "Mié 17/06", time: "14:00", stadium: "Houston Stadium" },
            { team1: teams.uz, team2: teams.co, date: "Mié 17/06", time: "23:00", stadium: "Estadio Ciudad de México" },
            { team1: teams.pt, team2: teams.uz, date: "Mar 23/06", time: "14:00", stadium: "Houston Stadium" },
            { team1: teams.rep1, team2: teams.co, date: "Mar 23/06", time: "23:00", stadium: "Estadio Guadalajara" },
            { team1: teams.co, team2: teams.pt, date: "Sáb 27/06", time: "20:30", stadium: "Miami Stadium" },
            { team1: teams.rep1, team2: teams.uz, date: "Sáb 27/06", time: "20:30", stadium: "Atlanta Stadium" },
        ]
    },
    {
        name: "GRUPO L",
        color: groupColors[11],
        teams: [teams.eng, teams.hr, teams.gh, teams.pa],
        matches: [
            { team1: teams.eng, team2: teams.hr, date: "Mié 17/06", time: "17:00", stadium: "Toronto Stadium" },
            { team1: teams.gh, team2: teams.pa, date: "Mié 17/06", time: "20:00", stadium: "Dallas Stadium" },
            { team1: teams.eng, team2: teams.gh, date: "Mar 23/06", time: "17:00", stadium: "Boston Stadium" },
            { team1: teams.hr, team2: teams.pa, date: "Mar 23/06", time: "20:00", stadium: "Toronto Stadium" },
            { team1: teams.pa, team2: teams.eng, date: "Sáb 27/06", time: "18:00", stadium: "NY / NJ Stadium" },
            { team1: teams.hr, team2: teams.gh, date: "Sáb 27/06", time: "18:00", stadium: "Philadelphia Stadium" },
        ]
    }
];

// --- COMPONENTES ---
function MatchItem({ match }: { match: Match }) {
  return (
    <div className="flex flex-col py-3 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-md group cursor-default">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3 w-[45%]">
            <img src={getFlagUrl(match.team1.code)} alt={match.team1.name} className="w-6 h-4 object-cover rounded shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="text-base font-bold truncate text-zinc-200 group-hover:text-white">{match.team1.name}</span>
        </div>
        
        {/* CAJAS DE GOLES */}
        <div className="flex gap-1">
            <div className="w-7 h-6 bg-zinc-800 border border-white/10 rounded flex items-center justify-center text-zinc-400 text-xs font-mono shadow-inner">
                -
            </div>
            <div className="w-7 h-6 bg-zinc-800 border border-white/10 rounded flex items-center justify-center text-zinc-400 text-xs font-mono shadow-inner">
                -
            </div>
        </div>

        <div className="flex items-center gap-3 w-[45%] justify-end">
            <span className="text-base font-bold truncate text-right text-zinc-200 group-hover:text-white">{match.team2.name}</span>
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
                <span className="truncate max-w-[120px]">{match.stadium}</span>
             </div>
         )}
      </div>
    </div>
  );
}

// ⚠️ COMPONENTE ACTUALIZADO PARA QUITAR ESPACIOS Y ADAPTAR ALTURA
function GroupCard({ group }: { group: Group }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="group w-full" style={{ perspective: '1000px' }}>
            {/* Contenedor relativo que se adapta a la altura del contenido (h-fit) */}
            <div 
                className={`relative w-full h-fit transition-transform duration-700`}
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* --- FRENTE (FIXTURE) --- */}
                {/* Usamos relative para que ESTA carta defina la altura del contenedor padre */}
                <Card 
                    className="relative w-full border-0 bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xl ring-1 ring-white/10 hover:ring-primary/50 transition-all cursor-pointer flex flex-col"
                    style={{ backfaceVisibility: 'hidden' }}
                    onClick={() => setIsFlipped(true)}
                >
                    <div className={`h-1.5 w-full bg-gradient-to-r ${group.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0`}></div>
                    
                    <CardHeader className="py-4 px-5 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 shrink-0">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-headline tracking-wide text-white flex items-center gap-2 drop-shadow-md">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${group.color}`}></div>
                                {group.name}
                            </CardTitle>
                            
                            <div className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
                                <List className="w-4 h-4" />
                                <span className="uppercase tracking-widest text-[10px]">Ver Tabla</span>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-2 flex flex-col gap-2">
                        {group.matches.map((match, index) => (
                            <MatchItem key={index} match={match} />
                        ))}
                    </CardContent>
                </Card>

                {/* --- DORSO (TABLA DE POSICIONES) --- */}
                {/* Usamos absolute inset-0 para que ocupe exactamente el mismo espacio que el frente */}
                <Card 
                    className="absolute inset-0 w-full h-full border-0 bg-zinc-950 backdrop-blur-xl overflow-hidden shadow-xl ring-1 ring-white/10 transition-all cursor-pointer flex flex-col"
                    style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: 'rotateY(180deg)' 
                    }}
                    onClick={() => setIsFlipped(false)}
                >
                    <div className={`h-1.5 w-full bg-gradient-to-r ${group.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0`}></div>
                    
                    <CardHeader className="py-4 px-5 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 shrink-0">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-headline tracking-wide text-white flex items-center gap-2 drop-shadow-md">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${group.color}`}></div>
                                POSICIONES
                            </CardTitle>
                             <div className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
                                <ArrowLeftRight className="w-4 h-4" />
                                <span className="uppercase tracking-widest text-[10px]">Volver</span>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 flex-grow flex flex-col items-center justify-start h-full">
                        <div className="w-full">
                            <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-zinc-500 mb-2 px-2">
                                <div className="col-span-1 text-center">#</div>
                                <div className="col-span-5">Equipo</div>
                                <div className="col-span-2 text-center">PTS</div>
                                <div className="col-span-2 text-center">PJ</div>
                                <div className="col-span-2 text-center">DIF</div>
                            </div>
                            
                            {group.teams.map((team, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center py-4 border-b border-white/5 hover:bg-white/5 rounded px-2 transition-colors">
                                    <div className="col-span-1 text-center font-bold text-zinc-400">{index + 1}</div>
                                    <div className="col-span-5 flex items-center gap-2">
                                        <img src={getFlagUrl(team.code)} alt={team.name} className="w-6 h-4 rounded shadow-sm" />
                                        <span className="text-base font-bold text-white truncate">{team.name}</span>
                                    </div>
                                    <div className="col-span-2 text-center font-black text-white text-lg">0</div>
                                    <div className="col-span-2 text-center text-zinc-400">0</div>
                                    <div className="col-span-2 text-center text-zinc-400">0</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- COMPONENTES BRACKET ---
function BracketMatch({ id, round }: { id: number, round: string }) {
    return (
        <div className="w-40 bg-zinc-900/90 border border-white/10 rounded-lg overflow-hidden shadow-lg hover:border-primary/50 transition-all relative z-10">
            <div className="bg-white/5 px-2 py-1 flex justify-between items-center border-b border-white/5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">{round} #{id}</span>
            </div>
            <div className="p-2 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-3.5 bg-zinc-800 rounded border border-zinc-700"></div>
                        <span className="text-[10px] font-semibold text-zinc-300">TBD</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">-</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-3.5 bg-zinc-800 rounded border border-zinc-700"></div>
                        <span className="text-[10px] font-semibold text-zinc-300">TBD</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">-</span>
                </div>
            </div>

            <div className="bg-black/30 px-2 py-1 flex justify-between items-center border-t border-white/5">
                <div className="flex items-center gap-1 text-[8px] text-zinc-400">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>Sede TBD</span>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-zinc-400">
                    <Clock className="w-2.5 h-2.5" />
                    <span>00:00</span>
                </div>
            </div>
        </div>
    )
}

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

function BracketConnector({ count, side = 'left' }: { count: number, side?: 'left' | 'right' }) {
    const connectorCount = count / 2;
    return (
        <div className="flex flex-col justify-around h-full w-8">
            {Array.from({ length: connectorCount }).map((_, i) => (
                <div key={i} className={`h-[50%] border-white/20 w-full relative ${side === 'left' ? 'border-r rounded-r-lg' : 'border-l rounded-l-lg'}`}>
                    <div className={`absolute top-1/2 w-4 h-px bg-white/20 ${side === 'left' ? 'right-[-16px]' : 'left-[-16px]'}`}></div>
                </div>
            ))}
        </div>
    );
}

function KnockoutStage2026() {
    const slider = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: MouseEvent) => {
        if (!slider.current) return;
        setIsDown(true);
        slider.current.classList.add('cursor-grabbing');
        slider.current.classList.remove('cursor-grab');
        setStartX(e.pageX - slider.current.offsetLeft);
        setScrollLeft(slider.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        if (!slider.current) return;
        setIsDown(false);
        slider.current.classList.remove('cursor-grabbing');
        slider.current.classList.add('cursor-grab');
    };

    const handleMouseUp = () => {
        if (!slider.current) return;
        setIsDown(false);
        slider.current.classList.remove('cursor-grabbing');
        slider.current.classList.add('cursor-grab');
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDown || !slider.current) return;
        e.preventDefault();
        const x = e.pageX - slider.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.current.scrollLeft = scrollLeft - walk;
    };

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
                <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest animate-pulse">
                    ↔ Arrastra para navegar el cuadro
                </p>
            </div>

            <div 
                ref={slider}
                className="overflow-x-auto pb-12 custom-scrollbar cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <div className="flex justify-center min-w-[1800px] h-[950px] gap-0 px-10">
                    <BracketColumn count={8} roundName="R32" title="32avos" />
                    <BracketConnector count={8} side="left" />
                    <BracketColumn count={4} roundName="R16" title="Octavos" />
                    <BracketConnector count={4} side="left" />
                    <BracketColumn count={2} roundName="CF" title="Cuartos" />
                    <BracketConnector count={2} side="left" />
                    <BracketColumn count={1} roundName="SF" title="Semis" />
                    
                    <div className="flex flex-col justify-center items-center w-80 px-4 relative gap-24">
                        <div className="absolute top-1/2 left-0 w-8 h-px bg-white/20 -translate-y-full mb-12"></div>
                        <div className="absolute top-1/2 right-0 w-8 h-px bg-white/20 -translate-y-full mb-12"></div>

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
                                        Dom 19/07 • NY / NJ Stadium
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="relative z-10 opacity-90 hover:opacity-100 transition-opacity">
                            <Card className="border-orange-700/50 bg-black/60 w-56 shadow-[0_0_20px_rgba(194,65,12,0.15)]">
                                <CardHeader className="py-2 bg-orange-900/20 border-b border-orange-700/30 text-center">
                                    <CardTitle className="text-xs text-orange-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Medal className="w-3 h-3 text-orange-500" />
                                        3er Puesto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 flex flex-col gap-2 items-center">
                                    <div className="flex justify-between w-full text-xs font-semibold text-zinc-300">
                                        <span>TBD</span>
                                        <span className="text-zinc-600">vs</span>
                                        <span>TBD</span>
                                    </div>
                                    <div className="bg-orange-900/20 text-orange-400 text-[9px] px-2 py-1 rounded border border-orange-700/30 w-full text-center">
                                        Sáb 18/07 • Miami Stadium
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>

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

export default function MundialPage() {
  return (
    <div className="container mx-auto py-10">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {officialGroups.map((group) => (
            <GroupCard key={group.name} group={group} />
        ))}
      </div>
      
      <KnockoutStage2026 />
      
    </div>
  );
}