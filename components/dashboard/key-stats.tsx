import { keyStats, players } from "@/lib/mock-data"

function leader(stat: (typeof keyStats)[number]): "a" | "b" | "tie" {
  if (stat.a === stat.b) return "tie"
  const aBetter = stat.higherIsBetter ? stat.a > stat.b : stat.a < stat.b
  return aBetter ? "a" : "b"
}

export function KeyStats() {
  return (
    <section aria-label="Гол статистикийн харьцуулалт">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {keyStats.map((stat) => {
          const win = leader(stat)
          const total = stat.a + stat.b || 1
          const aShare = (stat.a / total) * 100
          return (
            <div
              key={stat.label}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-3.5"
            >
              <p className="mb-3 text-xs font-medium text-muted-foreground text-pretty">
                {stat.label}
              </p>
              <div className="mb-2 flex items-baseline justify-between font-mono">
                <span
                  className={`text-xl font-bold ${
                    win === "a" ? "text-primary" : "text-foreground"
                  }`}
                >
                  {stat.a}
                  {stat.unit}
                </span>
                <span
                  className={`text-xl font-bold ${
                    win === "b" ? "text-accent" : "text-foreground"
                  }`}
                >
                  {stat.b}
                  {stat.unit}
                </span>
              </div>
              <div className="flex h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                <div className="h-full bg-primary" style={{ width: `${aShare}%` }} />
                <div className="h-full bg-accent" style={{ width: `${100 - aShare}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full bg-primary" aria-hidden="true" />
          {players.a.name}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full bg-accent" aria-hidden="true" />
          {players.b.name}
        </span>
      </div>
    </section>
  )
}
