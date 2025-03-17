import type { Metadata } from "next"
import { CategoryManagement } from "@/components/category-management"
import { CategoryBrowser } from "@/components/category-browser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Categories - QuizmeAI",
  description: "Organize your quizzes into custom categories and collections.",
}

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Categories & Collections</h1>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="browse">Browse Categories</TabsTrigger>
          <TabsTrigger value="manage">Manage Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Categories</CardTitle>
              <CardDescription>Browse your quizzes by category or collection</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBrowser />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>Create, edit, and organize your custom categories</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

