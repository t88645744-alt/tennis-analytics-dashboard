import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PlayersView } from "@/components/players/players-view"

export default function PlayersPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Тоглогчид
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Топ тоглогчдын профайл, чансаа ба улирлын статистик — Sportradar Tennis API-аас шинэчлэгдэнэ.
          </p>
        </div>

        <PlayersView />

        <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p className="text-pretty">
            AceMetrics · Sportradar Tennis API v2 холболттой. Бодит дата хүрэхгүй үед туршилтын дата руу шилждэг.
          </p>
        </footer>
      </main>
    </div>
  )
}
