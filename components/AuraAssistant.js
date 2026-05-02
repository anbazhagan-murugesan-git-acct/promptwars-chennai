'use client';

import { useState } from 'react';

export default function AuraAssistant({ onSuggestTasks }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    { role: 'ai', text: 'I am your Gemini Agile Coach. Describe a high-level goal, and I will break it down into actionable tasks for the board.' }
  ]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

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

      const data = await res.json();
      
      if (data.tasks && data.tasks.length > 0) {
        setConversation(prev => [...prev, { 
          role: 'ai', 
          text: `I've analyzed that and created ${data.tasks.length} sub-tasks. I'll add them to the board.` 
        }]);
        onSuggestTasks(data.tasks);
      } else {
        setConversation(prev => [...prev, { 
          role: 'ai', 
          text: data.reply || "I couldn't generate specific tasks from that. Could you provide more details?" 
        }]);
      }
    } catch (error) {
      setConversation(prev => [...prev, { role: 'ai', text: 'Connection error to Gemini API.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="assistant-panel glass-panel" aria-label="AI Agile Coach">
      <h2 className="assistant-header">Gemini Coach</h2>
      
      <div className="chat-area" aria-live="polite">
        {conversation.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-bubble ai">Thinking...</div>}
      </div>

      <div className="input-area">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g., 'We need to build a secure login page'"
          aria-label="Message to Gemini Coach"
        />
        <button onClick={handleSend} className="btn-icon" aria-label="Send message" disabled={loading}>
          ➤
        </button>
      </div>
    </section>
  );
}
