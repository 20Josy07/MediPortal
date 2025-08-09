import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";

type Props = {
  params: Promise<{ patientId: string }>
};

export default async function Page({ params }: Props) {
  const { patientId } = await params; // 👈 ahora sí lo puedes await-ear
  return <PatientDetailPage patientId={patientId} />;
}
