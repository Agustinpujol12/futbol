'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, AlertCircle, Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const MAX_CHARS = 200;       
const COOLDOWN_MS = 2000;    

const QUICK_MESSAGES = [
  { id: 1, text: "¡Buena suerte! 🍀" },
  { id: 2, text: "Hola buenas 👋" },
  { id: 3, text: "¡GOLAZO! ⚽🔥" },
  { id: 4, text: "Qué atajada... 🧤" },
  { id: 5, text: "Era penal juez 👮‍♂️" },
  { id: 6, text: "¡No me lo creo! 😱" },
  { id: 7, text: "Bien jugado 🤝" },
  { id: 8, text: "Jajaja 😂" },
  { id: 9, text: "Ojo con mi capitán 👀" },
  { id: 10, text: "Remontada épica 🚀" },
];

type Message = {
  id: string;
  sender: 'me' | 'rival';
  text: string;
  timestamp: Date;
};

interface DuelChatProps {
  userAvatar?: string | null;
  rivalAvatar?: string | null;
  matchupId: string;
  currentUserId: string;
  userPlan: string; // ✅ NUEVO: Recibimos el plan
}

export default function DuelChat({ 
  userAvatar, 
  rivalAvatar, 
  matchupId, 
  currentUserId,
  userPlan = 'free' // Valor por defecto
}: DuelChatProps) {
  
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const lastMessageTimeRef = useRef<number>(0);
  const lastMessageTextRef = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ LÓGICA DE PERMISOS
  const isPremium = userPlan === 'premium';
  const canType = isPremium; // Solo Premium puede escribir libremente

  // --- 1. CARGAR HISTORIAL ---
  useEffect(() => {
    if (!matchupId) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('match_messages')
        .select('*')
        .eq('matchup_id', matchupId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        const formattedMessages: Message[] = data.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_id === currentUserId ? 'me' : 'rival',
          text: msg.content,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(formattedMessages);
      }
      setIsLoading(false);
    };

    fetchMessages();

    // 📡 SUSCRIPCIÓN REALTIME
    const channel = supabase
      .channel(`chat_room_${matchupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_messages',
          filter: `matchup_id=eq.${matchupId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          
          if (newMsg.sender_id === currentUserId) {
            return;
          }

          const formattedMsg: Message = {
            id: newMsg.id,
            sender: 'rival',
            text: newMsg.content,
            timestamp: new Date(newMsg.created_at),
          };
          
          setMessages((prev) => [...prev, formattedMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchupId, currentUserId]);

  // Scroll automático
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Limpiar errores
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // --- 2. ENVIAR MENSAJE ---
  const handleSendMessage = async (text: string) => {
    const cleanText = text.trim();
    const now = Date.now();

    if (!cleanText) return;

    if (cleanText.length > MAX_CHARS) {
      setErrorMsg(`El mensaje es muy largo (Máx ${MAX_CHARS}).`);
      return;
    }

    if (now - lastMessageTimeRef.current < COOLDOWN_MS) {
      setErrorMsg("¡Vas muy rápido! Espera unos segundos.");
      return;
    }

    if (cleanText === lastMessageTextRef.current) {
      setErrorMsg("No envíes el mismo mensaje repetido.");
      return;
    }

    // Actualizar referencias
    lastMessageTimeRef.current = now;
    lastMessageTextRef.current = cleanText;
    
    // ⚡ 1. ACTUALIZACIÓN OPTIMISTA
    const optimisticMsg: Message = {
        id: Math.random().toString(),
        sender: 'me',
        text: cleanText,
        timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputValue(''); 

    // 🚀 2. ENVIAR A SUPABASE
    const { error } = await supabase
      .from('match_messages')
      .insert({
        matchup_id: matchupId,
        sender_id: currentUserId,
        content: cleanText
      });

    if (error) {
      console.error('Error enviando mensaje:', error);
      setErrorMsg("Error al enviar. Verifica tu conexión.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full text-sm">
      
      {/* ÁREA DE MENSAJES */}
      <div 
        ref={scrollRef}
        className="
          flex-1 overflow-y-auto p-4 space-y-3
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-primary/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-primary/40
        "
      >
        {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <p className="text-xs">Conectando...</p>
            </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
            <MessageSquare className="w-8 h-8 mb-2" />
            <p className="text-xs">El chat está vacío. ¡Saluda!</p>
          </div>
        ) : (
           messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex w-full items-end gap-2 ${isMe ? 'justify-start' : 'justify-end'}`}>
                
                {/* AVATAR USUARIO */}
                {isMe && (
                  <div className="shrink-0 w-6 h-6 rounded-full overflow-hidden border border-primary/50 shadow-sm mb-1">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[8px] font-bold">YO</div>
                    )}
                  </div>
                )}

                {/* BURBUJA DE MENSAJE */}
                <div
                  className={`
                    w-fit max-w-[75%] px-3 py-1.5 rounded-xl text-sm shadow-sm relative break-words leading-tight
                    ${isMe 
                      ? 'bg-primary text-primary-foreground rounded-bl-none' 
                      : 'bg-zinc-700 text-white rounded-br-none'
                    }
                  `}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-60 mt-0.5 block text-right leading-none">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* AVATAR RIVAL */}
                {!isMe && (
                  <div className="shrink-0 w-6 h-6 rounded-full overflow-hidden border border-zinc-500 shadow-sm mb-1">
                    {rivalAvatar ? (
                      <img src={rivalAvatar} alt="Rival" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-600 flex items-center justify-center text-[8px] font-bold">VS</div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* ÁREA DE INPUT Y CONTROLES */}
      <div className="p-2 bg-muted/20 border-t border-white/5 flex flex-col gap-2 relative">
        
        {/* Alerta Flotante */}
        {errorMsg && (
          <div className="absolute -top-8 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-bottom-2 z-10">
            <div className="bg-destructive/90 text-destructive-foreground text-[10px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-sm">
              <AlertCircle className="w-3 h-3" />
              {errorMsg}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // ✅ Solo permitir enviar si es premium (o si el input se pudo llenar de alguna forma)
            if (canType) handleSendMessage(inputValue);
          }}
          className="flex gap-2 items-center"
        >
          <div className="relative flex-1 group">
            <Input
              value={inputValue}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setInputValue(e.target.value);
                }
              }}
              // ✅ LÓGICA DE BLOQUEO DE INPUT
              disabled={!matchupId || isLoading || !canType}
              placeholder={
                !matchupId ? "Chat deshabilitado" : 
                !canType ? "Solo usuarios Premium pueden escribir..." : // Mensaje para Free
                "Escribe..."
              }
              className={`
                w-full h-8 text-xs pr-10 border-white/10
                ${!canType ? 'bg-zinc-900/50 text-muted-foreground cursor-not-allowed' : 'bg-background/50 focus-visible:ring-primary/50'}
              `}
            />
            
            {/* Ícono de candado si no puede escribir */}
            {!canType && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                <Lock className="w-3 h-3" />
              </div>
            )}

            {/* Contador de caracteres (solo si puede escribir) */}
            {canType && (
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono ${inputValue.length >= MAX_CHARS ? 'text-destructive' : 'text-muted-foreground/50'}`}>
                {inputValue.length}/{MAX_CHARS}
              </span>
            )}
          </div>

          <Button 
            type="submit" 
            size="icon" 
            // ✅ Botón deshabilitado si no es premium
            disabled={!inputValue.trim() || !matchupId || isLoading || !canType} 
            className="h-8 w-8 bg-primary shadow-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
          </Button>
        </form>

        {/* FRASES RÁPIDAS (Disponibles para TODOS) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
           {QUICK_MESSAGES.map((msg) => (
             <button
               key={msg.id}
               type="button" 
               onClick={() => handleSendMessage(msg.text)}
               disabled={!matchupId || isLoading}
               className="text-center px-1 py-1 rounded bg-secondary/30 hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/30 transition-all text-[10px] font-medium truncate active:scale-95 cursor-pointer select-none disabled:opacity-30 disabled:cursor-not-allowed"
               title={msg.text}
             >
               {msg.text}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}