"use client"

import { Brain, Sparkles, TrendingUp, Trophy } from "lucide-react"
import { matchPrediction, players, type MatchPrediction } from "@/lib/mock-data"

function WinProbabilityBar({ prediction }: { prediction: MatchPrediction }) {
  const { a, b } = prediction.winProbability
  const leader = a > b ? "a" : "b"
  const aName = players.a.name
  const bName = players.b.name

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold" style={{ color: "var(--chart-1)" }}>
          {aName}
        </span>
        <span className="text-xs text-muted-foreground">Хожих магадлал</span>
        <span className="font-semibold" style={{ color: "var(--chart-3)" }}>
          {bName}
        </span>
      </div>

      <div className="relative flex h-9 overflow-hidden rounded-xl border border-border bg-secondary/40">
        <div
          className="flex items-center justify-start gap-1.5 px-3 transition-all duration-700 ease-out"
          style={{
            width: `${a}%`,
            background:
              "linear-gradient(90deg, color-mix(in oklch, var(--chart-1) 85%, transparent), var(--chart-1))",
            boxShadow: leader === "a" ? "0 0 18px color-mix(in oklch, var(--chart-1) 45%, transparent)" : "none",
          }}
        >
          <span className="font-mono text-sm font-bold text-primary-foreground">{a}%</span>
        </div>
        <div
          className="flex items-center justify-end gap-1.5 px-3 transition-all duration-700 ease-out"
          style={{
            width: `${b}%`,
            background:
              "linear-gradient(90deg, var(--chart-3), color-mix(in oklch, var(--chart-3) 85%, transparent))",
            boxShadow: leader === "b" ? "0 0 18px color-mix(in oklch, var(--chart-3) 45%, transparent)" : "none",
          }}
        >
          <span className="font-mono text-sm font-bold text-primary-foreground">{b}%</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden="true" />
        AI итгэлцүүр: <span className="font-mono font-semibold text-foreground">{prediction.confidence}%</span>
      </div>
    </div>
  )
}

function KeyFactors({ prediction }: { prediction: MatchPrediction }) {
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Brain className="size-4" style={{ color: "var(--chart-1)" }} aria-hidden="true" />
        AI гол шалтгаанууд
      </h4>
      <ul className="space-y-3">
        {prediction.factors.map((factor) => (
          <li key={factor.label} className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{factor.label}</span>
              <span className="font-mono text-xs text-muted-foreground">{factor.impact}%</span>
            </div>
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${factor.impact}%`,
                  background: "linear-gradient(90deg, var(--chart-1), var(--chart-3))",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-pretty">{factor.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ScorePredictions({ prediction }: { prediction: MatchPrediction }) {
  const max = Math.max(...prediction.scorePredictions.map((s) => s.probability)) || 1
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Trophy className="size-4" style={{ color: "var(--chart-3)" }} aria-hidden="true" />
        Таамагласан эцсийн харьцаа
      </h4>
      <div className="space-y-2">
        {prediction.scorePredictions.map((s) => {
          const isTop = s.score === prediction.predictedScore
          return (
            <div key={s.score} className="flex items-center gap-3">
              <span
                className={`w-12 shrink-0 text-center font-mono text-sm ${
                  isTop ? "font-bold" : "text-muted-foreground"
                }`}
                style={isTop ? { color: "var(--chart-1)" } : undefined}
              >
                {s.score}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(s.probability / max) * 100}%`,
                    background: isTop
                      ? "linear-gradient(90deg, var(--chart-1), var(--chart-3))"
                      : "var(--muted-foreground)",
                    opacity: isTop ? 1 : 0.5,
                  }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {s.probability}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function PredictionWidget() {
  return (
    <section
      className="flex flex-col rounded-2xl border border-border bg-card p-5"
      aria-label="AI Match Winner & Set Prediction"
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: "color-mix(in oklch, var(--chart-1) 18%, transparent)",
          }}
        >
          <TrendingUp className="size-4.5" style={{ color: "var(--chart-1)" }} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">AI ялагч таамаглал</h3>
          <p className="text-xs text-muted-foreground text-pretty">
            Хожих магадлал, гол шалтгаан ба эцсийн харьцаа.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <WinProbabilityBar prediction={matchPrediction} />
        <KeyFactors prediction={matchPrediction} />
        <ScorePredictions prediction={matchPrediction} />
      </div>
    </section>
  )
}
