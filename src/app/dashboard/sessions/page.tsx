import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SessionsCalendar } from "@/components/dashboard/sessions-calendar";

export default function SessionsPage() {
  return (
    <div className="flex-1 space-y-4">
      <DashboardHeader title="Mi Agenda" />
      <SessionsCalendar />
    </div>
  );
}