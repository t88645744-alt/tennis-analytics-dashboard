"use client"

import { useCallback, useEffect, useState } from "react"
import { CircleAlert as AlertCircle, RefreshCw, User } from "lucide-react"
import { roster, winPct, type RosterPlayer } from "@/lib/players-data"
import type { PlayerProfile } from "@/lib/sportradar"

type ApiResponse = {
  data: PlayerProfile
  source: "live" | "mock"
  error?: string
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}

function PlayerCard({ player, profile, source }: { player: RosterPlayer; profile: PlayerProfile | null; source: "live" | "mock" | null }) {
  const winPctVal = profile ? winPct(profile.won ?? 0, profile.lost ?? 0) : winPct(player.careerWins, player.careerLosses)
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={player.image}
            alt={player.fullName}
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold">{player.fullName}</h3>
          <p className="text-sm text-muted-foreground">
            {player.countryFlag} {player.country} · #{player.rank} · {player.tour}
          </p>
          {source === "mock" && (
            <span className="mt-1 inline-block rounded bg-secondary/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              Mock дата
            </span>
          )}
          {source === "live" && (
            <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              Sportradar live
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <StatTile label="Чанса" value={`#${profile?.ranking ?? player.rank}`} />
        <StatTile label="Хожлын хувь" value={`${winPctVal}%`} />
        <StatTile label="А насны хожил" value={profile?.won ?? player.careerWins} />
        <StatTile label="Хожигдол" value={profile?.lost ?? player.careerLosses} />
        <StatTile label="Гарж тоглосон" value={profile?.played ?? player.careerWins + player.careerLosses} />
        <StatTile label="Гар" value={profile?.handedness ?? player.hand} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <StatTile label="Тоос" value={`${player.stats.firstServePct}%`} />
        <StatTile label="Ace/тоглолт" value={player.stats.aces} />
        <StatTile label="BP авралт" value={`${player.stats.bpSaved}%`} />
        <StatTile label="Winner/тоглолт" value={player.stats.winners} />
        <StatTile label="Алдаа/тоглолт" value={player.stats.unforcedErrors} />
        <StatTile label="Return pts won" value={`${player.stats.returnPtsWon}%`} />
      </div>

      <div className="mt-4">
        <h4 className="mb-2 text-xs font-medium text-muted-foreground">Хөрсний дагуух амжилт</h4>
        <div className="space-y-2">
          {player.surfaces.map((s) => (
            <div key={s.surface} className="flex items-center gap-2 text-xs">
              <span className="w-14 shrink-0 text-muted-foreground">{s.surface}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${winPct(s.wins, s.losses)}%`,
                    background: player.color,
                  }}
                />
              </div>
              <span className="w-20 shrink-0 text-right font-mono text-muted-foreground">
                {s.wins}-{s.losses} · {s.titles} титлэ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PlayersView() {
  const [profiles, setProfiles] = useState<Record<string, PlayerProfile | null>>({})
  const [sources, setSources] = useState<Record<string, "live" | "mock">>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchProfiles = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const results = await Promise.all(
        roster.map(async (p) => {
          const res = await fetch(`/api/tennis?type=player&playerId=${p.id}`, { cache: "no-store" })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return { id: p.id, json: (await res.json()) as ApiResponse }
        }),
      )
      const newProfiles: Record<string, PlayerProfile | null> = {}
      const newSources: Record<string, "live" | "mock"> = {}
      for (const r of results) {
        newProfiles[r.id] = r.json.data
        newSources[r.id] = r.json.source
      }
      setProfiles(newProfiles)
      setSources(newSources)
    } catch {
      setError("Тоглогчдын дата татаж чадсангүй — туршилтын дата харуулж байна.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return (
    <section aria-label="Тоглогчид">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground text-pretty">
          Топ тоглогчдын профайл, чансаа ба статистик — Sportradar Tennis API-аас.
        </p>
        <button
          onClick={() => fetchProfiles(true)}
          disabled={refreshing}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-secondary/40 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          aria-label="Шинэчлэх"
        >
          <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-pretty">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <User className="size-4 animate-pulse" aria-hidden="true" />
          Тоглогчдын дата ачаалж байна…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {roster.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              profile={profiles[p.id] ?? null}
              source={sources[p.id] ?? null}
            />
          ))}
        </div>
      )}
    </section>
  )
}
