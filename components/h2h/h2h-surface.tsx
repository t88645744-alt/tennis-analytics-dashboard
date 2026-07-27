"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Mountain, Trees, Waves } from "lucide-react"
import type { RosterPlayer, Surface } from "@/lib/players-data"
import { winPct } from "@/lib/players-data"
import { ChartTooltip } from "@/components/dashboard/chart-tooltip"

type Props = {
  a: RosterPlayer
  b: RosterPlayer
  h2hSurfaces: { surface: Surface; a: number; b: number }[]
}

const SURFACE_META: Record<Surface, { icon: typeof Mountain; color: string; label: string }> = {
  Hard: { icon: Waves, color: "var(--chart-3)", label: "Hard" },
  Clay: { icon: Mountain, color: "var(--chart-2)", label: "Clay" },
  Grass: { icon: Trees, color: "var(--chart-1)", label: "Grass" },
}

export function H2HSurface({ a, b, h2hSurfaces }: Props) {
  // Хөрс тус бүрийн хожлын хувь (career)
  const chartData = (["Hard", "Clay", "Grass"] as Surface[]).map((s) => {
    const ar = a.surfaces.find((x) => x.surface === s)!
    const br = b.surfaces.find((x) => x.surface === s)!
    return {
      surface: s,
      a: winPct(ar.wins, ar.losses),
      b: winPct(br.wins, br.losses),
    }
  })

  const labelMap = { a: a.name, b: b.name }

  return (
    <div className="flex flex-col gap-6">
      {/* Хөрсний карьерын хожлын хувь график */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={6} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="surface"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip cursor={{ fill: "var(--secondary)", opacity: 0.4 }} content={<ChartTooltip unit="%" labelMap={labelMap} />} />
            <Bar dataKey="a" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={34} />
            <Bar dataKey="b" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={34} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Хөрс тус бүрийн H2H тулааны үр дүн */}
      <div className="grid grid-cols-3 gap-3">
        {h2hSurfaces.map(({ surface, a: aw, b: bw }) => {
          const meta = SURFACE_META[surface]
          const Icon = meta.icon
          return (
            <div key={surface} className="rounded-xl border border-border bg-secondary/40 p-3 text-center">
              <div className="mb-1.5 flex items-center justify-center gap-1.5">
                <Icon className="size-3.5" style={{ color: meta.color }} aria-hidden="true" />
                <span className="text-xs font-medium text-muted-foreground">{meta.label}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 font-bold tabular-nums">
                <span style={{ color: "var(--chart-1)" }}>{aw}</span>
                <span className="text-xs text-muted-foreground">:</span>
                <span style={{ color: "var(--chart-2)" }}>{bw}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
