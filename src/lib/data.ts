import { PlaceHolderImages } from '@/lib/placeholder-images';

export type Player = {
  id: string;
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  salary: number;
  team: string;
  imageUrl: string;
  imageHint: string;
  stats: {
    goals: number;
    assists: number;
    cleanSheets: number;
  };
};

export type StrategyCard = {
  id: string;
  name: string;
  description: string;
  type: 'Boost' | 'Hinder';
  effect: string;
};

export type LeagueTier = {
  name: string;
  entryFee: number;
  prizePool: string;
};

export type AvatarItem = {
  id: string;
  name: string;
  type: 'Jersey' | 'Boots' | 'Accessory';
  price: number;
  imageUrl: string;
  imageHint: string;
};

export const players: Player[] = [
  { id: 'p1', name: 'Leo Striker', position: 'Forward', salary: 15000, team: 'FC Dynamos', imageUrl: PlaceHolderImages.find(p => p.id === 'player1')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 22, assists: 8, cleanSheets: 0 } },
  { id: 'p2', name: 'Chris Guard', position: 'Defender', salary: 11000, team: 'United FC', imageUrl: PlaceHolderImages.find(p => p.id === 'player2')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 2, assists: 3, cleanSheets: 12 } },
  { id: 'p3', name: 'Maria Pivot', position: 'Midfielder', salary: 13500, team: 'FC Dynamos', imageUrl: PlaceHolderImages.find(p => p.id === 'player3')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 9, assists: 15, cleanSheets: 0 } },
  { id: 'p4', name: 'Sam Keeper', position: 'Goalkeeper', salary: 10000, team: 'AC Eagles', imageUrl: PlaceHolderImages.find(p => p.id === 'player4')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 0, assists: 0, cleanSheets: 15 } },
  { id: 'p5', name: 'Alex Runner', position: 'Midfielder', salary: 12000, team: 'United FC', imageUrl: PlaceHolderImages.find(p => p.id === 'player5')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 7, assists: 10, cleanSheets: 0 } },
  { id: 'p6', name: 'Jordan Wall', position: 'Defender', salary: 10500, team: 'AC Eagles', imageUrl: PlaceHolderImages.find(p => p.id === 'player6')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 1, assists: 1, cleanSheets: 11 } },
  { id: 'p7', name: 'Nico Finish', position: 'Forward', salary: 14000, team: 'United FC', imageUrl: PlaceHolderImages.find(p => p.id === 'player7')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 18, assists: 5, cleanSheets: 0 } },
  { id: 'p8', name: 'Eva Cross', position: 'Midfielder', salary: 11500, team: 'FC Dynamos', imageUrl: PlaceHolderImages.find(p => p.id === 'player8')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 5, assists: 12, cleanSheets: 0 } },
  { id: 'p9', name: 'Ben Block', position: 'Defender', salary: 9500, team: 'FC Dynamos', imageUrl: PlaceHolderImages.find(p => p.id === 'player9')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 0, assists: 2, cleanSheets: 10 } },
  { id: 'p10', name: 'Frank Goal', position: 'Forward', salary: 12500, team: 'AC Eagles', imageUrl: PlaceHolderImages.find(p => p.id === 'player10')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 15, assists: 4, cleanSheets: 0 } },
  { id: 'p11', name: 'Ricardo Swift', position: 'Forward', salary: 13000, team: 'Titans FC', imageUrl: PlaceHolderImages.find(p => p.id === 'player11')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 16, assists: 7, cleanSheets: 0 } },
  { id: 'p12', name: 'Tanya Shield', position: 'Defender', salary: 11200, team: 'Titans FC', imageUrl: PlaceHolderImages.find(p => p.id === 'player12')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 3, assists: 2, cleanSheets: 14 } },
  { id: 'p13', name: 'Marco Engine', position: 'Midfielder', salary: 12800, team: 'Titans FC', imageUrl: PlaceHolderImages.find(p => p.id === 'player13')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 8, assists: 14, cleanSheets: 0 } },
  { id: 'p14', name: 'Gwen Hands', position: 'Goalkeeper', salary: 9800, team: 'United FC', imageUrl: PlaceHolderImages.find(p => p.id === 'player14')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 0, assists: 0, cleanSheets: 13 } },
  { id: 'p15', name: 'Hiro Speed', position: 'Midfielder', salary: 10800, team: 'AC Eagles', imageUrl: PlaceHolderImages.find(p => p.id === 'player15')?.imageUrl || '', imageHint: 'soccer player', stats: { goals: 6, assists: 9, cleanSheets: 0 } },
];

export const strategyCards: StrategyCard[] = [
  { id: 'sc1', name: 'Forward Frenzy', type: 'Boost', description: 'Doubles the points for all your forwards for one match day.', effect: '+100% Forward Points' },
  { id: 'sc2', name: 'Iron Defense', type: 'Boost', description: 'Doubles the points for all your defenders and goalkeeper for one match day.', effect: '+100% Defense Points' },
  { id: 'sc3', name: 'Midfield Maestro', type: 'Boost', description: 'All your midfielders gain a 50% point boost for one match day.', effect: '+50% Midfielder Points' },
  { id: 'sc4', name: 'Opponent Fatigue', type: 'Hinder', description: 'Reduces one of your opponent\'s player\'s points by 50%.', effect: '-50% on Opponent Player' },
  { id: 'sc5', name: 'Captain\'s Inspiration', type: 'Boost', description: 'Triples the points for one selected player for one match day.', effect: '+200% on one player' },
];

export const leagueTiers: LeagueTier[] = [
  { name: 'Bronze League', entryFee: 10, prizePool: '1,000 G-Coins' },
  { name: 'Silver League', entryFee: 50, prizePool: '7,500 G-Coins' },
  { name: 'Gold League', entryFee: 100, prizePool: '20,000 G-Coins & Exclusive Item' },
  { name: 'Diamond League', entryFee: 500, prizePool: '150,000 G-Coins & Legendary Item' },
];

export const avatarItems: AvatarItem[] = [
  { id: 'item1', name: 'Classic Stripes', type: 'Jersey', price: 500, imageUrl: PlaceHolderImages.find(p => p.id === 'item-jersey-1')?.imageUrl || '', imageHint: 'soccer jersey' },
  { id: 'item2', name: 'Blazing Reds', type: 'Jersey', price: 750, imageUrl: PlaceHolderImages.find(p => p.id === 'item-jersey-2')?.imageUrl || '', imageHint: 'soccer jersey' },
  { id: 'item3', name: 'Golden Kicks', type: 'Boots', price: 1200, imageUrl: PlaceHolderImages.find(p => p.id === 'item-boots-1')?.imageUrl || '', imageHint: 'soccer boots' },
  { id: 'item4', name: 'Captain\'s Band', type: 'Accessory', price: 300, imageUrl: PlaceHolderImages.find(p => p.id === 'item-accessory-1')?.imageUrl || '', imageHint: 'armband' },
];

export const user = {
    name: 'Alex Ray',
    email: 'alex.ray@example.com',
    currency: 2500,
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-default')?.imageUrl || '',
    avatarHint: 'user avatar'
}
