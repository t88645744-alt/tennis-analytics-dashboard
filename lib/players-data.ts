// Head-to-Head харьцуулалтад ашиглах тоглогчдын багц (Mock Data).
// Дараа нь энэ файлыг real-time API-аар л солино.

export type Surface = "Hard" | "Clay" | "Grass"

export type SurfaceRecord = {
  surface: Surface
  wins: number
  losses: number
  titles: number
}

export type RosterPlayer = {
  id: string
  name: string
  fullName: string
  country: string
  countryFlag: string
  tour: "ATP" | "WTA"
  rank: number
  age: number
  hand: "Right" | "Left"
  image: string
  color: string // Recharts-д ашиглах CSS хувьсагч
  careerWins: number
  careerLosses: number
  titles: number
  // Гол статистик (улирлын дундаж)
  stats: {
    firstServePct: number // First Serve %
    aces: number // тоглолт тутмын дундаж
    bpSaved: number // Break Points Saved %
    unforcedErrors: number // тоглолт тутмын дундаж
    winners: number
    returnPtsWon: number // Return points won %
  }
  surfaces: SurfaceRecord[]
}

export const roster: RosterPlayer[] = [
  {
    id: "djk",
    name: "N. Đoković",
    fullName: "Novak Đoković",
    country: "Serbia",
    countryFlag: "🇷🇸",
    tour: "ATP",
    rank: 1,
    age: 37,
    hand: "Right",
    image: "/players/djokovic.png",
    color: "var(--chart-1)",
    careerWins: 1105,
    careerLosses: 219,
    titles: 98,
    stats: {
      firstServePct: 65,
      aces: 8,
      bpSaved: 66,
      unforcedErrors: 24,
      winners: 34,
      returnPtsWon: 43,
    },
    surfaces: [
      { surface: "Hard", wins: 720, losses: 130, titles: 65 },
      { surface: "Clay", wins: 265, losses: 66, titles: 20 },
      { surface: "Grass", wins: 120, losses: 23, titles: 13 },
    ],
  },
  {
    id: "alc",
    name: "C. Alcaraz",
    fullName: "Carlos Alcaraz",
    country: "Spain",
    countryFlag: "🇪🇸",
    tour: "ATP",
    rank: 3,
    age: 21,
    hand: "Right",
    image: "/players/alcaraz.png",
    color: "var(--chart-2)",
    careerWins: 232,
    careerLosses: 52,
    titles: 16,
    stats: {
      firstServePct: 61,
      aces: 6,
      bpSaved: 62,
      unforcedErrors: 29,
      winners: 41,
      returnPtsWon: 41,
    },
    surfaces: [
      { surface: "Hard", wins: 118, losses: 28, titles: 7 },
      { surface: "Clay", wins: 78, losses: 16, titles: 6 },
      { surface: "Grass", wins: 36, losses: 8, titles: 3 },
    ],
  },
  {
    id: "sin",
    name: "J. Sinner",
    fullName: "Jannik Sinner",
    country: "Italy",
    countryFlag: "🇮🇹",
    tour: "ATP",
    rank: 2,
    age: 23,
    hand: "Right",
    image: "/players/sinner.png",
    color: "var(--chart-3)",
    careerWins: 268,
    careerLosses: 89,
    titles: 17,
    stats: {
      firstServePct: 63,
      aces: 7,
      bpSaved: 64,
      unforcedErrors: 26,
      winners: 38,
      returnPtsWon: 40,
    },
    surfaces: [
      { surface: "Hard", wins: 158, losses: 44, titles: 11 },
      { surface: "Clay", wins: 74, losses: 33, titles: 4 },
      { surface: "Grass", wins: 36, losses: 12, titles: 2 },
    ],
  },
  {
    id: "med",
    name: "D. Medvedev",
    fullName: "Daniil Medvedev",
    country: "Russia",
    countryFlag: "🇷🇺",
    tour: "ATP",
    rank: 5,
    age: 28,
    hand: "Right",
    image: "/players/medvedev.png",
    color: "var(--chart-4)",
    careerWins: 380,
    careerLosses: 178,
    titles: 20,
    stats: {
      firstServePct: 62,
      aces: 9,
      bpSaved: 63,
      unforcedErrors: 28,
      winners: 33,
      returnPtsWon: 38,
    },
    surfaces: [
      { surface: "Hard", wins: 268, losses: 96, titles: 17 },
      { surface: "Clay", wins: 72, losses: 55, titles: 1 },
      { surface: "Grass", wins: 40, losses: 27, titles: 2 },
    ],
  },
  {
    id: "zve",
    name: "A. Zverev",
    fullName: "Alexander Zverev",
    country: "Germany",
    countryFlag: "🇩🇪",
    tour: "ATP",
    rank: 4,
    age: 27,
    hand: "Right",
    image: "/players/zverev.png",
    color: "var(--chart-5)",
    careerWins: 460,
    careerLosses: 210,
    titles: 22,
    stats: {
      firstServePct: 60,
      aces: 11,
      bpSaved: 61,
      unforcedErrors: 30,
      winners: 36,
      returnPtsWon: 36,
    },
    surfaces: [
      { surface: "Hard", wins: 280, losses: 130, titles: 14 },
      { surface: "Clay", wins: 130, losses: 55, titles: 6 },
      { surface: "Grass", wins: 50, losses: 25, titles: 2 },
    ],
  },
  {
    id: "rud",
    name: "C. Ruud",
    fullName: "Casper Ruud",
    country: "Norway",
    countryFlag: "🇳🇴",
    tour: "ATP",
    rank: 8,
    age: 25,
    hand: "Right",
    image: "/players/ruud.png",
    color: "var(--chart-2)",
    careerWins: 320,
    careerLosses: 165,
    titles: 12,
    stats: {
      firstServePct: 64,
      aces: 5,
      bpSaved: 60,
      unforcedErrors: 27,
      winners: 31,
      returnPtsWon: 39,
    },
    surfaces: [
      { surface: "Hard", wins: 150, losses: 95, titles: 3 },
      { surface: "Clay", wins: 145, losses: 55, titles: 8 },
      { surface: "Grass", wins: 25, losses: 15, titles: 1 },
    ],
  },
]

