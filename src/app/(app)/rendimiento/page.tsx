'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Player, type GameDay } from '../dashboard/types';
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, CalendarDays } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Configuración de ordenamiento
type SortConfig = {
  key: 'name' | 'team' | 'position' | 'score';
  direction: 'asc' | 'desc';
};

// Orden lógico de posiciones (no alfabético)
const POSITION_ORDER: Record<string, number> = {
  'Arquero': 1,
  'Defensor': 2,
  'Mediocampista': 3,
  'Delantero': 4
};

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function RendimientoPage() {
  // --- ESTADOS ---
  const [players, setPlayers] = useState<Player[]>([]);
  const [availableGameDays, setAvailableGameDays] = useState<GameDay[]>([]);
  
  // Usamos el NÚMERO de fecha (1, 2, 3...) como valor del selector, no el ID
  const [selectedMatchDayNum, setSelectedMatchDayNum] = useState<string>("1");

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'score', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const supabase = createClient();

  // 1. CARGAR FECHAS DISPONIBLES AL INICIO
  useEffect(() => {
    const fetchGameDays = async () => {
      const { data } = await supabase
        .from('game_days')
        .select('*');
      if (data) setAvailableGameDays(data);
    };
    fetchGameDays();
  }, []);

  // 2. BUSCAR JUGADORES CUANDO CAMBIA EL NÚMERO DE FECHA
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setPlayers([]); // Limpiar tabla mientras carga

      // Buscar si existe un ID real para el número de fecha seleccionado
      const gameDayObj = availableGameDays.find(
        gd => gd.match_day_number === parseInt(selectedMatchDayNum)
      );

      // Si existe la fecha en DB, buscamos los jugadores
      if (gameDayObj) {
        const { data, error } = await supabase
          .from('players')
          .select('*, teams(name, logo_url), player_scores(score)')
          .eq('player_scores.game_day_id', gameDayObj.id);

        if (!error && data) {
          setPlayers(data as Player[]);
        }
      } 
      // Si no existe (ej: Fecha 8 que aún no se jugó), players se queda vacío []

      setLoading(false);
    };

    loadData();
  }, [selectedMatchDayNum, availableGameDays]);

  // 3. FILTRADO Y ORDENAMIENTO
  const processedPlayers = useMemo(() => {
    let filtered = [...players];

    // Filtro
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.teams?.name?.toLowerCase().includes(lowerQuery)
      );
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      switch (sortConfig.key) {
        case 'name':
          valA = a.name; valB = b.name; break;
        case 'team':
          valA = a.teams?.name || ''; valB = b.teams?.name || ''; break;
        case 'position':
          // Usamos el mapa de orden lógico. Si no está, va al final (99)
          valA = POSITION_ORDER[a.position] || 99;
          valB = POSITION_ORDER[b.position] || 99;
          break;
        case 'score':
          valA = a.player_scores?.[0]?.score ?? 0;
          valB = b.player_scores?.[0]?.score ?? 0;
          break;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [players, searchQuery, sortConfig]);

  // Reset de página al filtrar
useEffect(() => { 
    setCurrentPage(1); 
  }, [searchQuery, selectedMatchDayNum, sortConfig]);

  // Paginación
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPlayers = processedPlayers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedPlayers.length / ITEMS_PER_PAGE);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
        <div>
           <h1 className="text-3xl font-bold font-headline">Rendimiento</h1>
           <p className="text-muted-foreground text-sm">Estadísticas por fecha.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
            {/* SELECTOR DE FECHAS (1 al 8) */}
            <Select value={selectedMatchDayNum} onValueChange={setSelectedMatchDayNum}>
                <SelectTrigger className="w-[180px]">
                    <CalendarDays className="w-4 h-4 mr-2 opacity-50"/>
                    <SelectValue placeholder="Selecciona Fecha" />
                </SelectTrigger>
                <SelectContent>
                    {/* Generamos array del 1 al 8 estático */}
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                            Fecha {num}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* BUSCADOR */}
            <div className="relative w-full md:w-[250px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar jugador..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                />
            </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
            <CardDescription>
                {loading 
                  ? "Cargando..." 
                  : processedPlayers.length > 0 
                    ? `Mostrando ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, processedPlayers.length)} de ${processedPlayers.length} jugadores.`
                    : "No hay datos para esta fecha."
                }
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {/* JUGADOR */}
                <TableHead className="w-[300px]">
                  <Button variant="ghost" onClick={() => handleSort('name')} className="flex items-center gap-1 font-bold pl-0 hover:bg-transparent">
                    Jugador <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                
                {/* EQUIPO */}
                <TableHead className="w-[200px]">
                   <Button variant="ghost" onClick={() => handleSort('team')} className="flex items-center gap-1 font-bold pl-0 hover:bg-transparent">
                    Equipo <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                
                {/* POSICIÓN (Con ancho fijo para evitar saltos) */}
                <TableHead className="w-[150px]">
                   <Button variant="ghost" onClick={() => handleSort('position')} className="flex items-center gap-1 font-bold pl-0 hover:bg-transparent">
                    Pos. <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                
                {/* PUNTAJE */}
                <TableHead className="text-right w-[100px]">
                   <Button variant="ghost" onClick={() => handleSort('score')} className="ml-auto flex items-center gap-1 font-bold pr-0 hover:bg-transparent">
                    Pts <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        Cargando datos de la Fecha {selectedMatchDayNum}...
                    </TableCell>
                 </TableRow>
              ) : currentPlayers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                        <p className="text-lg font-semibold">Sin datos</p>
                        <p className="text-sm opacity-60">Aún no hay registros para la Fecha {selectedMatchDayNum}.</p>
                    </TableCell>
                 </TableRow>
              ) : (
                currentPlayers.map((player) => {
                const score = player.player_scores?.[0]?.score ?? 0;
                const scoreColor = score > 8 ? 'text-green-500' : score > 6 ? 'text-yellow-500' : 'text-red-500';

                return (
                  <TableRow key={player.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border bg-muted">
                          <AvatarImage src={player.photo_url || undefined} alt={player.name} className="object-cover" />
                          <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm sm:text-base">{player.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <img 
                          src={player.teams?.logo_url || '/assets/team-placeholder.png'} 
                          alt={player.teams?.name || 'Equipo'}
                          className="w-5 h-5 object-contain" 
                        />
                        <span className="hidden sm:inline text-sm">{player.teams?.name || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-normal w-24 justify-center">
                        {player.position}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-bold text-lg ${scoreColor}`}>
                      {score.toFixed(1)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* PAGINACIÓN */}
      {!loading && totalPages > 1 && (
        <Pagination>
            <PaginationContent>
            <PaginationItem>
                <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} 
                />
            </PaginationItem>
            <span className="text-sm text-muted-foreground px-4">
                Página {currentPage} de {totalPages}
            </span>
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