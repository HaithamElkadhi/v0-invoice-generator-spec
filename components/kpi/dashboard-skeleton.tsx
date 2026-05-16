export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8 animate-pulse">
      <div className="h-16 rounded-2xl bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-2xl bg-slate-200" />
        <div className="h-72 rounded-2xl bg-slate-200" />
      </div>
      <div className="h-80 rounded-2xl bg-slate-200" />
      <div className="h-40 rounded-2xl bg-slate-200" />
    </div>
  )
}
