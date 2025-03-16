import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    
    // Prepare the prompt for the AI
    const tasksData = tasks.map(task => ({
      id: task.id,
      name: task.name,
      description: task.description,
      dueDate: task.dueDate,
    }));
    
    // In a real implementation, you would call an AI API here
    // For now, we'll simulate a response
    const aiResponse = await simulateAIPlanning(tasksData, customInstructions);
    
    return NextResponse.json({ plan: aiResponse });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}

// This is a placeholder function that simulates an AI response
// In a real implementation, you would call an actual AI API
async function simulateAIPlanning(tasks: any[], customInstructions?: string) {
  // In a real implementation, you would:
  // 1. Format the tasks and instructions into a prompt
  // 2. Call an AI API (like OpenAI)
  // 3. Parse the response
  
  // For now, return a simple mock response
  return {
    summary: "Here's a suggested plan for your tasks",
    scheduledTasks: tasks.map((task, index) => ({
      taskId: task.id,
      suggestedStartDate: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      suggestedEndDate: new Date(Date.now() + ((index + 1) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      priority: index < 2 ? 'high' : index < 5 ? 'medium' : 'low',
      notes: `This is a placeholder suggestion for task "${task.name}"`,
    })),
  };
} 