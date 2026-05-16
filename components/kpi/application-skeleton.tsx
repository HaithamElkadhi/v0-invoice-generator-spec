export function ApplicationSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-14 rounded-xl bg-slate-200" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="h-96 rounded-2xl bg-slate-200" />
      <div className="h-[492px] rounded-2xl bg-slate-200" />
    </div>
  )
}
