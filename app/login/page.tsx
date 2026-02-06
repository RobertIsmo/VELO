import { AuthForm } from "@/components/auth-form"
import { login } from "@/lib/auth-actions"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log In - VELO",
  description: "Log in to your VELO account.",
}

export default function LoginPage() {
  return <AuthForm mode="login" action={login} />
}
