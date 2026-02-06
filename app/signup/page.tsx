import { AuthForm } from "@/components/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - VELO",
  description: "Create your VELO account.",
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
