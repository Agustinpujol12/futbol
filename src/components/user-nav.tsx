'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, Settings, User, Star } from 'lucide-react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

interface UserNavProps {
  email: string | undefined;
  username: string | null | undefined;
  avatarUrl?: string | null | undefined;
  planType?: string | null;
  reputation?: string | null;
}

export function UserNav({ email, username, avatarUrl, planType, reputation }: UserNavProps) {
  const initials = username
    ? username.substring(0, 2).toUpperCase()
    : email?.substring(0, 2).toUpperCase() || 'U';

  const displayName = username || email?.split('@')[0] || 'Usuario';

  // ✅ LIMPIO: Solo lógica Premium (Dorado) o Default
  const getBorderClass = () => {
    if (planType === 'premium') return 'border-2 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]';
    return 'border border-border/50';
  };

  // ✅ LIMPIO: Solo hover especial si es Premium
  const getButtonClass = () => {
    if (planType === 'premium') return 'hover:opacity-80';
    return 'ring-2 ring-primary/20 hover:ring-primary/50';
  };

  // Lógica de reputación (Se mantiene igual)
  const getReputationColor = () => {
    switch (reputation) {
      case 'warning': return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]';
      case 'danger': return 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]';
      case 'banned': return 'bg-zinc-950 border border-zinc-700 shadow-[0_0_8px_rgba(0,0,0,0.8)]';
      default: return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`relative h-10 w-10 rounded-full transition-all overflow-visible ${getButtonClass()}`}
        >
          
          {/* 🟥 BADGE REPUTACIÓN (Tarjeta Sólida - IZQUIERDA) */}
          <div className="absolute -top-2 -left-2 z-50 bg-zinc-950/80 rounded-full p-[3px] border border-white/10 backdrop-blur-sm">
              <div className={`w-2 h-3 rounded-[1px] ${getReputationColor()}`}></div>
          </div>

          {/* ⭐ BADGE PREMIUM (Estrella - DERECHA) - Solo si es Premium */}
          {planType === 'premium' && (
            <div className="absolute -top-3 -right-3 z-50 bg-zinc-950 rounded-full p-[3px] border border-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.6)]">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
            </div>
          )}

          {/* AVATAR */}
          <Avatar className={`h-10 w-10 ${getBorderClass()}`}>
            <AvatarImage 
              src={avatarUrl || ''} 
              alt={displayName} 
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none font-headline truncate">
                {displayName}
              </p>
              {/* Etiqueta PRO solo para Premium */}
              {planType === 'premium' && <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20 font-bold">PRO</span>}
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/tienda" className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Suscripción</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <div className="w-full cursor-pointer text-red-500 focus:text-red-500">
             <LogoutButton isDropdownItem /> 
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}