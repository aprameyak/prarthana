"use client";

import { useEffect, useState } from "react";
import { readFavorites, toggleFavorite } from "@/lib/favorites";

export function FavoriteButton({ id }: { id: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readFavorites().includes(id));
  }, [id]);

  return (
    <button
      type="button"
      className={`fav-btn${saved ? " is-saved" : ""}`}
      onClick={() => setSaved(toggleFavorite(id).includes(id))}
      aria-pressed={saved}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
