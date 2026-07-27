"use client"

import { useMemo, useState } from "react"
import { ArrowLeftRight, BarChart3, LandPlot, Radar } from "lucide-react"
import { getH2H, getPlayer } from "@/lib/players-data"
import { ChartCard } from "@/components/dashboard/chart-card"
import { PlayerSelect } from "./player-select"
import { H2HPlayers } from "./h2h-players"
import { H2HComparisonBars } from "./h2h-comparison-bars"
import { H2HRadar } from "./h2h-radar"
import { H2HSurface } from "./h2h-surface"

export function H2HView() {
  const [aId, setAId] = useState("djk")
  const [bId, setBId] = useState("alc")

  const a = useMemo(() => getPlayer(aId), [aId])
  const b = useMemo(() => getPlayer(bId), [bId])
  const h2h = useMemo(() => getH2H(aId, bId), [aId, bId])

  function swap() {
    setAId(bId)
    setBId(aId)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Тоглогч сонгох */}
      <section className="rounded-2xl border border-border bg-card p-5" aria-label="Тоглогч сонгох">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <PlayerSelect
            label="Тоглогч 1"
            value={aId}
            onChange={setAId}
            disabledId={bId}
            accent="var(--chart-1)"
          />
          <button
            type="button"
            onClick={swap}
            className="mb-0.5 flex size-10 items-center justify-center self-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground sm:self-end"
            aria-label="Тоглогчдыг солих"
          >
            <ArrowLeftRight className="size-4" aria-hidden="true" />
          </button>
          <PlayerSelect
            label="Тоглогч 2"
            value={bId}
            onChange={setBId}
            disabledId={aId}
            accent="var(--chart-2)"
          />
        </div>
      </section>

      {/* Профайл + H2H оноо */}
      <H2HPlayers a={a} b={b} h2h={h2h} />

      {/* Статистик харьцуулалт + радар */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Статистикийн харьцуулалт"
          description="Улирлын дундаж үзүүлэлт. Тодруулсан тал нь давуутай."
          icon={BarChart3}
        >
          <H2HComparisonBars a={a} b={b} />
        </ChartCard>

        <ChartCard
          title="Ерөнхий чадварын профайл"
          description="Зургаан үндсэн үзүүлэлтийг хэвийн болгож харьцуулав."
          icon={Radar}
        >
          <H2HRadar a={a} b={b} />
        </ChartCard>
      </div>

      {/* Хөрсний дагуух амжилт */}
      <ChartCard
        title="Хөрсний дагуух амжилт"
        description="Карьерын хожлын хувь болон хоорондын тулааны үр дүн (Hard / Clay / Grass)."
        icon={LandPlot}
      >
        <H2HSurface a={a} b={b} h2hSurfaces={h2h.surfaces} />
      </ChartCard>
    </div>
  )
}
