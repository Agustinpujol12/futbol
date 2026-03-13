// src/app/(app)/leagues/page.tsx
import PaymentListener from './PaymentListener';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Crown, Check, Users, Sparkles, Globe, MessageCircle, Eye, RefreshCw, BarChart3, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LeaguesPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      
      {/* Listener para cuando integremos los pagos */}
      <PaymentListener />

      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline text-foreground">
          Elegí cómo jugar el Mundial
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-lg">
          Seleccioná tu nivel de competición. Podés ir a la guerra contra el mundo o armar tu propio torneo cerrado.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
        
        {/* --- TARJETA 1: LIGA PÚBLICA --- */}
        <Card className="relative flex flex-col border-border shadow-lg hover:shadow-xl hover:border-primary/50 transition-all bg-card overflow-hidden h-full">
          <CardHeader className="text-center pb-8 pt-10 bg-muted/20 border-b border-border/50">
            <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold">Inscribite a una Liga Pública</CardTitle>
            <CardDescription className="text-base mt-2">Competí contra otros managers al azar.</CardDescription>
            <div className="mt-6 flex items-center justify-center gap-1">
              <span className="text-5xl font-extrabold text-foreground">$5</span>
              <span className="text-muted-foreground font-medium mt-3">USD</span>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 pt-8 px-6 sm:px-8">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Qué incluye:</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Auto-asignación a una Liga Global.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Duelos diarios cara a cara por el pozo de premios.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Avatares Básicos.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Chat Básico.</span>
              </li>
            </ul>
          </CardContent>
          
          <CardFooter className="p-6 sm:px-8 pb-8 pt-4">
            <Button className="w-full h-14 text-lg font-bold bg-primary/90 hover:bg-primary text-primary-foreground transition-all">
              Inscribirme a Liga Pública
            </Button>
          </CardFooter>
        </Card>

        {/* --- TARJETA 2: JUGÁ CON AMIGOS (PREMIUM) --- */}
        <div className="relative h-full">
          {/* Efecto de brillo de fondo */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-2xl blur opacity-25 animate-pulse"></div>
          
          <Card className="relative flex flex-col h-full border-yellow-500/50 shadow-2xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black overflow-hidden">
            <div className="absolute top-0 right-0 p-4 z-10">
              <Badge className="bg-yellow-500 text-black font-bold hover:bg-yellow-400 pointer-events-none px-3 py-1">
                RECOMENDADO
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-8 pt-10 border-b border-yellow-500/20 relative">
              <div className="absolute top-6 left-6">
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              </div>
              <div className="mx-auto bg-yellow-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-yellow-500" />
              </div>
              <CardTitle className="text-3xl font-headline font-bold text-yellow-400">Jugá con tus Amigos</CardTitle>
              <CardDescription className="text-base text-zinc-400 mt-2">Creá tu liga privada y desbloqueá todo el poder PRO.</CardDescription>
              <div className="mt-6 flex items-center justify-center gap-1">
                <span className="text-5xl font-extrabold text-white">$10</span>
                <span className="text-zinc-500 font-medium mt-3">USD</span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 pt-8 px-6 sm:px-8">
              <p className="text-sm font-medium text-yellow-500/80 uppercase tracking-wider mb-4">Todo lo anterior, más:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 p-1 rounded-full shrink-0">
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-zinc-200 font-medium">Crear Ligas Privadas con código de invitación.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 p-1 rounded-full shrink-0">
                    <Eye className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-zinc-300">Ver Alineación y Tácticas del Rival (Scouting).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 p-1 rounded-full shrink-0">
                    <RefreshCw className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-zinc-300">Descartar Cartas de Estrategia.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 p-1 rounded-full shrink-0">
                    <MessageCircle className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-zinc-300">Chat Libre sin restricciones.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 p-1 rounded-full shrink-0">
                    <BarChart3 className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-zinc-300">Análisis de Rendimiento Avanzado.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 p-1 rounded-full shrink-0">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-zinc-300">Marco Dorado, Avatares VIP y Soporte Prioritario.</span>
                </li>
              </ul>
            </CardContent>
            
            <CardFooter className="p-6 sm:px-8 pb-8 pt-4">
              <Button className="w-full h-14 text-lg font-bold bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all hover:scale-[1.02]">
                Inscribirme y Crear Liga PRO
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  )
}