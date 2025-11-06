// src/app/(app)/leagues/LeagueJoinCard.tsx
'use client'

// 1. Importamos 'useTransition' (para el estado de "cargando")
import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Trophy, Users } from 'lucide-react'

// 2. Importamos nuestra nueva "Acción de Servidor"
import { joinLeagueAction } from './actions'

// (El tipo 'League' que definimos antes)
type League = {
    id: string;
    name: string;
    entry_fee: number;
    max_participants: number;
    participant_count: number;
}

export default function LeagueJoinCard({ league }: { league: League }) {
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()

    // 3. Usamos 'useTransition'
    const [isPending, startTransition] = useTransition()

    const handleJoin = async () => {
        // 3.1 Usamos startTransition para el estado de 'cargando'
        startTransition(async () => {
            // 3.2 ¡Llamamos a la Acción de Servidor!
            const result = await joinLeagueAction(league.id)

            // 3.3 Manejamos la respuesta de la acción
            if (result?.error) {
                toast({
                    title: "Error al unirse",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "¡Te has unido a la liga!",
                    description: `Bienvenido a la ${league.name}. ¡Mucha suerte!`,
                })
                setIsOpen(false) // Cierra el popup
            }
        })
    }

    return (
        <Card className="flex flex-col text-center hover:border-primary transition-colors">
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-2">
                    <Trophy className="h-8 w-8 text-amber-400" />
                </div>
                <CardTitle className="font-headline">{league.name}</CardTitle>
                <CardDescription>Costo de Entrada: ${league.entry_fee}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex items-center justify-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{league.participant_count}</span>
                    <span className="text-muted-foreground">/ {league.max_participants} Jugadores</span>
                </div>
            </CardContent>
            <CardFooter>
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <Button className="w-full" onClick={() => setIsOpen(true)}>Unirme a la Liga</Button>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline">Confirmar Entrada</AlertDialogTitle>
                            <AlertDialogDescription>
                                ¿Seguro que quieres unirte a la {league.name} por ${league.entry_fee}?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            {/* 3.4 Actualizamos el botón de acción */}
                            <AlertDialogAction onClick={handleJoin} disabled={isPending}>
                                {isPending ? "Uniéndote..." : "Confirmar y Pagar"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    )
}