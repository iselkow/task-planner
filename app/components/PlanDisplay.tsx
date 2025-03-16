import { format } from 'date-fns';

type ScheduledTask = {
  taskId: string;
  suggestedStartDate: string;
  suggestedEndDate: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
};

type Plan = {
  summary: string;
  scheduledTasks: ScheduledTask[];
};

type PlanDisplayProps = {
  plan: Plan;
  onClose: () => void;
};

export default function PlanDisplay({ plan, onClose }: PlanDisplayProps) {
  // Group tasks by start date
  const tasksByDate = plan.scheduledTasks.reduce((acc, task) => {
    const date = task.suggestedStartDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, ScheduledTask[]>);
  
  // Sort dates
  const sortedDates = Object.keys(tasksByDate).sort();
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your AI-Generated Plan</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      
      <div className="mb-4 p-4 bg-indigo-50 rounded-md">
        <p className="text-indigo-800">{plan.summary}</p>
      </div>
      
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date} className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h3>
            <ul className="space-y-3">
              {tasksByDate[date].map((task) => (
                <li key={task.taskId} className="flex items-start">
                  <div className={`w-2 h-2 mt-2 rounded-full mr-2 ${
                    task.priority === 'high' 
                      ? 'bg-red-500' 
                      : task.priority === 'medium' 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{task.notes.split('"')[1]}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Due: {format(new Date(task.suggestedEndDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 