"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FoodSearch } from "./food-search"
import { Plus } from "lucide-react"

interface Food {
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

interface AddFoodDialogProps {
  mealType: string
  onFoodAdded: () => void
}

export function AddFoodDialog({ mealType, onFoodAdded }: AddFoodDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [quantity, setQuantity] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food)
  }

  const handleAddFood = async () => {
    if (!selectedFood) return

    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("food_entries").insert({
        user_id: user.id,
        food_id: selectedFood.id,
        meal_type: mealType,
        quantity: Number.parseFloat(quantity),
        date: new Date().toISOString().split("T")[0],
      })

      if (error) throw error

      setOpen(false)
      setSelectedFood(null)
      setQuantity("1")
      onFoodAdded()
    } catch (error) {
      console.error("Error adding food:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Food
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Food to {mealType}</DialogTitle>
          <DialogDescription>Search for a food item and specify the quantity</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedFood ? (
            <FoodSearch onSelectFood={handleSelectFood} />
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-accent/50 rounded-lg">
                <h3 className="font-medium">{selectedFood.name}</h3>
                {selectedFood.brand && <p className="text-sm text-muted-foreground">{selectedFood.brand}</p>}
                <p className="text-sm text-muted-foreground">
                  {selectedFood.serving_size} {selectedFood.serving_unit} • {selectedFood.calories_per_serving} cal
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1.0"
                />
                <p className="text-xs text-muted-foreground">
                  Total calories: {Math.round(selectedFood.calories_per_serving * Number.parseFloat(quantity || "1"))}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedFood(null)} className="flex-1">
                  Change Food
                </Button>
                <Button onClick={handleAddFood} disabled={isLoading} className="flex-1">
                  {isLoading ? "Adding..." : "Add Food"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
