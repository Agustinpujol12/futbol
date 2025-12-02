// src/app/(app)/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleDollarSign, Loader2, CheckCircle2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Tus avatares disponibles (puedes agregar más aquí)
const AVATARS = [
  { id: 'tiburon', src: '/avatars/tiburon.jpg', label: 'Tiburón' },
  { id: 'cocodrilo', src: '/avatars/cocodrilo.jpg', label: 'Cocodrilo' },
  { id: 'mono', src: '/avatars/mono.jpg', label: 'Mono' },
  { id: 'chancho', src: '/avatars/chancho.jpg', label: 'Chancho' },
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Datos del usuario
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

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
        
        const { data } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (data) {
          setUsername(data.username || '');
          setSelectedAvatar(data.avatar_url || null);
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
              {/* ⬇️ CAMBIO AQUÍ: Avatar principal mucho más grande 
                  Antes: w-32 h-32 border-4
                  Ahora: w-56 h-56 border-[6px] y sombra
              */}
              <Avatar className="w-56 h-56 mb-6 border-[6px] border-primary shadow-xl transition-all hover:scale-105">
                 <AvatarImage src={selectedAvatar || ''} className="object-cover" />
                 <AvatarFallback className="text-6xl font-headline">{username ? username[0].toUpperCase() : <User className="w-20 h-20" />}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-3xl font-bold font-headline mb-1">{username || 'Sin Nombre'}</h2>
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
                    return (
                      <div 
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.src)}
                        className={`
                          cursor-pointer relative rounded-2xl p-4 border-2 transition-all
                          flex flex-col items-center gap-3 group
                          ${isSelected 
                            ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-105' 
                            : 'border-transparent hover:bg-muted hover:border-muted-foreground/20 hover:shadow-md'}
                        `}
                      >
                        {/* ⬇️ CAMBIO AQUÍ: Avatares de la grilla más grandes
                            Antes: w-20 h-20
                            Ahora: w-28 h-28
                        */}
                        <Avatar className={`w-28 h-28 transition-transform shadow-sm ${isSelected ? 'scale-110 shadow-md' : 'group-hover:scale-105'}`}>
                          <AvatarImage src={avatar.src} className="object-cover" />
                          <AvatarFallback className="text-2xl">{avatar.label[0]}</AvatarFallback>
                        </Avatar>
                        <span className={`text-base font-bold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                          {avatar.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-primary bg-background rounded-full p-1 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 fill-current" />
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