
'use server';
/**
 * @fileOverview An AI flow to send session reminders.
 *
 * - sendReminder - A function that handles sending reminders.
 * - SendReminderInput - The input type for the sendReminder function.
 * - SendReminderOutput - The return type for the sendReminder function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const SendReminderInputSchema = z.object({
  patientName: z.string().describe("The patient's name."),
  patientEmail: z.string().describe("The patient's email address."),
  patientPhone: z.string().describe("The patient's phone number."),
  sessionDate: z.string().describe('The date and time of the session.'),
  reminderType: z.enum(['patient', 'psychologist', 'both']).describe('Who to send the reminder to.'),
});
export type SendReminderInput = z.infer<typeof SendReminderInputSchema>;

const SendReminderOutputSchema = z.object({
  status: z.string().describe('The status of the reminder sending process.'),
});
export type SendReminderOutput = z.infer<typeof SendReminderOutputSchema>;

export async function sendReminder(input: SendReminderInput): Promise<SendReminderOutput> {
  return sendReminderFlow(input);
}

const sendReminderFlow = ai.defineFlow(
  {
    name: 'sendReminderFlow',
    inputSchema: SendReminderInputSchema,
    outputSchema: SendReminderOutputSchema,
  },
  async (input) => {
    console.log('--- Iniciando flujo de envío de recordatorios ---');
    
    const formattedDate = format(new Date(input.sessionDate), "eeee, d 'de' MMMM, yyyy 'a las' p", { locale: es });
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("MAKE_WEBHOOK_URL no está configurada en las variables de entorno.");
      return { status: "Error: Webhook URL no configurada." };
    }

    if (input.reminderType === 'patient' || input.reminderType === 'both') {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientName: input.patientName,
            patientEmail: input.patientEmail,
            patientPhone: input.patientPhone,
            sessionDate: formattedDate,
            rawSessionDate: input.sessionDate,
          }),
        });

        if (response.ok) {
          console.log(`Webhook enviado exitosamente para el paciente ${input.patientName}`);
        } else {
          const errorText = await response.text();
          console.error(`Error al enviar webhook para ${input.patientName}: ${response.status} ${errorText}`);
        }
      } catch (error) {
        console.error(`Error de red al enviar webhook para ${input.patientName}:`, error);
      }
    }

    if (input.reminderType === 'psychologist' || input.reminderType === 'both') {
        // Placeholder for psychologist reminder logic
    }

    console.log('--- Flujo de envío de recordatorios completado ---');
    
    return {
      status: 'Proceso de recordatorios ejecutado.',
    };
  }
);
