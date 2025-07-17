import { SessionsCalendar } from "@/components/dashboard/sessions-calendar";

export default function SessionsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <SessionsCalendar />
    </div>
  );
}
