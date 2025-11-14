// src/components/dashboard/FixtureTab.tsx
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type GameDay } from '@/app/(app)/dashboard/types';

// Definimos el tipo para los datos del fixture que esperamos de page.tsx
type Match = {
  match_day_number: number;
  home_score: number | null;
  away_score: number | null;
  home_user: { username: string | null };
  away_user: { username: string | null };
};

interface FixtureTabProps {
  leagueFixture: Match[];
  gameDay: GameDay | null; // Para saber cuál es la fecha actual
}

export function FixtureTab({ leagueFixture, gameDay }: FixtureTabProps) {
  // Calculamos el número total de fechas basado en los datos
  const totalMatchDays = useMemo(() => {
    if (leagueFixture.length === 0) return 1;
    return Math.max(...leagueFixture.map(m => m.match_day_number));
  }, [leagueFixture]);

  // El estado empieza en la fecha activa actual
  const [visibleMatchDay, setVisibleMatchDay] = useState(gameDay?.match_day_number || 1);

  const handlePrevDay = () => {
    setVisibleMatchDay(current => Math.max(1, current - 1));
  };

  const handleNextDay = () => {
    setVisibleMatchDay(current => Math.min(totalMatchDays, current + 1));
  };

  // Filtramos solo los partidos de la fecha seleccionada
  const matchesForDay = leagueFixture.filter(
    (match) => match.match_day_number === visibleMatchDay
  );

  return (
    <Card>
      <CardContent className="pt-6">
        {/* --- 1. Navegación de Fecha --- */}
        <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevDay} 
            disabled={visibleMatchDay <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-xl font-headline font-bold">
            FECHA {visibleMatchDay}
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextDay}
            disabled={visibleMatchDay >= totalMatchDays}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* --- 2. Lista de Partidos --- */}
        <div className="space-y-2">
          {matchesForDay.length > 0 ? (
            matchesForDay.map((match, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border rounded-md"
              >
                {/* Equipo Local */}
                <span className="text-right font-semibold w-[40%] truncate">
                  {match.home_user?.username || 'Equipo 1'}
                </span>
                
                {/* Resultado */}
                <div className="flex-shrink-0 w-[20%] text-center">
                  <span className="text-lg font-bold px-3 py-1 bg-muted rounded-md">
                    {/* Mostramos - si el score es null */}
                    {match.home_score ?? '-'}
                    <span className="mx-2 text-muted-foreground">:</span>
                    {match.away_score ?? '-'}
                  </span>
                </div>

                {/* Equipo Visitante */}
                <span className="text-left font-semibold w-[40%] truncate">
                  {match.away_user?.username || 'Equipo 2'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No hay partidos programados para esta fecha.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}