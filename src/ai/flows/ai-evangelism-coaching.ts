
'use server';
/**
 * @fileOverview An AI-powered evangelism coaching agent.
 *
 * - getEvangelismCoaching - A function that provides evangelism coaching tips.
 * - GetEvangelismCoachingInput - The input type for the getEvangelismCoaching function.
 * - GetEvangelismCoachingOutput - The return type for the getEvangelismCoaching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetEvangelismCoachingInputSchema = z.object({
  missionDescription: z
    .string()
    .describe('Una descripción de la misión de evangelismo planeada.'),
  userExperience: z
    .string()
    .describe('La experiencia previa del usuario con el evangelismo.'),
  targetAudience: z
    .string()
    .describe('Descripción del público objetivo para la misión.'),
});
export type GetEvangelismCoachingInput = z.infer<typeof GetEvangelismCoachingInputSchema>;

const GetEvangelismCoachingOutputSchema = z.object({
  coachingTips: z.array(z.string()).describe('Una lista de consejos de coaching para la misión de evangelismo.'),
});
export type GetEvangelismCoachingOutput = z.infer<typeof GetEvangelismCoachingOutputSchema>;

export async function getEvangelismCoaching(input: GetEvangelismCoachingInput): Promise<GetEvangelismCoachingOutput> {
  return evangelismCoachingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evangelismCoachingPrompt',
  input: {schema: GetEvangelismCoachingInputSchema},
  output: {schema: GetEvangelismCoachingOutputSchema},
  prompt: `Eres un coach de evangelismo impulsado por IA. Proporciona consejos de coaching para la misión de evangelismo del usuario basándote en la siguiente información:

Descripción de la Misión: {{{missionDescription}}}
Experiencia del Usuario: {{{userExperience}}}
Público Objetivo: {{{targetAudience}}}

Proporciona al menos tres consejos de coaching para mejorar su enfoque.`,
});

const evangelismCoachingFlow = ai.defineFlow(
  {
    name: 'evangelismCoachingFlow',
    inputSchema: GetEvangelismCoachingInputSchema,
    outputSchema: GetEvangelismCoachingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
