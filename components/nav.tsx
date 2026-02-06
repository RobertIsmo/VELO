import Link from "next/link"
import { UserMenu } from "@/components/user-menu"
import { getCurrentUser } from "@/lib/auth-actions"

export async function Nav() {
  const user = await getCurrentUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          VELO
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu email={user.email ?? ""} />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
