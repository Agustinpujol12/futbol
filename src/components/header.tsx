// src/components/Header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';

// --- INICIO DE CAMBIOS ---
// 1. Importamos los helpers de Supabase para el Servidor
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
// 2. Importamos el botón de Logout (que crearemos en el siguiente paso)
import LogoutButton from './LogoutButton';
// --- FIN DE CAMBIOS ---


// 3. Convertimos la función en "async"
export async function Header() {

  // --- INICIO DE CAMBIOS ---
  // 4. Obtenemos la sesión del usuario desde el servidor
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  // --- FIN DE CAMBIOS ---

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b">
      <div className="flex items-center gap-2">
        <Logo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground">
          Global GoalGetters
        </h1>
      </div>
      
      {/* --- INICIO DE CAMBIOS --- */}
      {/* 5. Lógica condicional: ¿Hay sesión o no? */}
      <nav className="flex items-center gap-2">
        {session ? (
          // SÍ HAY SESIÓN (Usuario logeado)
          <>
            <span className="text-sm hidden sm:inline">
              ¡Hola, {session.user.email?.split('@')[0]}!
            </span>
            <LogoutButton />
          </>
        ) : (
          // NO HAY SESIÓN (Usuario deslogeado)
          <>
            <Button asChild variant="ghost">
              {/* Apuntamos a la página /login que creaste */}
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              {/* Apuntamos a la página /login (que también tiene el registro) */}
              <Link href="/login">Registrarse</Link>
            </Button>
          </>
        )}
      </nav>
      {/* --- FIN DE CAMBIOS --- */}
      
    </header>
  );
}