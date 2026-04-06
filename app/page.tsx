import Link from "next/link"
import { FileText, Mail, BookOpen, Layers, MessageCircle } from "lucide-react"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"

export default function HomePage() {
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Modules</h2>
          <p className="mt-1 text-muted-foreground">Select a module to get started</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* WhatsApp - templates & compose */}
          <Link
            href="/whatsapp"
            className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 shadow-sm transition-all hover:border-[rgb(41,84,144)] hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors group-hover:bg-[#25D366] group-hover:text-white">
              <MessageCircle className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">WhatsApp</h3>
              <p className="mt-1 text-sm text-muted-foreground">Templates and quick contact</p>
            </div>
          </Link>

          {/* CRM - Coming Soon */}
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-8 opacity-60">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Layers className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-muted-foreground">CRM</h3>
              <p className="mt-1 text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>

          {/* Mailing - Active */}
          <Link
            href="/mailing"
            className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 shadow-sm transition-all hover:border-[rgb(41,84,144)] hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(41,84,144)]/10 text-[rgb(41,84,144)] transition-colors group-hover:bg-[rgb(41,84,144)] group-hover:text-white">
              <Mail className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Mailing</h3>
              <p className="mt-1 text-sm text-muted-foreground">Send and manage emails</p>
            </div>
          </Link>

          {/* Knowledge Hub */}
          <Link
            href="/knowledge-hub"
            className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 shadow-sm transition-all hover:border-[rgb(41,84,144)] hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(41,84,144)]/10 text-[rgb(41,84,144)] transition-colors group-hover:bg-[rgb(41,84,144)] group-hover:text-white">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Knowledge Hub</h3>
              <p className="mt-1 text-sm text-muted-foreground">Guides and official notes</p>
            </div>
          </Link>

          {/* Generator - Active */}
          <Link
            href="/generator"
            className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 shadow-sm transition-all hover:border-[rgb(41,84,144)] hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(41,84,144)]/10 text-[rgb(41,84,144)] transition-colors group-hover:bg-[rgb(41,84,144)] group-hover:text-white">
              <FileText className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Generator</h3>
              <p className="mt-1 text-sm text-muted-foreground">Create documents</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
