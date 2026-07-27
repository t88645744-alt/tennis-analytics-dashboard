"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Repeat } from "lucide-react"
import { players, rallyLength } from "@/lib/mock-data"
import { ChartCard } from "./chart-card"
import { ChartTooltip } from "./chart-tooltip"

const labelMap = { a: players.a.name, b: players.b.name }

export function RallyChart() {
  return (
    <ChartCard
      title="Rally уртаар хожсон оноо"
      description="Цохилтын тооны бүлгээр хожсон онооны хуваарилалт"
      icon={Repeat}
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rallyLength}
            layout="vertical"
            barGap={2}
            margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="range"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
              content={<ChartTooltip labelMap={labelMap} />}
            />
            <Bar dataKey="a" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={16} />
            <Bar dataKey="b" fill="var(--chart-2)" radius={[0, 4, 4, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground text-pretty">
        {players.b.name} урт rally-д (10+) илүү давуутай байна
      </p>
    </ChartCard>
  )
}
