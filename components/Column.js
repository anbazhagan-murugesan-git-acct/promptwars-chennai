'use client';

import { memo } from 'react';
import TaskNode from './TaskNode';
import PropTypes from 'prop-types';

/**
 * Renders a single Kanban column containing a list of tasks.
 * Optimized with React.memo to prevent unnecessary re-renders during drag-and-drop.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.column - The column definition object
 * @param {string} props.column.id - Unique identifier for the column
 * @param {string} props.column.title - Display title for the column
 * @param {Array} props.tasks - Array of task objects currently in this column
 * @param {Function} props.onDrop - Handler for when a task is dropped into this column
 * @param {Function} props.onMove - Handler for moving a task via keyboard
 * @returns {JSX.Element} The rendered column component
 */
const Column = memo(function Column({ column, tasks, onDrop, onMove }) {
  return (
    <section 
      className="kanban-column glass-panel"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, column.id)}
      aria-labelledby={`col-title-${column.id}`}
      role="region"
    >
      <div className="column-header">
        <h2 id={`col-title-${column.id}`} className="column-title">
          {column.title}
        </h2>
        <span className="task-count" aria-label={`${tasks.length} tasks in ${column.title}`}>
          {tasks.length}
        </span>
      </div>
      
      <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map(task => (
          <TaskNode key={task.id} task={task} onMove={onMove} />
        ))}
      </div>
    </section>
  );
});

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDrop: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
};

export default Column;
