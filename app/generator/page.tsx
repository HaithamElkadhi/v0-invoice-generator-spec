import Link from "next/link"
import { FileText, ArrowLeft, ScrollText, ReceiptText, CreditCard, FileSpreadsheet, ArrowRight } from "lucide-react"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"

const GENERATORS = [
  {
    href: "/generator/invoice",
    icon: FileText,
    label: "Invoice",
    desc: "Generate professional invoices",
    color: "text-[rgb(41,84,144)]",
    iconBg: "bg-[rgb(41,84,144)]/10",
    accent: "from-[rgb(41,84,144)] to-blue-400",
  },
  {
    href: "/generator/contrat",
    icon: ScrollText,
    label: "Contrat",
    desc: "Prestation de services JEEXPERT (Italie)",
    color: "text-indigo-600",
    iconBg: "bg-indigo-50",
    accent: "from-indigo-600 to-indigo-400",
  },
  {
    href: "/generator/payment-receipt",
    icon: ReceiptText,
    label: "Paiement Receipt",
    desc: "Generate proof of payment documents",
    color: "text-emerald-600",
    iconBg: "bg-emerald-50",
    accent: "from-emerald-600 to-teal-400",
  },
  {
    href: "/generator/paiement",
    icon: CreditCard,
    label: "Paiement",
    desc: "Fetch and review payments from Airtable",
    color: "text-violet-600",
    iconBg: "bg-violet-50",
    accent: "from-violet-600 to-violet-400",
  },
  {
    href: "/generator/proposal-italy",
    icon: FileSpreadsheet,
    label: "Proposal Italy",
    desc: "Generate study abroad proposals",
    color: "text-amber-600",
    iconBg: "bg-amber-50",
    accent: "from-amber-500 to-orange-400",
  },
]

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert" className="h-11 w-11 rounded-xl" />
            <div>
              <h1 className="text-lg font-bold text-[rgb(41,84,144)] leading-tight">JEEXPERT ERP Light</h1>
              <p className="text-xs text-slate-400">Your Academic Journey Abroad Starts Here</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a6e] to-[rgb(41,84,144)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Modules
          </Link>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Generator</p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Create Documents</h2>
          <p className="mt-1.5 text-blue-200 text-sm">Professional documents for your business.</p>
        </div>
      </div>

      {/* Document types */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">Document Types</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GENERATORS.map((gen) => {
            const Icon = gen.icon
            return (
              <Link
                key={gen.label}
                href={gen.href}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:border-slate-200"
              >
                <div className={`h-1 bg-gradient-to-r ${gen.accent}`} />
                <div className="flex items-center gap-4 p-5">
                  <div className={`w-12 h-12 rounded-xl ${gen.iconBg} ${gen.color} flex items-center justify-center flex-shrink-0 transition-colors`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{gen.label}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{gen.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
