"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AUTH_CONFIG } from "@/lib/auth-config"

const STORAGE_KEY = "jeexpert_erp_session_v1"

type AuthContextValue = {
  ready: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    try {
      setIsAuthenticated(localStorage.getItem(STORAGE_KEY) === "1")
    } catch {
      setIsAuthenticated(false)
    }
    setReady(true)
  }, [])

  const login = useCallback((username: string, password: string) => {
    const ok =
      username.trim() === AUTH_CONFIG.username && password === AUTH_CONFIG.password
    if (ok) {
      try {
        localStorage.setItem(STORAGE_KEY, "1")
      } catch {
        /* ignore */
      }
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ ready, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { ready, isAuthenticated, logout } = useAuth()
  const isLoginRoute = pathname === "/login"

  useEffect(() => {
    if (!ready) return
    if (isLoginRoute && isAuthenticated) {
      router.replace("/")
    }
  }, [ready, isLoginRoute, isAuthenticated, router])

  useEffect(() => {
    if (!ready) return
    if (isLoginRoute) return
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [ready, isAuthenticated, isLoginRoute, router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (isLoginRoute) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Redirecting…
      </div>
    )
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-[100]">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 border-[rgb(41,84,144)]/30 bg-card/95 shadow-md backdrop-blur-sm"
          onClick={() => {
            logout()
            router.replace("/login")
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      {children}
    </>
  )
}
