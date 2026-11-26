import { Suspense } from "react";
import { PrayersBrowser } from "@/components/PrayersBrowser";

export const metadata = {
  title: "Prayers",
};

export default function PrayersPage() {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>Prayers</h2>
          <p>Filter by deity, occasion, festival, or type.</p>
        </div>
      </div>
      <Suspense fallback={<p className="empty">Loading…</p>}>
        <PrayersBrowser />
      </Suspense>
    </section>
  );
}
