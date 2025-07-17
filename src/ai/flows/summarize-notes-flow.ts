'use server';
/**
 * @fileOverview An AI flow to summarize and answer questions about clinical notes.
 *
 * - chatWithNotes - A function that handles chat interactions based on notes.
 * - ChatWithNotesInput - The input type for the chatWithNotes function.
 * - ChatWithNotesOutput - The return type for the chatWithNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ChatWithNotesInputSchema = z.object({
  question: z.string().describe('The user question about the notes.'),
  notesContent: z.string().describe('The concatenated content of the relevant clinical notes.'),
});
export type ChatWithNotesInput = z.infer<typeof ChatWithNotesInputSchema>;

export const ChatWithNotesOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question based on the provided notes."),
});
export type ChatWithNotesOutput = z.infer<typeof ChatWithNotesOutputSchema>;

export async function chatWithNotes(input: ChatWithNotesInput): Promise<ChatWithNotesOutput> {
  return chatWithNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithNotesPrompt',
  input: { schema: ChatWithNotesInputSchema },
  output: { schema: ChatWithNotesOutputSchema },
  prompt: `Eres un asistente de IA para un psicólogo. Tu tarea es responder preguntas basadas en las notas clínicas de un paciente.
  
  Aquí están las notas relevantes:
  ---
  {{{notesContent}}}
  ---

  Y aquí está la pregunta del psicólogo:
  "{{{question}}}"

  Por favor, proporciona una respuesta concisa y útil basada únicamente en la información de las notas. Si la información no está en las notas, indícalo claramente.
  `,
});

const chatWithNotesFlow = ai.defineFlow(
  {
    name: 'chatWithNotesFlow',
    inputSchema: ChatWithNotesInputSchema,
    outputSchema: ChatWithNotesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
