// Тоглолтын гүнзгий шинжилгээний туршилтын дата (Mock Data).
// Олон тоглолтын датыг генератороор үүсгэдэг бөгөөд
// real-time API-д шилжихэд зөвхөн энэ файлыг солино.

export type ShotOutcome = "winner" | "error" | "in"
export type ShotType = "forehand" | "backhand" | "serve" | "volley"
export type Surface = "Hard" | "Clay" | "Grass"
export type TournamentType = "Grand Slam" | "Masters 1000"

export type Shot = {
  id: number
  x: number // 0-100 — талбайн өргөнөөр (singles) зүүнээс баруун
  y: number // 0-100 — талбайн уртаар (0 = дээд baseline, 100 = доод baseline)
  player: "a" | "b"
  outcome: ShotOutcome
  type: ShotType
}

export type RallyBucket = {
  range: string
  label: string
  a: number // A хожсон %
  b: number // B хожсон %
  aPoints: number
  bPoints: number
}

export type MomentumPoint = {
  game: string
  diff: number
  setBreak: boolean
}

export type MatchMeta = {
  id: string
  year: number
  tournamentType: TournamentType
  surface: Surface
  tournament: string
  round: string
  court: string
  duration: string
  date: string
  scoreline: { set: number; a: number; b: number }[]
  winner: "a" | "b"
}

export type MatchDataset = MatchMeta & {
  shots: Shot[]
  rallyWinDist: RallyBucket[]
  matchMomentum: MomentumPoint[]
  setBreaks: string[]
}

