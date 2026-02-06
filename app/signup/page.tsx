import { AuthForm } from "@/components/auth-form"
import { signup } from "@/lib/auth-actions"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - VELO",
  description: "Create your VELO account.",
}

export default function SignupPage() {
  return <AuthForm mode="signup" action={signup} />
}
