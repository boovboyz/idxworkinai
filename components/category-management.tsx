"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string
  color: string
  quizCount: number
  createdAt: Date
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Biology",
      description: "All biology-related quizzes and study materials",
      color: "#10b981", // Emerald
      quizCount: 5,
      createdAt: new Date(2023, 2, 15),
    },
    {
      id: "2",
      name: "Chemistry",
      description: "Chemistry concepts and formulas",
      color: "#3b82f6", // Blue
      quizCount: 3,
      createdAt: new Date(2023, 3, 10),
    },
    {
      id: "3",
      name: "History",
      description: "Historical events and timelines",
      color: "#f97316", // Orange
      quizCount: 2,
      createdAt: new Date(2023, 4, 5),
    },
    {
      id: "4",
      name: "Math",
      description: "Mathematics concepts and problem-solving",
      color: "#8b5cf6", // Violet
      quizCount: 4,
      createdAt: new Date(2023, 5, 20),
    },
  ])

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3b82f6", // Default blue
  })

  const colorOptions = [
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Yellow", value: "#eab308" },
    { name: "Lime", value: "#84cc16" },
    { name: "Green", value: "#22c55e" },
    { name: "Emerald", value: "#10b981" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Sky", value: "#0ea5e9" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Fuchsia", value: "#d946ef" },
    { name: "Pink", value: "#ec4899" },
    { name: "Rose", value: "#f43f5e" },
  ]

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return

    const category: Category = {
      id: Math.random().toString(36).substring(7),
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
      quizCount: 0,
      createdAt: new Date(),
    }

    setCategories([...categories, category])
    setNewCategory({
      name: "",
      description: "",
      color: "#3b82f6",
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return

    setCategories(categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)))

    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
    if (editingCategory?.id === id) {
      setEditingCategory(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Create New Category</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              placeholder="Enter category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category-description">Description (Optional)</Label>
            <Textarea
              id="category-description"
              placeholder="Enter a brief description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-full border",
                    newCategory.color === color.value && "ring-2 ring-offset-2 ring-primary",
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleCreateCategory} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Categories</h3>
        <div className="grid gap-4">
          {categories.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No categories created yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-4">
                {categories.map((category) => (
                  <Card key={category.id} className="overflow-hidden">
                    <div className="h-2" style={{ backgroundColor: category.color }}></div>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{category.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{category.quizCount} quizzes</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingCategory(category)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Category</DialogTitle>
                                <DialogDescription>Make changes to your category here.</DialogDescription>
                              </DialogHeader>
                              {editingCategory && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingCategory.name}
                                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={editingCategory.description}
                                      onChange={(e) =>
                                        setEditingCategory({ ...editingCategory, description: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Color</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {colorOptions.map((color) => (
                                        <button
                                          key={color.value}
                                          type="button"
                                          className={cn(
                                            "w-6 h-6 rounded-full border",
                                            editingCategory.color === color.value &&
                                              "ring-2 ring-offset-2 ring-primary",
                                          )}
                                          style={{ backgroundColor: color.value }}
                                          onClick={() => setEditingCategory({ ...editingCategory, color: color.value })}
                                          title={color.name}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateCategory}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Category</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this category? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}

