"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WeightLog {
  id: string
  weight_kg: number
  date: string
  notes?: string
}

interface WeightProgressChartProps {
  data: WeightLog[]
}

export function WeightProgressChart({ data }: WeightProgressChartProps) {
  const chartData = data.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: Number(log.weight_kg),
    fullDate: log.date,
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        <p>No weight data available. Start logging your weight to see progress!</p>
      </div>
    )
  }

  const minWeight = Math.min(...chartData.map((d) => d.weight))
  const maxWeight = Math.max(...chartData.map((d) => d.weight))
  const range = maxWeight - minWeight
  const padding = Math.max(range * 0.1, 1) // 10% padding or minimum 1kg

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
          <YAxis
            className="text-xs fill-muted-foreground"
            domain={[minWeight - padding, maxWeight + padding]}
            tickFormatter={(value) => `${value.toFixed(1)}kg`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => [`${value.toFixed(1)} kg`, "Weight"]}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
