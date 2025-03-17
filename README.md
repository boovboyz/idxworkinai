# QuizmeAI - AI-Powered Learning Platform

QuizmeAI is an educational platform that uses AI to generate personalized quizzes based on your study materials. Upload your notes, textbooks, or any learning content, and let our AI create quizzes to help you learn more effectively.

## Features

- **AI-Generated Quizzes**: Create quizzes based on your uploaded study materials
- **Interactive Chat Interface**: Chat with our AI assistant to generate quizzes and get explanations
- **Resource Management**: Upload and organize your study materials
- **Course Organization**: Group your resources into courses for focused learning
- **Performance Tracking**: Track your quiz performance and identify areas for improvement
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase
- **AI**: OpenAI GPT-4o
- **Database**: Supabase PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account
- OpenAI API key

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quizmeai.git
   cd quizmeai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up your Supabase database with the following tables:
   - `resources`: For storing uploaded study materials
   - `courses`: For organizing resources into courses
   - `quizzes`: For storing generated quizzes
   - `quiz_questions`: For storing individual quiz questions
   - `quiz_attempts`: For tracking user quiz attempts
   - `chat_history`: For storing chat conversations

   You can use the following SQL to create these tables:

   ```sql
   -- Drop existing tables if they exist (in reverse order of dependencies)
   DROP TABLE IF EXISTS chat_history;
   DROP TABLE IF EXISTS quiz_attempts;
   DROP TABLE IF EXISTS quiz_questions;
   DROP TABLE IF EXISTS quizzes;
   DROP TABLE IF EXISTS resources;
   DROP TABLE IF EXISTS courses;

   -- Create courses table
   CREATE TABLE courses (
     id UUID PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     color TEXT,
     user_id TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create resources table
   CREATE TABLE resources (
     id UUID PRIMARY KEY,
     name TEXT NOT NULL,
     type TEXT NOT NULL,
     content TEXT NOT NULL,
     size INTEGER,
     user_id TEXT NOT NULL,
     course_ids TEXT[] DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create quizzes table
   CREATE TABLE quizzes (
     id UUID PRIMARY KEY,
     title TEXT NOT NULL,
     user_id TEXT NOT NULL,
     resource_ids TEXT[] DEFAULT '{}',
     course_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create quiz_questions table
   CREATE TABLE quiz_questions (
     id UUID PRIMARY KEY,
     quiz_id UUID REFERENCES quizzes(id),
     question TEXT NOT NULL,
     options TEXT[],
     correct_answer TEXT NOT NULL,
     explanation TEXT,
     type TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create quiz_attempts table
   CREATE TABLE quiz_attempts (
     id UUID PRIMARY KEY,
     quiz_id TEXT NOT NULL,
     user_id TEXT NOT NULL,
     score INTEGER NOT NULL,
     total_questions INTEGER NOT NULL,
     answers JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create chat_history table
   CREATE TABLE chat_history (
     id UUID PRIMARY KEY,
     user_id TEXT NOT NULL,
     message TEXT NOT NULL,
     response TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Upload Study Materials**: Go to the Dashboard and upload your study materials (PDFs, text, images).
2. **Organize into Courses**: Create courses and assign your study materials to them.
3. **Generate Quizzes**: Start a quiz based on your uploaded materials or a specific course.
4. **Take Quizzes**: Answer the questions and get immediate feedback.
5. **Review Performance**: Check your quiz history and performance statistics.

## Deployment

The application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

1. Connect your repository to Vercel or Netlify.
2. Set the environment variables in the deployment platform.
3. Deploy the application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [OpenAI](https://openai.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/) 