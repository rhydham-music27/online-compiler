import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Info, Settings, X, Command, Sparkles, History as HistoryIcon, Clock, Zap, HardDrive, ChevronDown, ChevronUp } from 'lucide-react';

const RightSidebar = ({ onOpenAI, history, onRestoreCode }) => {
  const [activePanel, setActivePanel] = useState(null); // 'shortcuts', 'history', etc.
  const [expandedRun, setExpandedRun] = useState(null);

  const shortcuts = [
    { keys: ['Ctrl', 'Enter'], action: 'Execute Code' },
    { keys: ['Ctrl', 'S'], action: 'Execute Code' },
    { keys: ['Ctrl', 'L'], action: 'Clear Terminal' },
    { keys: ['Alt', 'P'], action: 'Toggle Web Preview' },
  ];

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {/* 1. Thin Utility Bar */}
      <aside className="utility-bar">
        <button 
          className="utility-btn"
          onClick={onOpenAI}
          title="Ask AI Assistant"
          style={{ color: 'var(--brand-primary)' }}
        >
          <Sparkles size={20} className="glow-icon" />
        </button>
        <button 
          className={`utility-btn ${activePanel === 'history' ? 'active' : ''}`}
          onClick={() => setActivePanel(activePanel === 'history' ? null : 'history')}
          title="Execution History"
        >
          <HistoryIcon size={20} />
        </button>
        <button 
          className={`utility-btn ${activePanel === 'shortcuts' ? 'active' : ''}`}
          onClick={() => setActivePanel(activePanel === 'shortcuts' ? null : 'shortcuts')}
          title="Keyboard Shortcuts"
        >
          <Keyboard size={20} />
        </button>
        <button className="utility-btn" title="Settings">
          <Settings size={20} />
        </button>
        <button className="utility-btn" title="Project Info">
          <Info size={20} />
        </button>
      </aside>

      {/* 2. Slide-out Panels */}
      <AnimatePresence>
        {activePanel === 'shortcuts' && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="shortcuts-panel glass-card"
          >
            <div className="section-header" style={{ justifyContent: 'space-between', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Command size={14} color="var(--brand-primary)" />
                <span className="label-micro">Shortcuts</span>
              </div>
              <button onClick={() => setActivePanel(null)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={14} />
              </button>
            </div>

            <div className="shortcuts-list">
              {shortcuts.map((s, idx) => (
                <div key={idx} className="shortcut-item">
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{s.action}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {s.keys.map((key, kIdx) => (
                      <kbd key={kIdx} className="kbd-tag">{key}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activePanel === 'history' && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="shortcuts-panel glass-card"
            style={{ width: '360px' }}
          >
            <div className="section-header" style={{ justifyContent: 'space-between', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HistoryIcon size={14} color="var(--brand-primary)" />
                <span className="label-micro">Output + Analytics</span>
              </div>
              <button onClick={() => setActivePanel(null)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }} className="no-scrollbar">
              {history?.length > 0 ? (
                [...history].reverse().map((run, idx) => (
                  <div 
                    key={run.id} 
                    style={{ 
                      padding: '12px', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '10px',
                      border: `1px solid ${expandedRun === run.id ? 'rgba(94, 106, 210, 0.4)' : 'rgba(255,255,255,0.05)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expandedRun === run.id ? '12px' : '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>RUN #{history.length - idx}</span>
                        <div style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {run.language}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(run.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        {expandedRun === run.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Zap size={10} color="var(--brand-primary)" />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{run.time}ms</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <HardDrive size={10} color="var(--brand-primary)" />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{run.memory}MB</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedRun === run.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', marginTop: '12px' }}
                        >
                          <div style={{ 
                            background: '#08090a', 
                            padding: '12px', 
                            borderRadius: '6px', 
                            fontSize: '11px', 
                            fontFamily: "'JetBrains Mono', monospace",
                            border: '1px solid rgba(255,255,255,0.05)',
                            maxHeight: '150px',
                            overflowY: 'auto'
                          }}>
                            {run.stdout && <div style={{ color: '#f7f8f8', whiteSpace: 'pre-wrap' }}>{run.stdout}</div>}
                            {run.stderr && <div style={{ color: '#ff4d4d', whiteSpace: 'pre-wrap', marginTop: run.stdout ? '8px' : '0' }}>{run.stderr}</div>}
                            {!run.stdout && !run.stderr && <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No terminal output</div>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.3 }}>
                  <HistoryIcon size={32} style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '12px' }}>No history yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightSidebar;
