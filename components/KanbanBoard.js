'use client';

import { useState } from 'react';
import TaskCard from './TaskCard';

const INITIAL_TASKS = [
  { id: '1', title: 'Setup Authentication', description: 'Integrate Firebase auth', status: 'todo', priority: 'High' },
  { id: '2', title: 'Design Database', description: 'Design Firestore schemas', status: 'in-progress', priority: 'High' },
  { id: '3', title: 'Initialize Project', description: 'Setup Next.js boilerplate', status: 'done', priority: 'Medium' }
];

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleMove = (taskId) => {
    // Basic accessibility move logic
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    const task = tasks[taskIndex];
    const currentStatusIndex = COLUMNS.findIndex(c => c.id === task.status);
    if (currentStatusIndex < COLUMNS.length - 1) {
      const newStatus = COLUMNS[currentStatusIndex + 1].id;
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  return (
    <div className="kanban-board" role="region" aria-label="Kanban Board">
      {COLUMNS.map(column => (
        <section 
          key={column.id} 
          className="kanban-column glass-panel"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, column.id)}
          aria-labelledby={`col-title-${column.id}`}
        >
          <h2 id={`col-title-${column.id}`}>
            {column.title}
            <span className="task-count">
              {tasks.filter(t => t.status === column.id).length}
            </span>
          </h2>
          
          <div className="task-list">
            {tasks
              .filter(task => task.status === column.id)
              .map(task => (
                <TaskCard key={task.id} task={task} onMove={handleMove} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
