import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Apple, BarChart3, Target, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Apple className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">NutriTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Track Your Nutrition, <span className="text-primary">Transform Your Health</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take control of your nutrition with our comprehensive tracking app. Log meals, monitor progress, and achieve
            your health goals with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">Start Tracking Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Apple className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Food Logging</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easily log your meals with our comprehensive food database and barcode scanner
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Progress Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Visualize your nutrition trends with detailed charts and insights</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Goal Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Set and monitor your daily calorie, protein, and macro goals</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Health Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get personalized recommendations based on your eating patterns</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-lg p-8 border">
          <h2 className="text-3xl font-bold mb-4">Ready to start your nutrition journey?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who have transformed their health with NutriTrack
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/auth/signup">Create Your Free Account</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
