// src/app/(app)/rendimiento/page.tsx
'use client';

import { 
  ShoppingCart, 
  Star, 
  MessageCircle, 
  UserCog, 
  Zap, 
  ShieldCheck, 
  CreditCard,
  Crown 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ShopPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      
      {/* --- HEADER DE LA TIENDA --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Tienda Oficial
          </h1>
          <p className="text-muted-foreground mt-1">
            Mejora tu experiencia y destaca sobre tus rivales.
          </p>
        </div>
        
        {/* Balance Simulado */}
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-full">
            <span className="text-sm text-zinc-400">Tu saldo:</span>
            <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-lg">$0.00</span>
            </div>
            <Button size="sm" variant="secondary" className="h-7 text-xs ml-2">Cargar</Button>
        </div>
      </div>

      {/* --- ITEM DESTACADO (SUSCRIPCIÓN) --- */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl blur opacity-25"></div>
        <Card className="relative border-yellow-500/50 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Badge className="bg-yellow-500 text-black font-bold mb-2 hover:bg-yellow-400">RECOMENDADO</Badge>
                        <CardTitle className="text-3xl text-yellow-400 flex items-center gap-2">
                            <Crown className="w-6 h-6 fill-yellow-400" />
                            Membresía PRO
                        </CardTitle>
                        <CardDescription>Desbloquea todo el potencial de Global GoalGetters.</CardDescription>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-bold text-white">$5.00</span>
                        <span className="text-muted-foreground text-sm">/mes</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">Acceso a torneos VIP</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">Sin anuncios publicitarios</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <ShieldCheck className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">Insignia dorada en perfil</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg h-12">
                    OBTENER PRO AHORA
                </Button>
            </CardFooter>
        </Card>
      </div>

      {/* --- GRID DE PRODUCTOS --- */}
      <h2 className="text-2xl font-bold font-headline mt-8 mb-4 border-b border-white/10 pb-2">Mejoras Disponibles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ITEM 1: CHAT */}
        <Card className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle>Desbloquear Chat</CardTitle>
                <CardDescription>Habilita el chat en vivo contra tus rivales.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="text-sm text-zinc-400 list-disc list-inside space-y-1">
                    <li>Mensajes ilimitados</li>
                    <li>Emojis exclusivos</li>
                    <li>Historial de conversaciones</li>
                </ul>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-xl font-bold text-white">$2.00</span>
                <Button variant="outline">Comprar</Button>
            </CardFooter>
        </Card>

        {/* ITEM 2: AVATAR */}
        <Card className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 group-hover:bg-purple-500/20 transition-colors">
                    <UserCog className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle>Editor de Avatar</CardTitle>
                <CardDescription>Personalización avanzada para tu perfil.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="text-sm text-zinc-400 list-disc list-inside space-y-1">
                    <li>Sube tu propia foto</li>
                    <li>Marcos animados</li>
                    <li>Fondos de perfil personalizados</li>
                </ul>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-xl font-bold text-white">$2.00</span>
                <Button variant="outline">Comprar</Button>
            </CardFooter>
        </Card>

        {/* ITEM 3: ESTADÍSTICAS (Inventado) */}
        <Card className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2 group-hover:bg-emerald-500/20 transition-colors">
                    <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle>Pack de Estadísticas</CardTitle>
                <CardDescription>Datos profundos sobre tus jugadores.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="text-sm text-zinc-400 list-disc list-inside space-y-1">
                    <li>Historial de puntajes</li>
                    <li>Predicciones de la IA</li>
                    <li>Comparativa de rendimiento</li>
                </ul>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-xl font-bold text-white">$3.50</span>
                <Button variant="outline">Comprar</Button>
            </CardFooter>
        </Card>

      </div>
    </div>
  );
}