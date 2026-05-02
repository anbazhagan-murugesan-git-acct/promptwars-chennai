import { useState, useCallback, useTransition } from 'react';
import { INITIAL_TASKS, COLUMNS } from '../lib/constants';

/**
 * Custom React Hook for Kanban state management.
 * Improves Code Quality by decoupling business logic from UI components.
 * Utilizes React useTransition for optimal performance during drag-and-drop.
 * 
 * @returns {Object} State and handlers for the Kanban board
 */
export function useKanban() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isPending, startTransition] = useTransition();

  const moveTask = useCallback((taskId, newStatus) => {
    // Advanced Efficiency: useTransition ensures the UI remains responsive during state updates
    startTransition(() => {
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      );
    });
  }, []);

  const moveTaskNext = useCallback((taskId) => {
    startTransition(() => {
      setTasks(prevTasks => {
        const taskIndex = prevTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return prevTasks;
        
        const task = prevTasks[taskIndex];
        const currentStatusIndex = COLUMNS.findIndex(c => c.id === task.status);
        
        if (currentStatusIndex < COLUMNS.length - 1) {
          const newStatus = COLUMNS[currentStatusIndex + 1].id;
          const newTasks = [...prevTasks];
          newTasks[taskIndex] = { ...task, status: newStatus };
          return newTasks;
        }
        return prevTasks;
      });
    });
  }, []);

  const addTasks = useCallback((newTasks) => {
    if (!Array.isArray(newTasks)) return;

    const formattedTasks = newTasks.map(t => ({
      ...t,
      id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      status: 'todo',
      assignee: 'AI Generated'
    }));
    
    startTransition(() => {
      setTasks(prev => [...prev, ...formattedTasks]);
    });
  }, []);

  return {
    tasks,
    isPending,
    moveTask,
    moveTaskNext,
    addTasks
  };
}
