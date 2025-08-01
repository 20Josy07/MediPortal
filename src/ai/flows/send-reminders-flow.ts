
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
    
    const formattedDate = format(input.sessionDate, "eeee, d 'de' MMMM, yyyy 'a las' p", { locale: es });

    if (input.reminderType === 'patient' || input.reminderType === 'both') {
      console.log(`SIMULACIÓN: Enviando recordatorio por correo electrónico al paciente ${input.patientName} a ${input.patientEmail}`);
      console.log(`Contenido del Correo: Hola ${input.patientName}, te recordamos tu sesión para el ${formattedDate}.`);

      console.log(`SIMULACIÓN: Enviando recordatorio por SMS al paciente ${input.patientName} al ${input.patientPhone}`);
      console.log(`Contenido del SMS: Recordatorio de sesión para el ${formattedDate}.`);
    }

    if (input.reminderType === 'psychologist' || input.reminderType === 'both') {
      console.log(`SIMULACIÓN: Enviando recordatorio al psicólogo sobre la sesión con ${input.patientName}.`);
    }

    console.log('--- Flujo de envío de recordatorios completado ---');
    
    return {
      status: 'Simulación de recordatorios completada.',
    };
  }
);
