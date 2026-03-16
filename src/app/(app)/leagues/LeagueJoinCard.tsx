'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Swords, Users, AlertCircle, CreditCard, Loader2, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { createLeaguePreference } from '@/app/actions/mercadopago'

type League = {
  id: string
  name: string
  entry_fee: number
  max_participants: number
  participant_count: number
}

// 👇 Agregamos isAlreadyInLeague a las props
export default function LeagueJoinCard({ activeLeague, isAlreadyInLeague = false }: { activeLeague: League, isAlreadyInLeague?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleJoin = async () => {
    startTransition(async () => {
      try {
        const paymentUrl = await createLeaguePreference(
          activeLeague.id, 
          activeLeague.name, 
          activeLeague.entry_fee
        )

        if (paymentUrl) {
          window.location.href = paymentUrl
        } else {
          throw new Error("No se pudo generar el link de pago.")
        }
      } catch (error: any) {
        toast({
          title: "Error al iniciar pago",
          description: error.message || "Hubo un problema con Mercado Pago.",
          variant: "destructive",
        })
        setIsOpen(false)
      }
    })
  }

  const fillPercentage = (activeLeague.participant_count / activeLeague.max_participants) * 100

  return (
    <Card className="bg-card border-primary/50 shadow-[0_0_15px_rgba(2,132,199,0.2)] flex flex-col overflow-hidden relative transform transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(2,132,199,0.3)]">
      <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>
      <div className="absolute top-3 right-3">
         <span className="flex h-3 w-3">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
         </span>
      </div>
      
      <CardHeader className="bg-primary/5 pb-4 pt-6 border-b border-primary/10 text-center">
        <Swords className="h-10 w-10 text-primary mx-auto mb-2" />
        <h3 className="font-bold text-foreground font-headline text-lg">{activeLeague.name}</h3>
        <Badge variant="outline" className="w-fit mx-auto mt-2 border-primary text-primary bg-primary/10">
          ${activeLeague.entry_fee} USD
        </Badge>
      </CardHeader>
      
      <CardContent className="py-6 flex flex-col items-center flex-grow">
        <div className="flex items-center gap-2 text-foreground mb-2">
          <Users className="h-6 w-6 text-primary" />
          <span className="text-3xl font-black">{activeLeague.participant_count}<span className="text-xl text-muted-foreground font-medium">/{activeLeague.max_participants}</span></span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 mt-4 overflow-hidden">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-1000" 
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Esperando jugadores...</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 w-full">
        {/* 👇 ACÁ SE DEFINE QUÉ BOTÓN SE MUESTRA */}
        {isAlreadyInLeague ? (
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-12 text-base font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors">
              Ir a mi Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                Entrar a la Sala
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-border bg-card">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  Asegurá tu lugar
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground pt-2">
                  Estás a punto de inscribirte en <strong>{activeLeague.name}</strong>. Para ingresar y participar por el pozo de premios, debés abonar tu Pase Estándar.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex items-center justify-center py-6">
                <div className="text-center bg-muted/30 p-6 rounded-xl border border-border w-full">
                  <p className="text-sm font-bold text-muted-foreground uppercase mb-2">Costo de Inscripción</p>
                  <p className="text-5xl font-black text-foreground">${activeLeague.entry_fee} <span className="text-xl text-muted-foreground">USD</span></p>
                </div>
              </div>
              
              <DialogFooter className="sm:justify-center w-full">
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleJoin();
                  }} 
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 text-lg transition-colors"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Redirigiendo a Mercado Pago...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pagar y Entrar a la Liga
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}