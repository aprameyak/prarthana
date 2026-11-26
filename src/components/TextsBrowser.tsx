"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PrayerCard } from "@/components/PrayerCard";
import {
  TEXTS,
  prayersForText,
  type CorpusFile,
  type ScriptureText,
  type TextsManifest,
} from "@/data/texts";
import { corpusUrl, loadableCorpora } from "@/lib/texts-corpus";

const PAGE_SIZE = 20;

export function TextsBrowser() {
  const [familyId, setFamilyId] = useState<ScriptureText["id"]>("vedas");
  const [manifest, setManifest] = useState<TextsManifest | null>(null);
  const [corpusId, setCorpusId] = useState<string>("");
  const [corpus, setCorpus] = useState<CorpusFile | null>(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const text = TEXTS.find((t) => t.id === familyId) ?? TEXTS[0];
  const related = useMemo(() => prayersForText(text), [text]);
  const familyCorpora = useMemo(
    () => loadableCorpora(manifest, familyId),
    [manifest, familyId]
  );
  const activeEntry = familyCorpora.find((c) => c.id === corpusId) ?? familyCorpora[0];

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetch(corpusUrl("manifest.json"))
      .then((r) => {
        if (!r.ok) {
          throw new Error("Corpus manifest missing. Run npm run ingest:texts.");
        }
        return r.json();
      })
      .then((data: TextsManifest) => {
        if (cancelled) return;
        setManifest(data);
        setError(null);
        setStatus("ready");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setManifest(null);
        setError(err.message);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const list = loadableCorpora(manifest, familyId);
    setCorpusId(list[0]?.id ?? "");
    setCorpus(null);
    setPage(0);
  }, [familyId, manifest]);

  useEffect(() => {
    if (!activeEntry?.path) {
      setCorpus(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    fetch(corpusUrl(activeEntry.path))
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load ${activeEntry.path}`);
        return r.json();
      })
      .then((data: CorpusFile) => {
        if (cancelled) return;
        if (!Array.isArray(data.verses) || data.verses.length === 0) {
          throw new Error(`${activeEntry.title} has no verses.`);
        }
        setCorpus(data);
        setPage(0);
        setStatus("ready");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setCorpus(null);
        setError(err.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [activeEntry?.id, activeEntry?.path, activeEntry?.title]);

  const verses = corpus?.verses ?? [];
  const pageCount = Math.max(1, Math.ceil(verses.length / PAGE_SIZE));
  const pageVerses = verses.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="texts-browser">
      <div className="filters texts-filters">
        <label>
          <span className="sr-only">Text</span>
          <select
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value as ScriptureText["id"])}
            aria-label="Text"
          >
            {TEXTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        {familyCorpora.length > 0 ? (
          <label>
            <span className="sr-only">Section</span>
            <select
              value={activeEntry?.id ?? ""}
              onChange={(e) => setCorpusId(e.target.value)}
              aria-label="Section"
              disabled={familyCorpora.length === 1}
            >
              {familyCorpora.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.verseCount.toLocaleString()})
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <header className="text-block-head">
        <p className="text-family">{text.familyLabel}</p>
        <h3>{text.title}</h3>
        <p>{text.summary}</p>
        <div className="cta-row">
          {text.external ? (
            <a
              href={text.external.href}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {text.external.label}
            </a>
          ) : null}
          {related.length > 0 ? (
            <Link href="#related-prayers" className="btn btn-ghost">
              Related prayers
            </Link>
          ) : null}
        </div>
      </header>

      {error ? <p className="empty">{error}</p> : null}
      {status === "loading" && !corpus ? <p className="empty">Loading…</p> : null}

      {corpus && verses.length > 0 ? (
        <section className="verse-panel">
          <div className="section-head">
            <div>
              <h2>{corpus.title}</h2>
              <p>
                {verses.length.toLocaleString()} verses.
                {corpus.source ? (
                  <>
                    {" "}
                    <span className="verse-source">{corpus.source}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
          <ol className="verse-list" start={page * PAGE_SIZE + 1}>
            {pageVerses.map((v) => (
              <li key={v.ref} className="verse-row">
                <span className="verse-ref">{v.ref}</span>
                <p className="verse-iast">{v.transliteration}</p>
              </li>
            ))}
          </ol>
          {pageCount > 1 ? (
            <div className="verse-pager">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </button>
              <span>
                {page + 1} / {pageCount}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              >
                Next
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {status === "ready" && !error && familyCorpora.length === 0 ? (
        <p className="empty">No verses for this text yet.</p>
      ) : null}

      {related.length > 0 ? (
        <section className="section" id="related-prayers">
          <div className="section-head">
            <div>
              <h2>Related prayers</h2>
              <p>From the prayer catalog.</p>
            </div>
          </div>
          <div className="grid">
            {related.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
