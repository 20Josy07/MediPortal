export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nextSession?: string | null;
  status: "Activo" | "Inactivo";
}

export interface Session {
  id: string;
  patientName: string;
  date: Date;
  status: "Confirmada" | "Pendiente" | "Cancelada";
}
