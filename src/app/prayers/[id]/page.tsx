import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/FavoriteButton";
import {
  getPrayer,
  KIND_LABELS,
  OCCASION_LABELS,
  PRAYERS,
} from "@/data/prayers";
import { metaDescription } from "@/lib/site";

export function generateStaticParams() {
  return PRAYERS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prayer = getPrayer(id);
  if (!prayer) return { title: "Prayer" };

  const description = metaDescription(prayer.meaning);
  const path = `/prayers/${prayer.id}`;

  return {
    title: prayer.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: prayer.title,
      description,
      url: path,
    },
    twitter: {
      card: "summary",
      title: prayer.title,
      description,
    },
  };
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
          {prayer.deities.join(" · ")} · {KIND_LABELS[prayer.kind]}
          {prayer.festivals.length
            ? ` · ${prayer.festivals.join(" · ")}`
            : ""}
        </p>
        <h1>{prayer.title}</h1>
        <p className="meaning" style={{ margin: 0 }}>
          {prayer.occasions.map((o) => OCCASION_LABELS[o]).join(" · ")}
        </p>
        <p className="accuracy-note">
          {prayer.accuracy === "verified"
            ? "Verified text"
            : "Unreviewed. Meaning and wording still need source checking"}
          {prayer.completeness === "excerpt" ? " · Excerpt / opening only" : ""}
          {prayer.source ? ` · Source: ${prayer.source}` : ""}
        </p>
        <div className="prayer-actions">
          <FavoriteButton id={prayer.id} />
          <Link href="/prayers" className="btn btn-ghost">
            All prayers
          </Link>
        </div>
      </section>

      <section className="block">
        <h2>Prayer</h2>
        <p className="latin prayer-text">{prayer.transliteration}</p>
      </section>

      <section className="block">
        <h2>Meaning</h2>
        <p className="meaning">{prayer.meaning}</p>
      </section>
    </>
  );
}
