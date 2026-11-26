"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrayerCard } from "@/components/PrayerCard";
import {
  DEITIES,
  FESTIVALS,
  KINDS,
  KIND_LABELS,
  OCCASIONS,
  OCCASION_LABELS,
  filterPrayers,
} from "@/data/prayers";

export function PrayersBrowser() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [deity, setDeity] = useState(params.get("deity") ?? "all");
  const [occasion, setOccasion] = useState(params.get("occasion") ?? "all");
  const [festival, setFestival] = useState(params.get("festival") ?? "all");
  const [kind, setKind] = useState(params.get("kind") ?? "all");

  const results = useMemo(
    () => filterPrayers({ q, deity, occasion, festival, kind }),
    [q, deity, occasion, festival, kind]
  );

  function sync(next: {
    q?: string;
    deity?: string;
    occasion?: string;
    festival?: string;
    kind?: string;
  }) {
    const sp = new URLSearchParams();
    const values = {
      q: next.q ?? q,
      deity: next.deity ?? deity,
      occasion: next.occasion ?? occasion,
      festival: next.festival ?? festival,
      kind: next.kind ?? kind,
    };
    if (values.q.trim()) sp.set("q", values.q.trim());
    if (values.deity !== "all") sp.set("deity", values.deity);
    if (values.occasion !== "all") sp.set("occasion", values.occasion);
    if (values.festival !== "all") sp.set("festival", values.festival);
    if (values.kind !== "all") sp.set("kind", values.kind);
    const qs = sp.toString();
    router.replace(qs ? `/prayers?${qs}` : "/prayers");
  }

  function clear() {
    setQ("");
    setDeity("all");
    setOccasion("all");
    setFestival("all");
    setKind("all");
    router.replace("/prayers");
  }

  return (
    <>
      <div className="filters">
        <input
          type="search"
          placeholder="Search title, meaning, tags…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            sync({ q: e.target.value });
          }}
          aria-label="Search prayers"
        />
        <select
          value={deity}
          onChange={(e) => {
            setDeity(e.target.value);
            sync({ deity: e.target.value });
          }}
          aria-label="Filter by deity"
        >
          <option value="all">All deities</option>
          {DEITIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={occasion}
          onChange={(e) => {
            setOccasion(e.target.value);
            sync({ occasion: e.target.value });
          }}
          aria-label="Filter by occasion"
        >
          <option value="all">All occasions</option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {OCCASION_LABELS[o]}
            </option>
          ))}
        </select>
        <select
          value={festival}
          onChange={(e) => {
            setFestival(e.target.value);
            sync({ festival: e.target.value });
          }}
          aria-label="Filter by festival"
        >
          <option value="all">All festivals</option>
          {FESTIVALS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          value={kind}
          onChange={(e) => {
            setKind(e.target.value);
            sync({ kind: e.target.value });
          }}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {KIND_LABELS[k]}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-ghost" onClick={clear}>
          Clear
        </button>
      </div>

      <p className="results-count">
        {results.length} prayer{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <p className="empty">No prayers match those filters.</p>
      ) : (
        <div className="grid">
          {results.map((prayer) => (
            <PrayerCard key={prayer.id} prayer={prayer} />
          ))}
        </div>
      )}
    </>
  );
}
