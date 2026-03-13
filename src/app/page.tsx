'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, BarChart, BrainCircuit, Gem } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- UTILIDAD PARA LAS BANDERAS (Con tipado TS) ---
const getFlagUrl = (code: string) => {
    if (code === 'fifa') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_FIFA.svg/64px-Flag_of_FIFA.svg.png';
    if (code === 'gb-eng') return 'https://flagcdn.com/w80/gb-eng.png';
    if (code === 'gb-sct') return 'https://flagcdn.com/w80/gb-sct.png';
    if (code === 'gb-wls') return 'https://flagcdn.com/w80/gb-wls.png';
    return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
};

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Armá tu 11 Ideal', 
    description: 'Cada día habrá un sorteo de jugadores donde deberás elegir los mejores 8 para tu alineación.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Puntuación en Tiempo Real',
    description: 'Observá cómo tu equipo acumula puntos con estadísticas en vivo de cada partido.', 
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'Jugabilidad Estratégica',
    description: 'Usá tarjetas de estrategia en el momento justo para sacarle ventaja a tus rivales.',
  },
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    title: 'Marcá tu Estilo',
    description: 'Divertite personalizando tu avatar y comunicándote con tu oponente por medio del chat cada fecha.', 
  },
];

// --- DATOS FIJOS DEL BANNER ---
const bannerConfig = {
  title: 'Ya llega el Mundial 2026',
  flagsLeft: [
    { name: 'Canadá', code: 'ca', rotate: 'rotate-[-5deg]' },
    { name: 'Estados Unidos', code: 'us', rotate: 'rotate-[5deg]' },
    { name: 'México', code: 'mx', rotate: 'rotate-[-10deg]' },
  ],
  flagsRight: [
    { name: 'México', code: 'mx', rotate: 'rotate-[10deg]' },
    { name: 'Estados Unidos', code: 'us', rotate: 'rotate-[5deg]' },
    { name: 'Canadá', code: 'ca', rotate: 'rotate-[-5deg]' },
  ],
};

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  // --- LÓGICA DEL CONTADOR ---
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    setMounted(true); // Para evitar errores de hidratación en Next.js
    
    // Fecha de inicio del Mundial (11 de Junio de 2026 a las 16:00 hs aprox)
    const targetDate = new Date('2026-06-11T16:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        // Cálculos matemáticos y formateo para que siempre tengan 2 dígitos (ej: 09 en vez de 9)
        const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Si ya llegó la fecha, queda todo en cero
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    };

    // Actualizamos apenas carga
    updateTimer();
    // Creamos el intervalo para que se ejecute cada segundo (1000 ms)
    const timerInterval = setInterval(updateTimer, 1000);

    // Limpiamos el intervalo si el componente se desmonta
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <>
      <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight">
            Viví el Mundial de una Manera Distinta
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-200">
            Sumate a la mejor experiencia de fantasy football. Competí en nuestras ligas, llevá tu equipo a la victoria y ganá premios.
          </p>
<div className="mt-8">
    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
      <Link href="/como-jugar">¿Cómo jugar?</Link>
    </Button>
  </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
              La nueva forma de vivir el fantasy
            </h3>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Hemos llenado el juego de funciones para que tu experiencia fantasy sea más atractiva y divertida.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-xl font-headline font-semibold text-foreground">{feature.title}</h4>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* --- BANNER VERDE ESTILO IMAGEN (Abajo de los features) --- */}
          <div className="mt-12 relative w-full rounded-xl overflow-hidden shadow-lg border border-green-800 bg-gradient-to-r from-green-800 via-green-600 to-green-800 h-28 flex items-center justify-between px-2 sm:px-8">
            
            {/* Banderas Izquierda */}
            <div className="flex items-end gap-1 sm:gap-4 h-full pt-2">
              {bannerConfig.flagsLeft.map((flag, idx) => (
                <div key={idx} className={`relative w-16 sm:w-28 h-10 sm:h-16 shadow-sm ${flag.rotate} origin-bottom-left transition-transform hover:scale-110 z-10`}>
                  <img 
                    src={getFlagUrl(flag.code)} 
                    alt={flag.name} 
                    className="w-full h-full object-cover border border-white/20" 
                  />
                  <div className="absolute top-0 -left-[2px] w-[3px] h-32 bg-gray-300 -z-10 origin-top"></div>
                </div>
              ))}
            </div>

            {/* Centro: Texto y Reloj Dinámico */}
            <div className="flex flex-col items-center justify-center z-20 mx-2">
              <h4 className="text-white font-headline font-bold text-sm sm:text-2xl drop-shadow-md mb-2 text-center tracking-wide">
                {bannerConfig.title}
              </h4>
              <div className="flex items-center gap-1 sm:gap-2 text-white font-mono font-bold text-lg sm:text-3xl drop-shadow-md">
                <div className="bg-[#0f172a]/80 px-2 sm:px-4 py-1.5 rounded-md shadow-inner w-12 sm:w-16 text-center">
                  {mounted ? timeLeft.days : '00'}
                </div>
                <span className="text-green-300/80">:</span>
                <div className="bg-[#0f172a]/80 px-2 sm:px-4 py-1.5 rounded-md shadow-inner w-12 sm:w-16 text-center">
                  {mounted ? timeLeft.hours : '00'}
                </div>
                <span className="text-green-300/80">:</span>
                <div className="bg-[#0f172a]/80 px-2 sm:px-4 py-1.5 rounded-md shadow-inner w-12 sm:w-16 text-center">
                  {mounted ? timeLeft.minutes : '00'}
                </div>
                <span className="text-green-300/80">:</span>
                <div className="bg-[#0f172a]/80 px-2 sm:px-4 py-1.5 rounded-md shadow-inner w-12 sm:w-16 text-center">
                  {mounted ? timeLeft.seconds : '00'}
                </div>
              </div>
            </div>

            {/* Banderas Derecha */}
            <div className="flex items-end gap-1 sm:gap-4 h-full pt-2">
              {bannerConfig.flagsRight.map((flag, idx) => (
                <div key={idx} className={`relative w-16 sm:w-28 h-10 sm:h-16 shadow-sm ${flag.rotate} origin-bottom-right transition-transform hover:scale-110 z-10`}>
                  <img 
                    src={getFlagUrl(flag.code)} 
                    alt={flag.name} 
                    className="w-full h-full object-cover border border-white/20" 
                  />
                  <div className="absolute top-0 -right-[2px] w-[3px] h-32 bg-gray-300 -z-10 origin-top"></div>
                </div>
              ))}
            </div>

          </div>
          {/* --- FIN BANNER VERDE --- */}

        </div>
      </section>
    </>
  );
}