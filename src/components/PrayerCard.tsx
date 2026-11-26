import Link from "next/link";
import type { Prayer } from "@/data/prayers";
import { KIND_LABELS, OCCASION_LABELS } from "@/data/prayers";

export function PrayerCard({ prayer }: { prayer: Prayer }) {
  return (
    <Link href={`/prayers/${prayer.id}`} className="prayer-card">
      <div className="prayer-card-meta">
        <span>{prayer.deities[0]}</span>
        <span aria-hidden>·</span>
        <span>{KIND_LABELS[prayer.kind]}</span>
        {prayer.festivals[0] ? (
          <>
            <span aria-hidden>·</span>
            <span>{prayer.festivals[0]}</span>
          </>
        ) : null}
      </div>
      <h3>{prayer.title}</h3>
      <p className="prayer-card-preview">{prayer.transliteration.split("\n")[0]}</p>
      <p className="prayer-card-occasions">
        {prayer.occasions.slice(0, 3).map((o) => OCCASION_LABELS[o]).join(" · ")}
      </p>
    </Link>
  );
}
