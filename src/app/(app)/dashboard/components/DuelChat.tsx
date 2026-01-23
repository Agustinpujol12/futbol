'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, AlertCircle } from 'lucide-react';

// --- CONFIGURACIÓN DE REGLAS ---
const MAX_CHARS = 200;       
const COOLDOWN_MS = 2000;    

// --- FRASES RÁPIDAS ---
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
}

export default function DuelChat({ userAvatar, rivalAvatar }: DuelChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const lastMessageTimeRef = useRef<number>(0);
  const lastMessageTextRef = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleSendMessage = (text: string) => {
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

    lastMessageTimeRef.current = now;
    lastMessageTextRef.current = cleanText;

    const newMessage: Message = {
      id: now.toString(),
      sender: 'me',
      text: cleanText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setErrorMsg(null);
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
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
            <MessageSquare className="w-8 h-8 mb-2" />
            <p className="text-xs">El chat está vacío. ¡Saluda!</p>
          </div>
        )}

        {messages.map((msg) => {
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

              {/* BURBUJA DE MENSAJE (COMPACTA) */}
              {/* Cambios clave para hacerla chica:
                  1. px-3 py-1.5 (Menos relleno)
                  2. text-sm leading-tight (Texto normal pero líneas pegadas)
                  3. w-fit (Se ajusta al contenido exacto)
              */}
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
        })}
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
            handleSendMessage(inputValue);
          }}
          className="flex gap-2 items-center"
        >
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setInputValue(e.target.value);
                }
              }}
              placeholder="Escribe..."
              className="w-full bg-background/50 border-white/10 h-8 text-xs focus-visible:ring-primary/50 pr-10"
            />
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono ${inputValue.length >= MAX_CHARS ? 'text-destructive' : 'text-muted-foreground/50'}`}>
              {inputValue.length}/{MAX_CHARS}
            </span>
          </div>

          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim()} 
            className="h-8 w-8 bg-primary shadow-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
          </Button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
           {QUICK_MESSAGES.map((msg) => (
             <button
               key={msg.id}
               type="button" 
               onClick={() => handleSendMessage(msg.text)}
               className="text-center px-1 py-1 rounded bg-secondary/30 hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/30 transition-all text-[10px] font-medium truncate active:scale-95 cursor-pointer select-none"
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