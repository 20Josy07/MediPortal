import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

type PatientPageProps = {
  params: {
    patientId: string;
  };
};

export default function PatientPage({ params }: PatientPageProps) {
  return <PatientDetailPage patientId={params.patientId} />;
}
