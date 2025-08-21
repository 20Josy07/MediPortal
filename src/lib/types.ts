
import { z } from "zod";

// User Profile
export const ProfileFormSchema = z.object({
  fullName: z.string().min(2, "El nombre es muy corto").max(50, "El nombre es muy largo"),
  email: z.string().email("El correo no es válido"),
  phone: z.string().optional(),
  photoURL: z.string().url().optional().or(z.literal("")),
});
export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  photoURL?: string;
  timezone?: string;
}

// Patient
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string; // Date of Birth
  status: "Activo" | "Inactivo";
  consultationType?: string;
  mainDiagnosis?: string;
  currentObjective?: string;
  frequency?: string;
  context?: string;
  createdAt: any;
}


// Session
export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  endDate: Date;
  duration: number;
  type: "Individual" | "Pareja" | "Familiar";
  status: "Confirmada" | "Pendiente" | "Cancelada" | "No asistió";
  remindPatient: boolean;
  googleEventId?: string;
}

// Note
export interface Note {
  id: string;
  patientId: string;
  title: string;
  content: string;
  type: "Voz" | "Texto" | "Manual";
  createdAt: Date;
  hasHistory: boolean;
  status: 'Draft' | 'Completed';
}

export interface NoteVersion {
    id: string;
    title: string;
    content: string;
    versionCreatedAt: Date;
}

// Chat with Notes AI Flow
export const ChatWithNotesInputSchema = z.object({
  question: z.string().describe('The user question about the notes.'),
  notesContent: z.string().describe("A compilation of all clinical notes for the patient."),
});
export type ChatWithNotesInput = z.infer<typeof ChatWithNotesInputSchema>;

export const ChatWithNotesOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer.'),
});
export type ChatWithNotesOutput = z.infer<typeof ChatWithNotesOutputSchema>;
