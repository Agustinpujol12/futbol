import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
              <Button
                asChild
                variant="ghost"
                className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
              >
                <Link href="/">Inicio</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
              >
                <Link href="/leagues">Ligas</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="font-medium text-base text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          )}
        </nav>

        {/* --- DERECHA: USUARIO / AUTH --- */}
        <div className="flex justify-end items-center gap-4">
          {user ? (
            <>
              <span className="text-base hidden sm:inline text-muted-foreground">
                Hola,{' '}
                <span className="font-semibold text-foreground">
                  {user.email?.split('@')[0]}
                </span>
              </span>
              <LogoutButton />
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
