import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

type ChartCardProps = {
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

export function ChartCard({
  title,
  description,
  icon: Icon,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-border bg-card p-5 ${className}`}
      aria-label={title}
    >
      <div className="mb-4 flex items-start gap-3">
        {Icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <Icon className="size-4.5" aria-hidden="true" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground text-pretty">{description}</p>
          )}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  )
}
