"use client"

import { TriangleAlert as AlertTriangle, Activity, Flame, TrendingDown, Scale } from "lucide-react"
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
import { liveMomentum, players, type FormStatus, type PlayerForm } from "@/lib/mock-data"

const STATUS_META: Record<
  FormStatus,
  { label: string; icon: typeof Flame; color: string; bg: string }
> = {
  fire: {
    label: "High Momentum / On Fire",
    icon: Flame,
    color: "var(--chart-1)",
    bg: "color-mix(in oklch, var(--chart-1) 18%, transparent)",
  },
  dropping: {
    label: "Dropping Form / Errors Rising",
    icon: TrendingDown,
    color: "var(--destructive)",
    bg: "color-mix(in oklch, var(--destructive) 18%, transparent)",
  },
  stable: {
    label: "Stable / Neutral",
    icon: Scale,
    color: "var(--muted-foreground)",
    bg: "color-mix(in oklch, var(--muted-foreground) 18%, transparent)",
  },
}

function StatusBadge({ form, name }: { form: PlayerForm; name: string }) {
  const meta = STATUS_META[form.status]
  const Icon = meta.icon
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm font-semibold">{name}</span>
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
        style={{ background: meta.bg, color: meta.color }}
      >
        <Icon className="size-3" aria-hidden="true" />
        {meta.label}
      </span>
    </div>
  )
}

function RecentPoints({ form }: { form: PlayerForm }) {
  const color = form.player === "a" ? "var(--chart-1)" : "var(--chart-3)"
  return (
    <div className="flex items-center gap-1">
      {form.recentPoints.map((p, i) => (
        <span
          key={i}
          className="size-2.5 rounded-full transition-colors"
          style={{
            background: p === 1 ? color : "var(--muted)",
            opacity: p === 1 ? 1 : 0.4,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function MomentumTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: Array<{ value?: number; dataKey?: string }>
}) {
  if (!active || !payload?.length) return null
  const aVal = payload.find((p) => p.dataKey === "a")?.value ?? 0
  const bVal = payload.find((p) => p.dataKey === "b")?.value ?? 0
  const leader = aVal + bVal > 0 ? players.a.name : bVal > 0 ? players.b.name : "Тэнцвэртэй"
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      <p className="text-muted-foreground">
        Давуу тал: <span className="text-foreground">{leader}</span>
      </p>
    </div>
  )
}

function BreakPointAlarm() {
  const alarm = liveMomentum.breakPointAlarm
  if (!alarm.active) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-xs text-muted-foreground">
        <Activity className="size-4" aria-hidden="true" />
        Break point дарамт байхгүй — хоёр талаа тогтвортой.
      </div>
    )
  }
  const severityColor =
    alarm.severity === "high"
      ? "var(--destructive)"
      : alarm.severity === "medium"
        ? "var(--accent)"
        : "var(--muted-foreground)"
  const playerName = alarm.player === "a" ? players.a.name : players.b.name
  return (
    <div
      className="flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs"
      style={{
        borderColor: `color-mix(in oklch, ${severityColor} 40%, transparent)`,
        background: `color-mix(in oklch, ${severityColor} 12%, transparent)`,
      }}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" style={{ color: severityColor }} aria-hidden="true" />
      <div>
        <p className="font-semibold" style={{ color: severityColor }}>
          Break Point Alarm — {playerName}
        </p>
        <p className="mt-0.5 text-muted-foreground text-pretty">{alarm.message}</p>
      </div>
    </div>
  )
}

export function LiveMomentumWidget() {
  const [aForm, bForm] = liveMomentum.players
  return (
    <section
      className="flex flex-col rounded-2xl border border-border bg-card p-5"
      aria-label="Live Player Momentum & Form Status"
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "color-mix(in oklch, var(--chart-3) 18%, transparent)" }}
        >
          <Activity className="size-4.5" style={{ color: "var(--chart-3)" }} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Тоглогчдын momentum & форм</h3>
          <p className="text-xs text-muted-foreground text-pretty">
            Одоогийн төлөв, сэт бүрийн динамик, break point дарамт.
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { form: aForm, name: players.a.name },
          { form: bForm, name: players.b.name },
        ].map(({ form, name }) => (
          <div key={form.player} className="rounded-xl border border-border bg-secondary/30 p-3">
            <StatusBadge form={form} name={name} />
            <div className="mt-2.5 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Дараалал:</span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: form.streak > 0 ? "var(--chart-1)" : "var(--destructive)" }}
                >
                  {form.streak > 0 ? `+${form.streak}` : form.streak}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Break point аваалт:</span>
                <span className="font-mono text-foreground">
                  {form.breakPointsSaved}/{form.breakPointsFaced}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Алдааны чиг хандлага:</span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: form.unforcedErrorsTrend > 0 ? "var(--destructive)" : "var(--chart-1)" }}
                >
                  {form.unforcedErrorsTrend > 0 ? `+${form.unforcedErrorsTrend}` : form.unforcedErrorsTrend}
                </span>
              </div>
              <div className="pt-1">
                <span className="mb-1 block">Сүүлийн оноо:</span>
                <RecentPoints form={form} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full" style={{ background: "var(--chart-1)" }} aria-hidden="true" />
          {players.a.name}
        </span>
        <span className="font-medium">Сэт бүрийн momentum</span>
        <span className="flex items-center gap-1.5">
          {players.b.name}
          <span className="inline-block size-2.5 rounded-full" style={{ background: "var(--chart-3)" }} aria-hidden="true" />
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={liveMomentum.setMomentum} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="liveMomA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="liveMomB" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="set"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[-100, 100]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<MomentumTooltip />} />
            <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeOpacity={0.5} />
            <Area
              type="monotone"
              dataKey="a"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#liveMomA)"
              activeDot={{ r: 4, fill: "var(--chart-1)" }}
            />
            <Area
              type="monotone"
              dataKey="b"
              stroke="var(--chart-3)"
              strokeWidth={2}
              fill="url(#liveMomB)"
              activeDot={{ r: 4, fill: "var(--chart-3)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5">
        <BreakPointAlarm />
      </div>
    </section>
  )
}
