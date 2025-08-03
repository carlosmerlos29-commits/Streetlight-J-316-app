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
  location: z.string().describe('The general location for the mission.'),
  topic: z.string().describe('The topic or theme of the evangelism mission.'),
  preferences: z.string().optional().describe('Any specific preferences for the mission (e.g., time of day, type of venue).'),
});
export type AiMissionPlanningInput = z.infer<typeof AiMissionPlanningInputSchema>;

const AiMissionPlanningOutputSchema = z.object({
  suggestedLocations: z.array(z.string()).describe('A list of suggested locations for the mission.'),
  suggestedTimes: z.array(z.string()).describe('A list of suggested times for the mission.'),
  reasoning: z.string().describe('The AI reasoning behind the location and time suggestions.'),
});
export type AiMissionPlanningOutput = z.infer<typeof AiMissionPlanningOutputSchema>;

export async function aiMissionPlanning(input: AiMissionPlanningInput): Promise<AiMissionPlanningOutput> {
  return aiMissionPlanningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMissionPlanningPrompt',
  input: {schema: AiMissionPlanningInputSchema},
  output: {schema: AiMissionPlanningOutputSchema},
  prompt: `You are an AI assistant specializing in planning evangelism missions.

  Based on the location, topic, and any preferences provided, suggest the best locations and times for the mission.

  Location: {{{location}}}
  Topic: {{{topic}}}
  Preferences: {{{preferences}}}

  Consider factors like population density, local events, and typical traffic patterns.
  Provide a list of suggested locations and times, along with a brief explanation of your reasoning.
  Format location suggestions as a bulleted list.
  Format time suggestions as a bulleted list.
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
