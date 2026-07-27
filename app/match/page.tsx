import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MatchView } from "@/components/match/match-view"

export default function MatchPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Тоглолтын гүнзгий шинжилгээ
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Талбайн дээрх цохилтууд, rally уртаар хожсон оноо ба тоглолтын явцын динамик — нэг дэлгэцэнд.
          </p>
        </div>

        <MatchView />

        <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p className="text-pretty">
            AceMetrics · Демо дата дээр суурилсан туршилтын хувилбар. Дараагийн шатанд real-time API-тай холбогдоно.
          </p>
        </footer>
      </main>
    </div>
  )
}
