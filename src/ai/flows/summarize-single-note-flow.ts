'use server';
/**
 * @fileOverview An AI flow to summarize a single clinical note.
 *
 * - summarizeSingleNote - A function that handles summarizing a note.
 * - SummarizeSingleNoteInput - The input type for the function.
 * - SummarizeSingleNoteOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeSingleNoteInputSchema = z.object({
  noteContent: z.string().describe("The full text content of the clinical note to be summarized."),
});
export type SummarizeSingleNoteInput = z.infer<typeof SummarizeSingleNoteInputSchema>;

const SummarizeSingleNoteOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the note, under 300 words."),
});
export type SummarizeSingleNoteOutput = z.infer<typeof SummarizeSingleNoteOutputSchema>;

export async function summarizeSingleNote(input: SummarizeSingleNoteInput): Promise<SummarizeSingleNoteOutput> {
  return summarizeSingleNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSingleNotePrompt',
  input: { schema: SummarizeSingleNoteInputSchema },
  output: { schema: SummarizeSingleNoteOutputSchema },
  prompt: `Eres un asistente de IA para psicólogos. Tu tarea es resumir la siguiente nota clínica.
  
  El resumen debe ser conciso, profesional y no debe exceder las 300 palabras, capturando los puntos más importantes de la nota.

  Nota original:
  ---
  {{{noteContent}}}
  ---

  Genera el resumen en el campo 'summary' del JSON de salida.
  `,
});

const summarizeSingleNoteFlow = ai.defineFlow(
  {
    name: 'summarizeSingleNoteFlow',
    inputSchema: SummarizeSingleNoteInputSchema,
    outputSchema: SummarizeSingleNoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
