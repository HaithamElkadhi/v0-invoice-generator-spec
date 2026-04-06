import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DocumentDeclarationValeur } from "@/components/knowledge-hub/document-declaration-valeur"

export const metadata = {
  title: "Déclaration de valeur — Tunis | Knowledge Hub",
  description:
    "Informations sur la Déclaration de valeur (Dichiarazione di Valore) — Ambassade d'Italie à Tunis",
}

export default function DeclarationValeurTunisPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href="/knowledge-hub"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Knowledge Hub
          </Link>
          <span className="text-muted-foreground/50">·</span>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Accueil
          </Link>
        </div>

        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Knowledge Hub · Document</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Déclaration de valeur — Nouvelles procédures Tunis
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Note d&apos;information — Ambassade d&apos;Italie à Tunis (en vigueur depuis le 30 mars 2026).
          </p>
        </header>

        <DocumentDeclarationValeur />
      </div>
    </div>
  )
}
