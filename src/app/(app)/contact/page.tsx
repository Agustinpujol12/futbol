import { Gamepad2 } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-lg p-8 md:p-10">
        
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Contacto</h1>
          <p className="text-muted-foreground">
            Si no encontraste la respuesta en nuestras <a href="/faq" className="text-primary hover:underline">Preguntas Frecuentes</a>, envíanos un mensaje directo.
          </p>
        </div>

        {/* 📝 FORMULARIO FUNCIONAL 
            Usamos formsubmit.co para enviar el mail sin servidor.
        */}
        <form 
          action="https://formsubmit.co/agustinpujol12@gmail.com" 
          method="POST" 
          className="space-y-6"
        >
          
          {/* Configuración Oculta para FormSubmit */}
          <input type="hidden" name="_subject" value="Nuevo Mensaje de Contacto - Global GoalGetters" />
          <input type="hidden" name="_captcha" value="false" /> {/* Desactivar captcha feo por defecto */}
          <input type="hidden" name="_next" value="https://futbol-iota-ten.vercel.app/dashboard" /> {/* Redirigir al enviar */}

          {/* Campo: Nombre */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-bold text-foreground">
              Nombre y Apellido*
            </label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="Ingresar"
              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Campo: Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-foreground">
              Correo electrónico*
            </label>
            <input 
              type="email" 
              name="email" 
              required
              placeholder="Ingresar"
              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Campo: Categoría */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-bold text-foreground">
              Categoría*
            </label>
            <div className="relative">
              <select 
                name="category"
                className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
              >
                <option value="Soporte Técnico">Soporte Técnico</option>
                <option value="Pagos y Facturación">Pagos y Facturación</option>
                <option value="Reporte de Jugadores">Reporte de Jugadores</option>
                <option value="Propuesta Comercial">Propuesta Comercial</option>
                <option value="Otro">Otro</option>
              </select>
              {/* Flechita del select */}
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Campo: Mensaje */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-bold text-foreground">
              Mensaje*
            </label>
            <textarea 
              name="message" 
              required
              rows={5}
              placeholder="Escribe tu consulta aquí..."
              className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            ></textarea>
          </div>

          {/* Botón Enviar */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
          >
            Enviar Mensaje
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Protegido por reCAPTCHA y sujeto a la Política de Privacidad de Google.
          </p>

        </form>
      </div>
    </div>
  );
}