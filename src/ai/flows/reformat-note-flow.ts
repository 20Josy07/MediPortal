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
  subjective: z.string().optional().describe('Subjective information reported by the patient. Only for SOAP notes.'),
  objective: z.string().optional().describe('Objective observations. Explicitly leave blank for SOAP notes.'),
  assessment: z.string().describe('Professional assessment of the situation.'),
  plan: z.string().describe('The treatment plan.'),
  data: z.string().optional().describe('Combined subjective and objective data. Only for DAP notes.'),
});

export type ReformatNoteOutput = z.infer<typeof ReformatNoteOutputSchema>;

export async function reformatNote(input: ReformatNoteInput): Promise<ReformatNoteOutput> {
  return reformatNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reformatNotePrompt',
  input: { schema: ReformatNoteInputSchema },
  output: { schema: ReformatNoteOutputSchema },
  prompt: `Eres un asistente de IA para psicólogos. Tu tarea es reformatear una nota clínica según una plantilla estándar, devolviendo los datos en el formato JSON especificado.

  Aquí está la plantilla seleccionada: {{{template}}}
  
  Aquí está el contenido original de la nota:
  ---
  {{{content}}}
  ---

  Por favor, procesa el contenido y rellena los campos del JSON de salida.

  Si la plantilla es "SOAP", la estructura debe ser:
  - subjective: En esta sección, debes resumir la información que el paciente reporta. No transcribas el texto literalmente; en su lugar, interpreta y sintetiza las ideas, sentimientos y eventos clave que el paciente comunica, redactándolo como lo haría un profesional.
  - objective: **IMPORTANTE: Deja este campo como una cadena vacía "".** El psicólogo la rellenará manualmente con sus observaciones.
  - assessment: Tu análisis profesional de la situación.
  - plan: El plan de tratamiento a seguir.
  
  Si la plantilla es "DAP", la estructura debe ser:
  - data: Combina los datos subjetivos y objetivos de la nota original.
  - assessment: Tu análisis profesional de la situación.
  - plan: El plan de tratamiento a seguir.

  Asegúrate de que el resultado final sea un objeto JSON válido que se ajuste al esquema de salida.
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
