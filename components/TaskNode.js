'use client';

import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * TaskNode Component
 * Represents a single draggable, keyboard-accessible task item on the board.
 * Optimized with React.memo to prevent re-renders when other tasks are modified.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.task - The task data object
 * @param {string} props.task.id - Unique ID
 * @param {string} props.task.title - Task title
 * @param {string} props.task.description - Task description
 * @param {string} props.task.status - Current column status
 * @param {string} [props.task.effort] - Estimated effort level
 * @param {string} [props.task.assignee] - Assigned team member or AI
 * @param {Function} props.onMove - Handler for keyboard movement
 * @returns {JSX.Element} The rendered task card
 */
const TaskNode = memo(function TaskNode({ task, onMove }) {
  /**
   * Initializes the HTML5 drag operation.
   * @param {DragEvent} e - The HTML drag start event
   */
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
    // Accessibility: announce drag start if a live region is set up
  };

  /**
   * Enables moving the task to the next column using the Enter or Space key.
   * @param {KeyboardEvent} e - The HTML keydown event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMove(task.id);
    }
  };

  return (
    <div 
      className="task-node"
      draggable="true"
      onDragStart={handleDragStart}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`${task.title}. ${task.description}. Status: ${task.status}. Press space to move to next column.`}
    >
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>
      <div className="task-meta">
        <span className="badge">{task.assignee || 'Unassigned'}</span>
        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Effort: {task.effort || 'N/A'}</span>
      </div>
      
      {/* Fallback for pure screen reader users without keyboard support on div */}
      <button 
        className="sr-only"
        onClick={() => onMove(task.id)}
        aria-label={`Move ${task.title} to next status`}
      >
        Move Task
      </button>
    </div>
  );
});

TaskNode.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    effort: PropTypes.string,
    assignee: PropTypes.string,
  }).isRequired,
  onMove: PropTypes.func.isRequired,
};

export default TaskNode;
