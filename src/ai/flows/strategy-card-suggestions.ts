'use server';

/**
 * @fileOverview AI-powered strategy card suggestions for the game.
 *
 * - getStrategyCardSuggestions - A function that returns AI suggestions for strategy card usage.
 * - StrategyCardSuggestionsInput - The input type for the getStrategyCardSuggestions function.
 * - StrategyCardSuggestionsOutput - The return type for the getStrategyCardSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrategyCardSuggestionsInputSchema = z.object({
  teamComposition: z
    .string()
    .describe('Description of the user team composition.'),
  gameState: z.string().describe('The current state of the game.'),
  availableCards: z
    .string()
    .describe('List of available strategy cards the user has.'),
});
export type StrategyCardSuggestionsInput = z.infer<typeof StrategyCardSuggestionsInputSchema>;

const StrategyCardSuggestionsOutputSchema = z.object({
  cardSuggestions: z
    .string()
    .describe(
      'AI-powered suggestions on which strategy cards to play and when, based on the team composition and the current game state.'
    ),
});
export type StrategyCardSuggestionsOutput = z.infer<typeof StrategyCardSuggestionsOutputSchema>;

export async function getStrategyCardSuggestions(
  input: StrategyCardSuggestionsInput
): Promise<StrategyCardSuggestionsOutput> {
  return strategyCardSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'strategyCardSuggestionsPrompt',
  input: {schema: StrategyCardSuggestionsInputSchema},
  output: {schema: StrategyCardSuggestionsOutputSchema},
  prompt: `You are an expert game strategist specializing in advising players on when to use strategy cards.

  Based on the user's team composition, the current game state, and the available cards, provide reasoned suggestions on when and if to play each card type.

  Team Composition: {{{teamComposition}}}
  Game State: {{{gameState}}}
  Available Cards: {{{availableCards}}} `,
});

const strategyCardSuggestionsFlow = ai.defineFlow(
  {
    name: 'strategyCardSuggestionsFlow',
    inputSchema: StrategyCardSuggestionsInputSchema,
    outputSchema: StrategyCardSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
