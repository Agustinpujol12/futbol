// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // --- INICIO DE LA CORRECCIÓN ---

        // 1. Convertir la función 'get' en 'async'
        async get(name: string) {
          // 2. Usar 'await' al llamar a cookies()
          const cookieStore = await cookies()
          return cookieStore.get(name)?.value
        },

        // 3. Convertir la función 'set' en 'async'
        async set(name: string, value: string, options: CookieOptions) {
          try {
            // 4. Usar 'await' al llamar a cookies()
            const cookieStore = await cookies()
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Manejar el error si es necesario
          }
        },

        // 5. Convertir la función 'remove' en 'async'
        async remove(name: string, options: CookieOptions) {
          try {
            // 6. Usar 'await' al llamar a cookies()
            const cookieStore = await cookies()
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Manejar el error si es necesario
          }
        },
        // --- FIN DE LA CORRECCIÓN ---
      },
    }
  )
}