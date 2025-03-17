export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Materials",
      description: "Upload your study guides, notes, textbooks, or paste text directly into the platform.",
    },
    {
      number: "02",
      title: "AI Processes Content",
      description: "Our AI analyzes your materials to understand the key concepts and information.",
    },
    {
      number: "03",
      title: "Start a Conversational Quiz",
      description: "Choose how many questions you want and begin your personalized quiz session.",
    },
    {
      number: "04",
      title: "Answer One Question at a Time",
      description: "The AI asks you questions one by one, just like a friend would quiz you on the material.",
    },
    {
      number: "05",
      title: "Get Immediate Feedback",
      description: "After each answer, receive instant feedback and detailed explanations to enhance learning.",
    },
    {
      number: "06",
      title: "Review Your Performance",
      description: "Get a comprehensive summary with your grade, strengths, and areas for improvement.",
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A natural, conversational approach to learning
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 mt-8 md:mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {step.number}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

