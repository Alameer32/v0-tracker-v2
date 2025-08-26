import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StepsForm } from "@/components/steps-form"
import { StepsChart } from "@/components/steps-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Activity, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function StepsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get step logs for the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const { data: stepLogs } = await supabase
    .from("step_logs")
    .select("*")
    .eq("user_id", data.user.id)
    .gte("date", thirtyDaysAgo)
    .order("date", { ascending: true })

  // Get today's steps
  const today = new Date().toISOString().split("T")[0]
  const { data: todaySteps } = await supabase
    .from("step_logs")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("date", today)
    .single()

  // Calculate average steps
  const averageSteps =
    stepLogs && stepLogs.length > 0
      ? Math.round(stepLogs.reduce((sum, log) => sum + log.steps, 0) / stepLogs.length)
      : 0

  const dailyGoal = 10000 // Default step goal
  const todayProgress = todaySteps ? (todaySteps.steps / dailyGoal) * 100 : 0

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
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Steps Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Today's Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{todaySteps?.steps.toLocaleString() || "0"}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Goal: {dailyGoal.toLocaleString()}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(todayProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{Math.round(todayProgress)}% of goal</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>30-Day Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{averageSteps.toLocaleString()}</div>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">steps per day</p>
              </CardContent>
            </Card>

            {/* Steps Form */}
            <StepsForm />
          </div>

          {/* Steps Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Steps Trend (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <StepsChart data={stepLogs || []} goal={dailyGoal} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
