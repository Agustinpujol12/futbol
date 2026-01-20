import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Encabezado */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Preguntas Frecuentes
          </h1>
          <p className="text-muted-foreground text-lg">
            Todo lo que necesitas saber para empezar a ganar en Global GoalGetters.
          </p>
        </div>

        {/* Sección de Acordeones */}
        <div className="space-y-4">
          
          {/* Pregunta 1 */}
          <details className="group bg-card border border-border rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all hover:border-primary/50">
            <summary className="flex items-center justify-between font-bold text-lg text-foreground">
              ⚽ ¿Cómo me uno a una liga?
              <span className="ml-4 transition-transform group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Es muy fácil. Ve a la sección de <Link href="/leagues" className="text-primary hover:underline">Ligas</Link>, elige la competición que más te guste y haz clic en "Unirse". Se te redirigirá a Mercado Pago para abonar la inscripción. Una vez confirmado el pago, quedarás inscrito automáticamente.
            </p>
          </details>

          {/* Pregunta 2 */}
          <details className="group bg-card border border-border rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all hover:border-primary/50">
            <summary className="flex items-center justify-between font-bold text-lg text-foreground">
              💰 ¿Cómo y cuándo se pagan los premios?
              <span className="ml-4 transition-transform group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Los premios se distribuyen automáticamente al finalizar la fecha o el torneo, dependiendo de las reglas de esa liga específica. El saldo ganador se acreditará en tu cuenta y podrás solicitar el retiro inmediato a tu cuenta bancaria o billetera virtual.
            </p>
          </details>

          {/* Pregunta 3 */}
          <details className="group bg-card border border-border rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all hover:border-primary/50">
            <summary className="flex items-center justify-between font-bold text-lg text-foreground">
              🔄 ¿Puedo cambiar mi equipo una vez empezada la fecha?
              <span className="ml-4 transition-transform group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              No. Los equipos se bloquean 15 minutos antes del inicio del primer partido de la fecha. Asegúrate de hacer todos tus cambios y transferencias antes de ese límite.
            </p>
          </details>

          {/* Pregunta 4 */}
          <details className="group bg-card border border-border rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all hover:border-primary/50">
            <summary className="flex items-center justify-between font-bold text-lg text-foreground">
              🐛 Encontré un error en la web, ¿qué hago?
              <span className="ml-4 transition-transform group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              ¡Apreciamos tu ayuda! Por favor, repórtalo en nuestro canal de <a href="https://discord.gg/fHV4yxsF76" target="_blank" className="text-primary hover:underline">Discord oficial</a> en la sección de <strong>#reportar-bug</strong>. Incluye una captura de pantalla si es posible.
            </p>
          </details>

          {/* Pregunta 5 */}
          <details className="group bg-card border border-border rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all hover:border-primary/50">
            <summary className="flex items-center justify-between font-bold text-lg text-foreground">
              📊 ¿Cómo funcionan los puntos?
              <span className="ml-4 transition-transform group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Los puntos se basan en el rendimiento real de los jugadores (Goles, Asistencias, Vallas Invictas, etc.). Puedes ver la tabla completa de puntuación en nuestra sección de <Link href="/rules" className="text-primary hover:underline">Reglas del Juego</Link>.
            </p>
          </details>

        </div>

        {/* CTA Final */}
        <div className="text-center pt-8 bg-muted/20 rounded-2xl p-8 mt-12">
          <h3 className="text-xl font-bold mb-2">¿Tienes más dudas?</h3>
          <p className="text-muted-foreground mb-6">Nuestra comunidad de managers y moderadores está lista para ayudarte.</p>
          <a 
            href="https://discord.gg/fHV4yxsF76"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            <Gamepad2 className="w-5 h-5" />
            Preguntar en Discord
          </a>
        </div>

      </div>
    </div>
  );
}

// Icono auxiliar para el botón final
import { Gamepad2 } from 'lucide-react';