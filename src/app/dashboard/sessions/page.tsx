import { SessionsCalendar } from "@/components/dashboard/sessions-calendar";

export default function SessionsPage() {
  return (
    <div className="flex-1 space-y-4 flex flex-col">
      <SessionsCalendar />
    </div>
  );
}
