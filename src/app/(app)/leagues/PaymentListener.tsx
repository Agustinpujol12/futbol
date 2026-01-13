'use client'

import { useEffect, useRef } from 'react' // 👈 Importamos useRef
import { useSearchParams, useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle } from 'lucide-react'
// 👇 Importamos la nueva acción
import { registerLeagueParticipant } from '@/app/actions/register-participant'

export default function PaymentListener() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // Evitamos que se ejecute 2 veces (React a veces hace doble efecto)
  const processedRef = useRef(false)

  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const leagueId = searchParams.get('leagueId') // 👈 Recuperamos el ID de la URL

    if (processedRef.current) return; // Si ya lo procesamos, no hacemos nada

    if (paymentStatus === 'success' && leagueId) {
      processedRef.current = true; // Marcamos como procesado

      // 🚀 LLAMADA A LA BASE DE DATOS
      registerLeagueParticipant(leagueId)
        .then(() => {
          toast({
            title: "¡Inscripción Confirmada!",
            description: "Ya estás dentro de la liga. ¡Mucha suerte!",
            variant: "default",
            className: "bg-green-600 text-white border-none",
            action: <CheckCircle2 className="h-6 w-6 text-white" />
          })
          // Limpiamos la URL
          router.replace('/leagues')
        })
        .catch(() => {
           toast({ title: "Error", description: "Hubo un error al guardar tu inscripción.", variant: "destructive" })
        })
    } 
    else if (paymentStatus === 'failure') {
      processedRef.current = true;
      toast({
        title: "Pago rechazado",
        description: "No se pudo completar la operación.",
        variant: "destructive",
        action: <XCircle className="h-6 w-6" />
      })
      router.replace('/leagues')
    }
  }, [searchParams, toast, router])

  return null
}