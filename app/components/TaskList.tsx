import { useState } from 'react';
import TaskItem, { Task } from './TaskItem';
import TaskForm, { TaskFormData } from './TaskForm';

type TaskListProps = {
  tasks: Task[];
  onTaskUpdate: () => void;
};

export default function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };
  
  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      onTaskUpdate();
    } catch (error) {
      console.error('Error deleting task:', error);
      // In a real app, you might want to show an error message
    }
  };
  
  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completedAt: isCompleted ? new Date().toISOString() : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
      // In a real app, you might want to show an error message
    }
  };
  
  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      setEditingTask(null);
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
      // In a real app, you might want to show an error message
    }
  };
  
  const cancelEdit = () => {
    setEditingTask(null);
  };
  
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks yet. Add your first task above!</p>;
  }
  
  return (
    <div>
      {editingTask && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Edit Task</h3>
            <button 
              onClick={cancelEdit}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
          <TaskForm 
            onSubmit={handleUpdateTask} 
            initialData={{
              name: editingTask.name,
              description: editingTask.description,
              dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : undefined,
            }}
            isEditing={true}
          />
        </div>
      )}
      
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      ))}
    </div>
  );
} 