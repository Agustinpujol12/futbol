'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Obtenemos la URL base del sitio
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002' // Ajusta el puerto si es necesario

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // ESTO ES CLAVE: Redirigimos al callback, pero le decimos que luego vaya a /reset-password
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] py-10">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-8">
        
        {/* BOTÓN VOLVER */}
        <Link href="/login" className="flex items-center text-xs text-zinc-500 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al login
        </Link>

        {success ? (
          // ESTADO DE ÉXITO
          <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto ring-1 ring-green-500/50">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">¡Correo enviado!</h2>
            <p className="text-zinc-400 text-sm">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>. <br/>
              Revisa tu bandeja de entrada (y spam).
            </p>
          </div>
        ) : (
          // FORMULARIO
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Recuperar Contraseña</h1>
              <p className="text-zinc-400 text-sm">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu acceso.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-black/40 border-white/10 pl-10 text-white placeholder:text-zinc-600 focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}