import type { Metadata } from "next";
import { TextsBrowser } from "@/components/TextsBrowser";

export const metadata: Metadata = {
  title: "Texts",
  description: "Vedas, Ramayana, Mahabharata, and Puranas in Latin transliteration.",
  alternates: { canonical: "/texts" },
};

export default function TextsPage() {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>Texts</h2>
          <p>Pick a text and read the transliteration.</p>
        </div>
      </div>
      <TextsBrowser />
    </section>
  );
}
