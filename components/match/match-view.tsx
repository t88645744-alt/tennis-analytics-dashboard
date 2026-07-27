"use client"

import { useMemo, useState } from "react"
import { ListFilter as Filter, MapPin, Repeat, Timer, TrendingUp, Trophy } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { matchInfo, players } from "@/lib/mock-data"
import {
  type Shot,
  type ShotOutcome,
  matchMomentum,
  rallyWinDist,
  setBreaks,
  shots,
} from "@/lib/match-data"
import { ChartCard } from "@/components/dashboard/chart-card"
import { TennisCourt } from "@/components/match/tennis-court"

type PlayerFilter = "a" | "b" | "both"
type OutcomeFilter = "all" | ShotOutcome

const OUTCOME_META: Record<ShotOutcome, { label: string; color: string }> = {
  winner: { label: "Winner", color: "var(--chart-1)" },
  error: { label: "Алдаа", color: "var(--destructive)" },
  in: { label: "Тоглоомд", color: "var(--muted-foreground)" },
}

function MomentumTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: Array<{ value?: number }>
}) {
  if (!active || !payload?.length) return null
  const diff = payload[0].value ?? 0
  const leader = diff >= 0 ? players.a.name : players.b.name
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      <p className="text-muted-foreground">
        Давуу тал:{" "}
        <span className={diff >= 0 ? "text-primary" : "text-accent"}>{leader}</span>
      </p>
      <p className="font-mono text-popover-foreground">
        Зөрүү: {diff > 0 ? "+" : ""}
        {diff}
      </p>
    </div>
  )
}

