'use client';

export default function TaskCard({ task, onMove }) {
  return (
    <article 
      className="task-card"
      draggable="true"
      aria-labelledby={`task-title-${task.id}`}
      aria-describedby={`task-desc-${task.id}`}
      tabIndex={0}
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
      }}
    >
      <div className="task-header">
        <span className="badge">{task.priority || 'Normal'}</span>
      </div>
      <h3 id={`task-title-${task.id}`}>{task.title}</h3>
      <p id={`task-desc-${task.id}`}>{task.description}</p>
      <div className="task-footer">
        <span>{task.assignee || 'Unassigned'}</span>
        {/* For accessibility, a button to move tasks instead of just drag/drop */}
        <button 
          className="move-btn sr-only"
          onClick={() => onMove(task.id)}
          aria-label={`Move ${task.title} to next column`}
        >
          Move
        </button>
      </div>
    </article>
  );
}
