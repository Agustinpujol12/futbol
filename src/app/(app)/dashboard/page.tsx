// src/app/(app)/dashboard/page.tsx

// --- 1. IMPORTACIONES DE TU CÓDIGO DE UI ---
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineupBuilder } from "@/components/lineup/lineup-builder";
import { StrategyCardManager } from "@/components/strategy/strategy-cards";
import { CircleDollarSign } from "lucide-react";

// --- 2. IMPORTACIONES DE LA LÓGICA DE SERVIDOR ---
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// Este es el formulario que crearemos en el próximo paso
import WelcomeForm from './WelcomeForm'; 

// Forzamos a que esta página NUNCA sea estática
export const dynamic = 'force-dynamic';

// --- 3. CONVERTIMOS LA PÁGINA EN ASYNC ---
export default async function DashboardPage() {
  
  // --- 4. LÓGICA DE AUTENTICACIÓN Y PERFIL ---
  const supabase = createClient();

  // Obtener el usuario de la sesión
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login'); // Redirige si no está logueado
  }

  // Buscar el perfil del usuario en la base de datos
  const { data: profile } = await supabase
    .from('profiles')
    .select('username') // Solo necesitamos saber el username
    .eq('id', session.user.id) // Buscamos por el ID del usuario logueado
    .single(); // Esperamos solo una fila

  if (!profile) {
    // Esto es un error grave (el trigger debería haberlo creado)
    return <div>Error: No se encontró el perfil. Contacta a soporte.</div>
  }

  // --- 5. ¡LA LÓGICA CLAVE DE BIENVENIDA! ---
  if (profile.username === null) {
    // Si el username está NULL, muestra el formulario de bienvenida
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold">¡Bienvenido a Global GoalGetters!</h1>
        <p className="text-muted-foreground mb-4">
          Necesitas crear un nombre de usuario para continuar.
        </p>
        <WelcomeForm userId={session.user.id} />
      </div>
    );
  }

  // --- 6. SI EL USUARIO YA TIENE PERFIL, MUESTRA TU UI ---
  // (Este es el código que tú ya tenías, pero ahora con un saludo dinámico)
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-2 sm:mb-0">
          {/* ¡Hacemos el saludo dinámico! */}
          ¡Hola, {profile.username}!
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg">
            <CircleDollarSign className="h-6 w-6 text-accent" />
            <span className="font-semibold text-foreground">100,000</span>
            <span className="text-sm text-muted-foreground">Budget</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="lineup" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="lineup">Lineup Selection</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="lineup" className="mt-6">
            <LineupBuilder />
        </TabsContent>
        <TabsContent value="strategy" className="mt-6">
            <StrategyCardManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}