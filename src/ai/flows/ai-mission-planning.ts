
'use server';

/**
 * @fileOverview AI-powered mission planning flow.
 *
 * - aiMissionPlanning - A function that suggests optimal mission locations and times.
 * - AiMissionPlanningInput - The input type for the aiMissionPlanning function.
 * - AiMissionPlanningOutput - The return type for the aiMissionPlanning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMissionPlanningInputSchema = z.object({
  location: z.string().describe('La ubicación general para la misión.'),
  topic: z.string().describe('El tema o asunto de la misión de evangelismo.'),
  preferences: z.string().optional().describe('Cualquier preferencia específica para la misión (ej., hora del día, tipo de lugar).'),
});
export type AiMissionPlanningInput = z.infer<typeof AiMissionPlanningInputSchema>;

const AiMissionPlanningOutputSchema = z.object({
  suggestedLocations: z.array(z.string()).describe('Una lista de ubicaciones sugeridas para la misión.'),
  suggestedTimes: z.array(z.string()).describe('Una lista de horarios sugeridos para la misión.'),
  reasoning: z.string().describe('El razonamiento de la IA detrás de las sugerencias de ubicación y horario.'),
});
export type AiMissionPlanningOutput = z.infer<typeof AiMissionPlanningOutputSchema>;

export async function aiMissionPlanning(input: AiMissionPlanningInput): Promise<AiMissionPlanningOutput> {
  return aiMissionPlanningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMissionPlanningPrompt',
  input: {schema: AiMissionPlanningInputSchema},
  output: {schema: AiMissionPlanningOutputSchema},
  prompt: `Eres un asistente de IA especializado en la planificación de misiones de evangelismo.

  Basándote en la ubicación, el tema y cualquier preferencia proporcionada, sugiere las mejores ubicaciones y horarios para la misión.

  Ubicación: {{{location}}}
  Tema: {{{topic}}}
  Preferencias: {{{preferences}}}

  Considera factores como la densidad de población, eventos locales y patrones de tráfico típicos.
  Proporciona una lista de ubicaciones y horarios sugeridos, junto con una breve explicación de tu razonamiento.
  Formatea las sugerencias de ubicación como una lista con viñetas.
  Formatea las sugerencias de horario como una lista con viñetas.
  `,
});

const aiMissionPlanningFlow = ai.defineFlow(
  {
    name: 'aiMissionPlanningFlow',
    inputSchema: AiMissionPlanningInputSchema,
    outputSchema: AiMissionPlanningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
