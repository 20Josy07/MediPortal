export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nextSession: string | null;
  status: "Activo" | "Inactivo";
}

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  type: "Individual" | "Pareja" | "Familiar";
  status: "Confirmada" | "Pendiente" | "Cancelada";
}
