'use client';

import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

/**
 * AuraAssistant Component
 * An embedded AI chat interface that interfaces with the Google Gemini API
 * to break down complex goals into actionable sprint tasks.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSuggestTasks - Callback function to add generated tasks to the board
 * @returns {JSX.Element} The rendered AI assistant panel
 */
const AuraAssistant = memo(function AuraAssistant({ onSuggestTasks }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    { role: 'ai', text: 'I am your Gemini Agile Coach. Describe a high-level goal, and I will break it down into actionable tasks for the board.' }
  ]);

  /**
   * Handles sending the user's prompt to the Next.js API route securely.
   */
  const handleSend = useCallback(async () => {
    // Security/Efficiency: Prevent empty submissions or spam clicks
    if (!input.trim() || loading) return;

    // Security: Basic client-side sanitization check (e.g., length limit)
    if (input.length > 500) {
      setConversation(prev => [...prev, { role: 'ai', text: 'Prompt is too long. Please summarize your goal.' }]);
      return;
    }

    const userText = input;
    setInput('');
    setConversation(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });

      // Security: Handle non-200 responses gracefully
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      
      if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
        setConversation(prev => [...prev, { 
          role: 'ai', 
          text: `I've analyzed that and created ${data.tasks.length} sub-tasks. I've added them to the board.` 
        }]);
        onSuggestTasks(data.tasks);
      } else {
        setConversation(prev => [...prev, { 
          role: 'ai', 
          text: data.reply || "I couldn't generate specific tasks from that. Could you provide more details?" 
        }]);
      }
    } catch (error) {
      console.error('Assistant Error:', error);
      setConversation(prev => [...prev, { role: 'ai', text: 'A network or API error occurred. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, onSuggestTasks]);

  return (
    <section className="assistant-panel glass-panel" aria-label="AI Agile Coach">
      <h2 className="assistant-header">Gemini Coach</h2>
      
      <div 
        className="chat-area" 
        aria-live="polite" 
        aria-relevant="additions"
        role="log"
      >
        {conversation.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-bubble ai" aria-label="AI is thinking">Thinking...</div>}
      </div>

      <div className="input-area">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g., 'We need to build a secure login page'"
          aria-label="Message to Gemini Coach"
          disabled={loading}
          maxLength={500}
        />
        <button 
          onClick={handleSend} 
          className="btn-icon" 
          aria-label="Send message to AI" 
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </div>
    </section>
  );
});

AuraAssistant.propTypes = {
  onSuggestTasks: PropTypes.func.isRequired,
};

export default AuraAssistant;
