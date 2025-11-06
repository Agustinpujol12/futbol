// src/app/(app)/dashboard/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineupBuilder } from "@/components/lineup/lineup-builder";
import { StrategyCardManager } from "@/components/strategy/strategy-cards";
import { CircleDollarSign } from "lucide-react";

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import WelcomeForm from './WelcomeForm'; 

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  
  const supabase = createClient();

  // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
  // Reemplazamos getSession() por getUser()
  const { data: { user } } = await supabase.auth.getUser();
  // --- FIN DEL CAMBIO ---

  if (!user) {
    redirect('/login'); // Redirige si no está logueado
  }

  // Buscamos el perfil (ahora usando 'user.id')
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id) // <-- Usamos user.id
    .single();

  if (!profile) {
    return <div>Error: No se encontró el perfil. Contacta a soporte.</div>
  }

  if (profile.username === null) {
    // Muestra el formulario de bienvenida
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold">¡Bienvenido a Global GoalGetters!</h1>
        <p className="text-muted-foreground mb-4">
          Necesitas crear un nombre de usuario para continuar.
        </p>
        <WelcomeForm userId={user.id} /> {/* <-- Pasamos user.id */}
      </div>
    );
  }

  // Si el usuario ya tiene perfil, muestra la UI
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-2 sm:mb-0">
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