import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TraducteursAssermentesContent } from "@/components/knowledge-hub/traducteurs-assermentes-content"

export const metadata = {
  title: "Traducteurs assermentés | Knowledge Hub",
  description: "Liste de contacts de traducteurs assermentés en Tunisie (indicatif).",
}

export default function TraducteursAssermentesPage() {
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

        <TraducteursAssermentesContent />
      </div>
    </div>
  )
}
