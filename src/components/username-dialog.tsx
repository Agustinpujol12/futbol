'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // Tu cliente configurado
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'; // Asegúrate de tener lucide-react instalado

export function UsernameDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // 1. DETECTAR SI EL USUARIO NECESITA ID
  useEffect(() => {
    const checkUsername = async () => {
      // Obtenemos sesión actual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Consultamos el perfil de este usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        // Si el perfil existe pero NO tiene username, abrimos el modal
        if (profile && !profile.username) {
          setIsOpen(true);
        }
        // Nota: Si el perfil no existe, probablemente el trigger de creación falló o no existe.
        // En ese caso, el update fallaría. Asumimos que la fila en 'profiles' existe.
      }
    };

    checkUsername();
  }, [supabase]);

  // 2. VALIDAR FORMATO MIENTRAS ESCRIBE
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Regex: Solo letras, números y guión bajo. Max 15 caracteres.
    if (value.length <= 15 && /^[a-zA-Z0-9_]*$/.test(value)) {
      setUsername(value);
      setError(null);
    }
  };

  // 3. GUARDAR Y VERIFICAR DUPLICADOS
  const handleSubmit = async () => {
    setError(null);

    // Validación longitud
    if (username.length < 3) {
      setError("El ID debe tener al menos 3 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // A. VERIFICAR UNICIDAD (¿Existe ya este ID?)
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        // Usamos maybeSingle para que no lance error si no encuentra nada
        .maybeSingle(); 

      if (existingUser) {
        setError("¡Este ID ya está ocupado! Prueba con otro.");
        setLoading(false);
        return;
      }

      // B. GUARDAR EN LA BASE DE DATOS
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: username })
        .eq('id', userId);

      if (updateError) throw updateError;

      // C. ÉXITO
      setIsOpen(false);
      router.refresh(); // Recargamos para que la app sepa que ya tienes ID

    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    // Overlay de fondo (bloquea clicks fuera)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* Tarjeta del Dialog */}
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header Visual */}
        <div className="p-8 text-center bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-primary/50">
             <span className="text-3xl">⚽</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Crea tu Identidad</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Para competir en el ranking global de <strong>GoalGetters</strong>, necesitas un ID de manager único.
          </p>
        </div>

        {/* Formulario */}
        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider ml-1">
              Tu ID de Usuario
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold group-focus-within:text-primary transition-colors">@</span>
              <input
                type="text"
                value={username}
                onChange={handleInputChange}
                placeholder="ej: agustin_pujol"
                className={`w-full bg-black/40 border rounded-lg py-4 pl-10 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-wide ${
                  error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'
                }`}
                autoFocus
              />
              {/* Icono de validación visual */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                 {loading ? <Loader2 className="w-4 h-4 text-zinc-500 animate-spin"/> : 
                  (username.length >= 3 && !error) ? <CheckCircle2 className="w-4 h-4 text-green-500/50" /> : null
                 }
              </div>
            </div>

            {/* Mensajes de error/ayuda */}
            {error ? (
              <div className="flex items-center gap-2 text-red-400 text-xs font-medium animate-pulse bg-red-950/20 p-2 rounded">
                <XCircle size={14} />
                {error}
              </div>
            ) : (
              <p className="text-zinc-600 text-xs ml-1">
                Mínimo 3 caracteres. Solo letras, números y guiones bajos.
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || username.length < 3}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verificando disponibilidad...
              </>
            ) : (
              "Confirmar y Comenzar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}