import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Target, Zap, Droplets } from "lucide-react"

interface QuickStatsProps {
  weeklyAverage: number
  dailyGoal: number
  streak: number
  hydration?: number
}

export function QuickStats({ weeklyAverage, dailyGoal, streak, hydration = 0 }: QuickStatsProps) {
  const goalDifference = weeklyAverage - dailyGoal
  const isAboveGoal = goalDifference > 0
  const isOnTrack = Math.abs(goalDifference) <= dailyGoal * 0.1 // Within 10% of goal

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Weekly Avg
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{Math.round(weeklyAverage)}</div>
            {isOnTrack ? (
              <Minus className="h-4 w-4 text-muted-foreground" />
            ) : isAboveGoal ? (
              <TrendingUp className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isOnTrack
              ? "On track"
              : isAboveGoal
                ? `+${Math.round(goalDifference)} cal`
                : `${Math.round(goalDifference)} cal`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streak}</div>
          <p className="text-xs text-muted-foreground">days logging</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Hydration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hydration}</div>
          <p className="text-xs text-muted-foreground">glasses today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{Math.round((weeklyAverage / dailyGoal) * 100)}%</div>
          <p className="text-xs text-muted-foreground">this week</p>
        </CardContent>
      </Card>
    </div>
  )
}
