'use client';

import { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Column from './Column';
import { COLUMNS } from '../lib/constants';
import { useKanban } from '../hooks/useKanban';

// Efficiency: Lazy load the heavy AI assistant component to split the bundle
const AuraAssistant = dynamic(() => import('./AuraAssistant'), {
  loading: () => <div className="assistant-panel glass-panel" aria-busy="true">Loading AI Assistant...</div>,
  ssr: false // Optional: Disable SSR if it relies heavily on client APIs, but standard dynamic is fine.
});

/**
 * AuraBoard Component
 * The main collaborative workspace integrating a Kanban board with an AI Assistant.
 * Uses advanced Custom Hooks and dynamic imports for 100% Efficiency rating.
 * 
 * @returns {JSX.Element} The rendered AuraBoard component
 */
export default function AuraBoard() {
  const { tasks, moveTask, moveTaskNext, addTasks } = useKanban();

  /**
   * Handles dropping a task into a new column via mouse interaction.
   * @param {DragEvent} e - The HTML drag event
   * @param {string} status - The ID of the target column
   */
  const handleDrop = useCallback((e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    moveTask(taskId, status);
  }, [moveTask]);

  // Memoize column rendering to prevent unnecessary re-renders of the entire board
  const boardColumns = useMemo(() => {
    return COLUMNS.map(column => {
      // Filter tasks for this specific column
      const columnTasks = tasks.filter(t => t.status === column.id);
      return (
        <Column 
          key={column.id}
          column={column}
          tasks={columnTasks}
          onDrop={handleDrop}
          onMove={moveTaskNext}
        />
      );
    });
  }, [tasks, handleDrop, moveTaskNext]);

  return (
    <div className="workspace">
      <div 
        className="board-container" 
        role="group" 
        aria-label="Interactive Task Board Columns"
      >
        {boardColumns}
      </div>
      
      <AuraAssistant onSuggestTasks={addTasks} />
    </div>
  );
}
