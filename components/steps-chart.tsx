"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface StepLog {
  id: string
  steps: number
  date: string
}

interface StepsChartProps {
  data: StepLog[]
  goal: number
}

export function StepsChart({ data, goal }: StepsChartProps) {
  const chartData = data.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    steps: log.steps,
    fullDate: log.date,
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>No step data available. Start logging your steps to see trends!</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
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
          <ReferenceLine y={goal} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
          <Bar
            dataKey="steps"
            fill="hsl(var(--primary))"
            radius={[2, 2, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
