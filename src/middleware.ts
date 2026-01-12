// src/middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Aquí es donde updateSession podría estar redirigiendo si detecta usuario.
  // Pero primero, asegurémonos que el matcher lo permita.
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Excluir reset-password para que no sea interceptado por reglas de redirección automática
     */
    // ⚠️ AGREGA |reset-password|login/forgot-password AQUÍ ⚠️
    '/((?!_next/static|_next/image|favicon.ico|login|auth/callback|reset-password|login/forgot-password|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}