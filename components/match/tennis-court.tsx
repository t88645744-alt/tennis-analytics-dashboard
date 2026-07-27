"use client"

import type { Shot } from "@/lib/match-data"

// Талбайн SVG координатууд (дээрээс харсан байрлал)
const VB_W = 240
const VB_H = 460
const CX0 = 20 // doubles зүүн ирмэг
const CX1 = 220 // doubles баруун ирмэг
const CY0 = 20 // дээд baseline
const CY1 = 440 // доод baseline
const SINGLES_L = 45 // singles зүүн шугам
const SINGLES_R = 195 // singles баруун шугам
const NET_Y = 230 // тор (голд)
const SVC_TOP = 117 // дээд service line
const SVC_BOT = 343 // доод service line
const CENTER_X = 120

// Нормчилсон (0-100) координатыг SVG координат руу хөрвүүлнэ
function toSvgX(x: number) {
  return SINGLES_L + (x / 100) * (SINGLES_R - SINGLES_L)
}
function toSvgY(y: number) {
  return CY0 + (y / 100) * (CY1 - CY0)
}

const line = {
  stroke: "var(--court-line)",
  strokeWidth: 1.6,
  fill: "none",
}

export type CourtMode = "shots" | "heatmap"

type TennisCourtProps = {
  shots: Shot[]
  mode: CourtMode
  colorA: string
  colorB: string
}

export function TennisCourt({ shots, mode, colorA, colorB }: TennisCourtProps) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      role="img"
      aria-label="Теннисний талбайн цохилтын зураглал"
    >
      {/* Талбайн гадаргуу */}
      <rect x="0" y="0" width={VB_W} height={VB_H} fill="var(--court-out)" rx="10" />
      <rect
        x={CX0}
        y={CY0}
        width={CX1 - CX0}
        height={CY1 - CY0}
        fill="var(--court-in)"
        rx="2"
      />

      {/* Doubles хүрээ */}
      <rect x={CX0} y={CY0} width={CX1 - CX0} height={CY1 - CY0} {...line} />
      {/* Singles хажуу шугам */}
      <line x1={SINGLES_L} y1={CY0} x2={SINGLES_L} y2={CY1} {...line} />
      <line x1={SINGLES_R} y1={CY0} x2={SINGLES_R} y2={CY1} {...line} />
      {/* Service шугамууд */}
      <line x1={SINGLES_L} y1={SVC_TOP} x2={SINGLES_R} y2={SVC_TOP} {...line} />
      <line x1={SINGLES_L} y1={SVC_BOT} x2={SINGLES_R} y2={SVC_BOT} {...line} />
      {/* Төв service шугам */}
      <line x1={CENTER_X} y1={SVC_TOP} x2={CENTER_X} y2={SVC_BOT} {...line} />
      {/* Baseline төв тэмдэг */}
      <line x1={CENTER_X} y1={CY0} x2={CENTER_X} y2={CY0 + 8} {...line} />
      <line x1={CENTER_X} y1={CY1 - 8} x2={CENTER_X} y2={CY1} {...line} />

      {/* Тор */}
      <line
        x1={CX0 - 6}
        y1={NET_Y}
        x2={CX1 + 6}
        y2={NET_Y}
        stroke="var(--court-net)"
        strokeWidth="2.4"
      />
      <line
        x1={CX0 - 6}
        y1={NET_Y}
        x2={CX1 + 6}
        y2={NET_Y}
        stroke="var(--court-net)"
        strokeWidth="6"
        strokeOpacity="0.18"
      />

      {/* Heatmap горим — бүдэг том цэгүүд давхарлан нягтралыг харуулна */}
      {mode === "heatmap" && (
        <g filter="url(#courtBlur)">
          {shots
            .filter((s) => s.outcome !== "error")
            .map((s) => (
              <circle
                key={`h-${s.id}`}
                cx={toSvgX(s.x)}
                cy={toSvgY(s.y)}
                r="15"
                fill={s.player === "a" ? colorA : colorB}
                opacity="0.28"
              />
            ))}
        </g>
      )}

      {/* Shots горим — цохилт бүрийг тэмдэглэнэ */}
      {mode === "shots" &&
        shots.map((s) => {
          const cx = toSvgX(s.x)
          const cy = toSvgY(s.y)
          const color = s.player === "a" ? colorA : colorB
          if (s.outcome === "error") {
            // Алдаа — X тэмдэг
            return (
              <g key={s.id} stroke={color} strokeWidth="1.8" opacity="0.85">
                <line x1={cx - 3} y1={cy - 3} x2={cx + 3} y2={cy + 3} />
                <line x1={cx - 3} y1={cy + 3} x2={cx + 3} y2={cy - 3} />
              </g>
            )
          }
          if (s.outcome === "winner") {
            // Winner — дүүрэн тод цэг
            return <circle key={s.id} cx={cx} cy={cy} r="4" fill={color} stroke="var(--court-in)" strokeWidth="0.8" />
          }
          // Тоглоомд — бүдэг жижиг цэг
          return <circle key={s.id} cx={cx} cy={cy} r="2.6" fill={color} opacity="0.42" />
        })}

      <defs>
        <filter id="courtBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
    </svg>
  )
}
