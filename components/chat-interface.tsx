"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Send, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { useChat } from "ai/react"
import { cn } from "@/lib/utils"
import { QuizSummary } from "@/components/quiz-summary"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { type Course, type Resource } from "@/lib/supabase"

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = "user-123"

type MessageType = "question" | "answer" | "feedback" | "system" | "summary"

interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system" | "data"
  type: MessageType
  isCorrect?: boolean
}

interface QuizState {
  inProgress: boolean
  currentQuestion: number
  totalQuestions: number
  correctAnswers: number
  courseId?: string
  questions: {
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string
  }[]
}

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [quizState, setQuizState] = useState<QuizState>({
    inProgress: false,
    currentQuestion: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    questions: [],
  })
  const [waitingForAnswer, setWaitingForAnswer] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [courses, setCourses] = useState<Course[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch courses and resources on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch courses
        const coursesResponse = await fetch(`/api/courses?userId=${MOCK_USER_ID}`)
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          setCourses(coursesData)
        } else {
          console.error("Failed to fetch courses")
          // Set default courses if API fails
          setCourses([
            { id: "1", name: "Biology", color: "#10b981", description: "", user_id: MOCK_USER_ID, created_at: new Date().toISOString() },
            { id: "2", name: "Chemistry", color: "#3b82f6", description: "", user_id: MOCK_USER_ID, created_at: new Date().toISOString() },
            { id: "3", name: "History", color: "#f97316", description: "", user_id: MOCK_USER_ID, created_at: new Date().toISOString() },
            { id: "4", name: "Math", color: "#8b5cf6", description: "", user_id: MOCK_USER_ID, created_at: new Date().toISOString() },
          ])
        }

        // Fetch resources
        const resourcesResponse = await fetch(`/api/resources?userId=${MOCK_USER_ID}`)
        if (resourcesResponse.ok) {
          const resourcesData = await resourcesResponse.json()
          setResources(resourcesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      userId: MOCK_USER_ID,
    },
    onResponse: async (response) => {
      // Process the response to determine if it's a question
      const responseText = await response.text();
      console.log("AI Response received:", responseText);

      // Force add the message to the UI if it's not showing up
      const newMessage = {
        id: Date.now().toString(),
        content: responseText,
        role: "assistant" as const,
      };
      
      // Add the message directly to aiMessages
      setMessages((prev) => [...prev, newMessage]);

      if (quizState.inProgress) {
        if (waitingForAnswer) {
          // This is feedback for the previous answer
          setWaitingForAnswer(false)

          // Check if this is the end of the quiz
          if (quizState.currentQuestion >= quizState.totalQuestions) {
            setShowSummary(true)
          }
        } else if (responseText.includes("?")) {
          // This is a new question
          setWaitingForAnswer(true)
          setQuizState((prev) => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1,
          }))
        }
      } else if (responseText.includes("Starting quiz with") && responseText.includes("questions")) {
        // Extract the number of questions
        const match = responseText.match(/Starting quiz with (\d+) questions/)
        const totalQuestions = match ? Number.parseInt(match[1]) : 5

        setQuizState({
          inProgress: true,
          currentQuestion: 0,
          totalQuestions,
          correctAnswers: 0,
          courseId: selectedCourse || undefined,
          questions: [],
        })
      }
    },
    onFinish: (message) => {
      if (waitingForAnswer && message.content.toLowerCase().includes("correct")) {
        // Update correct answers count
        setQuizState((prev) => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
          questions: [
            ...prev.questions,
            {
              question: prev.questions.length > 0 ? prev.questions[prev.questions.length - 1].question : "Question",
              userAnswer: input,
              correctAnswer: "Correct answer", // This would be extracted from the AI response
              isCorrect: true,
              explanation: message.content,
            },
          ],
        }))
      } else if (waitingForAnswer) {
        // Wrong answer
        setQuizState((prev) => ({
          ...prev,
          questions: [
            ...prev.questions,
            {
              question: prev.questions.length > 0 ? prev.questions[prev.questions.length - 1].question : "Question",
              userAnswer: input,
              correctAnswer: "Correct answer", // This would be extracted from the AI response
              isCorrect: false,
              explanation: message.content,
            },
          ],
        }))
      }

      // Save quiz attempt if it's finished
      if (showSummary) {
        saveQuizAttempt()
      }
    },
  })

  // Save quiz attempt to Supabase
  const saveQuizAttempt = async () => {
    try {
      const response = await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: MOCK_USER_ID,
          score: quizState.correctAnswers,
          totalQuestions: quizState.totalQuestions,
          courseId: quizState.courseId,
          questions: quizState.questions,
        }),
      })

      if (!response.ok) {
        console.error('Failed to save quiz attempt')
      }
    } catch (error) {
      console.error('Error saving quiz attempt:', error)
    }
  }

  // Convert AI SDK messages to our custom format
  const messages: Message[] = aiMessages.map((msg) => {
    console.log("Processing message:", msg);
    // Determine message type
    let type: MessageType = "system"
    let isCorrect: boolean | undefined = undefined

    if (msg.role === "assistant" && msg.content.includes("?") && quizState.inProgress) {
      type = "question"
    } else if (msg.role === "user" && waitingForAnswer) {
      type = "answer"
    } else if (msg.role === "assistant" && quizState.inProgress && !msg.content.includes("?")) {
      type = "feedback"
      isCorrect =
        msg.content.toLowerCase().includes("correct") ||
        msg.content.toLowerCase().includes("that's right") ||
        msg.content.toLowerCase().includes("well done")
    } else if (msg.role === "assistant" && showSummary) {
      type = "summary"
    }

    return {
      id: msg.id,
      content: msg.content,
      role: msg.role,
      type,
      isCorrect,
    }
  })

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Start a new quiz
  const startQuiz = async (questionCount = 5) => {
    setShowSummary(false)
    setQuizState({
      inProgress: false,
      currentQuestion: 0,
      totalQuestions: questionCount,
      correctAnswers: 0,
      courseId: selectedCourse || undefined,
      questions: [],
    })

    // Clear previous messages
    setMessages([])

    // Get resources for the selected course
    let resourceIds: string[] = []
    try {
      const url = selectedCourse 
        ? `/api/resources?userId=${MOCK_USER_ID}&courseId=${selectedCourse}`
        : `/api/resources?userId=${MOCK_USER_ID}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        resourceIds = data.map((r: Resource) => r.id)
      }
    } catch (error) {
      console.error('Error fetching resources for quiz:', error)
    }

    if (resourceIds.length === 0) {
      toast.error('No resources available. Please upload study materials first.')
      return
    }

    // Send a message to start the quiz
    const courseText = selectedCourse 
      ? ` from the ${courses.find((c) => c.id === selectedCourse)?.name} course` 
      : ""

    const message = `Start a quiz with ${questionCount} questions based on my uploaded materials${courseText}.`
    
    // Submit the message
    const formData = new FormData()
    formData.append("message", message)
    handleSubmit(new Event("submit") as any)
  }

  // End the current quiz and show summary
  const endQuiz = () => {
    if (quizState.inProgress) {
      setShowSummary(true)
      setQuizState((prev) => ({
        ...prev,
        inProgress: false,
      }))

      // Request a summary from the AI
      const formData = new FormData()
      formData.append("message", "Please provide a summary of my performance in this quiz.")
      handleSubmit(new Event("submit") as any)
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      {showSummary ? (
        <QuizSummary
          correctAnswers={quizState.correctAnswers}
          totalQuestions={quizState.totalQuestions}
          questions={quizState.questions}
          courseName={quizState.courseId ? courses.find((c) => c.id === quizState.courseId)?.name : undefined}
          onStartNewQuiz={() => startQuiz()}
        />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <h3 className="text-xl font-semibold mb-2">Welcome to QuizmeAI!</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your study materials and start a quiz. I'll ask you questions one by one and provide immediate
                  feedback.
                </p>

                <div className="w-full max-w-xs mb-4">
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          <div className="flex items-center">
                            <span
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: course.color }}
                            ></span>
                            {course.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => startQuiz(5)}>5 Questions</Button>
                  <Button onClick={() => startQuiz(10)}>10 Questions</Button>
                  <Button onClick={() => startQuiz(15)}>15 Questions</Button>
                </div>
              </div>
            ) : (
              <>
                {quizState.inProgress && (
                  <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 p-2 border rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        Question {quizState.currentQuestion}/{quizState.totalQuestions}
                      </div>
                      <div className="text-sm">
                        Score: {quizState.correctAnswers}/{quizState.currentQuestion}
                      </div>
                      <Button variant="outline" size="sm" onClick={endQuiz}>
                        End Quiz
                      </Button>
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <Card
                      className={cn(
                        "max-w-[80%] p-3",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                        message.type === "question" && "border-l-4 border-blue-500",
                        message.type === "feedback" && message.isCorrect && "border-l-4 border-green-500",
                        message.type === "feedback" && !message.isCorrect && "border-l-4 border-red-500",
                      )}
                    >
                      <div className="space-y-2">
                        {message.type === "feedback" && (
                          <div className="flex items-center gap-2 mb-1">
                            {message.isCorrect ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={cn(
                                "text-sm font-medium",
                                message.isCorrect ? "text-green-500" : "text-red-500",
                              )}
                            >
                              {message.isCorrect ? "Correct!" : "Incorrect"}
                            </span>
                          </div>
                        )}
                        <div className="prose dark:prose-invert">{message.content}</div>
                      </div>
                    </Card>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start">
                    <Card className="max-w-[80%] p-3 bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </Card>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={waitingForAnswer ? "Type your answer..." : "Ask a question..."}
                className="flex-1"
                disabled={isChatLoading}
              />
              <Button type="submit" size="icon" disabled={isChatLoading}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
              {messages.length > 0 && !quizState.inProgress && (
                <Button type="button" variant="outline" onClick={() => startQuiz()}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Quiz
                </Button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  )
}

