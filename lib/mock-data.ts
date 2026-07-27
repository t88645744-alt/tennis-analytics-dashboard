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

// --- AI Match Winner Prediction ---
export type PredictionFactor = {
  label: string
  detail: string
  impact: number // 0-100 — AI-н бодож буй нөлөөллийн хүч
}

export type ScorePrediction = {
  score: string // "2-1", "3-0" г.м
  probability: number // 0-100 — энэ харьцаагаар төгсөх магадлал
}

export type MatchPrediction = {
  winProbability: { a: number; b: number } // нийт 100
  confidence: number // AI-н итгэлцүүр (0-100)
  factors: PredictionFactor[]
  scorePredictions: ScorePrediction[]
  predictedScore: string
}

export const matchPrediction: MatchPrediction = {
  winProbability: { a: 58, b: 42 },
  confidence: 73,
  factors: [
    {
      label: "Дээд хэмжээний сервис",
      detail:
        "Сүүлийн 10 тоглолтод 68% нэгдүгээр сервис, 9.1 ace/тоглолт — өрсөлдөгчийн буцаалтын алдааг өдөөнө.",
      impact: 82,
    },
    {
      label: "Шавар гадаргуугийн тохироо",
      detail:
        "Шавар дээр 24-3 гэх амжилттай. Урт rally-д физик хүчин зүйл давамгайлна.",
      impact: 71,
    },
    {
      label: "Сүүлийн форм",
      detail:
        "Сүүлийн 5 тоглолтод 4 хожил, гэхдээ сүүлийн 2 тоглолтод break point авалт 41% буурсан.",
      impact: 64,
    },
  ],
  scorePredictions: [
    { score: "3-1", probability: 28 },
    { score: "3-0", probability: 22 },
    { score: "3-2", probability: 18 },
    { score: "1-3", probability: 17 },
    { score: "0-3", probability: 15 },
  ],
  predictedScore: "3-1",
}

// --- Live Player Momentum & Form Status ---
export type FormStatus = "fire" | "dropping" | "stable"

export type PlayerForm = {
  player: "a" | "b"
  status: FormStatus
  streak: number // дараалал (эерэг = хожлын, сөрөг = алдааны)
  recentPoints: number[] // сүүлийн N оноо (1 = хожсон, 0 = алдсан)
  breakPointsFaced: number
  breakPointsSaved: number
  unforcedErrorsTrend: number // сүүлийн сэтүүдийн өсөлт (+) / бууралт (-)
}

export type SetMomentumPoint = {
  set: string
  a: number // тухайн сетэд A-н momentum (-100..100)
  b: number // B-н momentum
}

export type BreakPointAlarm = {
  active: boolean
  player: "a" | "b" | null
  message: string
  severity: "high" | "medium" | "low"
}

export type LiveMomentumData = {
  players: PlayerForm[]
  setMomentum: SetMomentumPoint[]
  breakPointAlarm: BreakPointAlarm
}

export const liveMomentum: LiveMomentumData = {
  players: [
    {
      player: "a",
      status: "fire",
      streak: 4,
      recentPoints: [1, 1, 1, 0, 1, 1, 1, 1],
      breakPointsFaced: 3,
      breakPointsSaved: 2,
      unforcedErrorsTrend: -2,
    },
    {
      player: "b",
      status: "dropping",
      streak: -3,
      recentPoints: [0, 0, 1, 0, 0, 1, 0, 0],
      breakPointsFaced: 5,
      breakPointsSaved: 2,
      unforcedErrorsTrend: 5,
    },
  ],
  setMomentum: [
    { set: "Сэт 1", a: 35, b: -35 },
    { set: "Сэт 2", a: -20, b: 20 },
    { set: "Сэт 3", a: 55, b: -55 },
    { set: "Сэт 4", a: 40, b: -40 },
  ],
  breakPointAlarm: {
    active: true,
    player: "b",
    message: "B тоглогч 3 break point тарж байна — сэтгэл зүйн дарамт өндөр.",
    severity: "high",
  },
}
