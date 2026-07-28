// Sportradar Tennis API (v2) — төрөлжүүлсэн клиент.
// API key зөвхөн сервер талаас ашиглагдана (API Route / Server Action).

import { roster, type RosterPlayer } from "@/lib/players-data"
import { matchInfo, players } from "@/lib/mock-data"

const BASE_URL = "https://api.sportradar.com/tennis/trial/v2/en"

type SportradarConfig = {
  apiKey: string
  baseUrl?: string
}

function getConfig(): SportradarConfig {
  const apiKey = process.env.SPORTRADAR_TENNIS_API_KEY
  if (!apiKey) {
    throw new Error("SPORTRADAR_TENNIS_API_KEY .env.local дотор тохируулагдаагүй байна.")
  }
  return { apiKey, baseUrl: BASE_URL }
}

async function sportradarFetch<T>(path: string): Promise<T> {
  const { apiKey, baseUrl } = getConfig()
  const url = `${baseUrl}${path}${path.includes("?") ? "&" : "?"}api_key=${apiKey}`

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // Дараагийн render хүртэл cache-даг — live дата шинэчлэхийн тулд revalidate бага байна.
    next: { revalidate: 30 },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new SportradarError(res.status, body || res.statusText)
  }
  return res.json() as Promise<T>
}

export class SportradarError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(`Sportradar API ${status}: ${message}`)
    this.name = "SportradarError"
    this.status = status
  }
}

// --- Төрөлжүүлсэн хариултууд (Sportradar JSON бүтэц) ---

export type SportradarPlayer = {
  id: string
  name: string
  country?: string
  country_code?: string
  ranking?: number
  prize_money?: number
  prize_currency?: string
  played?: number
  won?: number
  lost?: number
  height?: number
  weight?: number
  handedness?: string
  birthday?: string
  turned_pro?: number
  residence?: string
  birthplace?: string
}

export type SportradarCompetitor = {
  id: string
  name: string
  country?: string
  country_code?: string
  seed?: string
  set_scores?: string
  game_score?: string
  serving?: string
  score?: number
}

export type SportradarMatch = {
  id: string
  status: string
  scheduled?: string
  tournament?: {
    id?: string
    name?: string
    type?: string
  }
  sport_event_status?: {
    match_status?: string
    home_score?: number
    away_score?: number
    set_scores?: { home_score: number; away_score: number; winner?: string }[]
    game_score?: string
  }
  competitors?: SportradarCompetitor[]
}

export type LiveScoresResponse = {
  generated_at?: string
  sport_events?: SportradarMatch[]
}

export type MatchSummaryResponse = {
  sport_event?: {
    id: string
    scheduled?: string
    tournament?: { id?: string; name?: string; type?: string }
    competitors?: SportradarCompetitor[]
  }
  sport_event_status?: {
    match_status?: string
    home_score?: number
    away_score?: number
    set_scores?: { home_score: number; away_score: number; winner?: string }[]
    game_score?: string
    period_scores?: { home_game_score: string; away_game_score: string }[]
  }
  statistics?: {
    competitors?: Array<{
      id: string
      statistics?: {
        first_serve_percentage?: string
        aces?: string
        double_faults?: string
        break_points_saved?: string
        break_points_faced?: string
        winners?: string
        unforced_errors?: string
      }
    }>
  }
}

export type PlayerProfileResponse = {
  player?: SportradarPlayer
  rankings?: Array<{ type: string; rank?: number; points?: number }>
}

// --- Нормалчилсон дотоод төрлүүд (UI-д ашиглах) ---

export type LiveMatch = {
  id: string
  status: string
  tournamentName: string
  scheduled?: string
  home: { name: string; country?: string; score: number; setScores: number[] }
  away: { name: string; country?: string; score: number; setScores: number[] }
  gameScore?: string
  matchStatus?: string
}

export type MatchSummary = {
  id: string
  tournamentName: string
  scheduled?: string
  status: string
  home: { name: string; country?: string; score: number; setScores: number[] }
  away: { name: string; country?: string; score: number; setScores: number[] }
  gameScore?: string
  stats?: {
    home?: MatchStats
    away?: MatchStats
  }
}

export type MatchStats = {
  firstServePct?: number
  aces?: number
  doubleFaults?: number
  breakPointsSaved?: number
  breakPointsFaced?: number
  winners?: number
  unforcedErrors?: number
}

export type PlayerProfile = {
  id: string
  name: string
  country?: string
  countryCode?: string
  ranking?: number
  played?: number
  won?: number
  lost?: number
  handedness?: string
  birthday?: string
  turnedPro?: number
  prizeMoney?: number
  prizeCurrency?: string
  height?: number
  weight?: number
  residence?: string
  birthplace?: string
}

// --- Нормалчилгч функцүүд ---

function toInt(v?: string): number | undefined {
  if (v == null || v === "") return undefined
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? undefined : n
}

