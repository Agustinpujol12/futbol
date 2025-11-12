'use client'

import { useState, useTransition } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Trophy, Users, Coins } from 'lucide-react'
import { joinLeagueAction } from './actions'
import { motion } from 'framer-motion'

type League = {
  id: string
  name: string
  entry_fee: number
  max_participants: number
  participant_count: number
}

export default function LeagueJoinCard({ league }: { league: League }) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleJoin = async () => {
    startTransition(async () => {
      const result = await joinLeagueAction(league.id)
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
        setIsOpen(false)
      }
    })
  }

  const isFull = league.participant_count >= league.max_participants

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card
        className={`
          flex flex-col items-center text-center
          border border-muted shadow-md transition-all
          hover:shadow-xl hover:border-primary/40
          rounded-2xl bg-gradient-to-b from-background to-muted/40
        `}
      >
        {/* HEADER */}
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="p-4 bg-primary/15 rounded-full mb-3 shadow-inner">
            <Trophy className="h-10 w-10 text-amber-400" />
          </div>
          <CardTitle className="font-headline text-xl tracking-tight">
            {league.name}
          </CardTitle>
        </CardHeader>

        {/* PRICE */}
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center gap-2 text-4xl font-extrabold text-primary tracking-tight">
            <Coins className="h-7 w-7 text-amber-500" />
            <span>${league.entry_fee}</span>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Costo de inscripción
          </CardDescription>
        </div>

        {/* CONTENT */}
        <CardContent className="flex flex-col gap-3 items-center text-sm py-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">
              {league.participant_count} / {league.max_participants}
            </span>
            <span className="text-muted-foreground">jugadores</span>
          </div>

          <div className="flex items-center gap-2 text-amber-500">
            <Coins className="h-5 w-5" />
            <span className="font-semibold">
              Pozo total: ${league.entry_fee * league.max_participants}
            </span>
          </div>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="w-full">
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <Button
              className="w-full font-medium"
              variant={isFull ? "secondary" : "default"}
              onClick={() => !isFull && setIsOpen(true)}
              disabled={isFull}
            >
              {isFull ? "Liga completa" : "Unirme a la Liga"}
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-headline">
                  Confirmar Entrada
                </AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Deseas unirte a <b>{league.name}</b> pagando ${league.entry_fee}?  
                  Tu cupo será reservado inmediatamente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleJoin} disabled={isPending}>
                  {isPending ? "Uniéndote..." : "Confirmar y Pagar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
