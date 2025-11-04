'use client';

import { useState } from 'react';
import { strategyCards, type StrategyCard } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AiSuggestionModal } from './ai-suggestion-modal';
import { BrainCircuit, ShieldCheck, Zap } from 'lucide-react';

export function StrategyCardManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCards, setActiveCards] = useState(strategyCards);

  const handleUseCard = (cardId: string) => {
    // In a real app, this would involve a server action.
    // For now, we'll just remove it from the view.
    setActiveCards(cards => cards.filter(c => c.id !== cardId));
    console.log(`Used card: ${cardId}`);
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline">
            Your Strategy Cards
            </h2>
            <p className="text-muted-foreground">Deploy these cards to gain an edge in your matchups.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <BrainCircuit className="mr-2 h-4 w-4" />
          Get AI Suggestions
        </Button>
      </div>
      
      {activeCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCards.map((card) => (
            <Card key={card.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  {card.type === 'Boost' ? <Zap className="h-6 w-6 text-green-500" /> : <ShieldCheck className="h-6 w-6 text-red-500" />}
                  {card.name}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm font-semibold text-primary">{card.effect}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleUseCard(card.id)}>Use Card</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold font-headline">No Strategy Cards Available</h3>
            <p className="text-muted-foreground mt-2">Earn more cards by winning matchups and completing challenges.</p>
        </div>
      )}

      <AiSuggestionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
