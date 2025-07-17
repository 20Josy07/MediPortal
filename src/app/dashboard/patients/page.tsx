import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PatientTableWrapper } from "@/components/dashboard/patient-table-wrapper";

export default function PatientsPage() {
  return (
    <div className="flex-1 space-y-4">
      <DashboardHeader title="Gestión de Pacientes" />
      <div className="space-y-4">
        <PatientTableWrapper />
      </div>
    </div>
  );
}