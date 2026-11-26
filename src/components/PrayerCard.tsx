import Link from "next/link";
import type { Prayer } from "@/data/prayers";

export function PrayerCard({ prayer }: { prayer: Prayer }) {
  return (
    <Link href={`/prayers/${prayer.id}`} className="prayer-card">
      <div className="prayer-card-meta">
        <span>{prayer.deity}</span>
        <span aria-hidden>·</span>
        <span className="capitalize">{prayer.occasion}</span>
      </div>
      <h3>{prayer.title}</h3>
      <p className="prayer-card-preview">{prayer.transliteration.split("\n")[0]}</p>
    </Link>
  );
}
