'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      alert("Error: " + error.message)
      setLoading(false)
    } else {
      alert("¡Contraseña actualizada correctamente!")
      router.push('/dashboard') // O '/login'
      router.refresh()
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] py-10">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-8">
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Nueva Contraseña</h1>
          <p className="text-zinc-400 text-sm">
            Ingresa tu nueva contraseña para asegurar tu cuenta.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Nueva Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                className="bg-black/40 border-white/10 pl-10 text-white placeholder:text-zinc-600 focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </Button>
        </form>
      </div>
    </div>
  )
}