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
    .describe('A description of the planned evangelism mission.'),
  userExperience: z
    .string()
    .describe('The user’s prior experience with evangelism.'),
  targetAudience: z
    .string()
    .describe('Description of the target audience for the mission.'),
});
export type GetEvangelismCoachingInput = z.infer<typeof GetEvangelismCoachingInputSchema>;

const GetEvangelismCoachingOutputSchema = z.object({
  coachingTips: z.array(z.string()).describe('A list of coaching tips for the evangelism mission.'),
});
export type GetEvangelismCoachingOutput = z.infer<typeof GetEvangelismCoachingOutputSchema>;

export async function getEvangelismCoaching(input: GetEvangelismCoachingInput): Promise<GetEvangelismCoachingOutput> {
  return evangelismCoachingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evangelismCoachingPrompt',
  input: {schema: GetEvangelismCoachingInputSchema},
  output: {schema: GetEvangelismCoachingOutputSchema},
  prompt: `You are an AI-powered evangelism coach. Provide coaching tips for the user’s evangelism mission based on the following information:

Mission Description: {{{missionDescription}}}
User Experience: {{{userExperience}}}
Target Audience: {{{targetAudience}}}

Provide at least three coaching tips to improve their approach.`,
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
