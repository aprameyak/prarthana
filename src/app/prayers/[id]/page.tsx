import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getPrayer, PRAYERS } from "@/data/prayers";

export function generateStaticParams() {
  return PRAYERS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const prayer = getPrayer(id);
    return {
      title: prayer?.title ?? "Prayer",
      description: prayer?.meaning,
    };
  });
}

export default async function PrayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prayer = getPrayer(id);
  if (!prayer) notFound();

  return (
    <>
      <section className="prayer-hero">
        <p className="meta">
          {prayer.deity} · {prayer.occasion}
        </p>
        <h1>{prayer.title}</h1>
        <div className="prayer-actions">
          <FavoriteButton id={prayer.id} />
          <Link href="/prayers" className="btn btn-ghost">
            All prayers
          </Link>
        </div>
      </section>

      <section className="block">
        <h2>Sanskrit</h2>
        <p className="sanskrit">{prayer.sanskrit}</p>
      </section>

      <section className="block">
        <h2>Transliteration</h2>
        <p className="latin">{prayer.transliteration}</p>
      </section>

      <section className="block">
        <h2>Meaning</h2>
        <p className="meaning">{prayer.meaning}</p>
      </section>
    </>
  );
}
