// src/components/countdown.tsx
'use client'

import { useState, useEffect } from 'react'

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Fecha límite: 10 de Junio de 2026 a las 00:00
    const targetDate = new Date('2026-06-10T00:00:00').getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        setTimeLeft({ days, hours })
      }
    }

    updateTimer() // Ejecutamos la primera vez
    const interval = setInterval(updateTimer, 60000) // Actualiza cada 1 minuto

    return () => clearInterval(interval)
  }, [])

  // Evitamos errores de hidratación de Next.js
  if (!isMounted) return null

  return (
    <div className="flex gap-4 mt-4 md:mt-0">
      <div className="flex flex-col items-center bg-muted/50 px-4 py-2 rounded-lg border border-border">
        <span className="text-3xl font-black text-foreground">{timeLeft.days}</span>
        <span className="text-xs text-muted-foreground uppercase font-bold">Días</span>
      </div>
      <div className="flex flex-col items-center bg-muted/50 px-4 py-2 rounded-lg border border-border">
        <span className="text-3xl font-black text-foreground">{timeLeft.hours}</span>
        <span className="text-xs text-muted-foreground uppercase font-bold">Hs</span>
      </div>
    </div>
  )
}