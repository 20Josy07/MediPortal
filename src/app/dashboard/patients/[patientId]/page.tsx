
import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

export default function PatientPage({ params }: { params: { patientId: string } }) {
  return <PatientDetailPage patientId={params.patientId} />;
}
