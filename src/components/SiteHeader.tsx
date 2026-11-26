import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        Prarthana
      </Link>
      <nav className="nav">
        <Link href="/prayers">Prayers</Link>
        <Link href="/texts">Texts</Link>
        <Link href="/calendar">Calendar</Link>
        <Link href="/favorites">Favorites</Link>
      </nav>
    </header>
  );
}
