// src/app/(app)/leagues/page.tsx
import { createClient } from '@/lib/supabase/server'
import LeagueJoinCard from './LeagueJoinCard'
// 👇 1. IMPORTAMOS EL LISTENER
import PaymentListener from './PaymentListener' 

export const dynamic = 'force-dynamic'

export default async function LeaguesPage() {
  const supabase = createClient()

  const { data: leagues, error } = await supabase
    .from('leagues')
    .select('*')
    .order('entry_fee', { ascending: true })

  if (error) {
    return (
      <p className="container mx-auto py-8">
        Error al cargar las ligas: {error.message}
      </p>
    )
  }

  return (
    <div className="container mx-auto">
      {/* 👇 2. LO COLOCAMOS AQUÍ ARRIBA (Es invisible pero vigila la URL) */}
      <PaymentListener />

      <div className="mb-8 text-center mt-8">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Elige tu Liga
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          Elige tu nivel de competición. A mayor riesgo, mayor recompensa.
        </p>
      </div>

      {(!leagues || leagues.length === 0) ? (
        <p className="text-center text-muted-foreground">
          No hay ligas disponibles en este momento. ¡Vuelve pronto!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leagues.map((league) => (
            <LeagueJoinCard key={league.id} league={league} />
          ))}
        </div>
      )}
    </div>
  )
}