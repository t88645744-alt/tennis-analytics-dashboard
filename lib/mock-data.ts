// Бодит мэт харагдах туршилтын дата (Mock Data).
// Дараа нь энэ файлыг real-time API-аар солиход л бүх дашборд шинэчлэгдэнэ.

export type Player = {
  id: string
  name: string
  country: string
  countryFlag: string
  rank: number
  age: number
  hand: "Right" | "Left"
  color: string // Recharts-д ашиглах CSS хувьсагч
}

export const players: Record<"a" | "b", Player> = {
  a: {
    id: "djk",
    name: "N. Đoković",
    country: "Serbia",
    countryFlag: "🇷🇸",
    rank: 1,
    age: 37,
    hand: "Right",
    color: "var(--chart-1)",
  },
  b: {
    id: "alc",
    name: "C. Alcaraz",
    country: "Spain",
    countryFlag: "🇪🇸",
    rank: 3,
    age: 21,
    hand: "Right",
    color: "var(--chart-2)",
  },
}

export const matchInfo = {
  tournament: "Roland-Garros",
  round: "Final",
  surface: "Clay",
  court: "Court Philippe-Chatrier",
  duration: "3ц 42мин",
  date: "2026-06-07",
  scoreline: [
    { set: 1, a: 6, b: 4 },
    { set: 2, a: 4, b: 6 },
    { set: 3, a: 7, b: 6 },
    { set: 4, a: 6, b: 3 },
  ],
  winner: "a" as const,
}

// Head-to-head түүх
export const headToHead = {
  totalMeetings: 8,
  aWins: 3,
  bWins: 5,
  surfaces: [
    { surface: "Hard", a: 1, b: 3 },
    { surface: "Clay", a: 2, b: 1 },
    { surface: "Grass", a: 0, b: 1 },
  ],
}

// Гол статистикийн харьцуулалт (KPI картанд)
export type StatComparison = {
  label: string
  unit: string
  a: number
  b: number
  // Аль тал өндөр байх нь "сайн"-г заана
  higherIsBetter: boolean
}

export const keyStats: StatComparison[] = [
  { label: "First Serve %", unit: "%", a: 68, b: 61, higherIsBetter: true },
  { label: "Aces", unit: "", a: 9, b: 14, higherIsBetter: true },
  { label: "Double Faults", unit: "", a: 2, b: 5, higherIsBetter: false },
  { label: "Break Points Won", unit: "%", a: 54, b: 41, higherIsBetter: true },
  { label: "Winners", unit: "", a: 38, b: 46, higherIsBetter: true },
  { label: "Unforced Errors", unit: "", a: 22, b: 31, higherIsBetter: false },
]

// Serve performance — эхний ба хоёр дахь serve
export const serveStats = [
  { name: "1-р %", a: 68, b: 61 },
  { name: "1-р хож.", a: 79, b: 74 },
  { name: "2-р хож.", a: 58, b: 52 },
  { name: "BP аврал", a: 67, b: 55 },
]

// Shot direction chart (radar) — цохилтын чиглэлийн үр дүн (winners %)
export const shotDirection = [
  { zone: "Down the Line", a: 72, b: 65 },
  { zone: "Cross-court", a: 84, b: 88 },
  { zone: "Inside-out", a: 66, b: 78 },
  { zone: "Body", a: 58, b: 54 },
  { zone: "Wide", a: 75, b: 70 },
  { zone: "T-serve", a: 80, b: 62 },
]

// Rally уртаар хожсон онооны хуваарилалт
export const rallyLength = [
  { range: "1-3", a: 41, b: 38 },
  { range: "4-6", a: 28, b: 24 },
  { range: "7-9", a: 15, b: 18 },
  { range: "10+", a: 12, b: 20 },
]

// Point-by-point momentum — эерэг утга = Тоглогч A давуутай
// Тоглолтын турш хуримтлагдсан онооны зөрүү
export const momentum = Array.from({ length: 40 }, (_, i) => {
  const game = i + 1
  // Бодит мэт долгион үүсгэх
  const wave =
    Math.sin(i / 3.2) * 3 +
    Math.sin(i / 1.4) * 1.6 +
    (i > 22 ? (i - 22) * 0.55 : 0) - // сүүлд A давамгайлж эхэлнэ
    Math.cos(i / 5) * 1.2
  return {
    game: `G${game}`,
    diff: Number(wave.toFixed(1)),
  }
})

// Serve хурдны хуваарилалт (км/ц)
export const serveSpeed = [
  { bucket: "170-180", a: 4, b: 6 },
  { bucket: "180-190", a: 11, b: 14 },
  { bucket: "190-200", a: 19, b: 17 },
  { bucket: "200-210", a: 13, b: 15 },
  { bucket: "210+", a: 5, b: 9 },
]
