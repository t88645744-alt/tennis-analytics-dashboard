"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Zap } from "lucide-react"
import { players, serveStats } from "@/lib/mock-data"
import { ChartCard } from "./chart-card"
import { ChartTooltip } from "./chart-tooltip"

const labelMap = { a: players.a.name, b: players.b.name }

export function ServeChart() {
  return (
    <ChartCard
      title="Serve-ийн үзүүлэлт"
      description="Эхний ба хоёр дахь serve-ийн үр дүнгийн харьцуулалт (%)"
      icon={Zap}
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={serveStats} barGap={4} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              unit="%"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
              content={<ChartTooltip unit="%" labelMap={labelMap} />}
            />
            <Bar dataKey="a" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={26} />
            <Bar dataKey="b" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
