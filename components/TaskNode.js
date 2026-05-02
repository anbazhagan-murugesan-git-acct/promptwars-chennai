'use client';

export default function TaskNode({ task, onMove }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMove(task.id);
    }
  };

  return (
    <article 
      className="task-node"
      draggable="true"
      onDragStart={handleDragStart}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`${task.title}. ${task.description}. Currently in ${task.status}. Press space to move to next status.`}
    >
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>
      <div className="task-meta">
        <span className="badge">{task.assignee || 'Unassigned'}</span>
        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Effort: {task.effort || 'N/A'}</span>
      </div>
      
      {/* Fallback for pure screen reader users without keyboard support on div */}
      <button 
        style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}
        onClick={() => onMove(task.id)}
        aria-label={`Move ${task.title} to next column`}
      >
        Move Task
      </button>
    </article>
  );
}
