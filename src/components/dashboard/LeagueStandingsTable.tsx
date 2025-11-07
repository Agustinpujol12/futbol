// src/components/dashboard/LeagueStandingsTable.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

// --- DATOS DE MAQUETA (MOCKUP) ---
// (Más adelante, estos datos vendrán de la base de datos)
const mockStandings = [
  { id: 1, teamName: 'Agus95_Talleres', pts: 12, pj: 5, v: 4, e: 0, p: 1, df: 150 },
  { id: 2, teamName: 'Pepo_Mix', pts: 10, pj: 5, v: 3, e: 1, p: 1, df: 120 },
  { id: 3, teamName: 'ElRayo', pts: 9, pj: 5, v: 3, e: 0, p: 2, df: 50 },
  { id: 4, teamName: 'Mistica_Copera', pts: 7, pj: 5, v: 2, e: 1, p: 2, df: -10 },
  { id: 5, teamName: 'LosMagios', pts: 1, pj: 5, v: 0, e: 1, p: 4, df: -120 },
  // ... (En el futuro, aquí irán los 34 equipos)
];
// --- FIN DE DATOS DE MAQUETA ---

export function LeagueStandingsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Tabla de Posiciones - Liga "Pozo $5"</CardTitle>
        <CardDescription>
          Clasificación de tu liga de 34 equipos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead className="text-right">PTS</TableHead>
              <TableHead className="text-right">PJ</TableHead>
              <TableHead className="text-right">V</TableHead>
              <TableHead className="text-right">E</TableHead>
              <TableHead className="text-right">D</TableHead>
              <TableHead className="text-right">DF. Puntaje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStandings.map((team, index) => (
              <TableRow key={team.id} className={team.teamName === 'Agus95_Talleres' ? 'bg-primary/10' : ''}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{team.teamName}</TableCell>
                <TableCell className="text-right font-bold">{team.pts}</TableCell>
                <TableCell className="text-right">{team.pj}</TableCell>
                <TableCell className="text-right">{team.v}</TableCell>
                <TableCell className="text-right">{team.e}</TableCell>
                <TableCell className="text-right">{team.p}</TableCell>
                <TableCell className="text-right">{team.df}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}