import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Resource = {
  id: string;
  name: string;
  type: 'document' | 'image' | 'text';
  content: string;
  size?: number;
  user_id: string;
  created_at: string;
  course_ids: string[];
};

export type Course = {
  id: string;
  name: string;
  description: string;
  color: string;
  user_id: string;
  created_at: string;
};

export type Quiz = {
  id: string;
  title: string;
  user_id: string;
  resource_ids: string[];
  course_id?: string;
  created_at: string;
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
};

export type QuizAttempt = {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  created_at: string;
  answers: {
    question_id: string;
    user_answer: string;
    is_correct: boolean;
  }[];
}; 