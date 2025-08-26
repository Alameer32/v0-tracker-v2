"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Scale, CheckCircle } from "lucide-react"

export function WeightForm() {
  const [weight, setWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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

      const { error } = await supabase.from("weight_logs").upsert(
        {
          user_id: user.id,
          weight_kg: Number.parseFloat(weight),
          notes: notes || null,
          date: new Date().toISOString().split("T")[0],
        },
        {
          onConflict: "user_id,date",
        },
      )

      if (error) throw error

      setSuccess(true)
      setWeight("")
      setNotes("")

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
          <Scale className="h-5 w-5" />
          Log Weight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              max="500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70.5"
              className="focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today?"
              className="focus:ring-2 focus:ring-primary/20"
              rows={3}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">Weight logged successfully!</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !weight}
            className="w-full hover:bg-primary/90 transition-colors"
          >
            {isLoading ? "Logging..." : "Log Weight"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