function CourtPanel() {
  const [mode, setMode] = useState<"shots" | "heatmap">("shots")
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>("both")
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("all")

  const filteredShots = useMemo(() => {
    return shots.filter((s) => {
      if (playerFilter !== "both" && s.player !== playerFilter) return false
      if (outcomeFilter !== "all" && s.outcome !== outcomeFilter) return false
      return true
    })
  }, [playerFilter, outcomeFilter])

  return (
    <ChartCard
      title="Талбайн дээрх цохилтууд"
      description="Бөмбөг хаашаа унасныг харуулах Shot Map / Heatmap."
      icon={MapPin}
    >
      {/* Горимын сонголт */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-border bg-secondary/50 p-0.5">
          {(["shots", "heatmap"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "shots" ? "Shot Map" : "Heatmap"}
            </button>
          ))}
        </div>
      </div>

      {/* Талбай */}
      <div className="mx-auto aspect-[240/460] w-full max-w-[280px]">
        <TennisCourt
          shots={filteredShots}
          mode={mode}
          colorA="var(--chart-1)"
          colorB="var(--chart-2)"
        />
      </div>

      {/* Шүүлтүүр */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="size-3.5" aria-hidden="true" />
          <span>Шүүлтүүр</span>
        </div>

        {/* Тоглогчийн шүүлтүүр */}
        <div className="flex flex-wrap gap-1.5">
          {([
            { id: "both", label: "Хоёулаа" },
            { id: "a", label: players.a.name },
            { id: "b", label: players.b.name },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPlayerFilter(opt.id)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                playerFilter === opt.id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Үр дүнгийн шүүлтүүр */}
        <div className="flex flex-wrap gap-1.5">
          {([
            { id: "all", label: "Бүгд" },
            { id: "winner", label: "Winner" },
            { id: "error", label: "Алдаа" },
            { id: "in", label: "Тоглоомд" },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setOutcomeFilter(opt.id)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                outcomeFilter === opt.id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground text-pretty">
        {filteredShots.length} цохилт —{" "}
        {mode === "shots"
          ? "цохилт бүрийг тэмдэглэв"
          : "бөмбөгний нягтралыг харуулав"}
      </p>
    </ChartCard>
  )
}

function RallyChart() {
  const maxPoints = Math.max(...rallyWinDist.flatMap((r) => [r.aPoints, r.bPoints])) || 1

  return (
    <ChartCard
      title="Rally уртаар хожсон оноо"
      description="Цохилтын тооны бүлгээр хожсон онооны хуваарилалт (1-4, 5-8, 9+)."
      icon={Repeat}
    >
      <div className="flex flex-col gap-4">
        {rallyWinDist.map((bucket) => {
          const aLead = bucket.a > bucket.b
          const bLead = bucket.b > bucket.a
          return (
            <div key={bucket.range}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold">{bucket.range} цохилт</span>
                <span className="text-xs text-muted-foreground">{bucket.label}</span>
              </div>

              {/* Хожлын хувь */}
              <div className="mb-2 flex items-center justify-between text-xs">
                <span
                  className={`font-mono tabular-nums ${aLead ? "font-bold" : "text-muted-foreground"}`}
                  style={aLead ? { color: "var(--chart-1)" } : undefined}
                >
                  {bucket.a}%
                </span>
                <span className="text-muted-foreground">хожлын хувь</span>
                <span
                  className={`font-mono tabular-nums ${bLead ? "font-bold" : "text-muted-foreground"}`}
                  style={bLead ? { color: "var(--chart-2)" } : undefined}
                >
                  {bucket.b}%
                </span>
              </div>

              {/* Хожлын хувийн тууз */}
              <div className="mb-3 flex h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full"
                  style={{ width: `${bucket.a}%`, backgroundColor: "var(--chart-1)" }}
                  aria-hidden="true"
                />
                <div
                  className="h-full"
                  style={{ width: `${bucket.b}%`, backgroundColor: "var(--chart-2)" }}
                  aria-hidden="true"
                />
              </div>

              {/* Онооны дүн */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex h-2.5 justify-end overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(bucket.aPoints / maxPoints) * 100}%`,
                        backgroundColor: "var(--chart-1)",
                        opacity: aLead ? 1 : 0.5,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 text-right text-xs font-mono text-muted-foreground">
                    {bucket.aPoints} оноо
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(bucket.bPoints / maxPoints) * 100}%`,
                        backgroundColor: "var(--chart-2)",
                        opacity: bLead ? 1 : 0.5,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 text-xs font-mono text-muted-foreground">
                    {bucket.bPoints} оноо
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground text-pretty">
        {players.b.name} урт rally-д (9+) илүү давуутай байна
      </p>
    </ChartCard>
  )
}

function MomentumChart() {
  return (
    <ChartCard
      title="Тоглолтын динамик (Momentum)"
      description="Онооны хуримтлагдсан зөрүү — дээш = A давуутай, доош = B давуутай."
      icon={TrendingUp}
      className="lg:col-span-2"
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={matchMomentum} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="matchMomA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="matchMomB" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="game"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<MomentumTooltip />} />
            <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeOpacity={0.5} />
            {setBreaks.map((g) => (
              <ReferenceLine
                key={g}
                x={g}
                stroke="var(--border)"
                strokeDasharray="4 4"
              />
            ))}
            <Area
              type="monotone"
              dataKey="diff"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#matchMomA)"
              activeDot={{ r: 4, fill: "var(--chart-1)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full bg-primary" aria-hidden="true" />
          {players.a.name} давамгайлж байгаа мөчүүд
        </span>
        <span className="flex items-center gap-1.5">
          {players.b.name}
          <span className="inline-block size-2.5 rounded-full bg-accent" aria-hidden="true" />
        </span>
      </div>
    </ChartCard>
  )
}

export function MatchView() {
  return (
    <div className="flex flex-col gap-6">
      {/* Тоглолтын тойм баннер */}
      <section
        className="rounded-2xl border border-border bg-card p-5 sm:p-6"
        aria-label="Тоглолтын тойм"
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

        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-3">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full text-xl ring-2"
              style={{
                backgroundColor: `color-mix(in oklch, ${players.a.color} 18%, transparent)`,
                color: players.a.color,
                ["--tw-ring-color" as string]: players.a.color,
              }}
              aria-hidden="true"
            >
              {players.a.countryFlag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{players.a.name}</h2>
                {matchInfo.winner === "a" && (
                  <Trophy className="size-4 text-accent" aria-label="Ялагч" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                #{players.a.rank} · {players.a.country}
              </p>
            </div>
          </div>

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

          <div className="flex items-center gap-3 md:flex-row-reverse md:text-right">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full text-xl ring-2"
              style={{
                backgroundColor: `color-mix(in oklch, ${players.b.color} 18%, transparent)`,
                color: players.b.color,
                ["--tw-ring-color" as string]: players.b.color,
              }}
              aria-hidden="true"
            >
              {players.b.countryFlag}
            </div>
            <div>
              <div className="flex items-center gap-2 md:flex-row-reverse">
                <h2 className="text-lg font-semibold tracking-tight">{players.b.name}</h2>
                {matchInfo.winner === "b" && (
                  <Trophy className="size-4 text-accent" aria-label="Ялагч" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                #{players.b.rank} · {players.b.country}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Гол агуулга */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CourtPanel />
        <RallyChart />
        <MomentumChart />
      </div>
    </div>
  )
}
