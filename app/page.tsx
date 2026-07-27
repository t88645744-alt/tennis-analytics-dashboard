import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MatchHero } from "@/components/dashboard/match-hero"
import { KeyStats } from "@/components/dashboard/key-stats"
import { ServeChart } from "@/components/dashboard/serve-chart"
import { ShotDirectionChart } from "@/components/dashboard/shot-direction-chart"
import { MomentumChart } from "@/components/dashboard/momentum-chart"
import { RallyChart } from "@/components/dashboard/rally-chart"

export default function DashboardPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Тоглолтын гүнзгий аналитик
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Тоглогчдын харьцуулалт, serve-ийн үзүүлэлт, цохилтын чиглэл болон онооны динамик — нэг дэлгэцэнд.
          </p>
        </div>

        <MatchHero />

        <KeyStats />

        <MomentumChart />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ServeChart />
          <ShotDirectionChart />
          <RallyChart />
        </div>

        <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p className="text-pretty">
            AceMetrics · Демо дата дээр суурилсан туршилтын хувилбар. Дараагийн шатанд real-time API-тай холбогдоно.
          </p>
        </footer>
      </main>
    </div>
  )
}
