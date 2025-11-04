// src/app/login/login-form.tsx
'use client' // ¡Muy importante!

import { createClient } from '@/lib/supabase/client' // <-- CAMBIO IMPORTANTE
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient() // Usa el cliente del navegador

  // Función para obtener la URL de callback
  const getCallbackURL = () => {
    // Lee tu variable de entorno
    let url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'
    
    // Asegúrate de que termine con /
    url = url.endsWith('/') ? url : `${url}/`
    
    // Devuelve la URL completa de callback
    return `${url}auth/callback`
  }

  // --- LOGIN CON GOOGLE ---
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getCallbackURL(), // Redirige al callback
      },
    })
  }

  // --- REGISTRO CON EMAIL ---
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getCallbackURL(), // Envía el link de confirmación
      },
    })
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Error signing in:', error.message)
      alert(error.message)
    } else {
      // Éxito, redirige al dashboard (o a donde quieras)
      router.push('/dashboard') 
      router.refresh() // Refresca para que el Header se actualice
    }
  }

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Botón de Google */}
      <Button onClick={handleGoogleLogin} className="w-full">
        Iniciar sesión con Google
      </Button>

      <p className="text-center">o</p>

      {/* Formulario de Email/Contraseña */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="flex gap-4">
        <Button onClick={handleSignIn} className="w-full">
          Iniciar Sesión
        </Button>
        <Button onClick={handleSignUp} variant="outline" className="w-full">
          Registrarse
        </Button>
      </div>
    </div>
  )
}