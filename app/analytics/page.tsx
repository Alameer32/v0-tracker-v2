import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, Calendar, Target, Award } from "lucide-react"
import Link from "next/link"
import { NutritionTrendsChart } from "@/components/nutrition-trends-chart"
import { MacroBreakdownChart } from "@/components/macro-breakdown-chart"
import { WeightProgressChart } from "@/components/weight-progress-chart"
import { StepsActivityChart } from "@/components/steps-activity-chart"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get date ranges
  const today = new Date().toISOString().split("T")[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  // Get user profile for goals
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const goals = {
    calories: profile?.daily_calorie_goal || 2000,
    protein: profile?.daily_protein_goal || 150,
    carbs: profile?.daily_carb_goal || 250,
    fat: profile?.daily_fat_goal || 65,
  }

  // Get nutrition data for the last 30 days
  const { data: nutritionData } = await supabase
    .from("food_entries")
    .select(`
      *,
      foods (*)
    `)
    .eq("user_id", data.user.id)
    .gte("date", thirtyDaysAgo)
    .lte("date", today)

  // Get weight data for the last 90 days
  const { data: weightData } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", data.user.id)
    .gte("date", ninetyDaysAgo)
    .order("date", { ascending: true })

  // Get steps data for the last 30 days
  const { data: stepsData } = await supabase
    .from("step_logs")
    .select("*")
    .eq("user_id", data.user.id)
    .gte("date", thirtyDaysAgo)
    .order("date", { ascending: true })

  // Process nutrition data by date
  const nutritionByDate =
    nutritionData?.reduce((acc: any, entry: any) => {
      const date = entry.date
      if (!acc[date]) {
        acc[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 }
      }
      const food = entry.foods
      const quantity = entry.quantity
      acc[date].calories += food.calories_per_serving * quantity
      acc[date].protein += food.protein_per_serving * quantity
      acc[date].carbs += food.carbs_per_serving * quantity
      acc[date].fat += food.fat_per_serving * quantity
      return acc
    }, {}) || {}

  // Calculate analytics stats
  const totalDaysWithData = Object.keys(nutritionByDate).length
  const avgCalories =
    totalDaysWithData > 0
      ? Math.round(
          Object.values(nutritionByDate).reduce((sum: any, day: any) => sum + day.calories, 0) / totalDaysWithData,
        )
      : 0

  const goalAchievementRate =
    totalDaysWithData > 0
      ? Math.round(
          (Object.values(nutritionByDate).filter((day: any) => day.calories >= goals.calories * 0.8).length /
            totalDaysWithData) *
            100,
        )
      : 0

  const currentStreak = calculateStreak(nutritionByDate, goals.calories)

  const weightChange =
    weightData && weightData.length > 1
      ? Number(weightData[weightData.length - 1].weight_kg) - Number(weightData[0].weight_kg)
      : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Avg Daily Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCalories}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goal Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goalAchievementRate}%</div>
              <p className="text-xs text-muted-foreground">Days within 80% of goal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreak}</div>
              <p className="text-xs text-muted-foreground">days logging food</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Weight Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${weightChange > 0 ? "text-red-500" : weightChange < 0 ? "text-green-500" : "text-muted-foreground"}`}
              >
                {weightChange > 0 ? "+" : ""}
                {weightChange.toFixed(1)} kg
              </div>
              <p className="text-xs text-muted-foreground">Last 90 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="nutrition" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Nutrition Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <NutritionTrendsChart data={nutritionByDate} goals={goals} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="macros" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Average Macro Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <MacroBreakdownChart data={nutritionByDate} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Macro Goals vs Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(goals)
                      .slice(1)
                      .map(([macro, goal]) => {
                        const avgActual =
                          totalDaysWithData > 0
                            ? Math.round(
                                Object.values(nutritionByDate).reduce(
                                  (sum: any, day: any) => sum + day[macro as keyof typeof day],
                                  0,
                                ) / totalDaysWithData,
                              )
                            : 0
                        const percentage = Math.round((avgActual / goal) * 100)

                        return (
                          <div key={macro} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize font-medium">{macro}</span>
                              <span>
                                {avgActual}g / {goal}g
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">{percentage}% of goal</p>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weight" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress (90 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <WeightProgressChart data={weightData || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Steps Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <StepsActivityChart data={stepsData || []} goal={10000} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function calculateStreak(nutritionByDate: any, calorieGoal: number): number {
  const dates = Object.keys(nutritionByDate).sort().reverse()
  let streak = 0

  for (const date of dates) {
    if (nutritionByDate[date].calories >= calorieGoal * 0.5) {
      // At least 50% of goal
      streak++
    } else {
      break
    }
  }

  return streak
}
