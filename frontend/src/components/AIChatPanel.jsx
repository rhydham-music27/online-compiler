import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Wand2, Terminal, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const AIChatPanel = ({ isOpen, onClose, currentCode, language, lastOutput, lastError }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your code AI. I can help you debug, optimize, or explain your code. How can I assist?",
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customPrompt = null) => {
    const text = customPrompt || input;
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/ai/chat', {
        message: text,
        code: currentCode,
        language,
        output: lastOutput,
        error: lastError,
      });
      setMessages([...newMessages, {
        role: 'assistant',
        content: response.data.reply,
        type: response.data.type || 'text',
      }]);
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: "I'm having trouble connecting to the AI engine. Please ensure the backend is running.",
        type: 'error',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cursor AI timeline stages shown as pills in the AI panel
  const aiStages = [
    { label: 'Thinking', cls: 'pill-thinking' },
    { label: 'Reading', cls: 'pill-read' },
    { label: 'Editing', cls: 'pill-edit' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="ai-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="ai-chat-container"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '440px',
              height: '100%',
              background: 'var(--color-surface-card)',
              borderLeft: '1px solid var(--color-hairline)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--color-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--color-canvas-soft)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Sparkles size={16} color="white" />
                </div>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.15px',
                  }}>
                    AI Assistant
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span className="status-dot success" />
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: 'var(--color-success)',
                    }}>
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn-ghost"
                style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* ── AI Timeline Pills (signature) ── */}
            <div style={{
              padding: '12px 24px',
              borderBottom: '1px solid var(--color-hairline-soft)',
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
            }}>
              {aiStages.map(s => (
                <span key={s.label} className={`timeline-pill ${s.cls}`}>
                  {s.label}
                </span>
              ))}
            </div>

            {/* ── Messages ── */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                scrollBehavior: 'smooth',
              }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user'
                      ? 'var(--radius-lg) var(--radius-lg) var(--radius-xs) var(--radius-lg)'
                      : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-xs)',
                    background: msg.role === 'user'
                      ? 'var(--color-primary)'
                      : 'var(--color-canvas-soft)',
                    border: msg.role === 'user'
                      ? 'none'
                      : '1px solid var(--color-hairline)',
                    color: msg.role === 'user' ? 'var(--color-on-primary)' : 'var(--color-ink)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.content}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '11px',
                    color: 'var(--color-muted)',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    fontWeight: 500,
                  }}>
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </motion.div>
              ))}

              {isLoading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '6px', padding: '10px 14px', background: 'var(--color-canvas-soft)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-lg)', width: 'fit-content' }}>
                  <div className="typing-dot" style={{ animationDelay: '0s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>

            {/* ── Footer / Input ── */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--color-hairline)',
              background: 'var(--color-canvas-soft)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {/* Quick actions */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
                <button className="quick-action-btn" onClick={() => handleSend("Can you find and fix the errors in my code?")}>
                  <Wand2 size={12} color="var(--color-primary)" />
                  Fix Errors
                </button>
                <button className="quick-action-btn" onClick={() => handleSend("Explain how this code works step by step.")}>
                  <Terminal size={12} color="var(--color-primary)" />
                  Explain
                </button>
                <button className="quick-action-btn" onClick={() => handleSend("Optimize this code for better time and space complexity.")}>
                  <CheckCircle2 size={12} color="var(--color-primary)" />
                  Optimize
                </button>
              </div>

              {/* Textarea */}
              <div style={{ position: 'relative' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your code…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '88px',
                    background: 'var(--color-surface-card)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    paddingRight: '48px',
                    color: 'var(--color-ink)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-hairline-strong)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-hairline)'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                    background: 'var(--color-primary)',
                    border: 'none',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-on-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
