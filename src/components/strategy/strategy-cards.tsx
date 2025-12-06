// src/components/strategy/strategy-cards.tsx
// --- ARCHIVO CON COLORES DINÁMICOS (ORO, VERDE, ROJO) ---

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
import { Loader2, Zap, Star, TrendingDown } from "lucide-react"; // Añadido TrendingDown
import { motion } from "framer-motion";
import { type GameDay, type Profile } from "@/app/(app)/dashboard/types";

// Tipos
interface StrategyCardManagerProps {
  profile?: Profile | null;
  matchup?: { id: string } | null;
  gameDay?: GameDay | null;
  leagueId?: string | null;
  size?: 'small' | 'large';
  mode?: 'game' | 'catalog';
}

type StrategyCard = {
  id: string;
  name: string;
  description: string;
  effect_type: string;
  effect_value: number;
};

// --- HELPER: Obtener estilos según el valor de la carta ---
const getCardStyles = (value: number) => {
  if (value >= 3) { // SUPERESTRELLA (x3) - DORADO
    return {
      border: "border-yellow-400",
      bg: "bg-gradient-to-b from-yellow-500/40 via-yellow-500/20 to-yellow-500/10",
      textTitle: "text-yellow-400",
      icon: <Star className="w-full h-full text-amber-500" />,
      shadow: "shadow-[0_0_20px_rgba(255,215,0,0.25)]",
      starColor: "text-yellow-400"
    };
  } else if (value >= 2) { // CAPITÁN (x2) - VERDE
    return {
      border: "border-emerald-500",
      bg: "bg-gradient-to-b from-emerald-500/40 via-emerald-500/20 to-emerald-500/10",
      textTitle: "text-emerald-400",
      icon: <Zap className="w-full h-full text-emerald-400" />,
      shadow: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
      starColor: "text-emerald-500"
    };
  } else { // NEGATIVA (x0.5) - ROJO
    return {
      border: "border-red-600",
      bg: "bg-gradient-to-b from-red-600/40 via-red-600/20 to-red-600/10",
      textTitle: "text-red-500",
      icon: <TrendingDown className="w-full h-full text-red-500" />,
      shadow: "shadow-[0_0_20px_rgba(220,38,38,0.25)]",
      starColor: "text-red-500"
    };
  }
};

