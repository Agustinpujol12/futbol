// src/app/(app)/rendimiento/page.tsx
// --- ARCHIVO COMPLETO DE LA PÁGINA DE RENDIMIENTO ---

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
// Importamos el tipo 'Player' desde la carpeta de dashboard
import { type Player } from '../dashboard/types'; 
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Función helper simple para obtener iniciales
const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function RendimientoPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const supabase = createClient();
      // Usamos el mismo ID de Game Day que en tu dashboard
      const GAME_DAY_ID = 'c77cd2ef-2c05-4e52-9c62-69496a39903b';

      const { data, error } = await supabase
        .from('players')
        .select('*, teams(name, logo_url), player_scores(score)')
        .eq('player_scores.game_day_id', GAME_DAY_ID)
        // Ordenamos por la columna 'score' de la tabla 'player_scores'
        .order('score', { referencedTable: 'player_scores', ascending: false });

      if (error) {
        console.error("Error fetching player performance:", error);
        setError("No se pudieron cargar los datos de rendimiento.");
      } else {
        // 'data' ya vendrá ordenado por la consulta
        setPlayers(data as Player[]);
      }
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">Cargando rendimiento de jugadores...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Rendimiento de Jugadores (Fecha 1)
          </CardTitle>
          <CardDescription>
            El puntaje de todos los jugadores disponibles para la fecha actual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Jugador</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Pos.</TableHead>
                <TableHead className="text-right">Puntaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => {
                // Obtenemos el puntaje de forma segura
                const score = player.player_scores?.[0]?.score ?? 0;
                
                // Damos un color al puntaje
                const scoreColor = score > 8 ? 'text-green-500' : score > 6 ? 'text-yellow-500' : 'text-red-500';

                return (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={player.photo_url || undefined} alt={player.name} />
                          <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{player.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={player.teams?.logo_url || '/assets/team-placeholder.png'} 
                          alt={player.teams?.name || 'Equipo'}
                          className="w-6 h-6 object-contain" 
                        />
                        <span>{player.teams?.name || 'Sin Equipo'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{player.position}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-bold text-lg ${scoreColor}`}>
                      {score.toFixed(1)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}