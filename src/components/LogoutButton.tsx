// src/components/LogoutButton.tsx
'use client'

import { createClient } from '@/lib/supabase/client' // <-- CAMBIO IMPORTANTE
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient() // Usa el cliente del navegador

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/') // Redirige al inicio
    router.refresh() // Refresca la página para que el Header se actualice
  }

  return <Button variant="secondary" onClick={handleLogout}>Cerrar Sesión</Button>
}