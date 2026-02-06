import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VELO - Collaborative Power Scaling",
  description:
    "Rate and rank fictional characters with the community using Elo-based matchups.",
}

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-foreground sm:text-6xl">
          VELO
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-lg text-muted-foreground">
          Collaborative power scaling for fictional characters. Rate, rank, and
          debate.
        </p>

        {user ? (
          <div className="mt-10">
            <p className="text-sm text-muted-foreground">
              {"Welcome back. More features coming soon."}
            </p>
          </div>
        ) : (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
