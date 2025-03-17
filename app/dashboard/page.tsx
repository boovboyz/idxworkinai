import type { Metadata } from "next"
import { ChatInterface } from "@/components/chat-interface"
import { ResourceUploader } from "@/components/resource-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Dashboard - QuizmeAI",
  description: "Upload your study materials and start learning with AI-powered quizzes.",
}

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="chat">Chat & Quiz</TabsTrigger>
          <TabsTrigger value="resources">Resources & Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QuizmeAI Chat</CardTitle>
              <CardDescription>Chat with our AI to generate quizzes based on your uploaded materials.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Study Materials</CardTitle>
              <CardDescription>
                Upload study materials and organize them into courses for more focused quizzes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceUploader />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

