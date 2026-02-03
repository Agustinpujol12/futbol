'use client';

import { 
  ShoppingCart, 
  Star, 
  MessageCircle, 
  Users, 
  Eye,   
  RefreshCw, 
  BarChart3, 
  Crown,
  Check,
  X,
  CreditCard,
  LifeBuoy // Nuevo icono para Soporte
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ShopPage() {
  
  // Lista de Beneficios para la tabla comparativa
  const benefits = [
    { name: "Jugar Torneos Globales", free: true, premium: true },
    { name: "Avatars Básicos (4 opciones)", free: true, premium: true },
    { name: "Chat en Vivo (Frases rápidas)", free: true, premium: true },
    { name: "Chat Libre (Escribir mensajes)", free: false, premium: true },
    { name: "Avatars Exclusivos (Gato, Hormiga...)", free: false, premium: true },
    { name: "Ver Alineación Rival (Scouting)", free: false, premium: true },
    { name: "Crear Ligas Privadas con Amigos", free: false, premium: true },
    { name: "Descartar Cartas de Estrategia (1 vez/fecha)", free: false, premium: true },
    { name: "Análisis de Rendimiento Avanzado", free: false, premium: true },
    { name: "Soporte VIP Prioritario", free: false, premium: true }, // ✅ NUEVO BENEFICIO
    { name: "Marco Dorado y Estrella en Perfil", free: false, premium: true },
  ];

  return (
    <div className="container mx-auto py-8 space-y-12">
      
      {/* --- HEADER --- */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black font-headline text-white tracking-tight">
          Sube de Nivel tu Juego
        </h1>
        <p className="text-xl text-muted-foreground">
          Desbloquea el potencial completo de Global GoalGetters con la membresía Premium.
        </p>
      </div>

      {/* --- TARJETAS PRINCIPALES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
        
        {/* PLAN FREE */}
        <Card className="border-zinc-800 bg-zinc-900/50 relative overflow-hidden">
           <CardHeader>
               <CardTitle className="text-2xl text-white">Manager Novato</CardTitle>
               <CardDescription>Para empezar a jugar y competir.</CardDescription>
               <div className="mt-4">
                   <span className="text-4xl font-bold text-white">$0</span>
                   <span className="text-muted-foreground">/mes</span>
               </div>
           </CardHeader>
           <CardContent>
               <ul className="space-y-3">
                   <li className="flex items-center gap-2 text-zinc-300">
                       <Check className="w-5 h-5 text-emerald-500" /> Jugar en la Liga Global
                   </li>
                   <li className="flex items-center gap-2 text-zinc-300">
                       <Check className="w-5 h-5 text-emerald-500" /> Avatars Estándar
                   </li>
                   <li className="flex items-center gap-2 text-zinc-300">
                       <Check className="w-5 h-5 text-emerald-500" /> Chat con Frases Rápidas
                   </li>
               </ul>
           </CardContent>
           <CardFooter>
               <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300 cursor-default">
                   Plan Actual
               </Button>
           </CardFooter>
        </Card>

        {/* PLAN PREMIUM (DESTACADO) */}
        <div className="relative transform md:-translate-y-4">
           {/* Efecto de brillo */}
           <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-2xl blur opacity-30 animate-pulse"></div>
           
           <Card className="relative h-full flex flex-col border-yellow-500/50 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-2xl">
              <div className="absolute top-0 right-0 p-4">
                  <Badge className="bg-yellow-500 text-black font-bold hover:bg-yellow-400 pointer-events-none">
                      RECOMENDADO
                  </Badge>
              </div>

              <CardHeader>
                  <CardTitle className="text-3xl text-yellow-400 flex items-center gap-2">
                      <Crown className="w-6 h-6 fill-yellow-400" />
                      Manager PRO
                  </CardTitle>
                  <CardDescription>Domina la liga con herramientas exclusivas.</CardDescription>
                  <div className="mt-4">
                      <span className="text-5xl font-black text-white">$5.00</span>
                      <span className="text-muted-foreground font-medium">/mes</span>
                  </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-grow">
                  <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Todo lo de Free, más:</p>
                  
                  <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                          <div className="bg-yellow-500/10 p-1.5 rounded-full">
                            <MessageCircle className="w-4 h-4 text-yellow-400" />
                          </div>
                          <span className="text-zinc-200 font-medium">Chat Libre sin restricciones</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <div className="bg-yellow-500/10 p-1.5 rounded-full">
                            <Eye className="w-4 h-4 text-yellow-400" />
                          </div>
                          <span className="text-zinc-200 font-medium">Ver Alineación y Tácticas del Rival</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <div className="bg-yellow-500/10 p-1.5 rounded-full">
                            <Users className="w-4 h-4 text-yellow-400" />
                          </div>
                          <span className="text-zinc-200 font-medium">Crear Ligas Privadas</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <div className="bg-yellow-500/10 p-1.5 rounded-full">
                            <LifeBuoy className="w-4 h-4 text-yellow-400" />
                          </div>
                          <span className="text-zinc-200 font-medium">Soporte VIP Prioritario</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <div className="bg-yellow-500/10 p-1.5 rounded-full">
                            <Star className="w-4 h-4 text-yellow-400" />
                          </div>
                          <span className="text-zinc-200 font-medium">Marco Dorado y Avatars VIP</span>
                      </li>
                  </ul>
              </CardContent>

              <CardFooter>
                  <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg h-12 shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all hover:scale-[1.02]">
                      CONVERTIRME EN PRO
                  </Button>
              </CardFooter>
           </Card>
        </div>
      </div>

      {/* --- TABLA COMPARATIVA DETALLADA --- */}
      <div className="max-w-4xl mx-auto pt-8">
        <h3 className="text-2xl font-bold font-headline text-center mb-8">Comparativa Detallada</h3>
        
        <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/30">
            {/* Header Tabla */}
            <div className="grid grid-cols-12 bg-zinc-900 p-4 border-b border-zinc-800">
                <div className="col-span-6 md:col-span-8 font-bold text-muted-foreground">BENEFICIO</div>
                <div className="col-span-3 md:col-span-2 text-center font-bold text-white">FREE</div>
                <div className="col-span-3 md:col-span-2 text-center font-bold text-yellow-400">PREMIUM</div>
            </div>

            {/* Filas */}
            {benefits.map((benefit, index) => (
                <div 
                    key={index} 
                    className={`grid grid-cols-12 p-4 items-center ${index !== benefits.length - 1 ? 'border-b border-zinc-800/50' : ''} hover:bg-white/5 transition-colors`}
                >
                    <div className="col-span-6 md:col-span-8 text-sm md:text-base text-zinc-300 font-medium">
                        {benefit.name}
                    </div>
                    
                    <div className="col-span-3 md:col-span-2 flex justify-center">
                        {benefit.free ? (
                            <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                            <X className="w-5 h-5 text-zinc-600" />
                        )}
                    </div>
                    
                    <div className="col-span-3 md:col-span-2 flex justify-center">
                        {benefit.premium ? (
                            <div className="bg-yellow-500/20 p-1 rounded-full">
                                <Check className="w-5 h-5 text-yellow-400" />
                            </div>
                        ) : (
                            <X className="w-5 h-5 text-zinc-600" />
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}