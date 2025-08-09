import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

type Props = { params: { patientId: string } };

export default function Page({ params }: Props) {
  return <PatientDetailPage patientId={params.patientId} />;
}
