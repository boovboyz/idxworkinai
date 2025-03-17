import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import { supabase, type Quiz, type QuizQuestion } from "@/lib/supabase"
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { resourceIds, topicFocus, questionCount = 5, userId = "anonymous" } = await req.json()

    if (!resourceIds || !Array.isArray(resourceIds) || resourceIds.length === 0) {
      return NextResponse.json({ error: "No resources provided" }, { status: 400 })
    }

    let combinedContent = "";
    let questions: QuizQuestion[] = [];

    try {
      // Try to fetch resources from Supabase
      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .in('id', resourceIds)

      if (!resourcesError && resources && resources.length > 0) {
        // Combine the content of all resources
        combinedContent = resources.map(resource => resource.content).join("\n\n")
      } else {
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
      }

      // Use Claude 3 for quiz generation
      try {
        const { text: questionsJson } = await generateText({
          model: anthropic("claude-3-haiku-20240307"),
          prompt: `Generate ${questionCount} quiz questions about the following content. Include a mix of multiple choice, true/false, and short answer questions. Format the response as a JSON array of question objects, each with 'id', 'type', 'question', 'options' (for multiple choice), 'correctAnswer', and 'explanation' fields.\n\nContent: ${combinedContent}`,
        })

        // Parse the generated questions
        const parsedQuestions = JSON.parse(questionsJson)
        
        // Format questions for our database schema
        questions = parsedQuestions.map((q: any) => ({
          id: uuidv4(),
          quiz_id: '', // Will be set after quiz creation
          question: q.question,
          options: q.options || undefined,
          correct_answer: q.correctAnswer,
          explanation: q.explanation,
          type: q.type.includes('multiple') ? 'multiple_choice' : 
                q.type.includes('true') ? 'true_false' : 'short_answer'
        }))
      } catch (aiError: any) {
        console.error("Error generating questions with Claude 3:", aiError)
        return NextResponse.json({ 
          error: "Failed to generate quiz questions", 
          details: aiError.message || "Unknown error" 
        }, { status: 500 })
      }
    } catch (dbError: any) {
      console.error("Error with database operations:", dbError)
      return NextResponse.json({ 
        error: "Database error", 
        details: dbError.message || "Unknown error" 
      }, { status: 500 })
    }

    // Create a new quiz in Supabase
    const quizId = uuidv4()
    const newQuiz: Quiz = {
      id: quizId,
      title: topicFocus || "Generated Quiz",
      user_id: userId,
      resource_ids: resourceIds,
      created_at: new Date().toISOString(),
      questions: questions
    }

    // Update quiz_id for each question
    questions.forEach(q => q.quiz_id = quizId)

    try {
      // Try to insert the quiz into the database
      const { error: quizError } = await supabase
        .from('quizzes')
        .insert(newQuiz)

      if (quizError) {
        console.error("Error creating quiz in database:", quizError)
        return NextResponse.json({ 
          error: "Failed to save quiz", 
          details: quizError.message 
        }, { status: 500 })
      }

      // Try to insert questions into the database
      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questions)

      if (questionsError) {
        console.error("Error saving questions in database:", questionsError)
        return NextResponse.json({ 
          error: "Failed to save quiz questions", 
          details: questionsError.message 
        }, { status: 500 })
      }
    } catch (saveError: any) {
      console.error("Error saving to database:", saveError)
      return NextResponse.json({ 
        error: "Failed to save quiz", 
        details: saveError.message || "Unknown error" 
      }, { status: 500 })
    }

    return NextResponse.json(newQuiz)
  } catch (error: any) {
    console.error("Error creating quiz:", error)
    return NextResponse.json({ 
      error: "Failed to create quiz", 
      details: error.message || "Unknown error" 
    }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const userId = searchParams.get("userId") || "anonymous"

  try {
    if (id) {
      // Return specific quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single()

      if (quizError) {
        console.error("Error fetching quiz:", quizError)
        return NextResponse.json({ 
          error: "Quiz not found", 
          details: quizError.message 
        }, { status: 404 })
      }

      // Fetch questions for this quiz
      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', id)

      if (questionsError) {
        console.error("Error fetching questions:", questionsError)
        return NextResponse.json({ 
          error: "Failed to fetch quiz questions", 
          details: questionsError.message 
        }, { status: 500 })
      } else {
        // Add questions to the quiz
        quiz.questions = questions
      }

      return NextResponse.json(quiz)
    } else {
      // Return all quizzes for the user
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (quizzesError) {
        console.error("Error fetching quizzes:", quizzesError)
        return NextResponse.json({ 
          error: "Failed to fetch quizzes", 
          details: quizzesError.message 
        }, { status: 500 })
      }

      return NextResponse.json(quizzes)
    }
  } catch (error: any) {
    console.error("Error in quiz retrieval:", error)
    return NextResponse.json({ 
      error: "Failed to fetch quizzes", 
      details: error.message || "Unknown error" 
    }, { status: 500 })
  }
}

