"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (login(username, password)) {
      router.replace("/")
      router.refresh()
    } else {
      setError("Invalid username or password.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src={getPictureUrl(PICTURE_LABELS.LogoApp)}
            alt="Jeexpert"
            className="h-14 w-14"
          />
          <div>
            <h1 className="text-xl font-bold text-[rgb(41,84,144)]">JEEXPERT ERP Light</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to access modules</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-user">Username</Label>
            <Input
              id="login-user"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-pass">Password</Label>
            <Input
              id="login-pass"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
