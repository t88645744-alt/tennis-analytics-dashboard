import { NextResponse } from "next/server"
import {
  getLiveScoresSafe,
  getMatchSummarySafe,
  getPlayerProfileSafe,
  SportradarError,
} from "@/lib/sportradar"

// Бүх хариултад CORS + эх сурвалжийн тэмдэг нэмнэ.
const json = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "s-maxage=30, stale-while-revalidate=60",
    },
  })

// GET /api/tennis?type=live
// GET /api/tennis?type=summary&matchId=<id>
// GET /api/tennis?type=player&playerId=<id>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type") ?? "live"

  try {
    if (type === "live") {
      const result = await getLiveScoresSafe()
      return json(result)
    }

    if (type === "summary") {
      const matchId = searchParams.get("matchId")
      if (!matchId) {
        return json({ error: "matchId параметр шаардлагатай" }, 400)
      }
      const result = await getMatchSummarySafe(matchId)
      return json(result)
    }

    if (type === "player") {
      const playerId = searchParams.get("playerId")
      if (!playerId) {
        return json({ error: "playerId параметр шаардлагатай" }, 400)
      }
      const result = await getPlayerProfileSafe(playerId)
      return json(result)
    }

    return json({ error: `Тодорхойгүй type: ${type}` }, 400)
  } catch (e) {
    // Fallback функцууд өөрсөө алдааг барьдаг ч, дахин нэг давхар хамгаалалт.
    const message = e instanceof SportradarError ? e.message : "Дотоод серверийн алдаа"
    return json({ error: message }, 500)
  }
}