export function getPlayer(id: string): RosterPlayer {
  return roster.find((p) => p.id === id) ?? roster[0]
}

export function winPct(wins: number, losses: number): number {
  const total = wins + losses
  if (total === 0) return 0
  return Math.round((wins / total) * 100)
}

// Хоёр тоглогчийн хоорондын head-to-head түүхийг тодорхойлолттойгоор үүсгэнэ.
// Тоглогчдын id-аар тогтмол (deterministic) утга гаргана.
export function getH2H(aId: string, bId: string) {
  const seed = (aId + bId).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const total = 4 + (seed % 12) // 4-15 удаа тоглосон
  const aWins = Math.round((total * (35 + (seed % 30))) / 100)
  const bWins = total - aWins
  const surfaces: { surface: Surface; a: number; b: number }[] = [
    { surface: "Hard", a: Math.round(aWins * 0.5), b: Math.round(bWins * 0.55) },
    { surface: "Clay", a: Math.round(aWins * 0.3), b: Math.round(bWins * 0.3) },
    { surface: "Grass", a: aWins, b: bWins },
  ].map((s, i) => {
    if (i === 2) {
      // Grass = үлдэгдэл
      const usedA = Math.round(aWins * 0.5) + Math.round(aWins * 0.3)
      const usedB = Math.round(bWins * 0.55) + Math.round(bWins * 0.3)
      return { surface: "Grass" as Surface, a: Math.max(0, aWins - usedA), b: Math.max(0, bWins - usedB) }
    }
    return s
  })
  return { total, aWins, bWins, surfaces }
}
