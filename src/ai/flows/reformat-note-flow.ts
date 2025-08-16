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
  prompt: `Eres un asistente de IA experto para psicólogos. Tu tarea es reformatear una nota clínica según una plantilla estándar, devolviendo los datos en el formato JSON especificado.

  Aquí está la plantilla seleccionada: {{{template}}}
  
  Aquí está el contenido original de la nota:
  ---
  {{{content}}}
  ---

  Por favor, procesa el contenido y rellena los campos del JSON de salida.

  Si la plantilla es "SOAP", la estructura debe ser:
  - subjective: En esta sección, debes resumir de manera BREVE y CONCISA la información que el paciente reporta. No transcribas el texto literalmente; en su lugar, sintetiza los puntos clave y preocupaciones del paciente.
  - objective: **IMPORTANTE: Este campo debe contener exactamente el texto: "Completa manualmente".** El psicólogo la rellenará manualmente con sus observaciones directas del comportamiento, apariencia y afecto del paciente durante la sesión.
  - assessment: Tu análisis profesional DETALLADO de la situación. Debe ser una evaluación completa que integre la información subjetiva con el conocimiento clínico. Incluye hipótesis diagnósticas (si aplica), una evaluación del riesgo y una descripción de los patrones de pensamiento y comportamiento del paciente.
  - plan: El plan de tratamiento a seguir, que debe ser COMPLETO y bien definido. Describe los objetivos a corto y largo plazo, las intervenciones terapéuticas específicas que se utilizarán (ej. técnicas de TCC, psicoeducación) y las tareas asignadas al paciente. **Si el contenido original no menciona ningún plan de tratamiento, el campo 'plan' debe contener exactamente el texto: "Completa manualmente".**
  
  Si la plantilla es "DAP", la estructura debe ser:
  - data: Combina los datos subjetivos y objetivos de la nota original de forma BREVE y CONCISA. Sintetiza la información más relevante presentada por el paciente.
  - assessment: Tu análisis profesional DETALLADO de la situación. Al igual que en SOAP, debe ser una evaluación completa que integre la información subjetiva con el conocimiento clínico. Incluye hipótesis diagnósticas (si aplica), una evaluación del riesgo y una descripción de los patrones de pensamiento y comportamiento del paciente.
  - plan: El plan de tratamiento a seguir, que debe ser COMPLETO y bien definido. Describe los objetivos a corto y largo plazo, las intervenciones terapéuticas específicas que se utilizarán y las tareas asignadas al paciente. **Si el contenido original no menciona ningún plan de tratamiento, el campo 'plan' debe contener exactamente el texto: "Completa manualmente".**

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
