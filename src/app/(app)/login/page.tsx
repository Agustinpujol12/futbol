// src/app/login/page.tsx
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] py-10">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}