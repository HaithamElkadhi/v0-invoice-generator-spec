import Link from "next/link"
import { FileText, FileSpreadsheet, ArrowLeft } from "lucide-react"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="Jeexpert Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-[rgb(41,84,144)]">JEEXPERT ERP Light</h1>
              <p className="text-sm text-muted-foreground">Your Academic Journey Abroad Starts Here</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[rgb(41,84,144)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Modules
        </Link>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Generator</h2>
          <p className="mt-1 text-muted-foreground">Create professional documents for your business</p>
        </div>

        {/* Generator Tiles */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Invoice - Active */}
          <Link
            href="/generator/invoice"
            className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 shadow-sm transition-all hover:border-[rgb(41,84,144)] hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(41,84,144)]/10 text-[rgb(41,84,144)] transition-colors group-hover:bg-[rgb(41,84,144)] group-hover:text-white">
              <FileText className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Invoice</h3>
              <p className="mt-1 text-sm text-muted-foreground">Generate professional invoices</p>
            </div>
          </Link>

          <Link
            href="/generator/proposal-italy"
            className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 shadow-sm transition-all hover:border-[rgb(41,84,144)] hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(41,84,144)]/10 text-[rgb(41,84,144)] transition-colors group-hover:bg-[rgb(41,84,144)] group-hover:text-white">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Proposal Italy</h3>
              <p className="mt-1 text-sm text-muted-foreground">Generate study abroad proposals</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
