/**
 * Generates a prompt for the AI to create a task plan
 */
export function generateTaskPlanPrompt(tasks: any[], customInstructions?: string): string {
  // Format tasks for the prompt
  const tasksFormatted = tasks.map((task, index) => {
    return `Task ${index + 1}: ${task.name}
Description: ${task.description}
${task.dueDate ? `Due Date: ${new Date(task.dueDate).toISOString().split('T')[0]}` : 'No due date specified'}
ID: ${task.id}
`;
  }).join('\n');
  
  return `I have the following tasks that need to be organized into a plan:

${tasksFormatted}

${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Please create a plan that organizes these tasks. For each task, provide:
1. A suggested start date
2. A suggested end date
3. A priority level (high, medium, or low)
4. Any notes or suggestions

Format your response as a JSON object with the following structure:
{
  "summary": "A brief summary of the overall plan",
  "scheduledTasks": [
    {
      "taskId": "the task ID",
      "suggestedStartDate": "YYYY-MM-DD",
      "suggestedEndDate": "YYYY-MM-DD",
      "priority": "high/medium/low",
      "notes": "Any specific notes for this task"
    }
  ]
}`;
} 