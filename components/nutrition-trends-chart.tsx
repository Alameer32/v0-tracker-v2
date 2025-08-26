"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface NutritionTrendsChartProps {
  data: Record<string, { calories: number; protein: number; carbs: number; fat: number }>
  goals: { calories: number; protein: number; carbs: number; fat: number }
}

export function NutritionTrendsChart({ data, goals }: NutritionTrendsChartProps) {
  const chartData = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      calories: Math.round(values.calories),
      protein: Math.round(values.protein),
      carbs: Math.round(values.carbs),
      fat: Math.round(values.fat),
      fullDate: date,
    }))

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        <p>No nutrition data available. Start logging meals to see trends!</p>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <ReferenceLine y={goals.calories} stroke="hsl(var(--primary))" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