function toFloat(v?: string): number | undefined {
  if (v == null || v === "") return undefined
  const n = parseFloat(v)
  return Number.isNaN(n) ? undefined : n
}

function normalizeMatch(m: SportradarMatch): LiveMatch {
  const comps = m.competitors ?? []
  const home = comps[0]
  const away = comps[1]
  const setScores = m.sport_event_status?.set_scores ?? []
  return {
    id: m.id,
    status: m.status,
    tournamentName: m.tournament?.name ?? "Тодорхойгүй тэмцээн",
    scheduled: m.scheduled,
    home: {
      name: home?.name ?? "Тоглогч 1",
      country: home?.country,
      score: m.sport_event_status?.home_score ?? 0,
      setScores: setScores.map((s) => s.home_score),
    },
    away: {
      name: away?.name ?? "Тоглогч 2",
      country: away?.country,
      score: m.sport_event_status?.away_score ?? 0,
      setScores: setScores.map((s) => s.away_score),
    },
    gameScore: m.sport_event_status?.game_score,
    matchStatus: m.sport_event_status?.match_status,
  }
}

function normalizeSummary(s: MatchSummaryResponse): MatchSummary {
  const ev = s.sport_event
  const status = s.sport_event_status
  const comps = ev?.competitors ?? []
  const home = comps[0]
  const away = comps[1]
  const setScores = status?.set_scores ?? []
  const statsHome = s.statistics?.competitors?.[0]?.statistics
  const statsAway = s.statistics?.competitors?.[1]?.statistics
  return {
    id: ev?.id ?? "",
    tournamentName: ev?.tournament?.name ?? "Тодорхойгүй тэмцээн",
    scheduled: ev?.scheduled,
    status: status?.match_status ?? "unknown",
    home: {
      name: home?.name ?? "Тоглогч 1",
      country: home?.country,
      score: status?.home_score ?? 0,
      setScores: setScores.map((st) => st.home_score),
    },
    away: {
      name: away?.name ?? "Тоглогч 2",
      country: away?.country,
      score: status?.away_score ?? 0,
      setScores: setScores.map((st) => st.away_score),
    },
    gameScore: status?.game_score,
    stats: {
      home: statsHome
        ? {
            firstServePct: toFloat(statsHome.first_serve_percentage),
            aces: toInt(statsHome.aces),
            doubleFaults: toInt(statsHome.double_faults),
            breakPointsSaved: toInt(statsHome.break_points_saved),
            breakPointsFaced: toInt(statsHome.break_points_faced),
            winners: toInt(statsHome.winners),
            unforcedErrors: toInt(statsHome.unforced_errors),
          }
        : undefined,
      away: statsAway
        ? {
            firstServePct: toFloat(statsAway.first_serve_percentage),
            aces: toInt(statsAway.aces),
            doubleFaults: toInt(statsAway.double_faults),
            breakPointsSaved: toInt(statsAway.break_points_saved),
            breakPointsFaced: toInt(statsAway.break_points_faced),
            winners: toInt(statsAway.winners),
            unforcedErrors: toInt(statsAway.unforced_errors),
          }
        : undefined,
    },
  }
}

function normalizePlayer(p: PlayerProfileResponse): PlayerProfile {
  const pl = p.player
  if (!pl) {
    throw new SportradarError(404, "Тоглогч олдсонгүй")
  }
  const singlesRank = p.rankings?.find((r) => r.type === "singles")?.rank
  return {
    id: pl.id,
    name: pl.name,
    country: pl.country,
    countryCode: pl.country_code,
    ranking: pl.ranking ?? singlesRank,
    played: pl.played,
    won: pl.won,
    lost: pl.lost,
    handedness: pl.handedness,
    birthday: pl.birthday,
    turnedPro: pl.turned_pro,
    prizeMoney: pl.prize_money,
    prizeCurrency: pl.prize_currency,
    height: pl.height,
    weight: pl.weight,
    residence: pl.residence,
    birthplace: pl.birthplace,
  }
}

// --- Нийтийн API функцууд (сервер талаас дуудагдана) ---

export async function getLiveScores(): Promise<LiveMatch[]> {
  const data = await sportradarFetch<LiveScoresResponse>("/sport_events/scheduled/live")
  return (data.sport_events ?? []).map(normalizeMatch)
}

export async function getMatchSummary(matchId: string): Promise<MatchSummary> {
  const data = await sportradarFetch<MatchSummaryResponse>(`/sport_events/${matchId}/summary`)
  return normalizeSummary(data)
}

export async function getPlayerProfile(playerId: string): Promise<PlayerProfile> {
  const data = await sportradarFetch<PlayerProfileResponse>(`/players/${playerId}/profile`)
  return normalizePlayer(data)
}

// --- Fallback (Mock) датанууд ---
// API key байхгүй эсвэл хүсэлт амжилтгүй болсныг UI мэдрэхгүйгээр шилжихэд ашиглана.

