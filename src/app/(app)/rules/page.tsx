import Link from 'next/link';
import { ShieldAlert, Zap } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Reglas del Juego
          </h1>
          <p className="text-gray-400 text-lg">
            Domina el sistema de puntuación y conviértete en el mejor manager.
          </p>
        </div>

        {/* SECCIÓN 1: CÓMO FUNCIONA */}
        <section className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            ⚽ ¿Cómo funciona?
          </h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">1</span>
              <p><strong>Únete a una Liga:</strong> Paga la inscripción para entrar a competir por el pozo de premios.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">2</span>
              <p><strong>Arma tu Equipo:</strong> Selecciona a tus jugadores reales favoritos. Tienes un presupuesto limitado.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">3</span>
              <p><strong>Suma Puntos:</strong> Tus jugadores suman puntos basados en su rendimiento real en los partidos (Goles, Asistencias, Vallas Invictas).</p>
            </li>
          </ul>
        </section>

        {/* SECCIÓN 2: SISTEMA DE PUNTUACIÓN (VISUAL) */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">🎯 Sistema de Puntuación Base</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ATAQUE */}
            <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-green-500">
              <h3 className="text-xl font-bold mb-4 text-green-400">Ofensiva</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Gol (Delantero)</span>
                  <span className="font-bold text-white">+4 pts</span>
                </li>
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Gol (Mediocampista)</span>
                  <span className="font-bold text-white">+5 pts</span>
                </li>
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Gol (Defensa/Arquero)</span>
                  <span className="font-bold text-white">+6 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>Asistencia</span>
                  <span className="font-bold text-white">+3 pts</span>
                </li>
              </ul>
            </div>

            {/* DEFENSA */}
            <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Defensiva</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Valla Invicta (Arquero/Def)</span>
                  <span className="font-bold text-white">+4 pts</span>
                </li>
                <li className="flex justify-between border-b border-gray-700 pb-2">
                  <span>Penal Atajado</span>
                  <span className="font-bold text-white">+5 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>Cada 3 Atajadas</span>
                  <span className="font-bold text-white">+1 pt</span>
                </li>
              </ul>
            </div>

            {/* SANCIONES (BASE) */}
            <div className="bg-gray-800 p-6 rounded-xl border-l-4 border-red-500 md:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-red-400">Sanciones Reales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="flex justify-between md:block md:text-center">
                   <span>Tarjeta Amarilla</span>
                   <span className="font-bold text-white block">-1 pt</span>
                 </div>
                 <div className="flex justify-between md:block md:text-center">
                   <span>Tarjeta Roja</span>
                   <span className="font-bold text-white block">-3 pts</span>
                 </div>
                 <div className="flex justify-between md:block md:text-center">
                   <span>Gol en Contra</span>
                   <span className="font-bold text-white block">-2 pts</span>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✨ NUEVA SECCIÓN: CARTAS Y RIESGOS */}
        <section className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="bg-gray-800 p-4 border-b border-gray-700">
             <h2 className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
               🃏 Cartas de Estrategia y Riesgos
             </h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Lado Positivo */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-green-400">
                <Zap className="w-5 h-5" />
                <h3 className="text-lg font-bold">Multiplicadores</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Al usar cartas como <strong>Capitán (x2)</strong> o <strong>Triple Capitán (x3)</strong>, todos los puntos que sume ese jugador se multiplicarán. Si tu jugador hace un gol de 4 pts y es Capitán, sumará <strong>8 pts</strong>.
              </p>
            </div>

            {/* Lado Negativo (Lo que pediste) */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-red-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-lg font-bold">Penalización y Quita de Puntos</h3>
              </div>
              <div className="bg-red-950/30 p-3 rounded-lg border border-red-900/50">
                <p className="text-gray-300 text-sm leading-relaxed">
                  <strong>¡Cuidado!</strong> Los multiplicadores también afectan a los puntos negativos.
                </p>
                <ul className="mt-2 space-y-1 text-sm text-red-200 list-disc list-inside">
                  <li>
                    Si tu Capitán recibe una Roja (-3 pts), <strong>se te restarán 6 puntos</strong>.
                  </li>
                  <li>
                    Existen cartas rivales de <strong>"Anulación"</strong> que pueden restar puntos directamente a tu total si tu jugador tiene mal rendimiento.
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* SECCIÓN 3: PREMIOS Y EMPATES */}
        <section className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">🏆 Premios y Desempates</h2>
          <p className="text-gray-300 mb-4">
            El ganador de la liga será quien acumule más puntos al finalizar la fecha/torneo estipulado.
          </p>
          <div className="bg-black/30 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-400 mb-2">Criterios de Desempate:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>Mayor cantidad de goles anotados por el equipo.</li>
              <li>Menor presupuesto utilizado.</li>
              <li>Sorteo aleatorio automático.</li>
            </ol>
          </div>
        </section>

        {/* CTA FINAL */}
        <div className="text-center pt-8">
          <Link 
            href="/leagues" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
          >
            ¡Entendido! Ir a Jugar
          </Link>
        </div>

      </div>
    </div>
  );
}