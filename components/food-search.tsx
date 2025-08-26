"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Database, Globe } from "lucide-react"

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

interface USDAFood {
  fdcId: number
  description: string
  brandName?: string
  servingSize?: number
  servingSizeUnit?: string
  foodNutrients: Array<{
    nutrientId: number
    value: number
  }>
}

interface FoodSearchProps {
  onSelectFood: (food: Food) => void
}

export function FoodSearch({ onSelectFood }: FoodSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [localFoods, setLocalFoods] = useState<Food[]>([])
  const [usdaFoods, setUsdaFoods] = useState<USDAFood[]>([])
  const [isLoadingLocal, setIsLoadingLocal] = useState(false)
  const [isLoadingUSDA, setIsLoadingUSDA] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchLocalFoods()
      searchUSDAFoods()
    } else {
      setLocalFoods([])
      setUsdaFoods([])
    }
  }, [searchTerm])

  const searchLocalFoods = async () => {
    setIsLoadingLocal(true)
    try {
      const { data, error } = await supabase.from("foods").select("*").ilike("name", `%${searchTerm}%`).limit(10)

      if (error) throw error
      setLocalFoods(data || [])
    } catch (error) {
      console.error("Error searching local foods:", error)
    } finally {
      setIsLoadingLocal(false)
    }
  }

  const searchUSDAFoods = async () => {
    setIsLoadingUSDA(true)
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=MHClEd92PxL31NtrlZSs1G0h4ODve09Pk8gOjJa1&query=${encodeURIComponent(searchTerm)}&pageSize=10&dataType=Branded,Foundation,SR%20Legacy`,
      )

      if (!response.ok) throw new Error("USDA API request failed")

      const data = await response.json()
      setUsdaFoods(data.foods || [])
    } catch (error) {
      console.error("Error searching USDA foods:", error)
      setUsdaFoods([])
    } finally {
      setIsLoadingUSDA(false)
    }
  }

  const convertUSDAFood = (usdaFood: USDAFood): Food => {
    const nutrients = usdaFood.foodNutrients
    const getNutrientValue = (nutrientId: number) => {
      const nutrient = nutrients.find((n) => n.nutrientId === nutrientId)
      return nutrient ? Math.round(nutrient.value * 100) / 100 : 0
    }

    return {
      id: `usda-${usdaFood.fdcId}`,
      name: usdaFood.description,
      brand: usdaFood.brandName,
      serving_size: usdaFood.servingSize?.toString() || "100",
      serving_unit: usdaFood.servingSizeUnit || "g",
      calories_per_serving: getNutrientValue(1008), // Energy (kcal)
      protein_per_serving: getNutrientValue(1003), // Protein
      carbs_per_serving: getNutrientValue(1005), // Carbohydrates
      fat_per_serving: getNutrientValue(1004), // Total lipid (fat)
    }
  }

  const handleUSDAFoodSelect = async (usdaFood: USDAFood) => {
    const convertedFood = convertUSDAFood(usdaFood)

    try {
      const { error } = await supabase.from("foods").insert({
        name: convertedFood.name,
        brand: convertedFood.brand,
        serving_size: convertedFood.serving_size,
        serving_unit: convertedFood.serving_unit,
        calories_per_serving: convertedFood.calories_per_serving,
        protein_per_serving: convertedFood.protein_per_serving,
        carbs_per_serving: convertedFood.carbs_per_serving,
        fat_per_serving: convertedFood.fat_per_serving,
      })

      if (error) console.error("Error saving USDA food:", error)
    } catch (error) {
      console.error("Error saving USDA food:", error)
    }

    onSelectFood(convertedFood)
  }

  const FoodCard = ({ food, onSelect, source }: { food: Food; onSelect: () => void; source: "local" | "usda" }) => (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{food.name}</h3>
              {food.brand && (
                <Badge variant="secondary" className="text-xs">
                  {food.brand}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {source === "local" ? <Database className="h-3 w-3 mr-1" /> : <Globe className="h-3 w-3 mr-1" />}
                {source === "local" ? "Local" : "USDA"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {food.serving_size} {food.serving_unit} • {food.calories_per_serving} cal
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>P: {food.protein_per_serving}g</span>
              <span>C: {food.carbs_per_serving}g</span>
              <span>F: {food.fat_per_serving}g</span>
            </div>
          </div>
          <Button size="sm" onClick={onSelect} className="ml-4">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search for foods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="local" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Local ({localFoods.length})
          </TabsTrigger>
          <TabsTrigger value="usda" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            USDA ({usdaFoods.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-2 max-h-96 overflow-y-auto">
          {isLoadingLocal && <div className="text-center py-4 text-muted-foreground">Searching local foods...</div>}

          {localFoods.map((food) => (
            <FoodCard key={food.id} food={food} onSelect={() => onSelectFood(food)} source="local" />
          ))}

          {searchTerm.length > 2 && localFoods.length === 0 && !isLoadingLocal && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No local foods found for "{searchTerm}"</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="usda" className="space-y-2 max-h-96 overflow-y-auto">
          {isLoadingUSDA && <div className="text-center py-4 text-muted-foreground">Searching USDA database...</div>}

          {usdaFoods.map((usdaFood) => {
            const convertedFood = convertUSDAFood(usdaFood)
            return (
              <FoodCard
                key={usdaFood.fdcId}
                food={convertedFood}
                onSelect={() => handleUSDAFoodSelect(usdaFood)}
                source="usda"
              />
            )
          })}

          {searchTerm.length > 2 && usdaFoods.length === 0 && !isLoadingUSDA && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No USDA foods found for "{searchTerm}"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {searchTerm.length <= 2 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Type at least 3 characters to search</p>
        </div>
      )}
    </div>
  )
}
