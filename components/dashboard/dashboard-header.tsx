import { Activity, CircleDot, Search } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CircleDot className="size-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">AceMetrics</p>
            <p className="text-xs text-muted-foreground">Tennis Deep Analytics</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Үндсэн цэс">
          {["Тойм", "Тоглогчид", "Тоглолтууд", "H2H", "Тайлан"].map((item, i) => (
            <a
              key={item}
              href="#"
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                i === 0
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground sm:flex">
            <Search className="size-4" aria-hidden="true" />
            <span className="pr-8">Тоглогч хайх…</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
            <Activity className="size-3.5" aria-hidden="true" />
            LIVE
          </div>
        </div>
      </div>
    </header>
  )
}
