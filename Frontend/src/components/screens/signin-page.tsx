import { useEffect, useState } from "react"
import { LoginForm } from "../../components/login-form"

export default function LoginPage() {
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark")

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
 });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-1xl">
        <LoginForm />
      </div>
    </div>
  )
}

