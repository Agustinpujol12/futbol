import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineupBuilder } from "@/components/lineup/lineup-builder"
import { StrategyCardManager } from "@/components/strategy/strategy-cards"
import { CircleDollarSign } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-2 sm:mb-0">
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg">
            <CircleDollarSign className="h-6 w-6 text-accent" />
            <span className="font-semibold text-foreground">100,000</span>
            <span className="text-sm text-muted-foreground">Budget</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="lineup" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="lineup">Lineup Selection</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="lineup" className="mt-6">
            <LineupBuilder />
        </TabsContent>
        <TabsContent value="strategy" className="mt-6">
            <StrategyCardManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
