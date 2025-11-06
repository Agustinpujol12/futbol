// src/components/Header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';

import { createClient } from '@/lib/supabase/server'; // Helper de Servidor
import { cookies } from 'next/headers';
import LogoutButton from './LogoutButton';

export async function Header() {
  const supabase = createClient();

  // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
  // Reemplazamos getSession() por getUser()
  const { data: { user } } = await supabase.auth.getUser();
  // --- FIN DEL CAMBIO ---

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b">
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground">
          Global GoalGetters
        </h1>
      </div>
      
      <nav className="flex items-center gap-2">
        {/* Ahora comprobamos 'user' en lugar de 'session' */}
        {user ? (
          <>
            <span className="text-sm hidden sm:inline">
              {/* Y usamos 'user.email' */}
              ¡Hola, {user.email?.split('@')[0]}!
            </span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Registrarse</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}