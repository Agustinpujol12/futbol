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
import { Trophy, Users, Coins, CreditCard, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

// 👇 IMPORTANTE: Importamos la acción de Mercado Pago que creamos antes
// Asegúrate de haber creado el archivo src/app/actions/mercadopago.ts
import { createLeaguePreference } from '@/app/actions/mercadopago'

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
      try {
        // 1. Llamamos a la Server Action para generar el link de pago
        // Le pasamos el ID, Nombre y el Precio de la liga
        const paymentUrl = await createLeaguePreference(
          league.id, 
          league.name, 
          league.entry_fee
        )

        if (paymentUrl) {
          // 2. Si MP nos devuelve el link, redirigimos al usuario allá
          window.location.href = paymentUrl
        } else {
          throw new Error("No se pudo generar el link de pago.")
        }

      } catch (error: any) {
        // 3. Manejo de errores (ej: usuario no logueado o error de MP)
        toast({
          title: "Error al iniciar pago",
          description: error.message || "Hubo un problema con Mercado Pago.",
          variant: "destructive",
        })
        setIsOpen(false)
      }
    })
  }

  const isFull = league.participant_count >= league.max_participants
  const potentialPrize = league.entry_fee * league.max_participants

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

        {/* PRECIO */}
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center gap-2 text-4xl font-extrabold text-primary tracking-tight">
            <Coins className="h-7 w-7 text-amber-500" />
            <span>${league.entry_fee}</span>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Costo de inscripción
          </CardDescription>
        </div>

        {/* INFO */}
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
              Premios Garantizados: ${potentialPrize.toLocaleString('es-AR')}
            </span>
          </div>
        </CardContent>

        {/* FOOTER Y CONFIRMACIÓN */}
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
                  Confirmar Inscripción
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Estás a un paso de unirte a <b>{league.name}</b>.
                  <br /><br />
                  Serás redirigido a <b>Mercado Pago</b> para abonar la inscripción de <b>${league.entry_fee} ARS</b> de forma segura.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                {/* Botón de Acción Principal */}
                <AlertDialogAction 
                  onClick={(e) => {
                    e.preventDefault(); // Prevenimos cierre automático para mostrar loading
                    handleJoin();
                  }} 
                  disabled={isPending} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPending ? (
                     <>
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       Redirigiendo...
                     </>
                  ) : (
                     <>
                       <CreditCard className="w-4 h-4 mr-2" />
                       Pagar con Mercado Pago
                     </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  )
}