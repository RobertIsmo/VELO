"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!username || !email || !password) {
    return { error: "All fields are required." }
  }

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters." }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." }
  }

  // Check if username is already taken
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single()

  if (existingUser) {
    return { error: "Username is already taken." }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/")
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const identifier = formData.get("identifier") as string
  const password = formData.get("password") as string

  if (!identifier || !password) {
    return { error: "All fields are required." }
  }

  let email = identifier

  // If the identifier doesn't look like an email, look up the username
  if (!identifier.includes("@")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", identifier)
      .single()

    if (!profile) {
      return { error: "Invalid username or password." }
    }

    email = profile.email
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Invalid credentials." }
  }

  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
