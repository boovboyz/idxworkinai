import { NextResponse } from "next/server";
import { supabase, type QuizAttempt } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

// Handle quiz attempt creation
export async function POST(req: Request) {
  try {
    const { userId = "anonymous", score, totalQuestions, courseId, questions } = await req.json();

    if (score === undefined || totalQuestions === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAttempt: Partial<QuizAttempt> = {
      id: uuidv4(),
      user_id: userId,
      quiz_id: courseId || "general", // Use courseId as quiz_id if available
      score,
      total_questions: totalQuestions,
      created_at: new Date().toISOString(),
      answers: questions.map((q: any) => ({
        question_id: uuidv4(), // Generate a unique ID for each question
        user_answer: q.userAnswer,
        is_correct: q.isCorrect,
      })),
    };

    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert(newAttempt)
      .select()
      .single();

    if (error) {
      console.error("Error creating quiz attempt:", error);
      return NextResponse.json({ error: "Failed to save quiz attempt" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in quiz attempt creation:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// Handle quiz attempt retrieval
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId") || "anonymous";

    if (id) {
      // Get a specific quiz attempt
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching quiz attempt:", error);
        return NextResponse.json({ error: "Quiz attempt not found" }, { status: 404 });
      }

      return NextResponse.json(data);
    } else {
      // Get all quiz attempts for a user
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching quiz attempts:", error);
        return NextResponse.json({ error: "Failed to fetch quiz attempts" }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error in quiz attempt retrieval:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
} 