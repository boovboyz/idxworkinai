"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { QuizCategoryAssignment } from "@/components/quiz-category-assignment"

interface QuizSession {
  id: string
  title: string
  date: Date
  questionsCount: number
  correctAnswers: number
  topics: string[]
  categoryIds: string[]
}

interface Category {
  id: string
  name: string
  color: string
}

export function QuizHistoryList() {
  // Mock categories - in a real app, this would come from your backend
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Biology", color: "#10b981" },
    { id: "2", name: "Chemistry", color: "#3b82f6" },
    { id: "3", name: "History", color: "#f97316" },
    { id: "4", name: "Math", color: "#8b5cf6" },
  ])

  // Mock data - in a real app, this would come from your backend
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([
    {
      id: "1",
      title: "Biology Fundamentals",
      date: new Date(2023, 4, 15),
      questionsCount: 10,
      correctAnswers: 8,
      topics: ["Cell Structure", "Photosynthesis"],
      categoryIds: ["1"],
    },
    {
      id: "2",
      title: "Chemistry Basics",
      date: new Date(2023, 4, 10),
      questionsCount: 15,
      correctAnswers: 12,
      topics: ["Periodic Table", "Chemical Bonds"],
      categoryIds: ["2"],
    },
    {
      id: "3",
      title: "History Review",
      date: new Date(2023, 4, 5),
      questionsCount: 8,
      correctAnswers: 6,
      topics: ["World War II", "Cold War"],
      categoryIds: ["3"],
    },
  ])

  const handleCategoriesChange = (quizId: string, categoryIds: string[]) => {
    setQuizSessions((prev) => prev.map((session) => (session.id === quizId ? { ...session, categoryIds } : session)))
  }

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id)
  }

  if (quizSessions.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No quiz history yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {quizSessions.map((session) => (
        <Card key={session.id}>
          <CardHeader className="pb-2">
            <CardTitle>{session.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">{formatDistanceToNow(session.date, { addSuffix: true })}</p>
              <p className="text-sm font-medium">
                Score: {session.correctAnswers}/{session.questionsCount} (
                {Math.round((session.correctAnswers / session.questionsCount) * 100)}%)
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {session.topics.map((topic) => (
                <Badge key={topic} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
            {session.categoryIds.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {session.categoryIds.map((catId) => {
                    const category = getCategoryById(catId)
                    return category ? (
                      <Badge
                        key={catId}
                        variant="outline"
                        className="flex items-center"
                        style={{ borderColor: category.color }}
                      >
                        <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: category.color }}></span>
                        {category.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <QuizCategoryAssignment
              quizId={session.id}
              quizTitle={session.title}
              assignedCategories={session.categoryIds}
              onCategoriesChange={(categoryIds) => handleCategoriesChange(session.id, categoryIds)}
            />
            <Button variant="outline" size="sm">
              Review Quiz
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

