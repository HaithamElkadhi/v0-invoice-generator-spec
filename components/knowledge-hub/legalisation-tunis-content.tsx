import Link from "next/link"
import { AlertTriangle, Stamp } from "lucide-react"
import { DiplomeLegalisationCards } from "./diplome-legalisation-cards"
import { LEGALISATION_PROCESS_STEPS } from "./legalisation-reference-data"
import { BilingualRow, C } from "./knowledge-hub-shared"

const PROCESS_STEPS = LEGALISATION_PROCESS_STEPS

export function LegalisationTunisContent() {
  return (
    <article className="mx-auto max-w-4xl space-y-10 pb-16">
      <div className="flex overflow-hidden rounded-t-lg">
        <div className="h-2 flex-1 bg-[#009432]" />
        <div className="h-2 flex-1 bg-white" />
        <div className="h-2 flex-1 bg-[#c62828]" />
      </div>

      <div
        className="rounded-xl px-6 py-8 text-center text-white shadow-md"
        style={{ backgroundColor: C.navy }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Knowledge Hub</p>
        <h1 className="mt-2 text-xl font-bold uppercase tracking-wide sm:text-2xl">Legalisation Tunis</h1>
        <p className="mt-3 text-base font-medium text-white/95">
          Légalisation préalable en Tunisie — par type de diplôme et ordre des étapes
        </p>
        <p dir="rtl" lang="ar" className="mt-2 text-sm text-white/90">
          التصديق المسبق في تونس حسب نوع الشهادة وترتيب الإجراءات
        </p>
      </div>

      <section className="space-y-4 rounded-xl p-6" style={{ backgroundColor: C.lightBlue }}>
        <h2 className="text-base font-bold" style={{ color: C.navy }}>
          Contexte
        </h2>
        <p className="text-sm leading-relaxed">
          Pour les dossiers soumis à l&apos;Ambassade d&apos;Italie à Tunis (notamment la{" "}
          <strong>Déclaration de valeur</strong>), les originaux doivent d&apos;abord être{" "}
          <strong>légalisés auprès du ministère ou de l&apos;organisme tunisien compétent</strong>, puis faire
          l&apos;objet d&apos;une <strong>Apostille</strong> par le notaire. Cette fiche résume{" "}
          <em>où</em> légaliser selon le diplôme et <em>dans quel ordre</em> enchaîner les étapes.
        </p>
        <p dir="rtl" lang="ar" className="text-sm leading-relaxed">
          لملفات السفارة الإيطالية (منها تصريح القيمة)، يجب أولاً التصديق على الأصول لدى الوزارة أو الإدارة المختصة،
          ثم الأبوستيل عند الموثّق. هذه الصفحة توضح أين يتم التصديق حسب نوع الشهادة وترتيب الخطوات.
        </p>
        <div className="flex flex-wrap items-center gap-2 border-t border-[#1a2b4b]/10 pt-4 text-sm">
          <span className="text-muted-foreground">Exigence renforcée (D.V.) depuis :</span>
          <span className="rounded-md px-3 py-1 font-bold text-white" style={{ backgroundColor: C.red }}>
            30 mars 2026
          </span>
          <Link
            href="/knowledge-hub/declaration-valeur-tunis"
            className="ml-auto font-medium text-[rgb(41,84,144)] underline-offset-4 hover:underline"
          >
            Voir la note complète Déclaration de valeur →
          </Link>
        </div>
      </section>

      {/* Process */}
      <section className="space-y-4">
        <div
          className="rounded-t-lg px-4 py-3 text-center font-bold text-white"
          style={{ backgroundColor: C.navy }}
        >
          Processus global (ordre à respecter)
        </div>
        <p dir="rtl" lang="ar" className="text-center text-sm text-muted-foreground">
          المسار العام (ترتيب إلزامي)
        </p>

        <ol className="relative space-y-0 rounded-b-xl border border-border bg-card p-4 sm:p-6">
          {PROCESS_STEPS.map((step, i) => (
            <li key={i} className="relative flex gap-4 pb-8 last:pb-0">
              {i < PROCESS_STEPS.length - 1 ? (
                <span
                  className="absolute left-[17px] top-10 h-[calc(100%-1.25rem)] w-px bg-[#009432]/35 sm:left-[17px]"
                  aria-hidden
                />
              ) : null}
              <span
                className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: C.green }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <BilingualRow fr={<span>{step.fr}</span>} ar={<span>{step.ar}</span>} />
              </div>
            </li>
          ))}
        </ol>

        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm">
          <Stamp className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden />
          <p className="leading-relaxed text-amber-950">
            <strong>Règle d&apos;or :</strong> la légalisation au ministère / rectorat vient{" "}
            <strong>avant</strong> l&apos;Apostille au notaire. Inverser l&apos;ordre peut invalider la chaîne de
            validité du document pour le consulat.
          </p>
        </div>
      </section>

      {/* By diploma type */}
      <section className="space-y-4">
        <div
          className="rounded-t-lg px-4 py-3 text-center font-bold text-white"
          style={{ backgroundColor: C.green }}
        >
          Légalisation préalable selon le type de diplôme
        </div>
        <p dir="rtl" lang="ar" className="text-center text-sm font-medium text-muted-foreground">
          التصديق المسبق حسب نوع الشهادة
        </p>
        <DiplomeLegalisationCards />
      </section>

      {/* Apostille reminder */}
      <section className="space-y-3">
        <div className="rounded-t-lg px-4 py-3 font-bold text-white" style={{ backgroundColor: C.navy }}>
          Après la légalisation : Apostille (notaire)
        </div>
        <div className="space-y-3 rounded-b-lg border border-t-0 border-border bg-[#fafafa] p-4 text-sm leading-relaxed">
          <p>
            L&apos;Apostille s&apos;applique typiquement aux <strong>originaux</strong> : diplôme, relevé de notes, et
            le cas échéant la <strong>traduction officielle en italien</strong>. Pour la D.V., l&apos;ambassade insiste
            pour que les trois soient couverts — voir le détail dans le guide Déclaration de valeur.
          </p>
          <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
            <p className="font-semibold text-red-800">
              L&apos;Apostille doit être apposée sur les deux originaux (diplôme + relevé) et sur la traduction lorsque
              le dossier l&apos;exige — ne pas omettre une pièce sous peine de refus ou de perte de rendez-vous.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t pt-6 text-center text-xs text-muted-foreground">
        Informations à titre pratique — confirmer les exigences auprès des administrations tunisiennes et de
        l&apos;Ambassade d&apos;Italie à Tunis.
      </footer>
    </article>
  )
}
