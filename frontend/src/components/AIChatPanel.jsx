import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Wand2, Terminal, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const AIChatPanel = ({ isOpen, onClose, currentCode, language, lastOutput, lastError }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I'm your Pro Compiler AI. I can help you debug, optimize, or explain your code. How can I assist you today?",
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
        language: language,
        output: lastOutput,
        error: lastError
      });

      setMessages([...newMessages, { 
        role: 'assistant', 
        content: response.data.reply,
        type: response.data.type || 'text'
      }]);
    } catch (err) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the AI engine. Please ensure the backend is running.",
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickAction = ({ icon: Icon, label, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02, background: 'rgba(94, 106, 210, 0.15)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="quick-action-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'var(--text-muted)',
        fontSize: '11px',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      <Icon size={12} color="var(--brand-primary)" />
      {label}
    </motion.button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="ai-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="ai-chat-container"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '450px',
              height: '100%',
              background: 'rgba(13, 14, 15, 0.95)',
              backdropFilter: 'blur(40px)',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '-20px 0 50px rgba(0,0,0,0.5)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'var(--brand-primary)',
                  padding: '8px',
                  borderRadius: '10px',
                  boxShadow: '0 0 20px rgba(94, 106, 210, 0.4)'
                }}>
                  <Sparkles size={18} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', color: 'white', fontWeight: 800 }}>AI Assistant</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em' }}>ONLINE</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: 'none', 
                padding: '8px', 
                borderRadius: '50%', 
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}>
                <X size={18} />
              </button>
            </div>

            {/* Chat Content */}
            <div 
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                scrollBehavior: 'smooth'
              }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '0 16px 16px 16px',
                    background: msg.role === 'user' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    color: 'white',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.content}
                  </div>
                  <span style={{ 
                    fontSize: '10px', 
                    color: 'var(--text-muted)', 
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    fontWeight: 600
                  }}>
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', padding: '12px' }}>
                  <div className="typing-dot" style={{ animationDelay: '0s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>

            {/* Footer / Input */}
            <div style={{
              padding: '24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                <QuickAction icon={Wand2} label="Fix Errors" onClick={() => handleSend("Can you find and fix the errors in my code?")} />
                <QuickAction icon={Terminal} label="Explain Code" onClick={() => handleSend("Explain how this code works step by step.")} />
                <QuickAction icon={CheckCircle2} label="Optimize" onClick={() => handleSend("Optimize this code for better time and space complexity.")} />
              </div>
              
              <div style={{ position: 'relative' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your code..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    paddingRight: '50px',
                    color: 'white',
                    fontSize: '13px',
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend()}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    bottom: '12px',
                    background: 'var(--brand-primary)',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(94, 106, 210, 0.3)'
                  }}
                >
                  <Send size={16} />
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
