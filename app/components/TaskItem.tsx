import { useState } from 'react';
import { format } from 'date-fns';

export type Task = {
  id: string;
  name: string;
  description: string;
  completedAt: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type TaskItemProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
};

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isCompleted = !!task.completedAt;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleToggleComplete = () => {
    onToggleComplete(task.id, !isCompleted);
  };
  
  return (
    <div className={`border rounded-lg p-4 mb-4 ${isCompleted ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleToggleComplete}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <h3 
              className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}
              onClick={toggleExpand}
            >
              {task.name}
            </h3>
            {task.dueDate && (
              <p className="text-sm text-gray-500">
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pl-7">
          <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
          <div className="mt-2 text-xs text-gray-500">
            {isCompleted && (
              <p>Completed: {format(new Date(task.completedAt!), 'MMM d, yyyy')}</p>
            )}
            <p>Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
          </div>
        </div>
      )}
    </div>
  );
} 