// Deterministic hash — server/client hydration зөрүүгээс сэргийлнэ
function seedHash(seed: number, n: number): number {
  const x = Math.sin(seed * 999.13 + n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const TYPES: ShotType[] = ["forehand", "backhand", "serve", "volley"]

function genShots(seed: number): Shot[] {
  const count = 55 + Math.floor(seedHash(seed, 1) * 35)
  return Array.from({ length: count }, (_, i) => {
    const player: "a" | "b" = i % 2 === 0 ? "a" : "b"
    const r1 = seedHash(seed, i + 1)
    const r2 = seedHash(seed, i + 50)
    const r3 = seedHash(seed, i + 90)
    const r4 = seedHash(seed, i + 130)

    const outcome: ShotOutcome = r3 > 0.74 ? "winner" : r3 > 0.52 ? "error" : "in"
    const type: ShotType =
      r4 > 0.85 ? "serve" : r4 > 0.7 ? "volley" : r4 > 0.4 ? "forehand" : "backhand"

    let x = 8 + r2 * 84
    let y: number
    if (player === "a") {
      y = outcome === "error" ? (r1 > 0.5 ? 2 + r1 * 4 : 46 + r1 * 5) : 10 + r1 * 34
    } else {
      y = outcome === "error" ? (r1 > 0.5 ? 94 + r1 * 4 : 49 - r1 * 5) : 56 + r1 * 34
    }
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
}

function genRally(seed: number, winner: "a" | "b"): RallyBucket[] {
  const aShort = 50 + Math.floor(seedHash(seed, 200) * 16)
  const aMid = 48 + Math.floor(seedHash(seed, 201) * 12)
  const aLong = winner === "a" ? 45 + Math.floor(seedHash(seed, 202) * 12) : 35 + Math.floor(seedHash(seed, 202) * 12)

  const mk = (range: string, label: string, a: number): RallyBucket => {
    const b = 100 - a
    const total = 55 + Math.floor(seedHash(seed, range.length + 300) * 35)
    return {
      range,
      label,
      a,
      b,
      aPoints: Math.round((total * a) / 100),
      bPoints: Math.round((total * b) / 100),
    }
  }

  return [
    mk("1-4", "Богино rally", aShort),
    mk("5-8", "Дунд rally", aMid),
    mk("9+", "Урт rally", aLong),
  ]
}

function genMomentum(seed: number, winner: "a" | "b", setCount: number, isGrandSlam: boolean): {
  momentum: MomentumPoint[]
  breaks: string[]
} {
  const totalGames = isGrandSlam ? 36 + setCount * 4 : 20 + setCount * 4
  const bias = winner === "a" ? 1 : -1
  const phase = seedHash(seed, 400) * 6.28

  const breakIndices = Array.from({ length: setCount - 1 }, (_, k) =>
    Math.round((totalGames * (k + 1)) / setCount) - 1,
  )

  const momentum: MomentumPoint[] = Array.from({ length: totalGames }, (_, i) => {
    const wave =
      Math.sin(i / 3.4 + phase) * 3 +
      Math.sin(i / 1.5 + phase * 1.7) * 1.7 +
      bias * (i > totalGames * 0.6 ? (i - totalGames * 0.6) * 0.45 : 0) -
      Math.cos(i / 4.6 + phase) * 1.3
    return {
      game: `G${i + 1}`,
      diff: Number(wave.toFixed(1)),
      setBreak: breakIndices.includes(i),
    }
  })

  return { momentum, breaks: momentum.filter((d) => d.setBreak).map((d) => d.game) }
}

// --- Тоглолтуудын мэдээлэл (metadata) ---
const MATCH_DEFS: Omit<MatchDataset, "shots" | "rallyWinDist" | "matchMomentum" | "setBreaks">[] = [
  {
    id: "ao-2024",
    year: 2024,
    tournamentType: "Grand Slam",
    surface: "Hard",
    tournament: "Australian Open",
    round: "Хагас шигшээ",
    court: "Rod Laver Arena",
    duration: "3ц 05мин",
    date: "2024-01-25",
    scoreline: [
      { set: 1, a: 6, b: 3 },
      { set: 2, a: 7, b: 6 },
      { set: 3, a: 6, b: 4 },
    ],
    winner: "a",
  },
  {
    id: "rg-2024",
    year: 2024,
    tournamentType: "Grand Slam",
    surface: "Clay",
    tournament: "Roland-Garros",
    round: "Шигшээ",
    court: "Court Philippe-Chatrier",
    duration: "3ц 19мин",
    date: "2024-06-09",
    scoreline: [
      { set: 1, a: 6, b: 3 },
      { set: 2, a: 2, b: 6 },
      { set: 3, a: 5, b: 7 },
      { set: 4, a: 4, b: 6 },
    ],
    winner: "b",
  },
  {
    id: "wim-2024",
    year: 2024,
    tournamentType: "Grand Slam",
    surface: "Grass",
    tournament: "Wimbledon",
    round: "Шигшээ",
    court: "Centre Court",
    duration: "2ц 45мин",
    date: "2024-07-14",
    scoreline: [
      { set: 1, a: 6, b: 7 },
      { set: 2, a: 7, b: 6 },
      { set: 3, a: 6, b: 4 },
    ],
    winner: "b",
  },
  {
    id: "cin-2024",
    year: 2024,
    tournamentType: "Masters 1000",
    surface: "Hard",
    tournament: "Cincinnati Masters",
    round: "Шигшээ",
    court: "Center Court",
    duration: "2ц 22мин",
    date: "2024-08-19",
    scoreline: [
      { set: 1, a: 7, b: 6 },
      { set: 2, a: 6, b: 4 },
    ],
    winner: "a",
  },
  {
    id: "sha-2024",
    year: 2024,
    tournamentType: "Masters 1000",
    surface: "Hard",
    tournament: "Shanghai Masters",
    round: "Шигшээ",
    court: "Qizhong Forest Arena",
    duration: "2ч 38мин",
    date: "2024-10-13",
    scoreline: [
      { set: 1, a: 6, b: 7 },
      { set: 2, a: 7, b: 6 },
      { set: 3, a: 6, b: 3 },
    ],
    winner: "a",
  },
  {
    id: "ao-2025",
    year: 2025,
    tournamentType: "Grand Slam",
    surface: "Hard",
    tournament: "Australian Open",
    round: "Шигшээ",
    court: "Rod Laver Arena",
    duration: "3ц 42мин",
    date: "2025-01-26",
    scoreline: [
      { set: 1, a: 6, b: 4 },
      { set: 2, a: 4, b: 6 },
      { set: 3, a: 7, b: 6 },
      { set: 4, a: 6, b: 3 },
    ],
    winner: "a",
  },
  {
    id: "iw-2025",
    year: 2025,
    tournamentType: "Masters 1000",
    surface: "Hard",
    tournament: "Indian Wells Masters",
    round: "Шигшээ",
    court: "Stadium 1",
    duration: "2ч 15мин",
    date: "2025-03-16",
    scoreline: [
      { set: 1, a: 4, b: 6 },
      { set: 2, a: 7, b: 5 },
      { set: 3, a: 5, b: 7 },
    ],
    winner: "b",
  },
  {
    id: "mc-2025",
    year: 2025,
    tournamentType: "Masters 1000",
    surface: "Clay",
    tournament: "Monte Carlo Masters",
    round: "Хагас шигшээ",
    court: "Court Rainier III",
    duration: "2ч 28мин",
    date: "2025-04-12",
    scoreline: [
      { set: 1, a: 6, b: 4 },
      { set: 2, a: 7, b: 6 },
    ],
    winner: "a",
  },
  {
    id: "rg-2025",
    year: 2025,
    tournamentType: "Grand Slam",
    surface: "Clay",
    tournament: "Roland-Garros",
    round: "Шигшээ",
    court: "Court Philippe-Chatrier",
    duration: "3ц 12мин",
    date: "2025-06-08",
    scoreline: [
      { set: 1, a: 7, b: 6 },
      { set: 2, a: 6, b: 3 },
      { set: 3, a: 6, b: 4 },
    ],
    winner: "b",
  },
  {
    id: "wim-2025",
    year: 2025,
    tournamentType: "Grand Slam",
    surface: "Grass",
    tournament: "Wimbledon",
    round: "Шигшээ",
    court: "Centre Court",
    duration: "3ц 01мин",
    date: "2025-07-13",
    scoreline: [
      { set: 1, a: 6, b: 7 },
      { set: 2, a: 7, b: 5 },
      { set: 3, a: 7, b: 6 },
    ],
    winner: "b",
  },
  {
    id: "ao-2026",
    year: 2026,
    tournamentType: "Grand Slam",
    surface: "Hard",
    tournament: "Australian Open",
    round: "Шигшээ",
    court: "Rod Laver Arena",
    duration: "3ц 28мин",
    date: "2026-01-28",
    scoreline: [
      { set: 1, a: 6, b: 3 },
      { set: 2, a: 7, b: 6 },
      { set: 3, a: 6, b: 7 },
      { set: 4, a: 7, b: 5 },
    ],
    winner: "a",
  },
  {
    id: "iw-2026",
    year: 2026,
    tournamentType: "Masters 1000",
    surface: "Hard",
    tournament: "Indian Wells Masters",
    round: "Шигшээ",
    court: "Stadium 1",
    duration: "2ч 35мин",
    date: "2026-03-15",
    scoreline: [
      { set: 1, a: 7, b: 6 },
      { set: 2, a: 6, b: 4 },
    ],
    winner: "a",
  },
]

const SEED_MAP: Record<string, number> = {}
MATCH_DEFS.forEach((m, i) => {
  SEED_MAP[m.id] = i + 1
})

export const matches: MatchDataset[] = MATCH_DEFS.map((def) => {
  const seed = SEED_MAP[def.id]
  const { momentum, breaks } = genMomentum(
    seed,
    def.winner,
    def.scoreline.length,
    def.tournamentType === "Grand Slam",
  )
  return {
    ...def,
    shots: genShots(seed),
    rallyWinDist: genRally(seed, def.winner),
    matchMomentum: momentum,
    setBreaks: breaks,
  }
})

// --- Шүүлтүүрийн сонголтууд ---
export const yearOptions = [2024, 2025, 2026]
export const tournamentTypeOptions: TournamentType[] = ["Grand Slam", "Masters 1000"]
export const surfaceOptions: Surface[] = ["Hard", "Clay", "Grass"]

export type Filters = {
  year: number | "all"
  tournamentType: TournamentType | "all"
  surface: Surface | "all"
}

export function filterMatches(filters: Filters): MatchDataset[] {
  return matches.filter((m) => {
    if (filters.year !== "all" && m.year !== filters.year) return false
    if (filters.tournamentType !== "all" && m.tournamentType !== filters.tournamentType)
      return false
    if (filters.surface !== "all" && m.surface !== filters.surface) return false
    return true
  })
}
