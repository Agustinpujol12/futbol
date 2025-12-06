// src/app/(app)/dashboard/components/DuelChat.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Send, Lock } from "lucide-react"; // Asegúrate de tener estos íconos

export default function DuelChat() {
  return (
    <div className="flex flex-col w-full gap-3">

      {/* 1. VENTANA DE MENSAJES */}
      {/* Usamos colores 'zinc' y 'muted' para que se mezcle con el dashboard */}
      <div className="h-40 w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 overflow-y-auto flex flex-col gap-3 shadow-inner">
        
        {/* Mensaje Rival (Alineado izquierda) */}
        <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] text-zinc-500 ml-1">Rival</span>
            <div className="bg-zinc-800/80 border border-zinc-700 px-3 py-2 rounded-2xl rounded-tl-none text-xs text-zinc-300 shadow-sm max-w-[85%]">
            ¡Buena suerte en el partido! ⚽
            </div>
        </div>

        {/* Mensaje Mío (Alineado derecha) */}
        <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-zinc-500 mr-1">Tú</span>
            <div className="bg-blue-600/20 border border-blue-500/20 px-3 py-2 rounded-2xl rounded-tr-none text-xs text-blue-100 shadow-sm max-w-[85%]">
            Igualmente, ¡a ganar! 🔥
            </div>
        </div>

        {/* Notificación del Sistema (Centro) */}
        <div className="text-center my-1">
            <span className="text-[10px] bg-zinc-900/80 text-zinc-500 px-2 py-1 rounded-full border border-dashed border-zinc-800">
                El duelo ha comenzado
            </span>
        </div>

      </div>

      {/* 2. ÁREA DE INPUT (Deshabilitada Visualmente) */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-grow">
            <input
                disabled
                type="text"
                placeholder="Chat habilitado en breve..."
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-md py-2 pl-3 pr-10 text-xs text-zinc-400 placeholder:text-zinc-600 cursor-not-allowed opacity-70"
            />
            <Lock className="w-3 h-3 text-zinc-600 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        
        <Button 
            size="icon" 
            disabled 
            className="h-9 w-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 border border-zinc-700 opacity-70 cursor-not-allowed"
        >
            <Send className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}