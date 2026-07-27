"use client"

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import { Target } from "lucide-react"
import { players, shotDirection } from "@/lib/mock-data"
import { ChartCard } from "./chart-card"
import { ChartTooltip } from "./chart-tooltip"

const labelMap = { a: players.a.name, b: players.b.name }

export function ShotDirectionChart() {
  return (
    <ChartCard
      title="Цохилтын чиглэл"
      description="Талбайн бүсээр цохилтын үр дүн (winners %)"
      icon={Target}
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={shotDirection} outerRadius="72%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="zone"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip unit="%" labelMap={labelMap} />} />
            <Radar
              name={players.a.name}
              dataKey="a"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.35}
            />
            <Radar
              name={players.b.name}
              dataKey="b"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
