import { useState } from 'react';

type PlanGeneratorProps = {
  onPlanGenerated: (plan: any) => void;
};

export default function PlanGenerator({ onPlanGenerated }: PlanGeneratorProps) {
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customInstructions }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }
      
      const data = await response.json();
      onPlanGenerated(data.plan);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Generate AI Plan</h2>
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700">
            Custom Instructions (Optional)
          </label>
          <textarea
            id="customInstructions"
            rows={3}
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Add any specific requirements for your plan, e.g., 'Focus on weekend tasks' or 'Prioritize by difficulty'"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Plan'}
          </button>
        </div>
      </form>
    </div>
  );
} 