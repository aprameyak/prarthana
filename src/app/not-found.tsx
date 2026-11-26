import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <h2>Not found</h2>
      <p className="empty">That prayer is not in the collection.</p>
      <Link href="/prayers" className="btn btn-primary">
        Browse prayers
      </Link>
    </section>
  );
}
