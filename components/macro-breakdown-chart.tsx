"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface MacroBreakdownChartProps {
  data: Record<string, { calories: number; protein: number; carbs: number; fat: number }>
}

export function MacroBreakdownChart({ data }: MacroBreakdownChartProps) {
  const totalDays = Object.keys(data).length

  if (totalDays === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <p>No macro data available</p>
      </div>
    )
  }

  const avgMacros = Object.values(data).reduce(
    (acc, day) => ({
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fat: acc.fat + day.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 },
  )

  const chartData = [
    {
      name: "Protein",
      value: Math.round(avgMacros.protein / totalDays),
      calories: Math.round((avgMacros.protein / totalDays) * 4), // 4 cal per gram
      color: "hsl(var(--primary))",
    },
    {
      name: "Carbs",
      value: Math.round(avgMacros.carbs / totalDays),
      calories: Math.round((avgMacros.carbs / totalDays) * 4), // 4 cal per gram
      color: "hsl(142, 76%, 36%)", // Green
    },
    {
      name: "Fat",
      value: Math.round(avgMacros.fat / totalDays),
      calories: Math.round((avgMacros.fat / totalDays) * 9), // 9 cal per gram
      color: "hsl(48, 96%, 53%)", // Yellow
    },
  ]

  const totalCalories = chartData.reduce((sum, macro) => sum + macro.calories, 0)

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="calories">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number, name: string) => {
              const macro = chartData.find((m) => m.name === name)
              const percentage = Math.round((value / totalCalories) * 100)
              return [`${macro?.value}g (${value} cal, ${percentage}%)`, name]
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
