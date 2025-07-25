'use server';
/**
 * @fileOverview An AI flow to generate a patient's therapeutic progress report.
 *
 * - generateProgressReport - A function that handles generating the report.
 * - GenerateProgressReportInput - The input type for the function.
 * - GenerateProgressReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateProgressReportInputSchema = z.object({
  patientName: z.string().describe("The patient's name."),
  notesContent: z.string().describe("A compilation of all clinical notes for the patient."),
  initialObjective: z.string().describe("The initial objective set for the therapy."),
});
export type GenerateProgressReportInput = z.infer<typeof GenerateProgressReportInputSchema>;

const GenerateProgressReportOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the patient's overall evolution."),
  achievements: z.string().describe("A list or summary of the goals and milestones achieved by the patient."),
  detectedChanges: z.string().describe("Notable changes observed in the patient, such as frequency of sessions, emotional state, behaviors, etc."),
  keyPhrases: z.string().optional().describe("A collection of key phrases or significant quotes from the patient's sessions."),
});
export type GenerateProgressReportOutput = z.infer<typeof GenerateProgressReportOutputSchema>;

export async function generateProgressReport(input: GenerateProgressReportInput): Promise<GenerateProgressReportOutput> {
  return generateProgressReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProgressReportPrompt',
  input: { schema: GenerateProgressReportInputSchema },
  output: { schema: GenerateProgressReportOutputSchema },
  prompt: `Eres un asistente experto de psicólogos clínicos. Tu tarea es analizar un conjunto de notas de sesión y generar un informe de progreso terapéutico conciso y profesional para el paciente: {{{patientName}}}.

El objetivo inicial de la terapia fue: "{{{initialObjective}}}".

Basándote en las siguientes notas, extrae y sintetiza la información para rellenar los campos del JSON de salida. Sé claro, objetivo y basa tus conclusiones únicamente en la información proporcionada.

Notas de sesión:
---
{{{notesContent}}}
---

Estructura del informe:
- summary: Un resumen general de la evolución del paciente desde el inicio hasta la fecha.
- achievements: Enumera los logros y avances concretos del paciente en relación con el objetivo inicial.
- detectedChanges: Describe cambios notables en la frecuencia de las sesiones, el estado emocional, los patrones de comportamiento o cualquier otro indicador relevante.
- keyPhrases: (Opcional) Cita algunas frases clave o significativas que el paciente haya mencionado y que ilustren su proceso. Si no hay frases destacadas, deja este campo vacío.

Asegúrate de que el resultado final sea un objeto JSON válido que se ajuste al esquema de salida.
`,
});

const generateProgressReportFlow = ai.defineFlow(
  {
    name: 'generateProgressReportFlow',
    inputSchema: GenerateProgressReportInputSchema,
    outputSchema: GenerateProgressReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
