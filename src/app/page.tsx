import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, BarChart, Gem, BrainCircuit } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/icons';

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Build Your Dream Team',
    description: 'Draft your favorite players within a salary cap and create the ultimate fantasy lineup.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Real-Time Scoring',
    description: 'Watch your team rack up points with live stats from every match.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'Strategic Gameplay',
    description: 'Use game-changing strategy cards with AI-powered advice to outsmart your opponents.',
  },
  {
    icon: <Gem className="h-8 w-8 text-primary" />,
    title: 'Customize Your Look',
    description: 'Earn rewards and unlock unique items to personalize your team and avatar.',
  },
];

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Global GoalGetters
          </h1>
        </div>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/dashboard">Enter App</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow">
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight">
              Your Field of Dreams Awaits
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-200">
              Join the ultimate fantasy football experience. Draft your team, compete in leagues, and lead your squad to victory.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Link href="/dashboard">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                Why You'll Love Global GoalGetters
              </h3>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                We've packed the game with features to make your fantasy experience more engaging and fun.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-xl font-headline font-semibold text-foreground">{feature.title}</h4>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Global GoalGetters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
