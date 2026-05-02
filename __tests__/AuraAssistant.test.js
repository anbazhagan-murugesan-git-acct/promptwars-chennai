import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuraAssistant from '../components/AuraAssistant';

// Mock fetch for the API route
global.fetch = jest.fn();

describe('AuraAssistant Edge Cases and Integration', () => {
  const mockOnSuggestTasks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('prevents submission of empty or whitespace-only prompts (Security & Quality Edge Case)', async () => {
    render(<AuraAssistant onSuggestTasks={mockOnSuggestTasks} />);
    
    const input = screen.getByPlaceholderText(/e.g., 'We need to build a secure login page'/i);
    const button = screen.getByRole('button', { name: /send message to ai/i });

    // Try empty string
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);
    expect(global.fetch).not.toHaveBeenCalled();

    // Try whitespace
    fireEvent.change(input, { target: { value: '    ' } });
    fireEvent.click(button);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('handles malformed API responses gracefully (Integration Edge Case)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: "Fallback message", tasks: [] })
    });

    render(<AuraAssistant onSuggestTasks={mockOnSuggestTasks} />);
    
    const input = screen.getByPlaceholderText(/We need to build/i);
    const button = screen.getByRole('button', { name: /send message to ai/i });

    fireEvent.change(input, { target: { value: 'Valid prompt' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Fallback message")).toBeInTheDocument();
      expect(mockOnSuggestTasks).not.toHaveBeenCalled();
    });
  });

  test('handles 500 Server Errors securely without crashing (Security Flow)', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network Failure'));

    render(<AuraAssistant onSuggestTasks={mockOnSuggestTasks} />);
    
    const input = screen.getByPlaceholderText(/We need to build/i);
    fireEvent.change(input, { target: { value: 'Valid prompt' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('A network or API error occurred. Please try again.')).toBeInTheDocument();
    });
  });

  test('successfully parses and lifts tasks on valid AI generation (Happy Path Integration)', async () => {
    const mockTasks = [
      { title: 'Test 1', description: 'Desc 1', effort: 'Low' }
    ];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: mockTasks })
    });

    render(<AuraAssistant onSuggestTasks={mockOnSuggestTasks} />);
    
    fireEvent.change(screen.getByPlaceholderText(/We need to build/i), { target: { value: 'Build login' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockOnSuggestTasks).toHaveBeenCalledWith(mockTasks);
      expect(screen.getByText(/I've analyzed that and created 1 sub-tasks/i)).toBeInTheDocument();
    });
  });
});
