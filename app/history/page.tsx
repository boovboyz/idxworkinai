import type { Metadata } from "next"
import { QuizHistoryList } from "@/components/quiz-history-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceStats } from "@/components/performance-stats"

export const metadata: Metadata = {
  title: "Quiz History - QuizmeAI",
  description: "View your quiz history and performance statistics.",
}

export default function HistoryPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Quiz History</h1>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="history">Quiz History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Quiz History</CardTitle>
              <CardDescription>
                Review your previous quiz sessions and results. Organize quizzes into categories for better management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizHistoryList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
              <CardDescription>Track your progress and identify areas for improvement.</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceStats />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

