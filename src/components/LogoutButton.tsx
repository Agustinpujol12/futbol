// src/components/LogoutButton.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react' // Importamos el icono
import { cn } from '@/lib/utils' // Utilidad para juntar clases (shadcn standard)

// 1. Definimos que el componente puede recibir esta prop opcional
interface LogoutButtonProps {
  isDropdownItem?: boolean;
}

export default function LogoutButton({ isDropdownItem = false }: LogoutButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login') // O a '/'
    router.refresh()
  }

  // 2. CASO A: Si está DENTRO del menú desplegable
  // Renderizamos un botón con estilo de texto, alineado a la izquierda y rojo
  if (isDropdownItem) {
    return (
      <button
        onClick={handleLogout}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "text-red-500 focus:text-red-500" // Color rojo para indicar acción de salida
        )}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Cerrar sesión</span>
      </button>
    );
  }

  // 3. CASO B: Si se usa FUERA del menú (como botón suelto)
  // Renderizamos el botón normal que tenías, o una versión con icono
  return (
    <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Cerrar Sesión">
      <LogOut className="h-5 w-5" />
    </Button>
  )
}