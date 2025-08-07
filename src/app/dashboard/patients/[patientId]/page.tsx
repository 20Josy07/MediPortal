import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

type PatientPageParams = {
  params: {
    patientId: string;
  };
};

export default function PatientPage({ params }: PatientPageParams) {
  return <PatientDetailPage patientId={params.patientId} />;
}
