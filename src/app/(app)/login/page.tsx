// src/app/login/page.tsx
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold text-center mb-8">
        Accede a Global GoalGetters
      </h1>
      <LoginForm />
    </div>
  )
}