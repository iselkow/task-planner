'use client';

import { useState, useEffect } from 'react';
import TaskForm, { TaskFormData } from './components/TaskForm';
import TaskList from './components/TaskList';
import { Task } from './components/TaskItem';
import PlanGenerator from './components/PlanGenerator';
import PlanDisplay from './components/PlanDisplay';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [plan, setPlan] = useState<any>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to load tasks', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (data: TaskFormData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add task');
      }

      setMessage({ text: 'Task added successfully!', type: 'success' });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'An error occurred', 
        type: 'error' 
      });
    }
  };

  const handlePlanGenerated = (generatedPlan: any) => {
    setPlan(generatedPlan);
    setMessage({ text: 'Plan generated successfully!', type: 'success' });
  };

  const closePlan = () => {
    setPlan(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Task Planner</h1>
      
      {message && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <TaskForm onSubmit={handleAddTask} />
      </div>
      
      {!plan && (
        <PlanGenerator onPlanGenerated={handlePlanGenerated} />
      )}
      
      {plan && (
        <PlanDisplay plan={plan} onClose={closePlan} />
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : (
          <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
        )}
      </div>
    </div>
  );
}
