'use server';
/**
 * @fileOverview An AI flow to reformat clinical notes into standard templates.
 *
 * - reformatNote - A function that handles reformatting a note.
 * - ReformatNoteInput - The input type for the reformatNote function.
 * - ReformatNoteOutput - The return type for the reformatNote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ReformatNoteInputSchema = z.object({
  content: z.string().describe('The raw text content of the clinical note.'),
  template: z.enum(['SOAP', 'DAP']).describe('The template to format the note into.'),
});
export type ReformatNoteInput = z.infer<typeof ReformatNoteInputSchema>;

const ReformatNoteOutputSchema = z.object({
  reformattedContent: z.string().describe('The note content reformatted according to the selected template.'),
});
export type ReformatNoteOutput = z.infer<typeof ReformatNoteOutputSchema>;

export async function reformatNote(input: ReformatNoteInput): Promise<ReformatNoteOutput> {
  return reformatNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reformatNotePrompt',
  input: { schema: ReformatNoteInputSchema },
  output: { schema: ReformatNoteOutputSchema },
  prompt: `Eres un asistente de IA para psicólogos. Tu tarea es reformatear una nota clínica según una plantilla estándar.

  Aquí está la plantilla seleccionada: {{{template}}}
  
  Aquí está el contenido original de la nota:
  ---
  {{{content}}}
  ---

  Por favor, reformatea el contenido de la nota para que siga la estructura de la plantilla {{{template}}}.

  Si la plantilla es "SOAP", la estructura debe ser:
  S (Subjetivo): Información que el paciente reporta.
  O (Objetivo): **IMPORTANTE: Deja esta sección en blanco.** El psicólogo la rellenará manualmente con sus observaciones.
  A (Análisis/Evaluación): Tu análisis profesional de la situación.
  P (Plan): El plan de tratamiento a seguir.
  
  Si la plantilla es "DAP", la estructura debe ser:
  D (Datos): Datos subjetivos y objetivos combinados.
  A (Análisis/Evaluación): Tu análisis profesional de la situación.
  P (Plan): El plan de tratamiento a seguir.

  Asegúrate de que el resultado final solo contenga el texto formateado, sin comentarios adicionales.
  `,
});


const reformatNoteFlow = ai.defineFlow(
  {
    name: 'reformatNoteFlow',
    inputSchema: ReformatNoteInputSchema,
    outputSchema: ReformatNoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
