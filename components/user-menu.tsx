"use client"

import { logout } from "@/lib/auth-actions"
import { LogOut } from "lucide-react"

export function UserMenu({ email }: { email: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">{email}</span>
      <form action={logout}>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Log out</span>
        </button>
      </form>
    </div>
  )
}
