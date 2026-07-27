import type { RosterPlayer } from "@/lib/players-data"

type StatDef = {
  key: keyof RosterPlayer["stats"]
  label: string
  unit: string
  higherIsBetter: boolean
}

const STATS: StatDef[] = [
  { key: "firstServePct", label: "First Serve %", unit: "%", higherIsBetter: true },
  { key: "aces", label: "Aces (дундаж)", unit: "", higherIsBetter: true },
  { key: "bpSaved", label: "Break Points Saved", unit: "%", higherIsBetter: true },
  { key: "unforcedErrors", label: "Unforced Errors", unit: "", higherIsBetter: false },
  { key: "winners", label: "Winners (дундаж)", unit: "", higherIsBetter: true },
  { key: "returnPtsWon", label: "Return Points Won", unit: "%", higherIsBetter: true },
]

type Props = {
  a: RosterPlayer
  b: RosterPlayer
}

export function H2HComparisonBars({ a, b }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {STATS.map((stat) => {
        const av = a.stats[stat.key]
        const bv = b.stats[stat.key]
        const max = Math.max(av, bv) || 1
        const aWidth = (av / max) * 100
        const bWidth = (bv / max) * 100
        // Аль тоглогч энэ үзүүлэлтээр давуу вэ
        const aBetter = stat.higherIsBetter ? av > bv : av < bv
        const bBetter = stat.higherIsBetter ? bv > av : bv < av

        return (
          <div key={stat.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span
                className={`font-mono tabular-nums ${aBetter ? "font-bold" : "text-muted-foreground"}`}
                style={aBetter ? { color: "var(--chart-1)" } : undefined}
              >
                {av}
                {stat.unit}
              </span>
              <span className="font-medium text-muted-foreground">{stat.label}</span>
              <span
                className={`font-mono tabular-nums ${bBetter ? "font-bold" : "text-muted-foreground"}`}
                style={bBetter ? { color: "var(--chart-2)" } : undefined}
              >
                {bv}
                {stat.unit}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {/* Тоглогч A — баруунаас зүүн тийш */}
              <div className="flex h-2.5 flex-1 justify-end overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${aWidth}%`, backgroundColor: "var(--chart-1)", opacity: aBetter ? 1 : 0.5 }}
                  aria-hidden="true"
                />
              </div>
              {/* Тоглогч B — зүүнээс баруун тийш */}
              <div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${bWidth}%`, backgroundColor: "var(--chart-2)", opacity: bBetter ? 1 : 0.5 }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
