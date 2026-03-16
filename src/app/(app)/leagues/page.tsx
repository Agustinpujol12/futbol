// src/app/(app)/leagues/page.tsx
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import PaymentListener from './PaymentListener';
import LeagueJoinCard from './LeagueJoinCard';
import { Countdown } from '@/components/countdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Lock, Users, Swords, Ticket, MessageSquare, Timer } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LeaguesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  let isPremium = false;
  let isAlreadyInLeague = false;
  let activeLeague = null;

  if (user) {
    // 1. Verificamos si es Premium
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_type')
      .eq('id', user.id)
      .single();

    isPremium = profile?.plan_type === 'premium' || profile?.plan_type === 'pro';

    // 2. Intentamos buscar si el usuario ya pertenece a una liga
    const { data: userLeagueMember } = await supabase
      .from('league_members')
      .select('league_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (userLeagueMember) {
      // Si ya tiene liga, traemos ESA liga específica (la suya)
      const { data: myLeague } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', userLeagueMember.league_id)
        .single();
      
      activeLeague = myLeague;
      isAlreadyInLeague = true;
    }
  }

  // 3. Si no tiene liga o no está logueado, buscamos la sala pública activa (la más antigua en 'forming')
  if (!activeLeague) {
    const { data: openLeague } = await supabase
      .from('leagues')
      .select('*')
      .eq('status', 'forming')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
      
    activeLeague = openLeague;
  }

  const closedLeagues = [
    { id: '101', name: 'Global Draft #101', players: 18 },
    { id: '102', name: 'Global Draft #102', players: 18 },
    { id: '103', name: 'Global Draft #103', players: 18 },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      
      <Suspense fallback={null}>
        <PaymentListener />
      </Suspense>

      {/* BANNER DEL CONTADOR */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-center gap-6 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
           <Timer className="h-10 w-10 text-orange-500 animate-pulse" />
           <div className="text-center md:text-left">
             <h2 className="text-2xl font-bold font-headline text-foreground">Cierre de Inscripciones</h2>
             <p className="text-muted-foreground">Tenés tiempo hasta 24hs antes del primer partido del Mundial.</p>
           </div>
           
           <Countdown />
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline text-foreground">
          Salas de Competición
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Unite a la sala pública activa. Cuando llegue a 18 jugadores, comienza el torneo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
        
        {/* LA SALA ACTIVA (PROPIA O NUEVA) SIEMPRE PRIMERO A LA IZQUIERDA */}
        {activeLeague ? (
          <LeagueJoinCard activeLeague={activeLeague} isAlreadyInLeague={isAlreadyInLeague} />
        ) : (
          <Card className="bg-muted/50 border-dashed border-2 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
            <Swords className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-bold text-xl mb-2 text-foreground">Generando sala...</h3>
          </Card>
        )}

        {/* LIGAS CERRADAS (FICTICIAS) */}
        {closedLeagues.map((league) => (
          <Card key={league.id} className="bg-zinc-950/50 border-zinc-800 opacity-60 grayscale flex flex-col overflow-hidden">
            <CardHeader className="bg-zinc-900 pb-4 pt-6 border-b border-zinc-800 text-center relative">
              <div className="absolute top-3 right-3">
                <Lock className="h-4 w-4 text-zinc-500" />
              </div>
              <Swords className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <h3 className="font-bold text-zinc-400 font-headline">{league.name}</h3>
            </CardHeader>
            <CardContent className="py-6 flex flex-col items-center flex-grow">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Users className="h-5 w-5" />
                <span className="text-xl font-bold">{league.players}/18</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2.5 mt-2">
                <div className="bg-zinc-600 h-2.5 rounded-full w-full"></div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button disabled variant="secondary" className="w-full bg-zinc-800 text-zinc-500 cursor-not-allowed">
                Sala Llena
              </Button>
            </CardFooter>
          </Card>
        ))}

      </div>

      {/* BANNER VIP */}
      <div className="max-w-5xl mx-auto">
        <div className={`border rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${isPremium ? 'bg-gradient-to-r from-yellow-600/20 via-yellow-500/10 to-transparent border-yellow-500/30 shadow-lg shadow-yellow-500/5' : 'bg-muted/10 border-border grayscale opacity-80'}`}>
          <div className="flex items-center gap-4">
            <div className={`${isPremium ? 'bg-yellow-500/20' : 'bg-muted'} p-3 rounded-full shrink-0`}>
              <Ticket className={`h-8 w-8 ${isPremium ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold font-headline ${isPremium ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                ¿Querés jugar solo con tus amigos?
              </h2>
              <p className="text-zinc-400 mt-1 text-sm sm:text-base">
                Abrimos cupos limitados para Ligas Privadas. Armá tu grupo de 18 y nosotros nos encargamos del resto.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col items-center gap-2">
            {isPremium ? (
              <a href="https://discord.gg/fHV4yxsF76" target="_blank" rel="noopener noreferrer">
                <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-6 h-auto text-base flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                  <MessageSquare className="h-5 w-5" />
                  Pedir Liga en Discord
                </Button>
              </a>
            ) : (
              <>
                <Button disabled className="bg-zinc-800 text-zinc-500 font-bold px-6 py-6 h-auto text-base flex items-center gap-2 cursor-not-allowed border border-zinc-700">
                  <Lock className="h-5 w-5" />
                  Pedir Liga en Discord
                </Button>
                <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Solo para usuarios PRO</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}