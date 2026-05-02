'use client';

import { useState, useCallback } from 'react';
import TaskNode from './TaskNode';
import AuraAssistant from './AuraAssistant';

const INITIAL_TASKS = [
  { id: 't1', title: 'Architect Database', description: 'Design Firestore schema for real-time sync.', status: 'todo', effort: 'Medium', assignee: 'AI System' },
  { id: 't2', title: 'Implement Auth', description: 'Setup Firebase Authentication.', status: 'in-progress', effort: 'High', assignee: 'Security Team' }
];

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

export default function AuraBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleDrop = useCallback((e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  }, []);

  const handleMove = useCallback((taskId) => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;
      const task = prev[taskIndex];
      const currentStatusIndex = COLUMNS.findIndex(c => c.id === task.status);
      if (currentStatusIndex < COLUMNS.length - 1) {
        const newStatus = COLUMNS[currentStatusIndex + 1].id;
        const newTasks = [...prev];
        newTasks[taskIndex] = { ...task, status: newStatus };
        return newTasks;
      }
      return prev;
    });
  }, []);

  const handleAddAITasks = useCallback((newTasks) => {
    const formattedTasks = newTasks.map(t => ({
      ...t,
      id: `ai-${Math.random().toString(36).substr(2, 9)}`,
      status: 'todo',
      assignee: 'AI Generated'
    }));
    setTasks(prev => [...prev, ...formattedTasks]);
  }, []);

  return (
    <div className="workspace">
      <div className="board-container" role="region" aria-label="Task Board">
        {COLUMNS.map(column => (
          <section 
            key={column.id} 
            className="kanban-column glass-panel"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, column.id)}
            aria-labelledby={`col-title-${column.id}`}
          >
            <div className="column-header">
              <h2 id={`col-title-${column.id}`} className="column-title">
                {column.title}
              </h2>
              <span className="task-count">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            
            <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <TaskNode key={task.id} task={task} onMove={handleMove} />
                ))}
            </div>
          </section>
        ))}
      </div>
      
      <AuraAssistant onSuggestTasks={handleAddAITasks} />
    </div>
  );
}
