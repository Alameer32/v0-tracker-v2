import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WeightForm } from "@/components/weight-form"
import { WeightChart } from "@/components/weight-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scale, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function WeightPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get weight logs for the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const { data: weightLogs } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", data.user.id)
    .gte("date", thirtyDaysAgo)
    .order("date", { ascending: true })

  // Get latest weight
  const { data: latestWeight } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", data.user.id)
    .order("date", { ascending: false })
    .limit(1)
    .single()

  // Calculate weight change
  const weightChange =
    weightLogs && weightLogs.length > 1 ? Number(latestWeight?.weight_kg || 0) - Number(weightLogs[0].weight_kg) : 0

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
                <Scale className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Weight Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weight Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Current Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {latestWeight ? `${latestWeight.weight_kg} kg` : "No data"}
                </div>
                {latestWeight && (
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(latestWeight.date).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>30-Day Change</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div
                    className={`text-2xl font-bold ${weightChange > 0 ? "text-red-500" : weightChange < 0 ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    {weightChange > 0 ? "+" : ""}
                    {weightChange.toFixed(1)} kg
                  </div>
                  {weightChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  ) : weightChange < 0 ? (
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {weightChange > 0 ? "Weight gained" : weightChange < 0 ? "Weight lost" : "No change"}
                </p>
              </CardContent>
            </Card>

            {/* Weight Form */}
            <WeightForm />
          </div>

          {/* Weight Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Weight Trend (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <WeightChart data={weightLogs || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
