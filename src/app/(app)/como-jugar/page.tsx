// app/como-jugar/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shuffle, Swords, Sparkles, Trophy, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Cómo jugar a Draft8 | Reglas y Guía',
  description: 'Aprende las reglas de Draft8, el fantasy football definitivo del Mundial.',
};

export default function ComoJugarPage() {
  const steps = [
    {
      icon: <Shuffle className="h-10 w-10 text-primary" />,
      title: '1. El Sorteo Equilibrado',
      description: 'Cada día del Mundial, el sistema te asignará jugadores al azar de las selecciones que jueguen esa fecha. El sistema es equilibrado: a todos les tocarán 1, 2 o 3 jugadores de los equipos favoritos y de los menos favoritos. El azar decide quiénes te tocan, pero las oportunidades son iguales para todos. De ese grupo, deberás elegir a tus 8 titulares.',
    },
    {
      icon: <Swords className="h-10 w-10 text-primary" />,
      title: '2. El Duelo Directo (Cara a Cara)',
      description: 'No jugás contra todos a la vez. Cada fecha te enfrentarás a un rival de tu liga en un duelo 1 vs 1. Tu rival también tendrá sus 8 jugadores elegidos. Al finalizar el día, los jugadores recibirán una valoración basada en su rendimiento real (goles, asistencias, defensa, etc.).',
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: '3. Cartas de Estrategia',
      description: 'Acá entra la magia. Además de los jugadores, el azar te otorgará Cartas de Estrategia (buenas o malas). Podés usarlas para potenciar a tu equipo o complicarle la vida a tu rival. Saber cuándo jugar esa carta clave puede dar vuelta un partido perdido.',
    },
    {
      icon: <CalendarDays className="h-10 w-10 text-primary" />,
      title: '4. Los Puntos de la Fecha',
      description: 'Se suma la valoración total de tus 8 jugadores + el efecto de las cartas. Si tu puntaje final es mayor al de tu rival, ganás el duelo y sumás 3 PUNTOS en la tabla de tu liga. Si empatan, 1 punto cada uno. Si perdés, 0 puntos. Al día siguiente, arranca una nueva fecha.',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera y Dinámica */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-foreground mb-6">
            Cómo jugar a <span className="text-primary">Draft8</span>
          </h1>
          
          <Card className="bg-primary/5 border-primary/20 shadow-inner">
            <CardContent className="p-6 md:p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cada fecha del Mundial te tocarán jugadores al azar de las selecciones que juegan ese día. <strong>Elegís a 8 para que te representen</strong> y te enfrentás cara a cara contra un rival de tu liga. Al finalizar los partidos reales, se suma la valoración de tu equipo frente a la de tu rival. Si ganás, sumás <strong>3 puntos</strong> en la tabla. ¡El mánager que más puntos sume al finalizar el torneo será el campeón y obtendrá grandes premios!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Paso a paso */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="bg-card border-border shadow-md hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-col gap-4 pb-2">
                <div className="bg-primary/10 p-3 rounded-lg w-fit">
                  {step.icon}
                </div>
                <CardTitle className="text-2xl font-headline">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sección de Ligas y Premios */}
        <Card className="bg-gradient-to-br from-green-900/40 via-background to-blue-900/40 border-primary/30 shadow-xl mb-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Trophy className="w-48 h-48 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-headline flex items-center gap-3 text-white">
               <Trophy className="h-8 w-8 text-yellow-400" />
               Ligas y Premios
            </CardTitle>
          </CardHeader>
          <CardContent>
<p className="text-lg text-slate-300 leading-relaxed mb-6 relative z-10">
              Todas las ligas de Draft8 tienen un costo de inscripción único de <strong>$5 USD</strong>.
              <br /><br />
              Podrás seguir el rendimiento de tu equipo, la tabla de posiciones y tus estadísticas día a día desde tu <strong>Dashboard personal</strong>. Al finalizar la Copa del Mundo, el mánager que haya quedado primero en la tabla de su liga se coronará campeón y se llevará su porcentaje del pozo de premios.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-500 text-white font-bold w-full sm:w-auto">
                <Link href="/leagues">Ver Ligas Disponibles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA (Llamado a la acción) */}
        <div className="text-center">
          <h2 className="text-2xl font-headline font-bold mb-6">¿Estás listo para armar tu equipo?</h2>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold group h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25">
            <Link href="/login" className="flex items-center gap-2">
              Crear mi cuenta y jugar
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}