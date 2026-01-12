'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Loader2, 
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('security')
  const [loading, setLoading] = useState(false)
  
  // --- ESTADOS DEL FORMULARIO ---
  const [userEmail, setUserEmail] = useState('') // Para re-autenticar
  const [currentPassword, setCurrentPassword] = useState('') // Nuevo campo
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Estados de feedback
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const supabase = createClient()
  const router = useRouter()

  // 1. Obtener el email del usuario al cargar (necesario para verificar contraseña)
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUserData()
  }, [supabase])

  // --- LÓGICA DE ACTUALIZACIÓN ---
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    // Validaciones básicas
    if (!currentPassword) {
      setErrorMessage('Debes ingresar tu contraseña actual para confirmar.')
      return
    }
    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas nuevas no coinciden.')
      return
    }

    setLoading(true)

    try {
      // PASO 1: VERIFICAR LA CONTRASEÑA ACTUAL (Re-Login silencioso)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      })

      if (signInError) {
        // Si falla el login, es que la contraseña actual está mal
        setErrorMessage('La contraseña actual es incorrecta.')
        setLoading(false)
        return
      }

      // PASO 2: SI PASA LA VERIFICACIÓN, ACTUALIZAMOS
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        setErrorMessage(updateError.message)
      } else {
        setSuccessMessage('¡Contraseña actualizada correctamente!')
        // Limpiamos los campos por seguridad
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        router.refresh()
      }

    } catch (error) {
      setErrorMessage('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Componente Sidebar Item
  const SidebarItem = ({ id, icon: Icon, label, description }: any) => (
    <button
      onClick={() => {
        setActiveTab(id)
        setSuccessMessage('')
        setErrorMessage('')
      }}
      className={`w-full text-left flex items-start gap-3 px-4 py-4 rounded-xl transition-all border ${
        activeTab === id 
          ? 'bg-primary/10 border-primary/50 text-white shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
          : 'bg-zinc-900/50 border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      <div className={`mt-1 p-2 rounded-lg ${activeTab === id ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-400'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <span className="block font-semibold text-sm">{label}</span>
        <span className="block text-xs text-zinc-500 mt-0.5 font-normal">{description}</span>
      </div>
    </button>
  )

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 font-headline">Configuración</h1>
        <p className="text-zinc-400 text-lg">Gestiona tu cuenta, seguridad y preferencias.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-3">
          <SidebarItem id="profile" icon={User} label="Perfil Público" description="Tu identidad en el juego" />
          <SidebarItem id="security" icon={Lock} label="Seguridad" description="Contraseña y autenticación" />
          <SidebarItem id="billing" icon={CreditCard} label="Suscripción" description="Métodos de pago y planes" />
          <SidebarItem id="notifications" icon={Bell} label="Notificaciones" description="Alertas y correos" />
        </aside>

        {/* Panel Principal */}
        <main className="flex-1 min-h-[500px]">
          
          {/* --- PESTAÑA DE SEGURIDAD --- */}
          {activeTab === 'security' && (
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary ring-1 ring-primary/50">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Seguridad de la Cuenta</h2>
                  <p className="text-zinc-400 text-sm">Protege tu cuenta verificando tu identidad antes de hacer cambios.</p>
                </div>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-lg">
                
                {/* CAMPO: CONTRASEÑA ACTUAL */}
                <div className="space-y-2 p-4 bg-black/20 rounded-lg border border-white/5">
                  <Label htmlFor="current-pass" className="text-zinc-300">Contraseña Actual</Label>
                  <Input 
                    id="current-pass" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-black/40 border-white/10 text-white h-11 focus:ring-primary/50"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <p className="text-xs text-zinc-500">Necesaria para autorizar el cambio.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-pass" className="text-white">Nueva Contraseña</Label>
                    <Input 
                      id="new-pass" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-black/40 border-white/10 text-white h-12 focus:ring-primary/50"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-pass" className="text-white">Confirmar Nueva Contraseña</Label>
                    <Input 
                      id="confirm-pass" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-black/40 border-white/10 text-white h-12 focus:ring-primary/50"
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <Button 
                    disabled={loading || !currentPassword || !newPassword} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 px-8 w-full md:w-auto shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Verificando...</>
                    ) : (
                      'Actualizar Contraseña'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* OTRAS PESTAÑAS (Visuales) */}
          {activeTab === 'profile' && (
             <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-2xl font-bold text-white mb-6">Perfil Público</h2>
               <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2 opacity-50 pointer-events-none">
                     <Label className="text-white">Nombre de Usuario</Label>
                     <Input className="bg-black/40 border-white/10" placeholder="@usuario" disabled />
                  </div>
                  <div className="space-y-2 opacity-50 pointer-events-none">
                     <Label className="text-white">Biografía</Label>
                     <Input className="bg-black/40 border-white/10" placeholder="..." disabled />
                  </div>
               </div>
               <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm">
                 🚧 <strong>En construcción:</strong> Pronto podrás personalizar tu avatar.
               </div>
             </div>
          )}

          {(activeTab === 'billing' || activeTab === 'notifications') && (
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                {activeTab === 'billing' ? <CreditCard className="w-10 h-10 text-zinc-600"/> : <Bell className="w-10 h-10 text-zinc-600"/>}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Próximamente</h3>
              <p className="text-zinc-400 max-w-sm">Función en desarrollo.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}