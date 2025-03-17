"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Course {
  id: string
  name: string
  description: string
  color: string
}

interface CourseManagerProps {
  courses: Course[]
  onCreateCourse: (course: Omit<Course, "id">) => void
  onUpdateCourse: (course: Course) => void
  onDeleteCourse: (id: string) => void
}

export function CourseManager({ courses, onCreateCourse, onUpdateCourse, onDeleteCourse }: CourseManagerProps) {
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    color: "#3b82f6", // Default blue
  })

  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)

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

  const handleCreateCourse = () => {
    if (!newCourse.name.trim()) return

    onCreateCourse(newCourse)

    setNewCourse({
      name: "",
      description: "",
      color: "#3b82f6",
    })
  }

  const handleUpdateCourse = () => {
    if (!editingCourse || !editingCourse.name.trim()) return

    onUpdateCourse(editingCourse)
    setEditingCourse(null)
  }

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      onDeleteCourse(courseToDelete)
      setCourseToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Create New Course</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="course-name">Course Name</Label>
            <Input
              id="course-name"
              placeholder="Enter course name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course-description">Description (Optional)</Label>
            <Textarea
              id="course-description"
              placeholder="Enter a brief description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
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
                    newCourse.color === color.value && "ring-2 ring-offset-2 ring-primary",
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setNewCourse({ ...newCourse, color: color.value })}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleCreateCourse} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Courses</h3>
        <div className="grid gap-4">
          {courses.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No courses created yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="h-2" style={{ backgroundColor: course.color }}></div>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{course.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingCourse(course)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Course</DialogTitle>
                                <DialogDescription>Make changes to your course here.</DialogDescription>
                              </DialogHeader>
                              {editingCourse && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingCourse.name}
                                      onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={editingCourse.description}
                                      onChange={(e) =>
                                        setEditingCourse({ ...editingCourse, description: e.target.value })
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
                                            editingCourse.color === color.value && "ring-2 ring-offset-2 ring-primary",
                                          )}
                                          style={{ backgroundColor: color.value }}
                                          onClick={() => setEditingCourse({ ...editingCourse, color: color.value })}
                                          title={color.name}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingCourse(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateCourse}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setCourseToDelete(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
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

      <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This will remove the course from all resources. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCourse} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

