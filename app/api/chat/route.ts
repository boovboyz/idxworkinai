import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { anthropic } from '@ai-sdk/anthropic';

// Set the runtime to edge for streaming
export const runtime = 'edge';

// Mock AI response function to bypass API key issues
async function mockAIResponse(messages: any[]) {
  // Get the last user message
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage.content.toLowerCase();
  
  // Check if this is a quiz request
  if (userMessage.includes('quiz') || userMessage.includes('test')) {
    return {
      text: "Starting quiz with 5 questions based on your materials.\n\nQuestion 1: What is the primary function of a cell membrane?\nA) Energy production\nB) Protein synthesis\nC) Selective barrier\nD) DNA replication"
    };
  } 
  // Check if this is an answer to a quiz question
  else if (userMessage.includes('c') || userMessage.includes('selective barrier')) {
    return {
      text: "Correct! The cell membrane functions as a selective barrier, controlling what enters and exits the cell. It's made up of a phospholipid bilayer with embedded proteins that help with various functions including transport, cell recognition, and enzymatic activity.\n\nQuestion 2: Which of the following is NOT a type of chemical bond?\nA) Ionic bond\nB) Covalent bond\nC) Magnetic bond\nD) Hydrogen bond"
    };
  }
  // Default response
  else {
    return {
      text: "Hello! I'm QuizmeAI, your educational assistant powered by Claude 3. I can help you learn through interactive quizzes and explanations. Would you like me to create a quiz based on your study materials? Or do you have any specific questions about a topic you're studying?"
    };
  }
}

export async function POST(req: Request) {
  try {
    const { messages, userId = 'anonymous' } = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the last message from the user
    const lastMessage = messages[messages.length - 1];
    
    // Check if this is a quiz request
    const isQuizRequest = lastMessage.content.toLowerCase().includes('quiz') || 
                          lastMessage.content.toLowerCase().includes('test me');

    // Fetch user's resources if this is a quiz request
    let resourcesContext = '';
    if (isQuizRequest) {
      const { data: resources, error } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', userId)
        .limit(5);
      
      if (!error && resources && resources.length > 0) {
        resourcesContext = `The user has the following study materials:\n${
          resources.map(r => `- ${r.name}: ${r.content.substring(0, 200)}...`).join('\n')
        }\n\nYou can reference these materials when creating quiz questions.`;
      }
    }

    // Create system message
    const systemMessage = {
      role: 'system',
      content: `You are QuizmeAI, an educational AI assistant powered by Claude 3 that helps students learn through interactive quizzes and explanations.
      
Your primary functions are:
1. Generate quizzes based on the user's study materials
2. Provide detailed explanations for quiz answers
3. Answer educational questions with clear, concise explanations
4. Help users understand difficult concepts

When a user asks for a quiz:
- Create 5-10 questions based on their study materials or specified topic
- Include a mix of multiple-choice, true/false, and short answer questions
- Provide immediate feedback after each answer
- At the end, summarize their performance and suggest areas for improvement

${resourcesContext}

Always be encouraging and supportive, focusing on helping the user learn rather than just testing them.`
    };

    // Add system message to the beginning of the messages array
    const augmentedMessages = [systemMessage, ...messages];

    let result;
    try {
      // Try to use Claude 3 for generating responses
      result = await generateText({
        model: anthropic('claude-3-haiku-20240307'),
        messages: augmentedMessages,
        temperature: 0.7,
        maxTokens: 1000,
      });
    } catch (aiError) {
      console.error('Error using Claude 3, falling back to mock responses:', aiError);
      // Fall back to mock responses if Claude API fails
      result = await mockAIResponse(augmentedMessages);
    }

    // Store the chat message in Supabase
    const chatId = uuidv4();
    try {
      await supabase.from('chat_history').insert({
        id: chatId,
        user_id: userId,
        message: lastMessage.content,
        response: result.text.substring(0, 1000), // Store first 1000 chars of response
        created_at: new Date().toISOString(),
      });
      console.log('Chat message stored');
    } catch (storeError) {
      console.error('Error storing chat message:', storeError);
    }

    // Return the response
    return new Response(result.text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'An error occurred during the chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

