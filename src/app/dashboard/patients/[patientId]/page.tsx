import { PatientDetailPage } from "@/components/dashboard/patient-detail-page";
import type { PageProps } from "next";

export default async function Page({ params }: PageProps<{ patientId: string }>) {
  const { patientId } = await params; // 👈 en Next 15, params puede ser Promise
  return <PatientDetailPage patientId={patientId} />;
}
