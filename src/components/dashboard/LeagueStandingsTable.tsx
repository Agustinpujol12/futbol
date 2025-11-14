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
import { type Profile } from '@/app/(app)/dashboard/types'; // Importamos el tipo Profile

// --- 1. DEFINIMOS LA INTERFAZ DE PROPS ---
// (usamos 'any' para 'team' por ahora, ya que no tenemos las columnas de stats)
interface StandingsProps {
  standings: any[];
  currentUserProfile: Profile | null;
  leagueName: string | null;
}

// --- 2. EL COMPONENTE AHORA RECIBE PROPS ---
export function LeagueStandingsTable({
  standings,
  currentUserProfile,
  leagueName,
}: StandingsProps) {
  
  // Función helper para obtener el username de forma segura
  const getUsername = (team: any) => {
    if (team.profiles && team.profiles.username) {
      return team.profiles.username;
    }
    return 'Usuario...';
  };

  return (
    <Card>
      <CardHeader>
        {/* --- 3. TÍTULO DINÁMICO --- */}
        <CardTitle className="font-headline">
          Tabla de Posiciones - {leagueName || 'Liga'}
        </CardTitle>
        <CardDescription>
          Clasificación de tu liga.
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
            {/* --- 4. MAPEO SOBRE LOS DATOS REALES (PROPS) --- */}
            {standings.map((team, index) => {
              const username = getUsername(team);
              return (
                <TableRow
                  key={team.user_id}
                  className={
                    username === currentUserProfile?.username
                      ? 'bg-primary/10'
                      : ''
                  }
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{username}</TableCell>
                  {/* --- 5. DATOS DE STATS (EN 0 POR AHORA) --- */}
                  <TableCell className="text-right font-bold">{team.pts || 0}</TableCell>
                  <TableCell className="text-right">{team.pj || 0}</TableCell>
                  <TableCell className="text-right">{team.v || 0}</TableCell>
                  <TableCell className="text-right">{team.e || 0}</TableCell>
                  <TableCell className="text-right">{team.p || 0}</TableCell>
                  <TableCell className="text-right">{team.df || 0}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}