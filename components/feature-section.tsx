import { BookOpen, Image, MessageSquare, BarChart, CheckCircle, List } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Upload Study Materials",
      description: "Import your notes, textbooks, and study guides to create personalized quizzes.",
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "OCR Technology",
      description: "Extract text from images and screenshots of your study materials.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Conversational Quizzing",
      description:
        "Experience a natural quiz flow like a friend quizzing you, with one question at a time and immediate feedback.",
    },
    {
      icon: <List className="h-6 w-6" />,
      title: "Diverse Question Types",
      description:
        "Challenge yourself with multiple-choice, true/false, short answer, and fill-in-the-blank questions to test your knowledge in different ways.",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Instant Feedback",
      description: "Receive immediate explanations after each answer to reinforce your learning and understanding.",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Comprehensive Summary",
      description:
        "Get a detailed performance report with grades, strengths, and areas for improvement after each quiz.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to enhance your learning experience
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-4 bg-background">
              <div className="p-2 rounded-full bg-primary/10 text-primary">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

