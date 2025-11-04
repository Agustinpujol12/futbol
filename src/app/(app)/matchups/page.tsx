// app/(app)/matchups/page.tsx

// 3. Forzar renderizado dinámico (Solución a error de Vercel)
export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { user } from "@/lib/data"; // Desactivamos esto temporalmente
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils"; // 4. Importación movida aquí

// 2. Añadido un 'user' de prueba para evitar errores
const user = {
  name: 'Agustín', // Puedes cambiarlo por tu nombre
  avatar: PlaceHolderImages.find(p => p.id === 'player1')?.imageUrl || '',
  avatarHint: 'user avatar'
};

const matchups = [
  {
    opponent: {
      name: 'Casey Jones',
      avatar: PlaceHolderImages.find(p => p.id === 'player2')?.imageUrl || '',
      avatarHint: 'user avatar'
    },
    userScore: 145.7,
    opponentScore: 132.1,
    status: 'In Progress' as const,
  },
  {
    opponent: {
      name: 'Maria Garcia',
      avatar: PlaceHolderImages.find(p => p.id === 'player3')?.imageUrl || '',
      avatarHint: 'user avatar'
    },
    userScore: 180.2,
    opponentScore: 188.9,
    status: 'Final' as const,
  },
  {
    opponent: {
      name: 'Ben Carter',
      avatar: PlaceHolderImages.find(p => p.id === 'player5')?.imageUrl || '',
      avatarHint: 'user avatar'
    },
    userScore: 210.5,
    opponentScore: 150.0,
    status: 'Final' as const,
  },
];

const StatusBadge = ({ status }: { status: 'In Progress' | 'Final' }) => {
  const variant = status === 'In Progress' ? 'default' : 'secondary';
  const className = status === 'In Progress' ? 'bg-green-500/20 text-green-700 border-transparent' : '';
  return <Badge variant={variant} className={cn('font-semibold', className)}>{status}</Badge>;
}

export default function MatchupsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          This Week's Matchups
        </h1>
        <p className="text-muted-foreground">
          Track your head-to-head performance.
        </p>
      </div>

      <div className="grid gap-6">
        {matchups.map((matchup, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-2xl">Matchup {index + 1}</CardTitle>
              <StatusBadge status={matchup.status} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-around text-center">
                {/* User */}
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-20 w-20 border-4 border-primary">
                    <AvatarImage src={user.avatar} data-ai-hint={user.avatarHint} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{user.name} (You)</p>
                  <p className="text-4xl font-bold text-primary">{matchup.userScore.toFixed(1)}</p>
                </div>

                <div className="text-4xl font-light text-muted-foreground">VS</div>

                {/* Opponent */}
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-20 w-20">
                    _**       <AvatarImage src={matchup.opponent.avatar} data-ai-hint={matchup.opponent.avatarHint} />
                    <AvatarFallback>{matchup.opponent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{matchup.opponent.name}</p>
                  {/* 1. ¡AQUÍ ESTÁ LA CORRECCIÓN! */}
                  <p className="text-4xl font-bold text-foreground">{matchup.opponentScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}