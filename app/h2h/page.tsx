import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { H2HView } from "@/components/h2h/h2h-view"

export default function H2HPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Head-to-Head харьцуулалт
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Хоёр тоглогчийг сонгож чансаа, хожлын хувь, гол статистик болон хөрсний дагуух амжилтыг зэрэгцүүлэн харьцуул.
          </p>
        </div>

        <H2HView />

        <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p className="text-pretty">
            AceMetrics · Демо дата дээр суурилсан туршилтын хувилбар. Дараагийн шатанд real-time API-тай холбогдоно.
          </p>
        </footer>
      </main>
    </div>
  )
}
