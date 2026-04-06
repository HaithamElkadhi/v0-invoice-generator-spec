import { AlertTriangle, FileText } from "lucide-react"
import { DiplomeLegalisationCards } from "./diplome-legalisation-cards"
import { BilingualRow, C } from "./knowledge-hub-shared"

function ListItem({ fr, ar }: { fr: string; ar: string }) {
  return (
    <div className="flex gap-3 border-l-4 bg-white/60 py-2 pl-3" style={{ borderLeftColor: C.gold }}>
      <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#1a2b4b]/70" aria-hidden />
      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 sm:gap-6">
        <p className="text-left text-sm leading-relaxed">{fr}</p>
        <p dir="rtl" lang="ar" className="text-right text-sm leading-relaxed">
          {ar}
        </p>
      </div>
    </div>
  )
}

export function DocumentDeclarationValeur() {
  return (
    <article className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Embassy strip */}
      <div className="flex overflow-hidden rounded-t-lg">
        <div className="h-2 flex-1 bg-[#009432]" />
        <div className="h-2 flex-1 bg-white" />
        <div className="h-2 flex-1 bg-[#c62828]" />
      </div>

      <header className="space-y-4 border-b border-[#009432]/30 pb-6">
        <BilingualRow
          fr={
            <div>
              <p className="text-lg font-bold uppercase tracking-wide" style={{ color: C.navy }}>
                Ambassade d&apos;Italie à Tunis
              </p>
              <p className="text-sm text-muted-foreground">AMBASCIATA D&apos;ITALIA A TUNISI</p>
            </div>
          }
          ar={
            <p className="text-lg font-bold" style={{ color: C.navy }}>
              سفارة إيطاليا في تونس
            </p>
          }
        />
      </header>

      {/* Main title */}
      <div
        className="rounded-xl px-6 py-8 text-center text-white shadow-md"
        style={{ backgroundColor: C.navy }}
      >
        <h2 className="text-xl font-bold uppercase tracking-wide sm:text-2xl">
          Note d&apos;information officielle
        </h2>
        <p className="mt-3 text-base font-semibold text-white/95">
          Déclaration de valeur — Nouvelles procédures
        </p>
        <p dir="rtl" lang="ar" className="mt-2 text-sm text-white/90">
          إشعار رسمي — تصريح بالقيمة — إجراءات جديدة
        </p>
      </div>

      {/* Effective date */}
      <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
        <span className="text-muted-foreground">En vigueur depuis :</span>
        <span
          className="rounded-md px-4 py-1.5 font-bold text-white"
          style={{ backgroundColor: C.red }}
        >
          30 mars 2026
        </span>
      </div>

      {/* Objet */}
      <section
        className="space-y-4 rounded-xl p-6"
        style={{ backgroundColor: C.lightBlue }}
      >
        <h3 className="text-base font-bold" style={{ color: C.navy }}>
          Objet
        </h3>
        <p className="text-sm leading-relaxed text-foreground">
          À compter du 30 mars 2026, l&apos;Ambassade d&apos;Italie en Tunisie exige que toute Déclaration de valeur
          (Dichiarazione di Valore) soit accompagnée de documents préalablement légalisés auprès du ministère compétent,
          avant l&apos;apposition de l&apos;Apostille par le notaire.
        </p>
        <p dir="rtl" lang="ar" className="text-sm leading-relaxed text-foreground">
          من تاريخ 30 مارس 2026، أصبح إلزامياً التصديق على الشهادات لدى الوزارة المختصة قبل الأبوستيل.
        </p>
      </section>

      {/* Section 1 */}
      <section className="space-y-4">
        <div
          className="rounded-t-lg px-4 py-3 text-center font-bold text-white"
          style={{ backgroundColor: C.green }}
        >
          1. Légalisation préalable selon le type de diplôme
        </div>
        <p dir="rtl" lang="ar" className="text-center text-sm font-medium text-muted-foreground">
          التصديق المسبق حسب نوع الشهادة
        </p>

        <DiplomeLegalisationCards />
      </section>

      {/* Section 2 Apostille */}
      <section className="space-y-3">
        <div className="rounded-t-lg px-4 py-3 font-bold text-white" style={{ backgroundColor: C.navy }}>
          2. Apostille — Documents concernés
        </div>
        <div className="space-y-2 rounded-b-lg border border-t-0 border-border bg-[#fafafa] p-4">
          <ListItem fr="Diplôme original" ar="الشهادة الأصلية" />
          <ListItem fr="Relevé de notes original" ar="كشف الأعداد الأصلي" />
          <ListItem
            fr="Traduction officielle en langue italienne"
            ar="الترجمة الرسمية إلى الإيطالية"
          />
        </div>
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
          <div className="space-y-2">
            <p className="font-bold text-red-700">
              ATTENTION : L&apos;Apostille doit être apposée sur les deux documents originaux (diplôme + relevé de
              notes) ET sur la traduction. Veillez à ce que les trois documents soient couverts afin d&apos;éviter toute
              perte de rendez-vous.
            </p>
            <p dir="rtl" lang="ar" className="text-foreground">
              توضع على الورقتين الأصليتين (الشهادة + كشف الأعداد) وعلى الترجمة. ركزوا هنا حتى لا يضيع عليكم الموعد.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <div className="rounded-t-lg px-4 py-3 font-bold text-white" style={{ backgroundColor: C.red }}>
          3. Exigences complémentaires
        </div>
        <div className="space-y-2 rounded-b-lg border border-t-0 border-border bg-[#fafafa] p-4">
          <ListItem
            fr="Copies certifiées conformes délivrées par la Municipalité"
            ar="نسخ مطابقة للأصل من البلدية"
          />
          <ListItem
            fr="Traduction des documents en langue italienne par un traducteur assermenté"
            ar="ترجمة الوثائق إلى الإيطالية عند مترجم محلف"
          />
          <ListItem
            fr="Concordance exacte du nom et prénom avec le passeport"
            ar="تطابق الاسم واللقب مع جواز السفر"
          />
        </div>
      </section>

      {/* Section 4 */}
      <section className="space-y-4">
        <div className="rounded-t-lg px-4 py-3 text-center font-bold text-white" style={{ backgroundColor: C.green }}>
          4. Documents à présenter le jour du rendez-vous
        </div>
        <p dir="rtl" lang="ar" className="text-center text-sm text-muted-foreground">
          الوثائق المطلوب يوم الموعد
        </p>

        <div className="space-y-2 rounded-lg border-2 border-[#009432]/40 bg-[#f1f9f1]/50 p-4">
          {[
            "Diplômes originaux (avec légalisation + Apostille)",
            "Relevés de notes originaux (avec Apostille)",
            "Traductions officielles en italien (avec Apostille)",
            "Copies certifiées conformes de la Municipalité",
            "Passeport en cours de validité",
            "Déclaration de Valeur complètement remplie",
          ].map((line, i) => (
            <label
              key={i}
              className="flex cursor-default items-start gap-3 border-b border-[#009432]/15 py-2 last:border-0"
            >
              <span className="mt-1 inline-flex h-4 w-4 shrink-0 rounded border-2 border-[#009432]" />
              <span className="text-sm leading-relaxed">{line}</span>
            </label>
          ))}
        </div>

        <div className="rounded-lg border border-dashed border-[#1a2b4b]/30 bg-[#eef2f7] p-4 text-sm">
          <p className="font-medium text-[#1a2b4b]">
            Concordance exacte du nom et prénom avec le passeport · Timbre fiscal de 5 DT par document original pour les
            diplômes universitaires
          </p>
        </div>
      </section>

      <footer className="border-t pt-6 text-center text-xs text-muted-foreground">
        Contenu fourni à titre informatif — vérifier auprès de l&apos;Ambassade d&apos;Italie à Tunis pour toute mise à jour.
      </footer>
    </article>
  )
}
