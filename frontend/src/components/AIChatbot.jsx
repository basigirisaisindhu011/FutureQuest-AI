import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import api from '../utils/api';

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I'm Questy 🤖! You can ask me about games, story building, logic puzzles, or ask: 'What adventure should I try next?'" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg.text });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.response }]);
    } catch (e) {
      // Friendly fallback responses if chat backend isn't connected
      const lower = userMsg.text.toLowerCase();
      let reply = "Nice work! You're doing awesome exploring new games and activities!";
      if (lower.includes('next') || lower.includes('try') || lower.includes('game')) {
        reply = "Want to try another adventure? Spell Quest, Story Builder, and Code the Robot are super fun!";
      } else if (lower.includes('story') || lower.includes('word') || lower.includes('spell')) {
        reply = "You really enjoy solving word puzzles and creating stories!";
      } else if (lower.includes('tech') || lower.includes('code') || lower.includes('logic')) {
        reply = "You seem to enjoy solving logical and technology-based challenges!";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {isOpen ? (
        <div className="card animate-fade-in" style={{ width: '320px', height: '420px', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          {/* Header */}
          <div style={{ background: 'var(--color-primary)', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>🤖 Ask Questy</span>
            <button onClick={() => setIsOpen(false)} style={{ border: 'none', background: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? 'var(--color-primary)' : 'var(--bg-app)',
                  color: m.sender === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  fontSize: '13px',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-app)', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', fontStyle: 'italic' }}>
                Questy is typing...
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '6px 12px', borderTop: '1px solid var(--color-border)' }}>
            {["What game should I play?", "Tell me a word hint!", "What am I good at?"].map((s, i) => (
              <button 
                key={i} 
                onClick={() => selectSuggestion(s)}
                style={{ background: 'var(--bg-app)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '4px 8px', fontSize: '11px', whiteSpace: 'nowrap', cursor: 'pointer' }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={sendMessage} style={{ display: 'flex', padding: '8px', borderTop: '1px solid var(--color-border)', background: 'var(--bg-surface)' }}>
            <input 
              type="text" 
              className="form-input" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask Questy..."
              style={{ flex: 1, minHeight: '38px', padding: '8px', borderRadius: '18px' }}
            />
            <button className="btn btn-primary" type="submit" style={{ minWidth: '40px', minHeight: '38px', padding: '0', borderRadius: '50%', marginLeft: '6px' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          className="btn btn-primary" 
          onClick={() => setIsOpen(true)}
          style={{ width: '56px', height: '56px', borderRadius: '50%', padding: '0', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          🤖
        </button>
      )}
    </div>
  );
}
