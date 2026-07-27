"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import type { RosterPlayer } from "@/lib/players-data"
import { ChartTooltip } from "@/components/dashboard/chart-tooltip"

type Props = {
  a: RosterPlayer
  b: RosterPlayer
}

export function H2HRadar({ a, b }: Props) {
  // Үзүүлэлтүүдийг 0-100 хооронд хэвийн (normalize) болгож радарт харуулна.
  const data = [
    { metric: "Serve", a: a.stats.firstServePct, b: b.stats.firstServePct },
    { metric: "Aces", a: Math.min(100, a.stats.aces * 7), b: Math.min(100, b.stats.aces * 7) },
    { metric: "BP аврал", a: a.stats.bpSaved, b: b.stats.bpSaved },
    { metric: "Winners", a: Math.min(100, a.stats.winners * 2), b: Math.min(100, b.stats.winners * 2) },
    { metric: "Return", a: a.stats.returnPtsWon, b: b.stats.returnPtsWon },
    {
      metric: "Тогтвор",
      a: Math.max(0, 100 - a.stats.unforcedErrors * 2.4),
      b: Math.max(0, 100 - b.stats.unforcedErrors * 2.4),
    },
  ]

  const labelMap = { a: a.name, b: b.name }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Radar
            name={a.name}
            dataKey="a"
            stroke="var(--chart-1)"
            fill="var(--chart-1)"
            fillOpacity={0.35}
            strokeWidth={2}
          />
          <Radar
            name={b.name}
            dataKey="b"
            stroke="var(--chart-2)"
            fill="var(--chart-2)"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip content={<ChartTooltip labelMap={labelMap} />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
