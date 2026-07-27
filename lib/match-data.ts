// Тоглолтын гүнзгий шинжилгээний туршилтын дата (Mock Data).
// Real-time API-д шилжихэд зөвхөн энэ файлыг солино.

export type ShotOutcome = "winner" | "error" | "in"
export type ShotType = "forehand" | "backhand" | "serve" | "volley"

export type Shot = {
  id: number
  x: number // 0-100 — талбайн өргөнөөр (singles) зүүнээс баруун
  y: number // 0-100 — талбайн уртаар (0 = дээд baseline, 100 = доод baseline)
  player: "a" | "b"
  outcome: ShotOutcome
  type: ShotType
}

// Deterministic hash — server/client hydration зөрүүгээс сэргийлнэ
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const TYPES: ShotType[] = ["forehand", "backhand", "serve", "volley"]

// ~72 цохилт үүсгэнэ. Тоглогч A дээш (y бага), тоглогч B доош (y их) цохино.
export const shots: Shot[] = Array.from({ length: 72 }, (_, i) => {
  const player: "a" | "b" = i % 2 === 0 ? "a" : "b"
  const r1 = hash(i + 1)
  const r2 = hash(i + 50)
  const r3 = hash(i + 90)
  const r4 = hash(i + 130)

  const outcome: ShotOutcome = r3 > 0.74 ? "winner" : r3 > 0.52 ? "error" : "in"
  const type: ShotType =
    r4 > 0.85 ? "serve" : r4 > 0.7 ? "volley" : r4 > 0.4 ? "forehand" : "backhand"

  // Талбайн өргөнөөр байрлал (singles: 0-100)
  let x = 8 + r2 * 84

  // Уртаар байрлал — өрсөлдөгчийн талбай руу
  let y: number
  if (player === "a") {
    // Дээд тал руу цохино (y бага)
    y = outcome === "error" ? (r1 > 0.5 ? 2 + r1 * 4 : 46 + r1 * 5) : 10 + r1 * 34
  } else {
    // Доод тал руу цохино (y их)
    y = outcome === "error" ? (r1 > 0.5 ? 94 + r1 * 4 : 49 - r1 * 5) : 56 + r1 * 34
  }

  // Алдаа заримдаа хажуу шугамаас гарна
  if (outcome === "error" && r2 > 0.6) {
    x = r2 > 0.8 ? 2 + r2 * 4 : 92 + (r2 - 0.8) * 30
  }

  return {
    id: i,
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
    player,
    outcome,
    type,
  }
})

// Rally уртаар хожсон онооны хуваарилалт (хожлын %, тал бүр)
export type RallyBucket = {
  range: string
  label: string
  a: number // A хожсон %
  b: number // B хожсон %
  aPoints: number
  bPoints: number
}

export const rallyWinDist: RallyBucket[] = [
  { range: "1-4", label: "Богино rally", a: 56, b: 44, aPoints: 42, bPoints: 33 },
  { range: "5-8", label: "Дунд rally", a: 52, b: 48, aPoints: 27, bPoints: 25 },
  { range: "9+", label: "Урт rally", a: 41, b: 59, aPoints: 14, bPoints: 20 },
]

// Тоглолтын явцын онооны динамик (хуримтлагдсан зөрүү).
// Эерэг = A давуутай, сөрөг = B давуутай.
export const matchMomentum = Array.from({ length: 44 }, (_, i) => {
  const wave =
    Math.sin(i / 3.4) * 3 +
    Math.sin(i / 1.5) * 1.7 +
    (i > 26 ? (i - 26) * 0.5 : 0) -
    Math.cos(i / 4.6) * 1.3
  // Set-ийн заагийг тэмдэглэх
  const setBreak = i === 11 || i === 22 || i === 34
  return {
    game: `G${i + 1}`,
    diff: Number(wave.toFixed(1)),
    setBreak,
  }
})

// Set хоорондын заагийн байрлал (ReferenceLine-д ашиглана)
export const setBreaks = matchMomentum.filter((d) => d.setBreak).map((d) => d.game)
