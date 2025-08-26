"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProgressRing } from "./progress-ring"

interface NutritionGoalsProps {
  current: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  goals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export function NutritionGoals({ current, goals }: NutritionGoalsProps) {
  const calorieProgress = Math.min((current.calories / goals.calories) * 100, 100)
  const proteinProgress = Math.min((current.protein / goals.protein) * 100, 100)
  const carbProgress = Math.min((current.carbs / goals.carbs) * 100, 100)
  const fatProgress = Math.min((current.fat / goals.fat) * 100, 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Main Calorie Goal */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-center">Daily Calorie Goal</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ProgressRing progress={calorieProgress} size={160} strokeWidth={12}>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(current.calories)}</div>
              <div className="text-sm text-muted-foreground">of {goals.calories}</div>
              <div className="text-xs text-muted-foreground">calories</div>
            </div>
          </ProgressRing>
        </CardContent>
      </Card>

      {/* Macronutrient Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Protein</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{Math.round(current.protein)}g</span>
            <span className="text-muted-foreground">{goals.protein}g goal</span>
          </div>
          <Progress value={proteinProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">{Math.round(proteinProgress)}% complete</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Carbohydrates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{Math.round(current.carbs)}g</span>
            <span className="text-muted-foreground">{goals.carbs}g goal</span>
          </div>
          <Progress value={carbProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">{Math.round(carbProgress)}% complete</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{Math.round(current.fat)}g</span>
            <span className="text-muted-foreground">{goals.fat}g goal</span>
          </div>
          <Progress value={fatProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">{Math.round(fatProgress)}% complete</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Remaining</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Calories</span>
            <span className={goals.calories - current.calories > 0 ? "text-primary" : "text-destructive"}>
              {Math.round(goals.calories - current.calories)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Protein</span>
            <span className={goals.protein - current.protein > 0 ? "text-primary" : "text-destructive"}>
              {Math.round(goals.protein - current.protein)}g
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Carbs</span>
            <span className={goals.carbs - current.carbs > 0 ? "text-primary" : "text-destructive"}>
              {Math.round(goals.carbs - current.carbs)}g
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fat</span>
            <span className={goals.fat - current.fat > 0 ? "text-primary" : "text-destructive"}>
              {Math.round(goals.fat - current.fat)}g
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