/* -------------------------------------------------------------------------- */
/* CARD FRONT (DINÁMICA)                                                      */
/* -------------------------------------------------------------------------- */
function CardFront({ card, size = 'large' }: { card: StrategyCard, size?: 'small' | 'large' }) {
  const styles = getCardStyles(card.effect_value);

  // Estilos base según tamaño
  const cardClasses = size === 'large' 
    ? "w-[300px] h-[420px] px-6 py-10" 
    : "w-full h-full p-3";

  const iconContainerSize = size === 'large' ? "w-16 h-16" : "w-8 h-8";
  const titleSize = size === 'large' ? "text-2xl" : "text-lg";
  const starSize = size === 'large' ? "text-5xl" : "text-3xl";
  const descSize = size === 'large' ? "text-base" : "text-xs";

  return (
    <Card
      className={`
        ${cardClasses} mx-auto text-center rounded-2xl
        border ${styles.border}
        ${styles.bg}
        ${styles.shadow}
        backdrop-blur-sm flex flex-col justify-between
      `}
    >
      <CardHeader className="p-0 flex flex-col items-center">
        <div className={`${styles.starColor} mb-2 ${starSize}`}>★</div>
        <CardTitle className={`${styles.textTitle} font-extrabold leading-tight ${titleSize}`}>
          {card.name.toUpperCase()}
        </CardTitle>
      </CardHeader>
      
      <div className="flex-grow flex items-center justify-center py-4">
         <div className={iconContainerSize}>
           {styles.icon}
         </div>
      </div>

      <CardContent className="p-0">
        <p className={`text-gray-300 ${descSize}`}>{card.description}</p>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* CARD BACK (GENÉRICA)                                                       */
/* -------------------------------------------------------------------------- */
function CardBack({ onClick, size = 'large' }: { onClick?: () => void, size?: 'small' | 'large' }) {
  
  const cardClasses = size === 'large' 
    ? "rounded-3xl" 
    : "rounded-2xl p-3";

  const iconSize = size === 'large' ? "w-20 h-20" : "w-10 h-10";
  const titleSize = size === 'large' ? "text-2xl mt-6" : "text-sm mt-2";
  
  return (
    <Card
      onClick={onClick}
      className={`
        absolute inset-0 w-full h-full ${cardClasses} cursor-pointer select-none
        shadow-2xl overflow-hidden
        border-[3px] border-yellow-500
        bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#0f0f0f]
        flex flex-col items-center justify-center
      `}
      style={{ backfaceVisibility: "hidden" }}
    >
      <div className="absolute inset-0 bg-yellow-400/10 blur-xl" />
      <div className="relative z-10 border-[3px] border-yellow-500 rounded-full p-4 shadow-inner shadow-black/40 bg-black/40">
        <Star className={`${iconSize} text-yellow-300 opacity-70 drop-shadow`} />
      </div>
      <p className={`relative z-10 font-bold text-yellow-300 drop-shadow uppercase tracking-wide ${titleSize}`}>
        Carta Oculta
      </p>
      <p className="relative z-10 text-gray-300 mt-1 text-xs text-center">
        Haz clic para revelar
      </p>
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-yellow-400/20 to-transparent" />
    </Card>
  );
}


/* -------------------------------------------------------------------------- */
/* COMPONENTE PRINCIPAL                                                       */
/* -------------------------------------------------------------------------- */
export function StrategyCardManager({
  matchup,
  gameDay,
  profile,
  leagueId,
  size = 'large',
  mode = 'game',
}: StrategyCardManagerProps) {
  
  const [drawnCard, setDrawnCard] = useState<StrategyCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCards, setAllCards] = useState<StrategyCard[]>([]);

  const supabase = createClient();

useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      if (mode === 'catalog') {
        const { data, error } = await supabase.from('strategy_cards').select('*');
        if (error) console.error("Error loading cards:", error);
        else setAllCards(data || []);
      
      } else {
        // ⚠️ CORRECCIÓN AQUÍ: Verificamos también que exista profile.id
        if (!matchup || !profile?.id) {
           setIsLoading(false);
           return;
        }

        // ⚠️ CONSULTA CORREGIDA:
        const { data, error } = await supabase
          .from("user_match_cards")
          .select("*, strategy_cards(*)")
          .eq("matchup_id", matchup.id)
          .eq("user_id", profile.id) // <--- ESTO ASEGURA QUE SOLO BUSQUE TU CARTA
          .maybeSingle(); // <--- Usamos maybeSingle para que no de error si no hay carta

        if (error) {
            console.error("Error buscando mi carta:", error);
        }

        if (data && data.strategy_cards) {
          setDrawnCard(data.strategy_cards as StrategyCard);
          setIsFlipped(true);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [mode, matchup, supabase, profile]); // <--- Agregamos 'profile' a las dependencias

  const handleDrawCard = async () => {
    if (mode === 'catalog' || isFlipped || !leagueId || !gameDay) return;
    
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

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center ${size === 'large' ? 'h-64' : 'h-48'}`}>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // MODO CATÁLOGO
  if (mode === 'catalog') {
    return (
      <div className="w-full">
        <h2 className="text-3xl font-headline font-bold text-center mb-2">Cartas de Estrategia</h2>
        <p className="text-center text-muted-foreground mb-8">
          Estas son las cartas disponibles.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {allCards.map((card) => (
            <div key={card.id} className="relative transition-transform hover:scale-105 duration-300">
               <CardFront card={card} size="large" />
            </div>
          ))}
          {allCards.length === 0 && <p>No hay cartas disponibles.</p>}
        </div>
      </div>
    );
  }

  // MODO JUEGO
  if (!matchup) {
    return (
      <div className="text-center text-muted-foreground text-sm p-4">
        {size === 'large' ? 'Debes tener un partido activo.' : 'Sin partido.'}
      </div>
    );
  }

  const containerSize = size === 'large' ? "w-80 h-[460px]" : "w-48 h-64";

  return (
    <div className="flex flex-col items-center">
      {size === 'large' && (
        <>
          <h2 className="text-3xl font-bold text-center mb-2">Tu Carta de Estrategia</h2>
          <p className="text-gray-400 mb-8">
            {isFlipped ? "Esta es tu carta para esta fecha" : "Haz clic para descubrir tu carta"}
          </p>
        </>
      )}

      <div style={{ perspective: "1000px" }}>
        <motion.div
          className={`relative ${containerSize}`}
          transition={{ duration: 0.7 }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)", zIndex: isFlipped ? 0 : 2 }}>
            <CardBack onClick={handleDrawCard} size={size} />
          </div>
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 2 : 0 }}>
            {drawnCard && <CardFront card={drawnCard} size={size} />}
          </div>
        </motion.div>
      </div>
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      
      {size === 'small' && (
        <p className="text-muted-foreground text-xs text-center mt-3">
          {isFlipped ? "Tu carta para esta fecha." : "Haz clic para descubrir tu carta."}
        </p>
      )}
    </div>
  );
}