"use client"

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
import { TrendingUp } from "lucide-react"
import { momentum, players } from "@/lib/mock-data"
import { ChartCard } from "./chart-card"

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

export function MomentumChart() {
  return (
    <ChartCard
      title="Тоглолтын динамик (Momentum)"
      description="Онооны хуримтлагдсан зөрүү — дээш = A давуутай, доош = B давуутай"
      icon={TrendingUp}
      className="lg:col-span-2"
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={momentum} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="momA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="momB" x1="0" y1="1" x2="0" y2="0">
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
            <Area
              type="monotone"
              dataKey="diff"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#momA)"
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
