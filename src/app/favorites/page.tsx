import { FavoritesList } from "@/components/FavoritesList";

export const metadata = {
  title: "Favorites",
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
