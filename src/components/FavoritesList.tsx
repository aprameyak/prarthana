"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PrayerCard } from "@/components/PrayerCard";
import { getPrayer } from "@/data/prayers";
import { readFavorites } from "@/lib/favorites";

export function FavoritesList() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readFavorites());
  }, []);

  const prayers = ids
    .map((id) => getPrayer(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (prayers.length === 0) {
    return (
      <p className="empty">
        No favorites yet.{" "}
        <Link href="/prayers" style={{ color: "var(--gold-soft)" }}>
          Browse prayers
        </Link>{" "}
        and tap Save.
      </p>
    );
  }

  return (
    <div className="grid">
      {prayers.map((prayer) => (
        <PrayerCard key={prayer.id} prayer={prayer} />
      ))}
    </div>
  );
}
