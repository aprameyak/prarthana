/** Canonical site origin used for metadata, sitemap, and robots. */
export const SITE_URL = "https://prarthana.aprameyakannan.com";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Short plain description for meta tags. Cuts on a word boundary when possible. */
export function metaDescription(text: string, max = 155): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const slice = cleaned.slice(0, max);
  const space = slice.lastIndexOf(" ");
  return (space > 80 ? slice.slice(0, space) : slice).trimEnd();
}
