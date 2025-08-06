import React from 'react';

type PageProps = {
  params: {
    patientId: string;
  };
};

export default async function PatientPage({ params }: PageProps) {
  const { patientId } = params;
}
