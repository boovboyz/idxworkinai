"use client"

import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, FileTextIcon, Trash2, Tag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { type Resource, type Course } from "@/lib/supabase"

interface ResourceListProps {
  resources: Resource[]
  courses: Course[]
  onDelete: (id: string) => void
  onCoursesChange: (resourceId: string, courseIds: string[]) => void
}

export function ResourceList({ resources, courses, onDelete, onCoursesChange }: ResourceListProps) {
  const [editingResource, setEditingResource] = useState<string | null>(null)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])

  if (resources.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No resources uploaded yet</p>
      </div>
    )
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A"
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const handleEditCourses = (resource: Resource) => {
    setEditingResource(resource.id)
    setSelectedCourses([...(resource.course_ids || [])])
  }

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const handleSaveCourses = () => {
    if (editingResource) {
      onCoursesChange(editingResource, selectedCourses)
      setEditingResource(null)
    }
  }

  return (
    <div className="space-y-2">
      {resources.map((resource) => (
        <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
          <div className="flex items-center space-x-3">
            {resource.type === "document" && <FileIcon className="h-5 w-5 text-blue-500" />}
            {resource.type === "image" && <ImageIcon className="h-5 w-5 text-green-500" />}
            {resource.type === "text" && <FileTextIcon className="h-5 w-5 text-orange-500" />}
            <div>
              <p className="font-medium">{resource.name}</p>
              <p className="text-xs text-muted-foreground">
                {resource.size ? formatFileSize(resource.size) + " • " : ""}
                {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}
              </p>

              {resource.course_ids && resource.course_ids.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {resource.course_ids.map((courseId) => {
                    const course = courses.find((c) => c.id === courseId)
                    return course ? (
                      <Badge
                        key={courseId}
                        variant="outline"
                        className="text-xs py-0 h-5 flex items-center"
                        style={{ borderColor: course.color }}
                      >
                        <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: course.color }}></span>
                        {course.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleEditCourses(resource)}>
                  <Tag className="h-4 w-4" />
                  <span className="sr-only">Edit Courses</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Courses</DialogTitle>
                  <DialogDescription>Categorize "{resource.name}" for better organization.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`resource-course-${course.id}`}
                          checked={selectedCourses.includes(course.id)}
                          onCheckedChange={() => handleCourseToggle(course.id)}
                        />
                        <Label
                          htmlFor={`resource-course-${course.id}`}
                          className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></span>
                          {course.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button onClick={() => setSelectedCourses([])}>Clear All</Button>
                  <Button variant="outline" onClick={() => setEditingResource(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCourses}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="icon" onClick={() => onDelete(resource.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

