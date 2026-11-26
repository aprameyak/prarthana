import type { Metadata } from "next";
import { FestivalCalendar } from "@/components/FestivalCalendar";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Hindu festival dates with links to related prayers.",
  alternates: { canonical: "/calendar" },
};

export default function CalendarPage() {
  return <FestivalCalendar />;
}
