import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import { generateTaskPlanPrompt } from '@/lib/prompts';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/plan - Generate a plan using AI
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customInstructions } = body;
    
    // Fetch all tasks from the database
    const tasks = await prisma.task.findMany({
      where: {
        completedAt: null, // Only include incomplete tasks
      },
    });
    
    if (tasks.length === 0) {
      return NextResponse.json(
        { error: 'No incomplete tasks found to plan' },
        { status: 400 }
      );
    }
    
    // Generate the prompt using our helper function
    const prompt = generateTaskPlanPrompt(tasks, customInstructions);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // or another appropriate model
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates task plans. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const aiResponseText = response.choices[0].message.content;
    if (!aiResponseText) {
      throw new Error("Empty response from AI");
    }

    const aiResponse = JSON.parse(aiResponseText);
    
    return NextResponse.json({ plan: aiResponse });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
} 