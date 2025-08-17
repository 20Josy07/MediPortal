import { z } from 'zod';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nextSession: string | null;
  status: "Activo" | "Inactivo";
  dob?: string;
  createdAt?: Date;
  consultationType?: string;
  mainDiagnosis?: string;
  currentObjective?: string;
  frequency?: string;
  context?: string;
}

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  endDate: Date;
  duration: number; // in minutes
  type: "Individual" | "Pareja" | "Familiar";
  status: "Confirmada" | "Pendiente" | "Cancelada" | "No asistió";
  remindPsychologist?: boolean;
  remindPatient?: boolean;
}

export interface Note {
  id: string;
  patientId: string;
  title: string;
  type: "Voz" | "Texto" | "Manual";
  createdAt: Date;
  content: string;
  sessionId?: string;
  hasHistory?: boolean;
}

export interface NoteVersion {
    id: string;
    title: string;
    content: string;
    versionCreatedAt: Date;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  photoURL?: string;
  role?: 'admin' | 'user';
  [key: string]: any; // Para mantener compatibilidad con otros campos existentes
}

// Schema for chatWithNotes flow input
export const ChatWithNotesInputSchema = z.object({
  question: z.string().describe('The user question about the notes.'),
  notesContent: z.string().describe('The concatenated content of the relevant clinical notes.'),
});
export type ChatWithNotesInput = z.infer<typeof ChatWithNotesInputSchema>;

// Schema for chatWithNotes flow output
export const ChatWithNotesOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question based on the provided notes."),
});
export type ChatWithNotesOutput = z.infer<typeof ChatWithNotesOutputSchema>;

export const ProfileFormSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido."),
  email: z.string().email("Correo electrónico inválido."),
  phone: z.string().optional(),
  photoURL: z.string().optional(),
});
export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
