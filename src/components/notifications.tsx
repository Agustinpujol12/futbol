'use client'; // 👈 ¡AGREGA ESTA LÍNEA AL PRINCIPIO!

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, MessageSquare, ShoppingCart } from 'lucide-react';

// Tipado para las notificaciones
interface Notification {
  id: number;
  type: 'game' | 'system' | 'store';
  title: string;
  source: string;
  date: string;
  time: string;
  read: boolean;
}

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Datos mock (simulando lo que vendría de tu Base de Datos)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'game',
      title: "Juego propuesto para su equipo",
      source: "Gamers Club",
      date: "21/01/2026",
      time: "18:45",
      read: false,
    },
    {
      id: 2,
      type: 'game',
      title: "Juego propuesto para su equipo",
      source: "Gamers Club",
      date: "20/01/2026",
      time: "23:14",
      read: false,
    },
    {
      id: 3,
      type: 'system',
      title: "Bienvenido al Dashboard Global",
      source: "Sistema",
      date: "20/01/2026",
      time: "18:29",
      read: true,
    }
  ]);

  // Cerrar al hacer click fuera
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative mr-4" ref={dropdownRef}>
      {/* --- BOTÓN CAMPANA --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#0B1120]"></span>
        )}
      </button>

      {/* --- DROPDOWN --- */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-[#1a1d26] border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
          
          {/* Header del Dropdown */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#13161c] border-b border-gray-800">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Notificaciones</h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              <CheckCheck size={14} /> Marcar todas leídas
            </button>
          </div>

          {/* Lista de Notificaciones */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 border-b border-gray-800/50 hover:bg-[#252836] transition-colors cursor-pointer group ${!notif.read ? 'bg-[#1a1d26]' : 'bg-[#13161c]/50'}`}
              >
                <div className="flex gap-4">
                  {/* Icono según tipo */}
                  <div className="mt-1 h-10 w-10 rounded-full bg-[#2a2e3b] flex items-center justify-center shrink-0 border border-gray-700">
                     {notif.type === 'game' ? <MessageSquare size={18} className="text-blue-400" /> : 
                      notif.type === 'store' ? <ShoppingCart size={18} className="text-yellow-400" /> :
                      <Bell size={18} className="text-gray-400" />}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 group-hover:text-white font-medium leading-snug">
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                        {notif.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {notif.date} - {notif.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer del Dropdown */}
          <div className="bg-[#13161c] p-3 text-center border-t border-gray-800 hover:bg-[#1a1d26] transition-colors cursor-pointer">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white">
              Ver notificaciones anteriores
            </span>
          </div>
        </div>
      )}
    </div>
  );
}