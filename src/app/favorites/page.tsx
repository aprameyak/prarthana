import type { Metadata } from "next";
import { FavoritesList } from "@/components/FavoritesList";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Prayers saved on this device.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/favorites" },
};

export default function FavoritesPage() {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>Favorites</h2>
          <p>Prayers you save stay on this device.</p>
        </div>
      </div>
      <FavoritesList />
    </section>
  );
}
