import { Trophy } from "lucide-react"
import { type RosterPlayer, winPct } from "@/lib/players-data"

type PlayerProfileProps = {
  player: RosterPlayer
  accentVar: string
  align: "left" | "right"
}

function PlayerProfile({ player, accentVar, align }: PlayerProfileProps) {
  const pct = winPct(player.careerWins, player.careerLosses)
  return (
    <div
      className={`flex flex-col items-center gap-3 text-center ${
        align === "right" ? "sm:items-end sm:text-right" : "sm:items-start sm:text-left"
      }`}
    >
      <div
        className="size-24 overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-card"
        style={{ ["--tw-ring-color" as string]: accentVar }}
      >
        <img
          src={player.image || "/placeholder.svg"}
          alt={player.fullName}
          className="size-full object-cover"
        />
      </div>
      <div>
        <div className="flex items-center justify-center gap-1.5 sm:justify-start">
          <h3 className="text-lg font-bold tracking-tight">{player.fullName}</h3>
          <span aria-hidden="true">{player.countryFlag}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {player.country} · {player.age} нас · {player.hand}-handed
        </p>
      </div>
      <div
        className={`flex items-center gap-4 ${align === "right" ? "sm:flex-row-reverse" : ""}`}
      >
        <div>
          <p className="text-2xl font-bold" style={{ color: accentVar }}>
            #{player.rank}
          </p>
          <p className="text-xs text-muted-foreground">{player.tour} Rank</p>
        </div>
        <div className="h-8 w-px bg-border" aria-hidden="true" />
        <div>
          <p className="text-2xl font-bold tabular-nums">{pct}%</p>
          <p className="text-xs text-muted-foreground">Хожлын хувь</p>
        </div>
        <div className="h-8 w-px bg-border" aria-hidden="true" />
        <div>
          <p className="flex items-center gap-1 text-2xl font-bold tabular-nums">
            <Trophy className="size-4 text-accent" aria-hidden="true" />
            {player.titles}
          </p>
          <p className="text-xs text-muted-foreground">Цол</p>
        </div>
      </div>
    </div>
  )
}

type H2HPlayersProps = {
  a: RosterPlayer
  b: RosterPlayer
  h2h: { total: number; aWins: number; bWins: number }
}

export function H2HPlayers({ a, b, h2h }: H2HPlayersProps) {
  const total = h2h.aWins + h2h.bWins || 1
  const aShare = (h2h.aWins / total) * 100

  return (
    <section
      className="rounded-2xl border border-border bg-card p-6"
      aria-label="Тоглогчдын профайл харьцуулалт"
    >
      <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
        <PlayerProfile player={a} accentVar="var(--chart-1)" align="left" />

        <div className="flex flex-col items-center gap-2 px-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Head-to-Head
          </span>
          <div className="flex items-center gap-3 text-3xl font-bold tabular-nums">
            <span style={{ color: "var(--chart-1)" }}>{h2h.aWins}</span>
            <span className="text-lg text-muted-foreground">:</span>
            <span style={{ color: "var(--chart-2)" }}>{h2h.bWins}</span>
          </div>
          <span className="text-xs text-muted-foreground">{h2h.total} удаагийн тулаан</span>
        </div>

        <PlayerProfile player={b} accentVar="var(--chart-2)" align="right" />
      </div>

      {/* Head-to-head туузан харьцаа */}
      <div className="mt-6">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full transition-all"
            style={{ width: `${aShare}%`, backgroundColor: "var(--chart-1)" }}
            aria-hidden="true"
          />
          <div
            className="h-full transition-all"
            style={{ width: `${100 - aShare}%`, backgroundColor: "var(--chart-2)" }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          <span>{a.name}</span>
          <span>{b.name}</span>
        </div>
      </div>
    </section>
  )
}