export type FallbackResult<T> = {
  data: T
  source: "live" | "mock"
  error?: string
}

export async function getLiveScoresSafe(): Promise<FallbackResult<LiveMatch[]>> {
  try {
    const data = await getLiveScores()
    if (data.length === 0) {
      return { data: mockLiveMatches(), source: "mock", error: "Live тоглолт алга — mock дата" }
    }
    return { data, source: "live" }
  } catch (e) {
    return {
      data: mockLiveMatches(),
      source: "mock",
      error: e instanceof Error ? e.message : "Sportradar хүсэлт амжилтгүй",
    }
  }
}

export async function getMatchSummarySafe(matchId: string): Promise<FallbackResult<MatchSummary>> {
  try {
    const data = await getMatchSummary(matchId)
    return { data, source: "live" }
  } catch (e) {
    return {
      data: mockMatchSummary(matchId),
      source: "mock",
      error: e instanceof Error ? e.message : "Sportradar хүсэлт амжилтгүй",
    }
  }
}

export async function getPlayerProfileSafe(playerId: string): Promise<FallbackResult<PlayerProfile>> {
  try {
    const data = await getPlayerProfile(playerId)
    return { data, source: "live" }
  } catch (e) {
    return {
      data: mockPlayerProfile(playerId),
      source: "mock",
      error: e instanceof Error ? e.message : "Sportradar хүсэлт амжилтгүй",
    }
  }
}

// --- Mock fallback датанууд ---

function mockLiveMatches(): LiveMatch[] {
  return [
    {
      id: "sr:match:mock-1",
      status: "live",
      tournamentName: "Roland-Garros · Шигшээ",
      scheduled: new Date().toISOString(),
      home: {
        name: players.a.name,
        country: players.a.country,
        score: 2,
        setScores: [6, 4, 7, 6],
      },
      away: {
        name: players.b.name,
        country: players.b.country,
        score: 1,
        setScores: [4, 6, 6, 3],
      },
      gameScore: "30-15",
      matchStatus: "set4",
    },
    {
      id: "sr:match:mock-2",
      status: "live",
      tournamentName: "Wimbledon · Хагас шигшээ",
      scheduled: new Date().toISOString(),
      home: {
        name: "J. Sinner",
        country: "Italy",
        score: 1,
        setScores: [7, 5],
      },
      away: {
        name: "D. Medvedev",
        country: "Russia",
        score: 1,
        setScores: [5, 7],
      },
      gameScore: "15-40",
      matchStatus: "set3",
    },
    {
      id: "sr:match:mock-3",
      status: "live",
      tournamentName: "Australian Open · Цэвэрлэгээ",
      scheduled: new Date().toISOString(),
      home: {
        name: "A. Zverev",
        country: "Germany",
        score: 0,
        setScores: [3],
      },
      away: {
        name: "C. Ruud",
        country: "Norway",
        score: 0,
        setScores: [4],
      },
      gameScore: "40-30",
      matchStatus: "set1",
    },
  ]
}

function mockMatchSummary(matchId: string): MatchSummary {
  return {
    id: matchId,
    tournamentName: matchInfo.tournament,
    scheduled: matchInfo.date,
    status: "closed",
    home: {
      name: players.a.name,
      country: players.a.country,
      score: matchInfo.winner === "a" ? 3 : 1,
      setScores: matchInfo.scoreline.map((s) => s.a),
    },
    away: {
      name: players.b.name,
      country: players.b.country,
      score: matchInfo.winner === "b" ? 3 : 1,
      setScores: matchInfo.scoreline.map((s) => s.b),
    },
    stats: {
      home: { firstServePct: 68, aces: 9, doubleFaults: 2, breakPointsSaved: 6, breakPointsFaced: 11, winners: 38, unforcedErrors: 22 },
      away: { firstServePct: 61, aces: 14, doubleFaults: 5, breakPointsSaved: 7, breakPointsFaced: 13, winners: 46, unforcedErrors: 31 },
    },
  }
}

function mockPlayerProfile(playerId: string): PlayerProfile {
  const rosterPlayer: RosterPlayer =
    roster.find((p) => p.id === playerId) ?? roster[0]
  return {
    id: rosterPlayer.id,
    name: rosterPlayer.fullName,
    country: rosterPlayer.country,
    countryCode: rosterPlayer.countryFlag,
    ranking: rosterPlayer.rank,
    played: rosterPlayer.careerWins + rosterPlayer.careerLosses,
    won: rosterPlayer.careerWins,
    lost: rosterPlayer.careerLosses,
    handedness: rosterPlayer.hand,
    birthday: `${2026 - rosterPlayer.age}-01-01`,
    turnedPro: 2026 - rosterPlayer.age - 18,
    prizeMoney: rosterPlayer.titles * 250000,
    prizeCurrency: "USD",
  }
}
