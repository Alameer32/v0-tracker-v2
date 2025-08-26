import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Apple, Utensils } from "lucide-react"

interface ActivityItem {
  id: string
  type: "food" | "weight" | "goal"
  description: string
  time: string
  calories?: number
  mealType?: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "food":
        return <Apple className="h-4 w-4" />
      case "weight":
        return <Utensils className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getMealTypeColor = (mealType?: string) => {
    switch (mealType) {
      case "breakfast":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "lunch":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "dinner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "snack":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                <div className="text-muted-foreground">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    {activity.mealType && (
                      <Badge variant="secondary" className={`text-xs ${getMealTypeColor(activity.mealType)}`}>
                        {activity.mealType}
                      </Badge>
                    )}
                    {activity.calories && (
                      <Badge variant="outline" className="text-xs">
                        {activity.calories} cal
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
