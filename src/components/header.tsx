import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { UserNav } from './user-nav';
import { NavLinks } from './nav-links';
import Notifications from './notifications';

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userProfile = null;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url, plan_type, reputation')
      .eq('id', user.id)
      .single();

    userProfile = data;
  }

  return (
<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/60 shadow-md">
      {/* 1. Cambiamos h-24 por h-32 para darle más espacio vertical a la barra */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 h-32 flex items-center justify-between">
        
        {/* --- IZQUIERDA: LOGO --- */}
        <div className="flex justify-start items-center">
          <Link
            href="/"
            className="flex items-center group w-fit" 
            aria-label="Volver a la página de inicio"
          >
            <div className="transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/draft8888.png"
                alt="Logo Draft8"
                // Aumentamos la resolución base para que no se pixele
                width={400} 
                height={128} 
                // 2. Llevamos el logo de h-20 a h-28 (un salto inmenso en tamaño)
                className="h-28 w-auto object-contain" 
                priority
              />
            </div>
          </Link>
        </div>

        {/* --- CENTRO: NAVEGACIÓN --- */}
<nav className="flex items-center justify-center gap-4 lg:gap-6">
  {user && <NavLinks />}
</nav>

        {/* --- DERECHA: USUARIO / AUTH --- */}
        <div className="flex justify-end items-center gap-4">
          {user ? (
            <>
              <Notifications />

              <UserNav
                email={user.email}
                username={userProfile?.username}
                avatarUrl={userProfile?.avatar_url}
                planType={userProfile?.plan_type}
                reputation={userProfile?.reputation}
              />
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
              >
                <Link href="/login">Iniciar sesión</Link>
              </Button>

              <Button
                asChild
                className="bg-primary text-white text-base px-5 py-2.5 hover:bg-primary/90 transition"
              >
                <Link href="/login">Registrarse</Link>
              </Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
