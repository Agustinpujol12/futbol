'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { leagueTiers, type LeagueTier } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Gem, Medal, Trophy, Star } from 'lucide-react';

const tierIcons: { [key: string]: React.ReactNode } = {
  'Bronze League': <Medal className="h-8 w-8 text-yellow-700" />,
  'Silver League': <Trophy className="h-8 w-8 text-gray-400" />,
  'Gold League': <Gem className="h-8 w-8 text-amber-400" />,
  'Diamond League': <Star className="h-8 w-8 text-blue-400" />,
}

export default function LeaguesPage() {
  const [selectedTier, setSelectedTier] = useState<LeagueTier | null>(null);
  const { toast } = useToast();

  const handleJoin = (tier: LeagueTier) => {
    // Simulate joining league
    console.log(`Joining ${tier.name}`);
    toast({
      title: "Joined League!",
      description: `Welcome to the ${tier.name}. Good luck!`,
    });
    setSelectedTier(null);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Join a League
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          Choose your competition level. Higher stakes mean greater rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leagueTiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col text-center hover:border-primary transition-colors">
            <CardHeader className="items-center">
              <div className="p-4 bg-primary/10 rounded-full mb-2">
                {tierIcons[tier.name]}
              </div>
              <CardTitle className="font-headline">{tier.name}</CardTitle>
              <CardDescription>Entry Fee: {tier.entryFee} G-Coins</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-lg font-semibold text-foreground">Prize Pool</p>
              <p className="text-accent font-bold text-xl">{tier.prizePool}</p>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedTier(tier)}>Join League</Button>
                </AlertDialogTrigger>
                 <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-headline">Confirm Entry</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to join the {selectedTier?.name} for {selectedTier?.entryFee} G-Coins? This action is irreversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => selectedTier && handleJoin(selectedTier)}>
                      Confirm and Pay
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
