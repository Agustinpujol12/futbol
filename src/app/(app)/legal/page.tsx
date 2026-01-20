import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl p-8 shadow-lg">
        
        <h1 className="text-3xl font-bold mb-6 text-primary">Términos, Condiciones y Política de Privacidad</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-300">
          
          {/* SECCIÓN 1: GENERAL */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introducción</h2>
            <p>
              Bienvenido a <strong>Global GoalGetters</strong>. Al registrarte, pagar la inscripción o utilizar nuestra plataforma, aceptas automáticamente estos términos y condiciones. Si no estás de acuerdo con alguna parte, por favor no utilices nuestros servicios.
            </p>
          </section>

          {/* SECCIÓN 2: JUEGO Y REGLAS */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Reglas del Juego</h2>
            <p>
              La participación en las ligas de fantasía se rige por el sistema de puntuación detallado en nuestra sección de <Link href="/rules" className="text-blue-400 hover:underline">Reglas del Juego</Link>. Global GoalGetters se reserva el derecho de modificar o ajustar las puntuaciones en caso de errores en los datos recibidos de nuestros proveedores de estadísticas deportivas.
            </p>
          </section>

          {/* SECCIÓN 3: PAGOS Y REEMBOLSOS (CRÍTICO) */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Pagos y Reembolsos</h2>
            <p>
              Todos los pagos procesados a través de <strong>Mercado Pago</strong> son definitivos. Debido a la naturaleza del juego (torneos con cupos limitados y pozos de premios), <strong>no se ofrecen reembolsos</strong> una vez que el usuario ha ingresado a una liga, salvo que la liga sea cancelada por la administración de Global GoalGetters.
            </p>
          </section>

          {/* SECCIÓN 4: CONDUCTA Y SANCIONES */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Conducta y Derecho de Admisión</h2>
            <p>
              Nos reservamos el derecho de suspender o eliminar permanentemente la cuenta de cualquier usuario que:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-400">
              <li>Intente manipular el sistema o utilizar "hacks".</li>
              <li>Utilice lenguaje ofensivo o discriminatorio en la comunidad (Discord).</li>
              <li>Cree múltiples cuentas para obtener ventajas injustas.</li>
            </ul>
          </section>

          {/* SECCIÓN 5: PRIVACIDAD (REQUERIDO POR LEY) */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Política de Privacidad y Datos</h2>
            <p>
              En cumplimiento con la Ley de Protección de Datos Personales, te informamos que:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-400">
              <li><strong>Datos recolectados:</strong> Solo almacenamos tu nombre, correo electrónico y datos públicos de autenticación para gestionar tu cuenta y contactarte.</li>
              <li><strong>Pagos:</strong> Global GoalGetters NO almacena datos de tarjetas de crédito. Toda la información financiera es procesada de forma segura y encriptada exclusivamente por Mercado Pago.</li>
              <li><strong>Uso de datos:</strong> No vendemos ni compartimos tu información personal con terceros.</li>
            </ul>
          </section>

          {/* SECCIÓN 6: LIMITACIÓN DE RESPONSABILIDAD */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Limitación de Responsabilidad</h2>
            <p>
              Global GoalGetters no se hace responsable por caídas del servidor, fallos en la conexión a internet del usuario, o errores en las APIs de terceros (Mercado Pago, proveedores de stats) que escapen a nuestro control razonable.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-muted-foreground">
            ¿Tienes dudas sobre estos términos? Contáctanos en <Link href="/contact" className="text-blue-400 hover:underline">nuestra sección de contacto</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}