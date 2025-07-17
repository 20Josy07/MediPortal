
import { z } from 'zod';

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

export interface Note {
  id: string;
  patientId: string;
  title: string;
  type: "Voz" | "Texto";
  createdAt: Date;
  content?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  specialization?: string;
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
