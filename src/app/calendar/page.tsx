import { FestivalCalendar } from "@/components/FestivalCalendar";

export const metadata = {
  title: "Calendar",
  description: "Hindu festival dates with links to related prayers.",
};

export default function CalendarPage() {
  return <FestivalCalendar />;
}
