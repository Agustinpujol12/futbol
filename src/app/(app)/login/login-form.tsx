// src/app/login/login-form.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' // Para el link de contraseña

export default function LoginForm() {
  const [view, setView] = useState<'login' | 'register'>('login') // Controla las pestañas
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('') // Nuevo estado para el ID
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  // Función para obtener la URL de callback
  const getCallbackURL = () => {
    let url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'
    url = url.endsWith('/') ? url : `${url}/`
    return `${url}auth/callback`
  }

  // --- LOGIN CON GOOGLE ---
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getCallbackURL(),
      },
    })
  }

  // --- REGISTRO CON EMAIL ---
  const handleSignUp = async () => {
    // Validación básica del username
    if (view === 'register' && username.length < 3) {
      alert('El ID de usuario debe tener al menos 3 caracteres.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getCallbackURL(),
        // Guardamos el username en la metadata del usuario
        data: {
          username: username, 
        }
      },
    })
    setLoading(false)

    if (error) {
      console.error('Error signing up:', error.message)
      alert(error.message)
    } else {
      alert('¡Registro exitoso! Revisa tu email para verificar tu cuenta.')
      router.refresh()
    }
  }

  // --- INICIO DE SESIÓN CON EMAIL ---
  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      console.error('Error signing in:', error.message)
      alert('Error al iniciar sesión: ' + error.message)
    } else {
      router.push('/dashboard') 
      router.refresh()
    }
  }

  // Icono oficial de Google
  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
      
      {/* HEADER CON PESTAÑAS */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setView('login')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
            view === 'login' 
              ? 'bg-zinc-800 text-white border-b-2 border-primary' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setView('register')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
            view === 'register' 
              ? 'bg-zinc-800 text-white border-b-2 border-primary' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
          }`}
        >
          Crear Cuenta
        </button>
      </div>

      <div className="p-8 space-y-6">
        
        {/* TÍTULO DINÁMICO */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {view === 'login' ? 'Bienvenido de nuevo' : 'Únete al juego'}
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {view === 'login' 
              ? 'Ingresa tus credenciales para continuar' 
              : 'Comienza tu carrera como manager hoy mismo'}
          </p>
        </div>

        {/* BOTÓN GOOGLE (Común para ambos) */}
        <Button 
          onClick={handleGoogleLogin} 
          variant="outline" 
          className="w-full bg-white text-zinc-800 hover:bg-zinc-100 border-0 h-12 font-semibold"
        >
          <GoogleIcon />
          Continuar con Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-500">O con email</span>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="space-y-4">
          
          {/* CAMPO DE ID (Solo visible en Registro) */}
          {view === 'register' && (
             <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
             <Label htmlFor="username" className="text-white">ID de Usuario (Handle)</Label>
             <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
               <Input
                 id="username"
                 type="text"
                 placeholder="ej: agustin_pujol"
                 className="bg-black/40 border-white/10 pl-8 text-white placeholder:text-zinc-600 focus:border-primary"
                 value={username}
                 onChange={(e) => {
                   // Solo permite letras, numeros y guion bajo
                   const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                   setUsername(val)
                 }}
               />
             </div>
             <p className="text-[10px] text-zinc-500">Será tu identidad única en el juego.</p>
           </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

<div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-white">Contraseña</Label>
              {view === 'login' && (
                // ✅ CAMBIO AQUÍ: Apunta a la ruta real
                <Link href="/login/forgot-password" className="text-xs text-primary hover:text-primary/80 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        
        {/* BOTÓN DE ACCIÓN */}
        <Button 
          onClick={view === 'login' ? handleSignIn : handleSignUp} 
          className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={loading}
        >
          {loading ? 'Procesando...' : (view === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
        </Button>

      </div>
      
      {/* FOOTER DE LA TARJETA */}
      <div className="p-4 bg-black/20 text-center text-xs text-zinc-500 border-t border-white/5">
        Global GoalGetters &copy; 2026. Todos los derechos reservados.
      </div>
    </div>
  )
}