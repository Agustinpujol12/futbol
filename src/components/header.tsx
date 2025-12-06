// src/components/header.tsx
// --- ARCHIVO ACTUALIZADO CON USERNAV ---

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { UserNav } from './user-nav'; // <-- Importamos el nuevo componente

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Buscar datos del perfil si hay usuario
  let userProfile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url') // Asegúrate que estas columnas existen
      .eq('id', user.id)
      .single();
    userProfile = data;
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/60 shadow-md">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 h-24 grid grid-cols-3 items-center">
        {/* --- IZQUIERDA: LOGO --- */}
        <div className="flex justify-start items-center">
          <Link
            href="/"
            className="flex items-center gap-4 group"
            aria-label="Volver a la página de inicio"
          >
            <Logo className="h-12 w-12 text-primary transition-transform duration-300 group-hover:rotate-6" />
            <h1 className="text-3xl font-headline font-extrabold text-foreground tracking-tight transition-colors group-hover:text-primary">
              Global GoalGetters
            </h1>
          </Link>
        </div>

        {/* --- CENTRO: NAVEGACIÓN --- */}
        <nav className="flex justify-center gap-5">
          {user && (
            <>
              <Button asChild variant="ghost" className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                <Link href="/">Inicio</Link>
              </Button>
              <Button asChild variant="ghost" className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                <Link href="/leagues">Ligas</Link>
              </Button>
              <Button asChild variant="ghost" className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                <Link href="/rendimiento">Rendimiento</Link>
              </Button>
              <Button asChild variant="ghost" className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                <Link href="/tienda">Tienda</Link>
              </Button>
              <Button 
                asChild 
                variant="ghost" 
                // 👇 Agregamos 'relative z-20' al final de las clases
                className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition relative z-20"
              >
                <Link href="/fixturemundial">Mundial 2026</Link>
              </Button>
            </>
          )}
        </nav>

        {/* --- DERECHA: USUARIO / AUTH --- */}
        <div className="flex justify-end items-center gap-4">
          {user ? (
            // --- CAMBIO: Usamos UserNav en lugar de texto plano ---
            <UserNav 
              email={user.email} 
              username={userProfile?.username} 
              avatarUrl={userProfile?.avatar_url} // Opcional
            />
          ) : (
            <>
              <Button asChild variant="ghost" className="text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild className="bg-primary text-white text-base px-5 py-2.5 hover:bg-primary/90 transition">
                <Link href="/login">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}