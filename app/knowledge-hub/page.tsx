import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { ArrowLeft, BookOpen, FileText, GraduationCap, Lock, Stamp } from "lucide-react"

export const metadata = {
  title: "Knowledge Hub",
  description: "Guides et notes officielles pour les démarches académiques",
}

type HubCard = {
  href?: string
  title: string
  description: string
  available: boolean
  icon: LucideIcon
}

const CARDS: HubCard[] = [
  {
    href: "/knowledge-hub/declaration-valeur-tunis",
    title: "Déclaration de valeur — Nouvelles procédures Tunis",
    description:
      "Ambassade d'Italie à Tunis : légalisation, Apostille, documents (en vigueur depuis le 30 mars 2026).",
    available: true,
    icon: FileText,
  },
  {
    href: "/knowledge-hub/legalisation-tunis",
    title: "Legalisation Tunis",
    description:
      "Où légaliser selon le diplôme (Éducation, Rectorat, Emploi, Santé), ordre des étapes et lien avec l'Apostille.",
    available: true,
    icon: Stamp,
  },
  {
    href: "/knowledge-hub/documents-master-italie",
    title: "Documents requis — Master en Italie",
    description:
      "Study in Italy : liste finale en 5 blocs (obligatoire, recommandé, lycée, licence, master) — FR / AR.",
    available: true,
    icon: GraduationCap,
  },
  {
    title: "Visa étudiant Italie",
    description: "À venir : exigences et calendrier type.",
    available: false,
    icon: BookOpen,
  },
  {
    title: "Reconnaissance des crédits (ECTS)",
    description: "À venir : équivalences et dossiers.",
    available: false,
    icon: BookOpen,
  },
  {
    title: "Traduction assermentée",
    description: "À venir : bonnes pratiques et liste d’orientations.",
    available: false,
    icon: BookOpen,
  },
  {
    title: "Pré-inscription universitaire",
    description: "À venir : étapes et pièces courantes.",
    available: false,
    icon: BookOpen,
  },
  {
    title: "Logement & assurance",
    description: "À venir : checklist arrivée en Italie.",
    available: false,
    icon: BookOpen,
  },
]

export default function KnowledgeHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour à l&apos;accueil
          </Link>
        </div>

        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Knowledge Hub</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Choisir un guide</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Notes pratiques et procédures. Les fiches disponibles sont ouvertes ; les autres arrivent progressivement.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = card.icon
            if (card.available && card.href) {
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-[rgb(41,84,144)] hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(41,84,144)]/10 text-[rgb(41,84,144)] transition-colors group-hover:bg-[rgb(41,84,144)] group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h2 className="text-lg font-semibold leading-snug text-foreground">{card.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{card.description}</p>
                  <span className="mt-4 text-sm font-medium text-[rgb(41,84,144)]">Ouvrir le guide →</span>
                </Link>
              )
            }
            return (
              <div
                key={card.title}
                className="flex flex-col rounded-xl border border-dashed border-border bg-muted/20 p-6 opacity-75"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Lock className="h-6 w-6" aria-hidden />
                </div>
                <h2 className="text-lg font-semibold leading-snug text-muted-foreground">{card.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{card.description}</p>
                <span className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Bientôt disponible
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
