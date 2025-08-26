"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddFoodDialog } from "./add-food-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface FoodEntry {
  id: string
  quantity: number
  foods: {
    id: string
    name: string
    brand?: string
    serving_size: string
    serving_unit: string
    calories_per_serving: number
    protein_per_serving: number
    carbs_per_serving: number
    fat_per_serving: number
  }
}

interface MealSectionProps {
  mealType: string
  entries: FoodEntry[]
}

export function MealSection({ mealType, entries }: MealSectionProps) {
  const router = useRouter()
  const supabase = createClient()

  const mealTotal = entries.reduce((total, entry) => {
    return total + entry.foods.calories_per_serving * entry.quantity
  }, 0)

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase.from("food_entries").delete().eq("id", entryId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting food entry:", error)
    }
  }

  const handleFoodAdded = () => {
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="capitalize">{mealType}</CardTitle>
            <p className="text-sm text-muted-foreground">{Math.round(mealTotal)} calories</p>
          </div>
          <AddFoodDialog mealType={mealType} onFoodAdded={handleFoodAdded} />
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No foods logged for {mealType} yet</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{entry.foods.name}</h4>
                    {entry.foods.brand && <span className="text-xs text-muted-foreground">({entry.foods.brand})</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.quantity} × {entry.foods.serving_size} {entry.foods.serving_unit}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>{Math.round(entry.foods.calories_per_serving * entry.quantity)} cal</span>
                    <span>P: {Math.round(entry.foods.protein_per_serving * entry.quantity)}g</span>
                    <span>C: {Math.round(entry.foods.carbs_per_serving * entry.quantity)}g</span>
                    <span>F: {Math.round(entry.foods.fat_per_serving * entry.quantity)}g</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
