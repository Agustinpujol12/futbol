// src/components/strategy/strategy-cards.tsx
// --- ARCHIVO ACTUALIZADO CON PROP 'size' ---

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { type GameDay, type Profile } from "@/app/(app)/dashboard/types";

// Tipos
interface StrategyCardManagerProps {
  profile?: Profile | null;
  matchup: { id: string } | null;
  gameDay: GameDay | null;
  leagueId: string | null;
  size?: 'small' | 'large'; // <--- NUEVA PROP
}

type StrategyCard = {
  id: string;
  name: string;
  description: string;
  effect_type: string;
  effect_value: number;
};

/* -------------------------------------------------------------------------- */
/* CARD FRONT                               */
/* -------------------------------------------------------------------------- */
function CardFront({ card, size }: { card: StrategyCard, size: 'small' | 'large' }) {
  const isCaptain = card.name.includes("Capitán");

  // Versión Grande (tu diseño original)
  if (size === 'large') {
    return (
      <Card
        className="
        w-[320px] mx-auto text-center px-6 py-10 rounded-3xl
        border border-yellow-400
        bg-gradient-to-b from-yellow-500/40 via-yellow-500/20 to-yellow-500/10
        shadow-[0_0_20px_rgba(255,215,0,0.25)]
        backdrop-blur-sm"
      >
        <CardHeader>
          <div className="text-yellow-400 text-5xl mb-4">★</div>
          <CardTitle className="text-yellow-400 text-2xl font-extrabold leading-tight">
            {card.name.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mt-6">{card.description}</p>
          <p className="text-gray-400 text-sm mt-10">
            Aplica esta carta a un jugador de tu equipo.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Versión Pequeña (para MatchOfTheDay)
  return (
    <Card
      className="
      w-full h-full text-center p-3 rounded-2xl
      border border-yellow-400
      bg-gradient-to-b from-yellow-500/30 via-yellow-500/10 to-yellow-500/5
      shadow-[0_0_10px_rgba(255,215,0,0.2)]
      backdrop-blur-sm flex flex-col justify-center"
    >
      <CardHeader className="p-1">
        <div className="text-yellow-400 text-3xl mx-auto">★</div>
        <CardTitle className="text-yellow-400 text-lg font-extrabold leading-tight">
          {card.name.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <p className="text-gray-300 text-xs mt-2">
          {card.description}
        </p>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* CARD BACK                               */
/* -------------------------------------------------------------------------- */
function CardBack({ onClick, size }: { onClick: () => void, size: 'small' | 'large' }) {
  
  // Versión Grande (tu diseño original)
  if (size === 'large') {
    return (
      <Card
        onClick={onClick}
        className="
        absolute inset-0 w-full h-full rounded-3xl p-0 cursor-pointer select-none
        shadow-2xl overflow-hidden
        border-[3px] border-yellow-500
        bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#0f0f0f]
        flex flex-col items-center justify-center"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-0 bg-yellow-400/10 blur-xl" />
        <div className="relative z-10 border-[3px] border-yellow-500 rounded-full p-6 shadow-inner shadow-black/40 bg-black/40">
          <Star className="w-20 h-20 text-yellow-300 opacity-70 drop-shadow" />
        </div>
        <p className="relative z-10 mt-6 font-bold text-2xl text-yellow-300 drop-shadow uppercase tracking-wide">
          Carta Oculta
        </p>
        <p className="relative z-10 text-gray-300 mt-1 text-sm">
          Haz clic para revelar tu estrategia
        </p>
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-yellow-400/20 to-transparent" />
      </Card>
    );
  }

  // Versión Pequeña (para MatchOfTheDay)
  return (
    <Card
      onClick={onClick}
      className="
      absolute inset-0 w-full h-full rounded-2xl p-3 cursor-pointer select-none
      shadow-lg overflow-hidden
      border-[2px] border-yellow-500/50
      bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#0f0f0f]
      flex flex-col items-center justify-center
      hover:border-yellow-400 transition-colors"
      style={{ backfaceVisibility: "hidden" }}
    >
      <div className="absolute inset-0 bg-yellow-400/5 blur-lg" />
      <Star className="w-10 h-10 text-yellow-300 opacity-50 drop-shadow" />
      <p className="relative z-10 mt-2 font-bold text-sm text-yellow-300 drop-shadow uppercase tracking-wide">
        Carta Oculta
      </p>
      <p className="relative z-10 text-gray-400 text-xs mt-1 text-center">
        Clic para revelar
      </p>
    </Card>
  );
}


/* -------------------------------------------------------------------------- */
/* COMPONENTE PRINCIPAL                                  */
/* -------------------------------------------------------------------------- */
export function StrategyCardManager({
  matchup,
  gameDay,
  leagueId,
  size = 'large', // <-- Se añade la prop con 'large' como default
}: StrategyCardManagerProps) {
  const [drawnCard, setDrawnCard] = useState<StrategyCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Cargar si ya existe una carta
  useEffect(() => {
    if (!matchup) {
      setIsLoading(false);
      return;
    }
    const checkExistingCard = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("user_match_cards")
        .select("*, strategy_cards(*)")
        .eq("matchup_id", matchup.id)
        .single();

      if (data && data.strategy_cards) {
        setDrawnCard(data.strategy_cards as StrategyCard);
        setIsFlipped(true);
      }
      setIsLoading(false);
    };
    checkExistingCard();
  }, [matchup, supabase]);

  // Robar carta
  const handleDrawCard = async () => {
    if (isFlipped || !leagueId || !gameDay) return;
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase.rpc("fn_draw_strategy_card", {
      p_league_id: leagueId,
      p_game_day_id: gameDay.id,
    });

    if (error) {
      setError("Error al robar la carta.");
      setIsLoading(false);
      return;
    }

    setDrawnCard(data as StrategyCard);
    setIsFlipped(true);
    setIsLoading(false);
  };

  if (isLoading && size === 'large') // El 'loader' grande solo para la pestaña principal
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  
  if (isLoading && size === 'small') // 'loader' pequeño para la tarjeta
    return (
       <div className="flex justify-center items-center h-48">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );


  if (!matchup)
    return (
      <div className="text-center text-muted-foreground text-sm p-4">
        {size === 'large' ? 'Debes tener un partido activo para robar una carta.' : 'Sin partido.'}
      </div>
    );

  // --- RENDERIZADO ---
  
  // Renderizado GRANDE (para la pestaña "Estrategia")
  if (size === 'large') {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center leading-tight break-words">
          Tu Carta de Estrategia
        </h2>
        <p className="text-gray-400 mb-8">
          {isFlipped
            ? "Esta es tu carta para esta fecha"
            : "Haz clic para descubrir tu carta"}
        </p>

        <div style={{ perspective: "1000px" }}>
          <motion.div
            className="relative w-80 h-[460px]" // Tamaño Grande
            transition={{ duration: 0.7 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* BACK */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
                zIndex: isFlipped ? 0 : 2,
              }}
            >
              <CardBack onClick={handleDrawCard} size="large" />
            </div>
            {/* FRONT */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                zIndex: isFlipped ? 2 : 0,
              }}
            >
              {drawnCard && <CardFront card={drawnCard} size="large" />}
            </div>
          </motion.div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  // Renderizado PEQUEÑO (para "MatchOfTheDay")
  return (
     <div className="flex flex-col items-center">
        <div style={{ perspective: "1000px" }}>
          <motion.div
            className="relative w-48 h-64" // Tamaño Pequeño
            transition={{ duration: 0.7 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* BACK */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
                zIndex: isFlipped ? 0 : 2,
              }}
            >
              <CardBack onClick={handleDrawCard} size="small" />
            </div>
            {/* FRONT */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                zIndex: isFlipped ? 2 : 0,
              }}
            >
              {drawnCard && <CardFront card={drawnCard} size="small" />}
            </div>
          </motion.div>
        </div>
        
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        
        <p className="text-muted-foreground text-xs text-center mt-3">
          {isFlipped
            ? "Tu carta para esta fecha."
            : "Haz clic para descubrir tu carta."}
        </p>
    </div>
  );
}