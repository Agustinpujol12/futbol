// src/app/(app)/dashboard/WelcomeForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client' // Cliente del NAVEGADOR

// Asumo que tienes estos componentes de shadcn/ui
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Aceptamos el userId que nos pasó la página (Componente de Servidor)
export default function WelcomeForm({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  
  // Estados para manejar el formulario
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Evita que la página se recargue
    setIsLoading(true)
    setError(null)

    if (!username || username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres.')
      setIsLoading(false)
      return
    }

    try {
      // 1. Esta es la consulta clave: ACTUALIZAR (UPDATE)
      const { error } = await supabase
        .from('profiles')
        .update({ username: username }) // Actualiza la columna 'username'
        .eq('id', userId) // Donde el 'id' coincida con el del usuario logueado

      if (error) {
        // Manejo de error (ej. si el username ya está tomado, si activaste "Is Unique")
        setError(`Error: ${error.message}`)
        console.error(error)
      } else {
        // 2. ¡Éxito! Refrescamos la página
        // router.refresh() le dice a Next.js "vuelve a cargar el componente de servidor"
        // (la página /dashboard).
        // La página se recargará, verá que 'username' ya no es NULL, y mostrará el dashboard real.
        router.refresh()
      }
    } catch (e) {
      setError('Ocurrió un error inesperado.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nombre de Usuario</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ej: tu_apodo_gamer"
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Guardando...' : 'Guardar y Continuar'}
      </Button>
    </form>
  )
}