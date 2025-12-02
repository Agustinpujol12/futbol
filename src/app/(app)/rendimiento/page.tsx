// src/app/(app)/rendimiento/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
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

// 1. IMPORTAMOS LOS COMPONENTES DE PAGINACIÓN
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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

  // 2. ESTADOS PARA LA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50; // Aquí defines cuántos ver por página (50 es ideal)

  useEffect(() => {
    const fetchPlayers = async () => {
      const supabase = createClient();
      const GAME_DAY_ID = 'c77cd2ef-2c05-4e52-9c62-69496a39903b';

      const { data, error } = await supabase
        .from('players')
        .select('*, teams(name, logo_url), player_scores(score)')
        .eq('player_scores.game_day_id', GAME_DAY_ID);
        // Quitamos el order de supabase aquí para hacerlo en JS, que es más preciso para estructuras anidadas

      if (error) {
        console.error("Error fetching player performance:", error);
        setError("No se pudieron cargar los datos de rendimiento.");
      } else {
        // --- AQUÍ ESTÁ LA MAGIA DEL ORDENAMIENTO ---
        // Convertimos data a tipo Player[] para manipularlo
        const playersData = data as Player[];

        // Ordenamos en el cliente: Mayor puntaje primero (Descendente)
        const sortedPlayers = playersData.sort((a, b) => {
          // Obtenemos el puntaje o 0 si no existe
          const scoreA = a.player_scores?.[0]?.score ?? 0;
          const scoreB = b.player_scores?.[0]?.score ?? 0;
          
          // Restamos B - A para orden descendente (Mayor a menor)
          return scoreB - scoreA; 
        });

        setPlayers(sortedPlayers);
      }
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  // 3. LÓGICA PARA CALCULAR QUÉ JUGADORES MOSTRAR
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPlayers = players.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(players.length / ITEMS_PER_PAGE);

  // Función para cambiar de página
  const handlePageChange = (pageNumber: number) => {
     // Evitar ir a páginas que no existen
    if(pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    // Opcional: Scrollear arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle className="font-headline text-3xl">
                    Rendimiento de Jugadores (Fecha 1)
                </CardTitle>
                <CardDescription>
                    Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, players.length)} de {players.length} jugadores.
                </CardDescription>
            </div>
          </div>
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
              {/* 4. USAMOS currentPlayers EN LUGAR DE players */}
              {currentPlayers.map((player) => {
                const score = player.player_scores?.[0]?.score ?? 0;
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

      {/* 5. COMPONENTE VISUAL DE PAGINACIÓN */}
      {totalPages > 1 && (
        <Pagination>
            <PaginationContent>
            
            {/* Botón Anterior */}
            <PaginationItem>
                <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} 
                />
            </PaginationItem>

            {/* Lógica simple de números: Muestra página actual y vecinas */}
            {/* Si quieres algo más complejo con '...' avísame, esta es la versión limpia */}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                    // Muestra primera, última, actual y vecinas
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, array) => {
                    // Lógica para poner '...' si hay salto
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                        <div key={page} className="flex items-center">
                            {showEllipsis && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink 
                                    href="#" 
                                    isActive={page === currentPage}
                                    onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        </div>
                    );
                })}

            {/* Botón Siguiente */}
            <PaginationItem>
                <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} 
                />
            </PaginationItem>
            
            </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}