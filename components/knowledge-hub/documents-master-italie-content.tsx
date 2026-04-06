import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { MasterDocumentsChecklist } from "./master-documents-checklist"

export function DocumentsMasterItalieContent() {
  return (
    <article className="mx-auto max-w-4xl space-y-8 pb-16">
      <header className="border-b border-border pb-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Knowledge Hub</p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
              Documents requis — Master en Italie
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cochez IT / Liste comme ci-dessous. Vous pouvez aussi cocher les blocs « Processus global » et «
              Légalisation par type de diplôme » pour les joindre au même e-mail (contenu identique à la page Legalisation
              Tunis).
            </p>
          </div>
        </div>
      </header>

      <p className="text-sm text-muted-foreground">
        Les exigences varient selon l’université — vérifiez le bando officiel.
      </p>

      <section className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
        <p className="font-medium text-foreground">Diplômes tunisiens</p>
        <p className="mt-1 text-muted-foreground">
          Prévoir légalisation, Apostille et traductions selon les guides.
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/knowledge-hub/legalisation-tunis" className="text-foreground underline-offset-4 hover:underline">
            Legalisation Tunis
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link
            href="/knowledge-hub/declaration-valeur-tunis"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Déclaration de valeur
          </Link>
        </div>
      </section>

      <MasterDocumentsChecklist />

      <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
        Informations indicatives — confirmer auprès de l’université et du consulat.
      </footer>
    </article>
  )
}
