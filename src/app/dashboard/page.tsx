import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PatientTableWrapper } from "@/components/dashboard/patient-table-wrapper";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader title="Patients" />
      <PatientTableWrapper />
    </div>
  );
}
