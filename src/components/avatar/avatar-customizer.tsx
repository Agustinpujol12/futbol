'use client';

import { useState } from 'react';
import Image from 'next/image';
import { avatarItems, user as userData, type AvatarItem } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function AvatarCustomizer() {
  const [user, setUser] = useState(userData);
  const [equippedItems, setEquippedItems] = useState<{ [key in AvatarItem['type']]?: AvatarItem }>({});
  const { toast } = useToast();

  const handleEquip = (item: AvatarItem) => {
    if (user.currency < item.price) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You need ${item.price} G-Coins to buy the ${item.name}.`,
      });
      return;
    }
    
    // Simulate purchase
    setUser(prev => ({ ...prev, currency: prev.currency - item.price }));
    
    setEquippedItems(prev => ({
      ...prev,
      [item.type]: item,
    }));

    toast({
        title: "Item Equipped!",
        description: `You've equipped the ${item.name}.`,
    });
  };

  const isEquipped = (item: AvatarItem) => {
    return equippedItems[item.type]?.id === item.id;
  };
  
  const itemGroups = avatarItems.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {} as Record<AvatarItem['type'], AvatarItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Avatar Customization</CardTitle>
        <CardDescription>Use your G-Coins to buy and equip new items.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex justify-center items-center p-4 bg-secondary/50 rounded-lg relative aspect-square">
             <Image src={user.avatar} alt="User Avatar" width={200} height={200} className="rounded-full" data-ai-hint={user.avatarHint} />
             {Object.values(equippedItems).map(item => item && (
               <Image key={item.id} src={item.imageUrl} alt={item.name} width={200} height={200} className="absolute inset-0 object-contain" data-ai-hint={item.imageHint}/>
             ))}
          </div>
          <div className="md:col-span-2">
            <Tabs defaultValue="Jersey" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {Object.keys(itemGroups).map(type => (
                   <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(itemGroups).map(([type, items]) => (
                <TabsContent key={type} value={type}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-h-64 overflow-y-auto p-1">
                    {items.map(item => (
                      <Card key={item.id} className={cn("text-center", isEquipped(item) && "border-primary ring-2 ring-primary")}>
                        <CardContent className="p-2">
                           <div className="aspect-square bg-slate-100 rounded-md mb-2 flex items-center justify-center">
                              <Image src={item.imageUrl} alt={item.name} width={80} height={80} data-ai-hint={item.imageHint} />
                           </div>
                          <p className="text-sm font-semibold truncate">{item.name}</p>
                          <div className="flex items-center justify-center text-xs text-accent font-bold">
                            <CircleDollarSign className="h-3 w-3 mr-1" />
                            {item.price}
                          </div>
                        </CardContent>
                        <CardFooter className="p-2">
                            <Button size="sm" className="w-full" onClick={() => handleEquip(item)} disabled={isEquipped(item)}>
                                {isEquipped(item) ? 'Equipped' : 'Equip'}
                            </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
