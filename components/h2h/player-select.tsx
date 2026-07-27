"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { roster, type RosterPlayer } from "@/lib/players-data"

type PlayerSelectProps = {
  value: string
  onChange: (id: string) => void
  disabledId?: string
  accent: string
  label: string
}

export function PlayerSelect({ value, onChange, disabledId, accent, label }: PlayerSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  const selected = roster.find((p) => p.id === value) as RosterPlayer

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const filtered = roster.filter(
    (p) =>
      p.fullName.toLowerCase().includes(query.toLowerCase()) ||
      p.country.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="relative w-full" ref={ref}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-ring/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2"
            style={{ ["--tw-ring-color" as string]: accent }}
          >
            <img
              src={selected.image || "/placeholder.svg"}
              alt={selected.fullName}
              className="size-full object-cover"
            />
          </span>
          <span className="leading-tight">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              {selected.fullName} <span aria-hidden="true">{selected.countryFlag}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {selected.tour} #{selected.rank}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Тоглогч хайх…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-sm text-muted-foreground">Тоглогч олдсонгүй</li>
            )}
            {filtered.map((p) => {
              const isDisabled = p.id === disabledId
              const isSelected = p.id === value
              return (
                <li key={p.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onChange(p.id)
                      setOpen(false)
                      setQuery("")
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                      isDisabled
                        ? "cursor-not-allowed opacity-40"
                        : "hover:bg-secondary"
                    } ${isSelected ? "bg-secondary/60" : ""}`}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <img src={p.image || "/placeholder.svg"} alt="" className="size-full object-cover" />
                    </span>
                    <span className="flex-1 leading-tight">
                      <span className="flex items-center gap-1.5 font-medium">
                        {p.fullName} <span aria-hidden="true">{p.countryFlag}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {p.tour} #{p.rank} · {p.country}
                      </span>
                    </span>
                    {isSelected && <Check className="size-4 text-primary" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
