import type { ReactNode } from "react"

type TooltipEntry = {
  name?: string
  value?: number | string
  color?: string
  dataKey?: string | number
  payload?: Record<string, unknown>
}

type ChartTooltipProps = {
  active?: boolean
  label?: ReactNode
  payload?: TooltipEntry[]
  unit?: string
  labelMap?: Record<string, string>
}

export function ChartTooltip({ active, label, payload, unit = "", labelMap }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      {label != null && (
        <p className="mb-1.5 font-medium text-popover-foreground">{label}</p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((entry, i) => {
          const key = String(entry.dataKey ?? entry.name ?? i)
          return (
            <div key={i} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                {labelMap?.[key] ?? entry.name}
              </span>
              <span className="font-mono font-medium text-popover-foreground">
                {entry.value}
                {unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
