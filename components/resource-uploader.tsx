"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, FileText, Tag, Loader2 } from "lucide-react"
import { ResourceList } from "@/components/resource-list"
import { CourseManager } from "@/components/course-manager"
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
import { toast } from "sonner"
import { type Resource, type Course } from "@/lib/supabase"

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = "user-123"

// Mock resources for testing when Supabase is not configured
const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    name: "Biology Notes.pdf",
    type: "document",
    content: "The cell is the basic structural and functional unit of all organisms. Cells are the smallest unit of life that can replicate independently, and are often called the 'building blocks of life'. The study of cells is called cell biology, cellular biology, or cytology.",
    size: 2500000,
    user_id: MOCK_USER_ID,
    course_ids: ["1"],
    created_at: new Date(2023, 2, 15).toISOString(),
  },
  {
    id: "2",
    name: "Chemistry Formulas.jpg",
    type: "image",
    content: "Chemical formulas: H2O (water), CO2 (carbon dioxide), NaCl (sodium chloride), C6H12O6 (glucose)",
    size: 1200000,
    user_id: MOCK_USER_ID,
    course_ids: ["2"],
    created_at: new Date(2023, 3, 10).toISOString(),
  },
  {
    id: "3",
    name: "History Timeline",
    type: "text",
    content: "1776: American Declaration of Independence, 1789: French Revolution begins, 1914-1918: World War I, 1939-1945: World War II",
    user_id: MOCK_USER_ID,
    course_ids: ["3"],
    created_at: new Date(2023, 4, 5).toISOString(),
  },
];

// Mock courses for testing when Supabase is not configured
const MOCK_COURSES: Course[] = [
  {
    id: "1",
    name: "Biology",
    description: "All biology-related study materials",
    color: "#10b981",
    user_id: MOCK_USER_ID,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Chemistry",
    description: "Chemistry concepts and formulas",
    color: "#3b82f6",
    user_id: MOCK_USER_ID,
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "History",
    description: "Historical events and timelines",
    color: "#f97316",
    user_id: MOCK_USER_ID,
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    name: "Math",
    description: "Mathematics concepts and problem-solving",
    color: "#8b5cf6",
    user_id: MOCK_USER_ID,
    created_at: new Date().toISOString()
  },
];

