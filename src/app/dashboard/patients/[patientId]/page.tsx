import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

type PatientPageProps = {
  params: { patientId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: PatientPageProps) {
  return <PatientDetailPage patientId={params.patientId} />;
}
