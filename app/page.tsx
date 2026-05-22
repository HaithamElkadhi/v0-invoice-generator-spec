import Link from "next/link"
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  FileText,
  Layers,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  BarChart3,
  Percent,
  Wallet,
  Settings,
  Sparkles,
  UserCircle2,
  Users,
  ArrowRight,
} from "lucide-react"
import { getPictureUrl, PICTURE_LABELS } from "@/lib/pictures"

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Layers, current: true },
  { href: "/whatsapp", label: "WhatsApp", icon: MessageCircle, current: false },
  { href: "/mailing", label: "Mailing", icon: Mail, current: false },
  { href: "/generator/proposal-italy", label: "Proposal Italy", icon: FileSpreadsheet, current: false },
  { href: "/generator", label: "Generator", icon: FileText, current: false },
  { href: "/knowledge-hub", label: "Knowledge Hub", icon: BookOpen, current: false },
  { href: "/kpis", label: "KPIs", icon: BarChart3, current: false },
  { href: "/finance", label: "Finance", icon: Wallet, current: false },
  { href: "#", label: "CRM", icon: Users, current: false, disabled: true },
  { href: "#", label: "Settings", icon: Settings, current: false, disabled: true },
]

const KPIS = [
  {
    href: "/kpis",
    label: "Pipeline admission",
    value: "Live",
    trend: "KPIs Airtable — section Admission",
    icon: BarChart3,
  },
  { label: "Active customers", value: "—", trend: "Voir module KPIs", icon: Users },
  { label: "Conversion rate", value: "—", trend: "Voir module KPIs", icon: Percent },
]

const MODULES = [
  {
    href: "/whatsapp",
    label: "WhatsApp",
    desc: "Message templates and quick contact",
    icon: MessageCircle,
    accent: "from-green-500 to-emerald-600",
    active: true,
  },
  {
    href: "/mailing",
    label: "Mailing",
    desc: "Send and manage campaigns",
    icon: Mail,
    accent: "from-sky-500 to-blue-600",
    active: true,
  },
  {
    href: "/generator/proposal-italy",
    label: "Proposal Italy",
    desc: "Generate study abroad proposals",
    icon: FileSpreadsheet,
    accent: "from-indigo-500 to-violet-600",
    active: true,
  },
  {
    href: "/generator",
    label: "Generator",
    desc: "Invoices, contracts and receipts",
    icon: FileText,
    accent: "from-cyan-500 to-blue-600",
    active: true,
  },
  {
    href: "/knowledge-hub",
    label: "Knowledge Hub",
    desc: "Guides and official notes",
    icon: BookOpen,
    accent: "from-blue-500 to-indigo-600",
    active: true,
  },
  {
    href: "/kpis",
    label: "KPIs",
    desc: "Pipeline admission en temps réel (Airtable)",
    icon: BarChart3,
    accent: "from-violet-500 to-purple-600",
    active: true,
  },
  {
    href: "/finance",
    label: "Finance",
    desc: "Encaissements, devises et tendances paiements",
    icon: Wallet,
    accent: "from-emerald-500 to-teal-600",
    active: true,
  },
  {
    href: "#",
    label: "CRM",
    desc: "Students, leads and pipeline",
    icon: Users,
    accent: "from-slate-400 to-slate-500",
    active: false,
  },
]

const ACTIVITIES = [
  { title: "Proposal generated for Sara Ben Ali", when: "5 minutes ago", type: "Proposal Italy" },
  { title: "WhatsApp follow-up sent to 12 prospects", when: "23 minutes ago", type: "WhatsApp" },
  { title: "Mail campaign 'May Admissions' launched", when: "1 hour ago", type: "Mailing" },
  { title: "Knowledge Hub updated: legalisation checklist", when: "Today, 10:14", type: "Knowledge Hub" },
]

