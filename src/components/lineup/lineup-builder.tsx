'use client';

import { useState } from 'react';
import { players as allPlayers, type Player } from '@/lib/data';
import { PlayerCard } from './player-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';

const SALARY_CAP = 100000;
const TEAM_SIZE = 11;

export function LineupBuilder() {
  const [lineup, setLineup] = useState<Player[]>([]);

  const totalSalary = lineup.reduce((sum, player) => sum + player.salary, 0);
  const budgetRemaining = SALARY_CAP - totalSalary;
  const progress = (totalSalary / SALARY_CAP) * 100;

  const addToLineup = (player: Player) => {
    if (lineup.length < TEAM_SIZE && !lineup.find((p) => p.id === player.id) && budgetRemaining >= player.salary) {
      setLineup([...lineup, player]);
    }
  };

  const removeFromLineup = (player: Player) => {
    setLineup(lineup.filter((p) => p.id !== player.id));
  };

  const availablePlayers = allPlayers.filter(p => !lineup.some(lp => lp.id === p.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Available Players</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {availablePlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onSelect={() => addToLineup(player)}
                    action="add"
                    disabled={lineup.length >= TEAM_SIZE || budgetRemaining < player.salary}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline">Your Lineup ({lineup.length}/{TEAM_SIZE})</CardTitle>
            <div className='pt-2'>
              <div className='flex justify-between items-center mb-1'>
                 <span className='text-sm font-medium text-muted-foreground'>Budget</span>
                 <span className='text-sm font-semibold text-foreground'>{budgetRemaining.toLocaleString()} / {SALARY_CAP.toLocaleString()}</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className='p-0'>
            <ScrollArea className="h-[520px]">
              <div className="p-4 flex flex-col gap-3">
              {lineup.length > 0 ? (
                lineup.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onSelect={() => removeFromLineup(player)}
                    action="remove"
                    variant="compact"
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-16">
                  <p>Your lineup is empty.</p>
                  <p>Select players to build your team.</p>
                </div>
              )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
