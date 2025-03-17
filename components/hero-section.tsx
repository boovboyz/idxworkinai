import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Learn Smarter with Conversational AI Quizzes
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Upload your study materials and let our AI quiz you like a friend would - one question at a time with
              immediate feedback and personalized insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-4 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 p-2">
                      <div className="flex gap-2">
                        <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">What is the capital of France?</p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <div className="bg-primary/20 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">Paris</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">
                            Correct! Paris is the capital of France. Let me ask you another question...
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <div className="flex-1 h-8 bg-muted rounded-md"></div>
                      <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

