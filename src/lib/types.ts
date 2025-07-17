export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nextSession?: string | null;
  status: "Activo" | "Inactivo";
}