const TASKS = [
  { title: "Review 8 pending proposals", due: "Due today", priority: "High" },
  { title: "Prepare invoice batch for April", due: "Due tomorrow", priority: "Medium" },
  { title: "Call back top 5 CRM leads", due: "This week", priority: "High" },
  { title: "Publish new visa guidance note", due: "This week", priority: "Normal" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="hidden min-h-screen w-72 flex-col border-r border-slate-200/70 bg-[#0f274a] px-5 py-6 text-slate-200 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <img src={getPictureUrl(PICTURE_LABELS.LogoApp)} alt="JEEXPERT logo" className="h-11 w-11 rounded-xl ring-2 ring-white/30" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-100">JEEXPERT ERP</p>
              <p className="text-xs text-slate-400">ERP Light</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const baseClass =
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
              if (item.disabled) {
                return (
                  <div key={item.label} className={`${baseClass} cursor-not-allowed text-slate-400/80`}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${baseClass} ${
                    item.current
                      ? "bg-white/12 text-white shadow-inner"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center gap-2.5">
              <UserCircle2 className="h-9 w-9 rounded-full bg-white/10 p-1.5 text-white" />
              <div>
                <p className="text-sm font-medium text-white">JEEXPERT Team</p>
                <p className="text-xs text-slate-400">Admissions Admin</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex-1" />
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#163867] to-[#1f4f8f] p-6 shadow-lg shadow-blue-900/10 sm:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                      <Sparkles className="h-3.5 w-3.5" />
                      Dashboard
                    </p>
                    <h1 className="text-2xl font-semibold text-white sm:text-3xl">Welcome back</h1>
                    <p className="mt-2 max-w-2xl text-sm text-blue-100">
                      Manage admissions, communication and student workflows from one place.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/generator/proposal-italy"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#163867] transition hover:bg-blue-50"
                    >
                      Create proposal
                    </Link>
                    <Link
                      href="/whatsapp"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      Send WhatsApp
                    </Link>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {KPIS.map((item) => {
                  const Icon = item.icon
                  const card = (
                    <article
                      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition ${
                        "href" in item && item.href ? "hover:-translate-y-0.5 hover:shadow-md" : ""
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">{item.label}</p>
                        <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>
                      <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.trend}</p>
                    </article>
                  )
                  if ("href" in item && item.href) {
                    return (
                      <Link key={item.label} href={item.href} className="block">
                        {card}
                      </Link>
                    )
                  }
                  return <div key={item.label}>{card}</div>
                })}
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {MODULES.map((module) => {
                  const Icon = module.icon
                  const content = (
                    <div className="group relative h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div
                        className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-2.5 text-white shadow-sm ${module.accent}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">{module.label}</h3>
                      <p className="mt-1 text-sm text-slate-600">{module.desc}</p>
                      <div className="mt-5 flex items-center justify-between text-sm">
                        <span className="font-medium text-blue-700">{module.active ? "Open module" : "Coming soon"}</span>
                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
                      </div>
                    </div>
                  )

                  if (!module.active) {
                    return (
                      <article key={module.label} className="cursor-not-allowed opacity-65">
                        {content}
                      </article>
                    )
                  }

                  return (
                    <Link key={module.label} href={module.href} className="block">
                      {content}
                    </Link>
                  )
                })}
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-900">Recent activity</h2>
                    <Clock3 className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="space-y-3">
                    {ACTIVITIES.map((activity) => (
                      <div
                        key={activity.title}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-blue-200 hover:bg-blue-50/40"
                      >
                        <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span>{activity.when}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span>{activity.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-900">Tasks & reminders</h2>
                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="space-y-3">
                    {TASKS.map((task) => (
                      <div
                        key={task.title}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-blue-200 hover:bg-blue-50/40"
                      >
                        <p className="text-sm font-medium text-slate-800">{task.title}</p>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                          <span>{task.due}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-medium ${
                              task.priority === "High"
                                ? "bg-rose-100 text-rose-700"
                                : task.priority === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
