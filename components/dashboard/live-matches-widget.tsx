"use client"

import { useCallback, useEffect, useState } from "react"
import { Activity, RefreshCw, Radio, CircleAlert as AlertCircle } from "lucide-react"
import type { LiveMatch } from "@/lib/sportradar"

type ApiResponse = {
  data: LiveMatch[]
  source: "live" | "mock"
  error?: string
}

function ScorePill({ sets }: { sets: number[] }) {
  if (sets.length === 0) return null
  return (
    <span className="flex items-center gap-0.5 font-mono text-xs">
      {sets.map((s, i) => (
        <span
          key={i}
          className="inline-flex min-w-5 justify-center rounded bg-secondary/60 px-1 py-0.5 text-secondary-foreground"
        >
          {s}
        </span>
      ))}
    </span>
  )
}

function MatchCard({ match }: { match: LiveMatch }) {
  const isLive = match.status === "live" || match.matchStatus != null
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground text-pretty">
          {match.tournamentName}
        </span>
        {isLive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
            LIVE
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">{match.home.name}</span>
          <div className="flex items-center gap-2">
            <ScorePill sets={match.home.setScores} />
            <span className="font-mono text-lg font-bold" style={{ color: "var(--chart-1)" }}>
              {match.home.score}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">{match.away.name}</span>
          <div className="flex items-center gap-2">
            <ScorePill sets={match.away.setScores} />
            <span className="font-mono text-lg font-bold" style={{ color: "var(--chart-3)" }}>
              {match.away.score}
            </span>
          </div>
        </div>
      </div>

      {match.gameScore && (
        <div className="mt-3 border-t border-border pt-2 text-center">
          <span className="font-mono text-xs text-muted-foreground">
            Одоогийн гэйм: {match.gameScore}
          </span>
        </div>
      )}
    </div>
  )
}

export function LiveMatchesWidget() {
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await fetch("/api/tennis?type=live", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as ApiResponse
      setResult(json)
    } catch {
      setResult({
        data: [],
        source: "mock",
        error: "Хүсэлт амжилтгүй — дараа дахин оролдоно уу.",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(() => fetchData(true), 30000)
    return () => clearInterval(id)
  }, [fetchData])

  return (
    <section
      className="flex flex-col rounded-2xl border border-border bg-card p-5"
      aria-label="Live Matches"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "color-mix(in oklch, var(--chart-1) 18%, transparent)" }}
          >
            <Radio className="size-4.5" style={{ color: "var(--chart-1)" }} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Цаг үеийн тоглолтууд</h3>
            <p className="text-xs text-muted-foreground text-pretty">
              Sportradar-аас бодит цаг агаарын оноо.
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-secondary/40 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          aria-label="Шинэчлэх"
        >
          <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
        </button>
      </div>

      {result?.source === "mock" && result.error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-pretty">
            Бодит дата түр хүрэхгүй байна — туршилтын дата харуулж байна. ({result.error})
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Activity className="size-4 animate-pulse" aria-hidden="true" />
          Тоглолтууд ачаалж байна…
        </div>
      ) : result && result.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
          Одоогоор live тоглолт алга байна.
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block size-2 rounded-full"
            style={{ background: result?.source === "live" ? "var(--chart-1)" : "var(--muted-foreground)" }}
            aria-hidden="true"
          />
          {result?.source === "live" ? "Бодит дата" : "Mock дата"}
        </span>
        <span>30 сек бүр шинэчлэгдэнэ</span>
      </div>
    </section>
  )
}