export function ResourceUploader() {
  const [textInput, setTextInput] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [useSupabase, setUseSupabase] = useState(true)
  const [debugMode, setDebugMode] = useState(false)

  // Fetch resources and courses on component mount
  useEffect(() => {
    fetchResources()
    fetchCourses()
  }, [])

  const fetchResources = async () => {
    try {
      if (!useSupabase) {
        console.log("Using mock resources instead of Supabase")
        setResources(MOCK_RESOURCES)
        return
      }

      setIsLoading(true)
      const response = await fetch(`/api/resources?userId=${MOCK_USER_ID}`)
      
      if (debugMode) {
        console.log("Resource fetch response:", response)
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (debugMode) {
        console.log("Resources data:", data)
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setResources(data)
      } else {
        console.log("No resources found or empty array returned, using mock data")
        setResources(MOCK_RESOURCES)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast.error('Failed to load resources, using mock data instead')
      setResources(MOCK_RESOURCES)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      if (!useSupabase) {
        console.log("Using mock courses instead of Supabase")
        setCourses(MOCK_COURSES)
        return
      }

      setIsLoading(true)
      const response = await fetch(`/api/courses?userId=${MOCK_USER_ID}`)
      
      if (debugMode) {
        console.log("Course fetch response:", response)
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (debugMode) {
        console.log("Courses data:", data)
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data)
      } else {
        console.log("No courses found or empty array returned, using mock data")
        setCourses(MOCK_COURSES)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses, using mock data instead')
      setCourses(MOCK_COURSES)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    setIsLoading(true)
    try {
      // Read file content
      const fileContent = await readFileAsText(selectedFile)
      
      if (debugMode) {
        console.log("File content:", fileContent.substring(0, 100) + "...")
      }
      
      if (!useSupabase) {
        // Mock upload - just add to local state
        const newResource: Resource = {
          id: Math.random().toString(36).substring(7),
          name: selectedFile.name,
          type: selectedFile.type.includes("image") ? "image" : "document",
          content: fileContent,
          size: selectedFile.size,
          user_id: MOCK_USER_ID,
          course_ids: selectedCourses,
          created_at: new Date().toISOString(),
        }
        
        setResources([...resources, newResource])
        toast.success('Resource uploaded successfully (mock)')
      } else {
        // Create resource via API
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: selectedFile.name,
            type: selectedFile.type.includes("image") ? "image" : "document",
            content: fileContent,
            size: selectedFile.size,
            userId: MOCK_USER_ID,
            courseIds: selectedCourses,
          }),
        })

        if (debugMode) {
          console.log("Upload response:", response)
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to upload resource: ${errorData.error || response.statusText}`)
        }
        
        // Refresh resources
        await fetchResources()
        toast.success('Resource uploaded successfully')
      }
      
      // Reset form
      setSelectedFile(null)
      setSelectedCourses([])
      
      // Reset the file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error(`Failed to upload resource: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const handleTextSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!textInput.trim()) {
      toast.error("Please enter some text content")
      return
    }

    setIsLoading(true)
    try {
      if (!useSupabase) {
        // Mock text submission - just add to local state
        const newResource: Resource = {
          id: Math.random().toString(36).substring(7),
          name: textInput.substring(0, 20) + (textInput.length > 20 ? "..." : ""),
          type: "text",
          content: textInput,
          user_id: MOCK_USER_ID,
          course_ids: selectedCourses,
          created_at: new Date().toISOString(),
        }
        
        setResources([...resources, newResource])
        toast.success('Text resource saved successfully (mock)')
      } else {
        // Create resource via API
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: textInput.substring(0, 20) + (textInput.length > 20 ? "..." : ""),
            type: "text",
            content: textInput,
            userId: MOCK_USER_ID,
            courseIds: selectedCourses,
          }),
        })

        if (debugMode) {
          console.log("Text submission response:", response)
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to save text resource: ${errorData.error || response.statusText}`)
        }
        
        // Refresh resources
        await fetchResources()
        toast.success('Text resource saved successfully')
      }
      
      // Reset form
      setTextInput("")
      setSelectedCourses([])
    } catch (error) {
      console.error('Error saving text:', error)
      toast.error(`Failed to save text resource: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteResource = async (id: string) => {
    try {
      const response = await fetch(`/api/resources?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete resource')
      
      // Update local state
      setResources(resources.filter((resource) => resource.id !== id))
      toast.success('Resource deleted successfully')
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast.error('Failed to delete resource')
    }
  }

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const handleResourceCoursesChange = async (resourceId: string, courseIds: string[]) => {
    try {
      const response = await fetch('/api/resources', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: resourceId,
          courseIds,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to update resource')
      
      // Update local state
      setResources((prev) => prev.map((resource) => (resource.id === resourceId ? { ...resource, course_ids: courseIds } : resource)))
      toast.success('Resource updated successfully')
    } catch (error) {
      console.error('Error updating resource:', error)
      toast.error('Failed to update resource')
    }
  }

  const handleCreateCourse = async (course: Omit<Course, "id" | "user_id" | "created_at">) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...course,
          userId: MOCK_USER_ID,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to create course')
      
      const newCourse = await response.json()
      setCourses([...courses, newCourse])
      toast.success('Course created successfully')
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('Failed to create course')
    }
  }

  const handleUpdateCourse = async (updatedCourse: Course) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCourse),
      })
      
      if (!response.ok) throw new Error('Failed to update course')
      
      setCourses(courses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course)))
      toast.success('Course updated successfully')
    } catch (error) {
      console.error('Error updating course:', error)
      toast.error('Failed to update course')
    }
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete course')
      
      setCourses(courses.filter((course) => course.id !== id))
      
      // Remove the course from all resources
      setResources(
        resources.map((resource) => ({
          ...resource,
          course_ids: resource.course_ids.filter((courseId) => courseId !== id),
        })),
      )
      
      // Remove from selected courses if present
      setSelectedCourses((prev) => prev.filter((courseId) => courseId !== id))
      
      toast.success('Course deleted successfully')
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Failed to delete course')
    }
  }

  const startQuiz = (courseId?: string) => {
    // Filter resources by course if specified
    const filteredResources = courseId ? resources.filter((r) => r.course_ids.includes(courseId)) : resources

    if (filteredResources.length === 0) {
      toast.error("No resources available for this course. Please upload resources first.")
      return
    }

    // Navigate to the chat tab and start a quiz
    const chatTab = document.querySelector('[data-value="chat"]') as HTMLElement
    if (chatTab) {
      chatTab.click()

      // Wait for the tab to change
      setTimeout(() => {
        const startQuizButton = document.querySelector('button:contains("Start a Quiz")') as HTMLElement
        if (startQuizButton) {
          startQuizButton.click()
        }
      }, 100)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Study Materials</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="use-supabase" 
              checked={useSupabase} 
              onCheckedChange={(checked) => setUseSupabase(checked as boolean)} 
            />
            <Label htmlFor="use-supabase">Use Supabase</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="debug-mode" 
              checked={debugMode} 
              onCheckedChange={(checked) => setDebugMode(checked as boolean)} 
            />
            <Label htmlFor="debug-mode">Debug Mode</Label>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="text">Add Text</TabsTrigger>
          <TabsTrigger value="courses">Manage Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
                <FileUp className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Documents or Images</h3>
                <p className="text-sm text-muted-foreground mb-4">Drag and drop your files here, or click to browse</p>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.docx,.txt,image/*"
                  onChange={handleFileChange}
                />
                <Button asChild>
                  <label htmlFor="file-upload">Select Files</label>
                </Button>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Selected File:</h4>
                  <p className="text-sm mb-2">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Assign Courses (Optional):</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedCourses.length > 0 ? (
                        selectedCourses.map((courseId) => {
                          const course = courses.find((c) => c.id === courseId)
                          return course ? (
                            <Badge
                              key={courseId}
                              variant="outline"
                              className="flex items-center"
                              style={{ borderColor: course.color }}
                            >
                              <span
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: course.color }}
                              ></span>
                              {course.name}
                            </Badge>
                          ) : null
                        })
                      ) : (
                        <span className="text-sm text-muted-foreground">No courses selected</span>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Tag className="h-4 w-4 mr-2" />
                          Select Courses
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Courses</DialogTitle>
                          <DialogDescription>Categorize your resource for better organization.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[200px] rounded-md border p-4">
                          <div className="space-y-4">
                            {courses.map((course) => (
                              <div key={course.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`course-${course.id}`}
                                  checked={selectedCourses.includes(course.id)}
                                  onCheckedChange={() => handleCourseToggle(course.id)}
                                />
                                <Label
                                  htmlFor={`course-${course.id}`}
                                  className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: course.color }}
                                  ></span>
                                  {course.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <DialogFooter>
                          <Button onClick={() => setSelectedCourses([])}>Clear All</Button>
                          <Button variant="outline" asChild>
                            <DialogTrigger>Done</DialogTrigger>
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button onClick={() => setSelectedFile(null)} variant="outline" className="mr-2">
                      Cancel
                    </Button>
                    <Button onClick={handleFileUpload}>Upload File</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleTextSubmit}>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col items-center justify-center text-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Add Text Content</h3>
                    <p className="text-sm text-muted-foreground">
                      Paste or type your notes, definitions, or study content
                    </p>
                  </div>
                  <Textarea
                    placeholder="Paste or type your content here..."
                    className="min-h-[200px]"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Assign Courses (Optional):</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedCourses.length > 0 ? (
                        selectedCourses.map((courseId) => {
                          const course = courses.find((c) => c.id === courseId)
                          return course ? (
                            <Badge
                              key={courseId}
                              variant="outline"
                              className="flex items-center"
                              style={{ borderColor: course.color }}
                            >
                              <span
                                className="w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: course.color }}
                              ></span>
                              {course.name}
                            </Badge>
                          ) : null
                        })
                      ) : (
                        <span className="text-sm text-muted-foreground">No courses selected</span>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Tag className="h-4 w-4 mr-2" />
                          Select Courses
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Courses</DialogTitle>
                          <DialogDescription>Categorize your text content for better organization.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[200px] rounded-md border p-4">
                          <div className="space-y-4">
                            {courses.map((course) => (
                              <div key={course.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`text-course-${course.id}`}
                                  checked={selectedCourses.includes(course.id)}
                                  onCheckedChange={() => handleCourseToggle(course.id)}
                                />
                                <Label
                                  htmlFor={`text-course-${course.id}`}
                                  className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: course.color }}
                                  ></span>
                                  {course.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <DialogFooter>
                          <Button onClick={() => setSelectedCourses([])}>Clear All</Button>
                          <Button variant="outline" asChild>
                            <DialogTrigger>Done</DialogTrigger>
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Button type="submit">Add Content</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <CourseManager
                courses={courses}
                onCreateCourse={handleCreateCourse}
                onUpdateCourse={handleUpdateCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Your Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceList
            resources={resources}
            courses={courses}
            onDelete={handleDeleteResource}
            onCoursesChange={handleResourceCoursesChange}
          />
        </CardContent>
      </Card>

      {resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Start Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => startQuiz()} className="w-full">
                Start Quiz with All Materials
              </Button>

              <div className="text-sm font-medium mt-4 mb-2">Or start a quiz by course:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {courses.map((course) => {
                  // Count resources in this course
                  const resourceCount = resources.filter((r) => r.course_ids.includes(course.id)).length

                  return (
                    <Button
                      key={course.id}
                      variant="outline"
                      className="justify-start"
                      disabled={resourceCount === 0}
                      onClick={() => startQuiz(course.id)}
                    >
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: course.color }}></span>
                      {course.name}
                      <Badge variant="secondary" className="ml-auto">
                        {resourceCount}
                      </Badge>
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

