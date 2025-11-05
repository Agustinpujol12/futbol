// src/app/(app)/leagues/LeagueJoinCard.tsx
'use client' // ¡Importante! Esto es un Componente Cliente

import { useState } from 'react'
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
import { Trophy, Users } from 'lucide-react' // Usamos un icono genérico

// Definimos el tipo de dato que esperamos de la DB
// (Asegúrate de que coincida con tus columnas de Supabase)
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

    const handleJoin = () => {
        // TODO: Esta es la lógica que conectaremos en el próximo paso
        console.log(`Unirse a la liga: ${league.name} (ID: ${league.id})`)

        toast({
            title: "¡Te has unido a la liga!",
            description: `Bienvenido a la ${league.name}. ¡Mucha suerte!`,
        })
        setIsOpen(false) // Cierra el popup
    }

    return (
        <Card className="flex flex-col text-center hover:border-primary transition-colors">
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-2">
                    {/* Usamos un icono genérico ya que los nombres son dinámicos */}
                    <Trophy className="h-8 w-8 text-amber-400" />
                </div>
                <CardTitle className="font-headline">{league.name}</CardTitle>
                <CardDescription>Costo de Entrada: ${league.entry_fee}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {/* Mostramos los participantes reales de la DB */}
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
                                Esta acción es irreversible.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleJoin}>
                                Confirmar y Pagar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    )
}