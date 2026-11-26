"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FESTIVAL_CALENDAR_META,
  FESTIVAL_DAYS,
  festivalDaysForYear,
  formatFestivalDate,
  upcomingFestivalDays,
} from "@/data/calendar";

const YEARS = Array.from(new Set(FESTIVAL_DAYS.map((f) => f.year))).sort(
  (a, b) => a - b
);

export function FestivalCalendar() {
  const upcoming = useMemo(() => upcomingFestivalDays(8), []);
  const [year, setYear] = useState(
    () => YEARS.find((y) => y >= new Date().getFullYear()) ?? YEARS[0]
  );
  const yearDays = useMemo(() => festivalDaysForYear(year), [year]);

  return (
    <>
      <section className="section">
        <div className="section-head">
          <div>
            <h2>Calendar</h2>
            <p>
              Festival dates for quiet planning, with links into prayers when we
              have them.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>Upcoming</h2>
            <p>Next observances on the calendar.</p>
          </div>
        </div>
        {upcoming.length === 0 ? (
          <p className="empty">No upcoming dates in the current dataset.</p>
        ) : (
          <ol className="festival-list">
            {upcoming.map((day) => (
              <li key={day.id} className="festival-row is-upcoming">
                <time dateTime={day.date}>{formatFestivalDate(day.date)}</time>
                <div className="festival-row-body">
                  <span className="festival-name">{day.name}</span>
                  {day.prayerFestival ? (
                    <Link
                      href={`/prayers?festival=${encodeURIComponent(day.prayerFestival)}`}
                      className="festival-link"
                    >
                      Related prayers
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>{year}</h2>
            <p>Major Hindu festivals (New Delhi dates).</p>
          </div>
          <label className="year-picker">
            <span className="sr-only">Year</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              aria-label="Calendar year"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ol className="festival-list">
          {yearDays.map((day) => (
            <li key={day.id} className="festival-row">
              <time dateTime={day.date}>{formatFestivalDate(day.date)}</time>
              <div className="festival-row-body">
                <span className="festival-name">{day.name}</span>
                {day.prayerFestival ? (
                  <Link
                    href={`/prayers?festival=${encodeURIComponent(day.prayerFestival)}`}
                    className="festival-link"
                  >
                    Related prayers
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="calendar-attribution">
          Dates:{" "}
          <a
            href={FESTIVAL_CALENDAR_META.docs}
            target="_blank"
            rel="noopener noreferrer"
          >
            {FESTIVAL_CALENDAR_META.attribution}
          </a>
          {" · "}
          <a
            href={FESTIVAL_CALENDAR_META.licence_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {FESTIVAL_CALENDAR_META.licence}
          </a>
          . {FESTIVAL_CALENDAR_META.note}
        </p>
      </section>
    </>
  );
}
