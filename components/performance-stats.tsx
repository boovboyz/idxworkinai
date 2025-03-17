"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TopicPerformance {
  topic: string
  correctPercentage: number
  questionsCount: number
}

export function PerformanceStats() {
  // Mock data - in a real app, this would come from your backend
  const overallStats = {
    totalQuizzes: 12,
    totalQuestions: 120,
    correctAnswers: 96,
    averageScore: 80,
  }

  const topicPerformance: TopicPerformance[] = [
    { topic: "Cell Biology", correctPercentage: 85, questionsCount: 20 },
    { topic: "Chemical Bonds", correctPercentage: 70, questionsCount: 15 },
    { topic: "World War II", correctPercentage: 90, questionsCount: 10 },
    { topic: "Algebra", correctPercentage: 65, questionsCount: 25 },
    { topic: "Literary Analysis", correctPercentage: 75, questionsCount: 12 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalQuizzes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalQuestions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.correctAnswers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topic Performance</CardTitle>
          <CardDescription>Your performance across different topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topicPerformance.map((topic) => (
              <div key={topic.topic} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{topic.topic}</span>
                  <span className="font-medium">{topic.correctPercentage}%</span>
                </div>
                <Progress value={topic.correctPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">Based on {topic.questionsCount} questions</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

