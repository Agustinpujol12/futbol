import Image from 'next/image';
import { type Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, MinusCircle, Shield, Crosshair, User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

type PlayerCardProps = {
  player: Player;
  onSelect: (player: Player) => void;
  action: 'add' | 'remove';
  disabled?: boolean;
  variant?: 'default' | 'compact';
};

const positionIcons = {
  Goalkeeper: <User className="h-4 w-4" />,
  Defender: <Shield className="h-4 w-4" />,
  Midfielder: <Zap className="h-4 w-4" />,
  Forward: <Crosshair className="h-4 w-4" />,
};

export function PlayerCard({ player, onSelect, action, disabled = false, variant = 'default' }: PlayerCardProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
        <div className="flex items-center gap-3">
          <Image
            src={player.imageUrl}
            alt={player.name}
            width={40}
            height={40}
            className="rounded-full"
            data-ai-hint={player.imageHint}
          />
          <div>
            <p className="font-semibold text-sm">{player.name}</p>
            <p className="text-xs text-muted-foreground">{player.position} · ${player.salary.toLocaleString()}</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive rounded-full h-8 w-8"
          onClick={() => onSelect(player)}
          aria-label={`Remove ${player.name}`}
        >
          <MinusCircle className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn("overflow-hidden transition-all duration-300", disabled && "opacity-50")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Image
            src={player.imageUrl}
            alt={player.name}
            width={64}
            height={64}
            className="rounded-lg"
            data-ai-hint={player.imageHint}
          />
          <div className="flex-grow">
            <p className="font-semibold font-headline">{player.name}</p>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              {positionIcons[player.position]}
              <span>{player.position}</span>
            </div>
             <p className="text-sm font-bold text-primary">${player.salary.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button
            className="w-full"
            variant={action === 'add' ? 'default' : 'destructive'}
            onClick={() => onSelect(player)}
            disabled={disabled}
          >
            {action === 'add' ? <PlusCircle className="mr-2 h-4 w-4" /> : <MinusCircle className="mr-2 h-4 w-4" />}
            {action === 'add' ? 'Add to Lineup' : 'Remove'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
