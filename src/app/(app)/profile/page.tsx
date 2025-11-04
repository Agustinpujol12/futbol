import { user } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarCustomizer } from '@/components/avatar/avatar-customizer';
import { CircleDollarSign } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="container mx-auto">
       <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          View your stats and customize your look.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Your Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                 <AvatarImage src={user.avatar} data-ai-hint={user.avatarHint} />
                 <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold font-headline">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-4 flex items-center gap-2 text-lg font-semibold text-accent p-2 bg-accent/10 rounded-lg">
                <CircleDollarSign className="h-6 w-6" />
                <span>{user.currency.toLocaleString()} G-Coins</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <AvatarCustomizer />
        </div>
      </div>
    </div>
  );
}
