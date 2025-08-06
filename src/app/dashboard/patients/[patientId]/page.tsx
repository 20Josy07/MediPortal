
import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

type PageProps = {
  params: {
    patientId: string;
  };
};

export default async function Page({ params }: PageProps) {
  return <PatientDetailPage patientId={params.patientId} />;
}
