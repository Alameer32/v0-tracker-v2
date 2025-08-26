"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Activity, CheckCircle, Target } from "lucide-react"

export function StepsForm() {
  const [steps, setSteps] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const dailyGoal = 10000
  const currentSteps = Number.parseInt(steps) || 0
  const goalProgress = Math.min((currentSteps / dailyGoal) * 100, 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("step_logs").upsert(
        {
          user_id: user.id,
          steps: Number.parseInt(steps),
          date: new Date().toISOString().split("T")[0],
        },
        {
          onConflict: "user_id,date",
        },
      )

      if (error) throw error

      setSuccess(true)
      setSteps("")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Log Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="steps">Steps Today</Label>
            <Input
              id="steps"
              type="number"
              min="0"
              max="100000"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="10000"
              className="focus:ring-2 focus:ring-primary/20"
              required
            />

            {currentSteps > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Goal Progress
                  </span>
                  <span className="font-medium">{Math.round(goalProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      goalProgress >= 100 ? "bg-green-500" : "bg-primary"
                    }`}
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentSteps >= dailyGoal
                    ? "🎉 Goal achieved! Great job!"
                    : `${(dailyGoal - currentSteps).toLocaleString()} steps to go`}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">Steps logged successfully!</p>
            </div>
          )}

          <Button type="submit" disabled={isLoading || !steps} className="w-full hover:bg-primary/90 transition-colors">
            {isLoading ? "Logging..." : "Log Steps"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
