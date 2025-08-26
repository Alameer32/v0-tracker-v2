import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MealSection } from "@/components/meal-section"
import { NutritionGoals } from "@/components/nutrition-goals"
import { QuickStats } from "@/components/quick-stats"
import { RecentActivity } from "@/components/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Apple, LogOut, User, Settings, TrendingUp, Scale, Activity } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const today = new Date().toISOString().split("T")[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  // Get user profile for goals
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Default goals if not set
  const goals = {
    calories: profile?.daily_calorie_goal || 2000,
    protein: profile?.daily_protein_goal || 150,
    carbs: profile?.daily_carb_goal || 250,
    fat: profile?.daily_fat_goal || 65,
  }

  // Get today's food entries
  const { data: foodEntries } = await supabase
    .from("food_entries")
    .select(`
      *,
      foods (*)
    `)
    .eq("user_id", data.user.id)
    .eq("date", today)

  // Get today's weight and steps
  const { data: todayWeight } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("date", today)
    .single()

  const { data: todaySteps } = await supabase
    .from("step_logs")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("date", today)
    .single()

  // Get week's food entries for stats
  const { data: weekEntries } = await supabase
    .from("food_entries")
    .select(`
      *,
      foods (*)
    `)
    .eq("user_id", data.user.id)
    .gte("date", weekAgo)
    .lte("date", today)

  // Calculate daily totals
  const dailyTotals = foodEntries?.reduce(
    (totals, entry: any) => {
      const food = entry.foods
      const quantity = entry.quantity
      return {
        calories: totals.calories + food.calories_per_serving * quantity,
        protein: totals.protein + food.protein_per_serving * quantity,
        carbs: totals.carbs + food.carbs_per_serving * quantity,
        fat: totals.fat + food.fat_per_serving * quantity,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 }

  // Calculate weekly average
  const weeklyTotals =
    weekEntries?.reduce((dailyTotals: any, entry: any) => {
      const date = entry.date
      if (!dailyTotals[date]) {
        dailyTotals[date] = 0
      }
      dailyTotals[date] += entry.foods.calories_per_serving * entry.quantity
      return dailyTotals
    }, {}) || {}

  const weeklyAverage =
    Object.keys(weeklyTotals).length > 0
      ? Object.values(weeklyTotals).reduce((sum: any, calories: any) => sum + calories, 0) /
        Object.keys(weeklyTotals).length
      : 0

  // Calculate streak (simplified - days with logged food)
  const streak = Object.keys(weeklyTotals).length

  // Create recent activity
  const recentActivities =
    foodEntries?.slice(0, 5).map((entry: any) => ({
      id: entry.id,
      type: "food" as const,
      description: `Added ${entry.foods.name}`,
      time: new Date(entry.created_at).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      calories: Math.round(entry.foods.calories_per_serving * entry.quantity),
      mealType: entry.meal_type,
    })) || []

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  const getMotivationalMessage = () => {
    const calorieProgress = (dailyTotals.calories / goals.calories) * 100
    if (calorieProgress >= 100) return "🎉 Goal achieved! Great job staying on track!"
    if (calorieProgress >= 80) return "💪 Almost there! You're doing amazing!"
    if (calorieProgress >= 50) return "🔥 Halfway to your goal! Keep it up!"
    if (calorieProgress >= 25) return "🌟 Good start! You've got this!"
    return "☀️ Ready to fuel your day? Let's log some meals!"
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return "Good early morning"
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    if (hour < 21) return "Good evening"
    return "Good night"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Apple className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">NutriTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/analytics">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <form action={handleSignOut}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {getTimeBasedGreeting()}, {profile?.full_name || "there"}!
          </h1>
          <p className="text-muted-foreground mb-3">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-4">
              <p className="text-sm font-medium text-primary">{getMotivationalMessage()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats
            weeklyAverage={weeklyAverage}
            dailyGoal={goals.calories}
            streak={streak}
            hydration={Math.floor(Math.random() * 8) + 1} // Mock data
          />
        </div>

        {/* Today's Health Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Weight Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayWeight ? `${todayWeight.weight_kg} kg` : "Not logged"}</div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-colors"
                asChild
              >
                <Link href="/weight">{todayWeight ? "Update" : "Log Weight"}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Steps Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySteps ? todaySteps.steps.toLocaleString() : "Not logged"}</div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-colors"
                asChild
              >
                <Link href="/steps">{todaySteps ? "Update" : "Log Steps"}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Calories Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(dailyTotals.calories)}</div>
              <p className="text-xs text-muted-foreground">of {goals.calories} goal</p>
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((dailyTotals.calories / goals.calories) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutrition Goals */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Today's Progress</h2>
          <NutritionGoals current={dailyTotals} goals={goals} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meal Sections */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Meals</h2>
            <MealSection
              mealType="breakfast"
              entries={foodEntries?.filter((entry: any) => entry.meal_type === "breakfast") || []}
            />
            <MealSection
              mealType="lunch"
              entries={foodEntries?.filter((entry: any) => entry.meal_type === "lunch") || []}
            />
            <MealSection
              mealType="dinner"
              entries={foodEntries?.filter((entry: any) => entry.meal_type === "dinner") || []}
            />
            <MealSection
              mealType="snack"
              entries={foodEntries?.filter((entry: any) => entry.meal_type === "snack") || []}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentActivity activities={recentActivities} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  asChild
                >
                  <Link href="/weight">
                    <Scale className="h-4 w-4 mr-2" />
                    Log Weight
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  asChild
                >
                  <Link href="/steps">
                    <Activity className="h-4 w-4 mr-2" />
                    Log Steps
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  asChild
                >
                  <Link href="/analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
