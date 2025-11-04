// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server' // <-- CAMBIO IMPORTANTE
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient() // Usa el cliente del servidor
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redirige de vuelta al login si hay un error
  return NextResponse.redirect(`${origin}/login?error=true`)
}