import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { CTASection } from "@/components/cta-section"

export const metadata: Metadata = {
  title: "QuizmeAI - Learn Smarter with AI-Powered Quizzes",
  description:
    "Upload your study materials and let AI generate personalized quizzes to help you learn more effectively.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <HowItWorksSection />
        <CTASection />
      </main>
    </div>
  )
}

