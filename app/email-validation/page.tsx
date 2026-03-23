"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Result = {
  ok: boolean
  email?: string
  exists?: boolean
  deliverability?: string
  is_valid_format?: boolean
  is_mx_found?: boolean
  is_smtp_valid?: boolean
  is_disposable?: boolean
  error?: string
}

export default function EmailValidationPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ ok: false, error: "Connection error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-[rgb(41,84,144)]">Email Validation</h1>
              <p className="text-sm text-muted-foreground">Check if an email exists before sending</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[rgb(41,84,144)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Modules
        </Link>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Verify email address</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter an email to check if it exists and can receive messages. Uses Abstract API (free tier: 100 checks/month).
          </p>
        </div>

        <div className="max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="verify-email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="verify-email"
                  type="email"
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-background"
                />
                <Button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="bg-[rgb(41,84,144)] text-white hover:bg-[rgb(41,84,144)]/90 font-semibold shrink-0"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {result && (
            <div
              className={`mt-6 rounded-lg border p-4 ${
                result.ok && result.exists
                  ? "border-green-500/30 bg-green-500/10"
                  : result.ok && !result.exists
                    ? "border-amber-500/30 bg-amber-500/10"
                    : "border-destructive/30 bg-destructive/10"
              }`}
            >
              {!result.ok && result.error && (
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Error</p>
                    <p className="text-sm text-muted-foreground">{result.error}</p>
                  </div>
                </div>
              )}
              {result.ok && (
                <div className="flex items-start gap-3">
                  {result.exists ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {result.exists
                        ? "Email is valid and deliverable"
                        : "Email is invalid or not deliverable"}
                    </p>
                    {result.email && (
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {result.email}
                      </p>
                    )}
                    {result.deliverability && result.deliverability !== "UNKNOWN" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Status: {result.deliverability}
                        {result.is_disposable && " · Disposable email"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
