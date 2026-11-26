import Link from "next/link";
import { PrayerCard } from "@/components/PrayerCard";
import { PRAYERS } from "@/data/prayers";

export default function HomePage() {
  const featured = PRAYERS.slice(0, 6);

  return (
    <>
      <section className="hero">
        <p className="hero-kicker">Sanatana Dharma</p>
        <h1>Prarthana</h1>
        <p>
          Mantras, stotras, aartis, and verses across deities, occasions, and
          festivals — published in Latin script with English meaning.
        </p>
        <div className="cta-row">
          <Link href="/prayers" className="btn btn-primary">
            Browse prayers
          </Link>
          <Link href="/prayers/gayatri" className="btn btn-ghost">
            Begin with Gayatri
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Featured</h2>
            <p>Start with these well-known mantras and verses.</p>
          </div>
          <Link href="/prayers" className="btn btn-ghost">
            View all
          </Link>
        </div>
        <div className="grid">
          {featured.map((prayer) => (
            <PrayerCard key={prayer.id} prayer={prayer} />
          ))}
        </div>
      </section>
    </>
  );
}
