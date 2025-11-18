// src/components/dashboard/LeagueStandingsTable.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { type Profile } from '@/app/(app)/dashboard/types';

interface LeagueMemberDB {
  user_id: string;
  pts: number; // Puntos de Tabla (3, 1, 0)
  pj: number;
  v: number;
  e: number;
  d: number;
  pf: number;  // Puntos Fantasy Totales
  pc: number;
  df: number;  // Diferencia
  profiles: Profile;
}

interface StandingsProps {
  standings: LeagueMemberDB[];
  currentUserProfile: Profile | null;
  leagueName: string | null;
}

export function LeagueStandingsTable({
  standings,
  currentUserProfile,
  leagueName,
}: StandingsProps) {
  
  // Ordenar: Primero por Puntos (PTS), luego por Diferencia (DIF), luego por Puntos Fantasy (PF)
  const sortedStandings = [...standings].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.df !== a.df) return b.df - a.df;
    return b.pf - a.pf;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline uppercase tracking-wide">
                Tabla de Posiciones
                </CardTitle>
                <CardDescription>
                {leagueName || 'Liga General'}
                </CardDescription>
            </div>
            <div className="text-2xl">🏆</div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px] font-bold text-center">#</TableHead>
              <TableHead className="font-bold w-[30%]">EQUIPO</TableHead>
              
              {/* COLUMNA PRINCIPAL: PUNTOS DE TABLA */}
              <TableHead className="text-center font-extrabold text-primary text-lg">PTS</TableHead>
              
              {/* DATOS ESTADÍSTICOS */}
              <TableHead className="text-center text-xs text-muted-foreground">PJ</TableHead>
              <TableHead className="text-center text-xs text-green-600 font-bold">V</TableHead>
              <TableHead className="text-center text-xs text-yellow-600 font-bold">E</TableHead>
              <TableHead className="text-center text-xs text-red-600 font-bold">D</TableHead>
              
              {/* NUEVA COLUMNA: PUNTOS FANTASY ACUMULADOS */}
              <TableHead className="text-center font-bold text-blue-400" title="Puntos Fantasy Totales">FANTASY</TableHead>
              
              {/* DIFERENCIA */}
              <TableHead className="text-center font-bold" title="Diferencia de Puntos">DIF</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStandings.map((team, index) => {
              const isMe = team.profiles?.username === currentUserProfile?.username;

              return (
                <TableRow
                  key={team.user_id}
                  className={isMe ? 'bg-primary/10 border-l-4 border-l-primary' : ''}
                >
                  <TableCell className="font-bold text-center text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  
                  <TableCell className="font-medium">
                    <span className="text-base">{team.profiles?.username || 'Usuario...'}</span>
                  </TableCell>

                  {/* PTS TABLA */}
                  <TableCell className="text-center font-black text-xl">
                    {team.pts || 0}
                  </TableCell>
                  
                  <TableCell className="text-center text-muted-foreground">{team.pj || 0}</TableCell>
                  <TableCell className="text-center">{team.v || 0}</TableCell>
                  <TableCell className="text-center">{team.e || 0}</TableCell>
                  <TableCell className="text-center">{team.d || 0}</TableCell>
                  
                  {/* FANTASY (Con 1 decimal) */}
                  <TableCell className="text-center font-bold text-blue-500">
                    {Number(team.pf || 0).toFixed(1)}
                  </TableCell>

                  {/* DIFERENCIA (Con 1 decimal) */}
                  <TableCell className={`text-center font-semibold ${team.df > 0 ? 'text-green-500' : (team.df < 0 ? 'text-red-500' : '')}`}>
                    {team.df > 0 ? `+${Number(team.df).toFixed(1)}` : Number(team.df || 0).toFixed(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}