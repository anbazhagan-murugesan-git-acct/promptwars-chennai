import React from 'react';
import { render, screen } from '@testing-library/react';
import Column from '../components/Column';

describe('Column Component', () => {
  const mockColumn = { id: 'todo', title: 'To Do' };
  const mockTasks = [
    { id: 't1', title: 'Task 1', description: 'Desc 1', status: 'todo', effort: 'Low', assignee: 'Dev' },
  ];
  const mockOnDrop = jest.fn();
  const mockOnMove = jest.fn();

  test('renders column title correctly', () => {
    render(<Column column={mockColumn} tasks={mockTasks} onDrop={mockOnDrop} onMove={mockOnMove} />);
    expect(screen.getByRole('heading', { name: /To Do/i })).toBeInTheDocument();
  });

  test('displays correct task count', () => {
    render(<Column column={mockColumn} tasks={mockTasks} onDrop={mockOnDrop} onMove={mockOnMove} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('renders empty column without crashing', () => {
    render(<Column column={mockColumn} tasks={[]} onDrop={mockOnDrop} onMove={mockOnMove} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('has proper accessibility labelling', () => {
    render(<Column column={mockColumn} tasks={mockTasks} onDrop={mockOnDrop} onMove={mockOnMove} />);
    const section = screen.getByLabelText(/1 tasks in To Do/i);
    expect(section).toBeInTheDocument();
  });
});
