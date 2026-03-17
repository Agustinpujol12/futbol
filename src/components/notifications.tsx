'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, MessageSquare, Trophy, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: 'game' | 'system' | 'league' | 'store';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

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

  // Cargar notificaciones reales de Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data as Notification[]);
      }
    };

    fetchNotifications();
  }, [supabase, isOpen]); // Se recarga cada vez que abris la campana

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    if (!userId) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const markAllAsRead = async () => {
    if (!userId || unreadCount === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
  };

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.type === 'league') router.push('/dashboard');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'league': return <Trophy size={18} className="text-yellow-400" />;
      case 'game': return <MessageSquare size={18} className="text-emerald-400" />;
      case 'system': return <Info size={18} className="text-blue-400" />;
      default: return <Bell size={18} className="text-gray-400" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="relative mr-4" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800 focus:outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#0B1120] animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#1a1d26] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-[#13161c] border-b border-gray-800">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Notificaciones</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                <CheckCheck size={14} /> Marcar todas leídas
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
                <Bell size={32} className="mb-2 opacity-20" />
                <p className="text-sm">No tienes notificaciones nuevas</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const { date, time } = formatDateTime(notif.created_at);
                return (
                  <div 
                    key={notif.id} 
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 border-b border-gray-800/50 hover:bg-[#252836] transition-colors cursor-pointer group ${!notif.read ? 'bg-[#1a1d26]' : 'bg-[#13161c]/50'}`}
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 h-10 w-10 rounded-full bg-[#2a2e3b] flex items-center justify-center shrink-0 border ${!notif.read ? 'border-gray-600' : 'border-gray-800'}`}>
                         {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm group-hover:text-white leading-snug ${!notif.read ? 'text-gray-100 font-bold' : 'text-gray-400 font-medium'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notif.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {date} - {time}
                          </span>
                        </div>
                      </div>
                      {!notif.read && (
                        <div className="shrink-0 flex items-center justify-center w-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}