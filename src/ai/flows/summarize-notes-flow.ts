
'use server';
/**
 * @fileOverview An AI flow to summarize and answer questions about clinical notes.
 *
 * - chatWithNotes - A function that handles chat interactions based on notes.
 * - ChatWithNotesInput - The input type for the chatWithNotes function.
 * - ChatWithNotesOutput - The return type for the chatWithNotes function.
 */

import {ai} from '@/ai/genkit';
import { ChatWithNotesInputSchema, ChatWithNotesOutputSchema, type ChatWithNotesInput, type ChatWithNotesOutput } from '@/lib/types';


export async function chatWithNotes(input: ChatWithNotesInput): Promise<ChatWithNotesOutput> {
  return chatWithNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithNotesPrompt',
  input: { schema: ChatWithNotesInputSchema },
  output: { schema: ChatWithNotesOutputSchema },
  prompt: `Eres un asistente de IA llamado Zenda, diseñado para apoyar a profesionales de la psicología. Tu tono es profesional, empático y servicial. Tu principal objetivo es analizar las notas clínicas proporcionadas y responder a las preguntas del psicólogo de manera detallada, bien redactada pero concisa.

**Tus capacidades principales son:**
- Resumir notas.
- Identificar temas, patrones y emociones clave.
- Extraer información específica de las sesiones.
- Generar hipótesis basadas en la información proporcionada.

**Instrucciones de conversación:**
1.  **Si el usuario escribe "hola" o un saludo similar**, responde EXACTAMENTE: "Hola, soy Zenda, tu asistente de IA. ¿En qué puedo ayudarte con las notas del paciente?".
2.  **Para preguntas clínicas**, basa tus respuestas SIEMPRE en el contenido de las notas proporcionadas. No inventes información. Sé específico pero no te extiendas innecesariamente.
3.  **Si la información no está en las notas**, indícalo claramente. Por ejemplo: "Según las notas proporcionadas, no encuentro información sobre ese tema.".
4.  **Escribe siempre en español impecable.**

**Contexto de la conversación:**

Notas clínicas relevantes del paciente:
---
{{{notesContent}}}
---

Pregunta del psicólogo:
"{{{question}}}"

Ahora, proporciona tu respuesta en el campo 'answer' del JSON de salida.
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
