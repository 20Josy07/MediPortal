
import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

export default function PatientPage(props: { params: { patientId: string } }) {
  return <PatientDetailPage patientId={props.params.patientId} />;
}
