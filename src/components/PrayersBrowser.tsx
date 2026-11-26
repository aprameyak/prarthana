"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrayerCard } from "@/components/PrayerCard";
import { DEITIES, filterPrayers } from "@/data/prayers";

export function PrayersBrowser() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [deity, setDeity] = useState(params.get("deity") ?? "all");
  const [occasion, setOccasion] = useState(params.get("occasion") ?? "all");

  const results = useMemo(
    () => filterPrayers({ q, deity, occasion }),
    [q, deity, occasion]
  );

  function sync(next: { q?: string; deity?: string; occasion?: string }) {
    const sp = new URLSearchParams();
    const qq = next.q ?? q;
    const dd = next.deity ?? deity;
    const oo = next.occasion ?? occasion;
    if (qq.trim()) sp.set("q", qq.trim());
    if (dd !== "all") sp.set("deity", dd);
    if (oo !== "all") sp.set("occasion", oo);
    const qs = sp.toString();
    router.replace(qs ? `/prayers?${qs}` : "/prayers");
  }

  return (
    <>
      <div className="filters">
        <input
          type="search"
          placeholder="Search prayers"
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
          <option value="all">Any time</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="anytime">Anytime</option>
          <option value="festival">Festival</option>
        </select>
      </div>

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
