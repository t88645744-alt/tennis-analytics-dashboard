import { MapPin, Timer, Trophy } from "lucide-react"
import { headToHead, matchInfo, players } from "@/lib/mock-data"

function PlayerBadge({
  side,
  align,
}: {
  side: "a" | "b"
  align: "left" | "right"
}) {
  const p = players[side]
  const isWinner = matchInfo.winner === side
  return (
    <div
      className={`flex items-center gap-3 ${
        align === "right" ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-full text-2xl ring-2"
        style={{
          backgroundColor: `color-mix(in oklch, ${p.color} 18%, transparent)`,
          color: p.color,
          // @ts-expect-error CSS custom ring color
          "--tw-ring-color": p.color,
        }}
        aria-hidden="true"
      >
        {p.countryFlag}
      </div>
      <div>
        <div
          className={`flex items-center gap-2 ${
            align === "right" ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{p.name}</h2>
          {isWinner && (
            <Trophy className="size-4 text-accent" aria-label="Ялагч" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          #{p.rank} · {p.country} · {p.age} нас
        </p>
      </div>
    </div>
  )
}

export function MatchHero() {
  const total = headToHead.totalMeetings
  const aPct = Math.round((headToHead.aWins / total) * 100)

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
      aria-label="Тоглолтын тойм ба head-to-head"
    >
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-accent/15 px-2.5 py-1 font-medium text-accent">
          {matchInfo.tournament} · {matchInfo.round}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden="true" />
          {matchInfo.court} · {matchInfo.surface}
        </span>
        <span className="flex items-center gap-1">
          <Timer className="size-3.5" aria-hidden="true" />
          {matchInfo.duration}
        </span>
      </div>

      {/* Тоглогчид ба оноо */}
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <PlayerBadge side="a" align="left" />

        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {matchInfo.scoreline.map((s) => {
            const aWon = s.a > s.b
            return (
              <div
                key={s.set}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-2 sm:px-3"
              >
                <span
                  className={`font-mono text-lg font-bold leading-none ${
                    aWon ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s.a}
                </span>
                <span className="h-px w-4 bg-border" aria-hidden="true" />
                <span
                  className={`font-mono text-lg font-bold leading-none ${
                    !aWon ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {s.b}
                </span>
              </div>
            )
          })}
        </div>

        <PlayerBadge side="b" align="right" />
      </div>

      {/* Head-to-head туузан диаграм */}
      <div className="mt-6 border-t border-border pt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-mono font-semibold text-primary">{headToHead.aWins}</span>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Head-to-Head ({total})
          </span>
          <span className="font-mono font-semibold text-accent">{headToHead.bWins}</span>
        </div>
        <div
          className="flex h-2.5 overflow-hidden rounded-full bg-secondary"
          role="img"
          aria-label={`Уулзалтын түүх: ${players.a.name} ${headToHead.aWins} - ${headToHead.bWins} ${players.b.name}`}
        >
          <div className="h-full bg-primary" style={{ width: `${aPct}%` }} />
          <div className="h-full bg-accent" style={{ width: `${100 - aPct}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {headToHead.surfaces.map((s) => (
            <div
              key={s.surface}
              className="rounded-lg bg-secondary/40 px-3 py-2 text-center"
            >
              <p className="text-xs text-muted-foreground">{s.surface}</p>
              <p className="font-mono text-sm font-semibold">
                <span className="text-primary">{s.a}</span>
                <span className="text-muted-foreground"> - </span>
                <span className="text-accent">{s.b}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
