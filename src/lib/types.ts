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
  type: "Voz" | "Texto";
  createdAt: Date;
  content: string;
  sessionId?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  photoURL?: string;
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

    
