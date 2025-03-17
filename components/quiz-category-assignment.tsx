"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tag, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  color: string
}

interface QuizCategoryAssignmentProps {
  quizId: string
  quizTitle: string
  assignedCategories: string[]
  onCategoriesChange: (categoryIds: string[]) => void
}

export function QuizCategoryAssignment({
  quizId,
  quizTitle,
  assignedCategories,
  onCategoriesChange,
}: QuizCategoryAssignmentProps) {
  // In a real app, these would come from your backend
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Biology", color: "#10b981" },
    { id: "2", name: "Chemistry", color: "#3b82f6" },
    { id: "3", name: "History", color: "#f97316" },
    { id: "4", name: "Math", color: "#8b5cf6" },
    { id: "5", name: "Physics", color: "#ec4899" },
    { id: "6", name: "Literature", color: "#14b8a6" },
    { id: "7", name: "Computer Science", color: "#f59e0b" },
    { id: "8", name: "Languages", color: "#6366f1" },
  ])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(assignedCategories)

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSave = () => {
    onCategoriesChange(selectedCategories)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Tag className="h-4 w-4" />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Categories</DialogTitle>
          <DialogDescription>Assign "{quizTitle}" to one or more categories.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Current Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((catId) => {
                  const category = categories.find((c) => c.id === catId)
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
                })
              ) : (
                <span className="text-sm text-muted-foreground">No categories assigned</span>
              )}
            </div>
          </div>

          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 flex justify-between items-center">
            <Button variant="outline" size="sm" asChild>
              <DialogTrigger>
                <Plus className="h-4 w-4 mr-2" />
                Create New Category
              </DialogTrigger>
            </Button>
            <span className="text-sm text-muted-foreground">{selectedCategories.length} categories selected</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" asChild>
            <DialogTrigger>Cancel</DialogTrigger>
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

