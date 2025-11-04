'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getStrategyCardSuggestions, StrategyCardSuggestionsInput } from '@/ai/flows/strategy-card-suggestions';
import { strategyCards } from '@/lib/data';
import { Loader2, Sparkles } from 'lucide-react';

type AiSuggestionModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

// Mock data for the modal
const mockTeamComposition = "2 Forwards, 4 Midfielders, 4 Defenders, 1 Goalkeeper. Strong on attack.";
const availableCardsString = strategyCards.map(c => c.name).join(', ');

export function AiSuggestionModal({ isOpen, onOpenChange }: AiSuggestionModalProps) {
  const [gameState, setGameState] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuggestion('');

    const input: StrategyCardSuggestionsInput = {
      teamComposition: mockTeamComposition,
      availableCards: availableCardsString,
      gameState,
    };

    try {
      const result = await getStrategyCardSuggestions(input);
      setSuggestion(result.cardSuggestions);
    } catch (err) {
      setError('Failed to get suggestions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> AI Strategy Advisor</DialogTitle>
          <DialogDescription>
            Describe the current game state to get personalized advice on using your strategy cards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="game-state">Current Game State</Label>
              <Textarea
                id="game-state"
                placeholder="e.g., 'I am facing the top player in the league. Their team is heavy on defense. The prize is high.'"
                value={gameState}
                onChange={(e) => setGameState(e.target.value)}
                required
              />
            </div>
            <div className='text-sm'>
                <p><strong className='font-medium'>Your Team:</strong> {mockTeamComposition}</p>
                <p><strong className='font-medium'>Available Cards:</strong> {availableCardsString}</p>
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get Suggestions
          </Button>
        </form>
        {suggestion && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold font-headline mb-2">AI Suggestion:</h4>
            <p className="text-sm text-foreground whitespace-pre-wrap">{suggestion}</p>
          </div>
        )}
        {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
