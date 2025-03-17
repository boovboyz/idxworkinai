"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, ListIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string
  color: string
  quizCount: number
}

interface Quiz {
  id: string
  title: string
  date: Date
  questionsCount: number
  correctAnswers: number
  categoryIds: string[]
}

export function CategoryBrowser() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Biology",
      description: "All biology-related quizzes and study materials",
      color: "#10b981", // Emerald
      quizCount: 5,
    },
    {
      id: "2",
      name: "Chemistry",
      description: "Chemistry concepts and formulas",
      color: "#3b82f6", // Blue
      quizCount: 3,
    },
    {
      id: "3",
      name: "History",
      description: "Historical events and timelines",
      color: "#f97316", // Orange
      quizCount: 2,
    },
    {
      id: "4",
      name: "Math",
      description: "Mathematics concepts and problem-solving",
      color: "#8b5cf6", // Violet
      quizCount: 4,
    },
  ])

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Cell Biology Basics",
      date: new Date(2023, 4, 15),
      questionsCount: 10,
      correctAnswers: 8,
      categoryIds: ["1"],
    },
    {
      id: "2",
      title: "Photosynthesis Process",
      date: new Date(2023, 4, 10),
      questionsCount: 8,
      correctAnswers: 7,
      categoryIds: ["1"],
    },
    {
      id: "3",
      title: "Periodic Table Elements",
      date: new Date(2023, 4, 5),
      questionsCount: 15,
      correctAnswers: 12,
      categoryIds: ["2"],
    },
    {
      id: "4",
      title: "Chemical Bonds",
      date: new Date(2023, 3, 28),
      questionsCount: 12,
      correctAnswers: 9,
      categoryIds: ["2"],
    },
    {
      id: "5",
      title: "World War II Timeline",
      date: new Date(2023, 3, 20),
      questionsCount: 10,
      correctAnswers: 8,
      categoryIds: ["3"],
    },
    {
      id: "6",
      title: "Algebra Fundamentals",
      date: new Date(2023, 3, 15),
      questionsCount: 12,
      correctAnswers: 10,
      categoryIds: ["4"],
    },
    {
      id: "7",
      title: "Geometry Basics",
      date: new Date(2023, 3, 10),
      questionsCount: 10,
      correctAnswers: 9,
      categoryIds: ["4"],
    },
    {
      id: "8",
      title: "DNA Structure and Function",
      date: new Date(2023, 3, 5),
      questionsCount: 8,
      correctAnswers: 7,
      categoryIds: ["1"],
    },
    {
      id: "9",
      title: "Acids and Bases",
      date: new Date(2023, 2, 28),
      questionsCount: 10,
      correctAnswers: 8,
      categoryIds: ["2"],
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"date" | "title" | "score">("date")

  // Filter quizzes based on selected category and search query
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory = selectedCategory ? quiz.categoryIds.includes(selectedCategory) : true
    const matchesSearch = searchQuery ? quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
    return matchesCategory && matchesSearch
  })

  // Sort quizzes based on selected sort option
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (sortBy === "date") {
      return b.date.getTime() - a.date.getTime()
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "score") {
      const scoreA = (a.correctAnswers / a.questionsCount) * 100
      const scoreB = (b.correctAnswers / b.questionsCount) * 100
      return scoreB - scoreA
    }
    return 0
  })

  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id)
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "title" | "score")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="score">Score (Highest)</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-r-none", viewMode === "grid" && "bg-muted")}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-l-none", viewMode === "list" && "bg-muted")}
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-4">
            <h3 className="font-medium">Categories</h3>
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
                <Badge variant="secondary" className="ml-auto">
                  {quizzes.length}
                </Badge>
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
                    {category.name}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.quizCount}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {sortedQuizzes.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No quizzes found</p>
            </div>
          ) : (
            <div
              className={cn(viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4")}
            >
              {sortedQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardContent className={cn("p-4", viewMode === "list" && "flex justify-between items-center")}>
                    <div className={cn(viewMode === "list" && "flex-1")}>
                      <h4 className="font-semibold">{quiz.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {quiz.categoryIds.map((catId) => {
                          const category = getCategoryById(catId)
                          return category ? (
                            <Badge
                              key={catId}
                              variant="outline"
                              className="flex items-center"
                              style={{ borderColor: category.color }}
                            >
                              <span
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: category.color }}
                              ></span>
                              {category.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">{formatDate(quiz.date)}</div>
                    </div>
                    <div className={cn("mt-4", viewMode === "list" && "mt-0 ml-4 text-right")}>
                      <div className="text-sm font-medium">
                        Score: {Math.round((quiz.correctAnswers / quiz.questionsCount) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quiz.correctAnswers}/{quiz.questionsCount} correct
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Quiz
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

