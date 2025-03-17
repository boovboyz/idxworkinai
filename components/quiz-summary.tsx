"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, RotateCcw, Trophy, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface QuizSummaryProps {
  correctAnswers: number
  totalQuestions: number
  questions: {
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string
  }[]
  courseName?: string
  onStartNewQuiz: () => void
}

export function QuizSummary({
  correctAnswers,
  totalQuestions,
  questions,
  courseName,
  onStartNewQuiz,
}: QuizSummaryProps) {
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  // Determine grade based on score
  const getGrade = (score: number) => {
    if (score >= 90) return { letter: "A", description: "Excellent!" }
    if (score >= 80) return { letter: "B", description: "Good job!" }
    if (score >= 70) return { letter: "C", description: "Not bad!" }
    if (score >= 60) return { letter: "D", description: "Needs improvement" }
    return { letter: "F", description: "Keep studying" }
  }

  const grade = getGrade(score)

  // Identify strengths and weaknesses
  const getStrengthsAndWeaknesses = () => {
    if (questions.length === 0) return { strengths: [], weaknesses: [] }

    // This is a simplified version - in a real app, you would analyze patterns
    // across multiple quizzes and categorize by topic
    const strengths = questions
      .filter((q) => q.isCorrect)
      .map((q) => q.question.substring(0, 50) + "...")
      .slice(0, 2)

    const weaknesses = questions
      .filter((q) => !q.isCorrect)
      .map((q) => q.question.substring(0, 50) + "...")
      .slice(0, 2)

    return { strengths, weaknesses }
  }

  const { strengths, weaknesses } = getStrengthsAndWeaknesses()

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Summary</CardTitle>
          <CardDescription>You've completed the quiz! Here's how you did:</CardDescription>
          {courseName && (
            <Badge className="mx-auto mt-2 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {courseName} Course
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-muted"></div>
              <div
                className="absolute inset-0 rounded-full bg-primary"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                  background: `conic-gradient(var(--primary) ${score}%, transparent 0)`,
                }}
              ></div>
              <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{score}%</div>
                  <div className="text-xl font-semibold">{grade.letter}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{grade.description}</h3>
              <p className="text-muted-foreground">
                You got {correctAnswers} out of {totalQuestions} questions correct.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-green-500" />
                Strengths
              </h3>
              {strengths.length > 0 ? (
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Keep practicing to identify your strengths!</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Areas to Improve
              </h3>
              {weaknesses.length > 0 ? (
                <ul className="space-y-2">
                  {weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Great job! No major weaknesses identified.</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Question Review</h3>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    {q.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{q.question}</p>
                      <div className="mt-1 space-y-1 text-sm">
                        <p>
                          Your answer:{" "}
                          <span className={q.isCorrect ? "text-green-500" : "text-red-500"}>{q.userAnswer}</span>
                        </p>
                        {!q.isCorrect && (
                          <p>
                            Correct answer: <span className="text-green-500">{q.correctAnswer}</span>
                          </p>
                        )}
                        <p className="text-muted-foreground">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onStartNewQuiz} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Start New Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

