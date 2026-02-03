'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleDollarSign, Loader2, CheckCircle2, User, Lock, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ✅ AGREGAMOS LA PROPIEDAD "premium: true" A LA HORMIGA
const AVATARS = [
  { id: 'tiburon', src: '/avatars/tiburon.jpg', label: 'Tiburón', premium: false },
  { id: 'cocodrilo', src: '/avatars/cocodrilo.jpg', label: 'Cocodrilo', premium: false },
  { id: 'mono', src: '/avatars/mono.jpg', label: 'Mono', premium: false },
  { id: 'chancho', src: '/avatars/chancho.jpg', label: 'Chancho', premium: false },
  { id: 'gato', src: '/avatars/gato.jpg', label: 'Gato', premium: false },
  { id: 'perro', src: '/avatars/perro.jpg', label: 'Perro', premium: false },
  { id: 'hormiga', src: '/avatars/hormiga.jpg', label: 'Hormiga', premium: true }, // 🔒 EXCLUSIVO
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Datos del usuario
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  // ✅ Nuevo estado para saber el plan
  const [userPlan, setUserPlan] = useState<string>('free'); 

  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  // 1. CARGAR DATOS AL INICIO
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        setEmail(user.email || '');
        
        // ✅ Pedimos también el 'plan_type'
        const { data } = await supabase
          .from('profiles')
          .select('username, avatar_url, plan_type')
          .eq('id', user.id)
          .single();

        if (data) {
          setUsername(data.username || '');
          setSelectedAvatar(data.avatar_url || null);
          setUserPlan(data.plan_type || 'free'); // Guardamos el plan
        }
      }
      setLoading(false);
    };

    getProfile();
  }, []);

  // 2. GUARDAR CAMBIOS
  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        avatar_url: selectedAvatar,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    setSaving(false);

    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar el perfil.", variant: "destructive" });
    } else {
      toast({ title: "¡Perfil actualizado!", description: "Tus cambios se han guardado correctamente." });
      router.refresh(); 
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Mi Perfil
        </h1>
        <p className="text-muted-foreground">
          Mira tus estadísticas y personaliza tu apariencia.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* --- COLUMNA IZQUIERDA: INFORMACIÓN ACTUAL --- */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Tu Información</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="w-56 h-56 mb-6 border-[6px] border-primary shadow-xl transition-all hover:scale-105">
                 <AvatarImage src={selectedAvatar || ''} className="object-cover" />
                 <AvatarFallback className="text-6xl font-headline">{username ? username[0].toUpperCase() : <User className="w-20 h-20" />}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-3xl font-bold font-headline mb-1">{username || 'Sin Nombre'}</h2>
              
              {/* Badge de Plan debajo del nombre */}
              <div className="mb-2">
                 {userPlan === 'premium' ? (
                   <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 w-fit mx-auto">
                     <Crown className="w-3 h-3" /> Premium
                   </span>
                 ) : (
                   <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">
                     Plan Gratuito
                   </span>
                 )}
              </div>

              <p className="text-muted-foreground text-lg">{email}</p>
              
              <div className="mt-6 flex items-center gap-2 text-xl font-semibold text-accent p-3 bg-accent/10 rounded-xl w-full justify-center">
                <CircleDollarSign className="h-7 w-7" />
                <span>100,000 G-Coins</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- COLUMNA DERECHA: PERSONALIZACIÓN --- */}
        <div className="lg:col-span-2">
          <Card className="h-full">
             <CardHeader>
              <CardTitle className="font-headline">Personalizar Perfil</CardTitle>
              <CardDescription>Elige un avatar y cambia tu nombre de usuario.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Input Nombre */}
              <div className="space-y-3">
                <Label htmlFor="username" className="text-base">Nombre de Usuario</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tu nombre de manager" 
                  className="text-lg p-6"
                />
              </div>

              {/* Grid de Avatares */}
              <div className="space-y-4">
                <Label className="text-base">Elige tu Avatar</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {AVATARS.map((avatar) => {
                    const isSelected = selectedAvatar === avatar.src;
                    
                    // 🔒 LÓGICA DE BLOQUEO
                    // Está bloqueado SI el avatar es premium Y el usuario NO es premium
                    const isLocked = avatar.premium && userPlan !== 'premium';

                    return (
                      <div 
                        key={avatar.id}
                        onClick={() => {
                            // Solo permite seleccionar si NO está bloqueado
                            if (!isLocked) setSelectedAvatar(avatar.src)
                        }}
                        className={`
                          relative rounded-2xl p-4 border-2 transition-all flex flex-col items-center gap-3 group
                          ${isLocked 
                             ? 'cursor-not-allowed opacity-60 bg-zinc-900/50 border-zinc-800 grayscale' // Estilo Bloqueado
                             : 'cursor-pointer hover:bg-muted hover:border-muted-foreground/20 hover:shadow-md' // Estilo Disponible
                          }
                          ${isSelected 
                            ? '!border-primary !bg-primary/10 !shadow-[0_0_20px_rgba(var(--primary),0.3)] !scale-105 !opacity-100 !grayscale-0' 
                            : ''}
                        `}
                      >
                        {/* Ícono de Candado o Corona */}
                        {isLocked && (
                            <div className="absolute top-2 right-2 z-20 bg-black/60 p-1.5 rounded-full backdrop-blur-sm border border-white/10">
                                <Lock className="w-4 h-4 text-white/80" />
                            </div>
                        )}
                        {!isLocked && avatar.premium && (
                            <div className="absolute top-2 right-2 z-20 bg-yellow-500/20 p-1 rounded-full border border-yellow-500/50" title="Exclusivo Premium">
                                <Crown className="w-3 h-3 text-yellow-500" />
                            </div>
                        )}

                        {/* Avatar */}
                        <Avatar className={`w-28 h-28 transition-transform shadow-sm ${isSelected ? 'scale-110 shadow-md' : isLocked ? 'scale-95' : 'group-hover:scale-105'}`}>
                          <AvatarImage src={avatar.src} className="object-cover" />
                          <AvatarFallback className="text-2xl">{avatar.label[0]}</AvatarFallback>
                        </Avatar>
                        
                        <span className={`text-base font-bold ${isSelected ? 'text-primary' : isLocked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                          {avatar.label}
                        </span>

                        {/* Check de seleccionado */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-primary bg-background rounded-full p-1 shadow-sm z-30">
                            <CheckCircle2 className="w-6 h-6 fill-current" />
                          </div>
                        )}
                        
                        {/* Texto Premium Bloqueado */}
                        {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                {/* Capa invisible para atrapar clicks si quieres */}
                            </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="flex justify-end pt-6">
                <Button onClick={handleSave} disabled={saving} size="lg" className="w-full sm:w-auto text-lg px-8 font-bold">
                  {saving && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Guardar Cambios
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}