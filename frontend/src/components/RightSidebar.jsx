import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard, Info, Settings, X, Command, Sparkles,
  History as HistoryIcon, Clock, Zap, HardDrive,
  ChevronDown, ChevronUp
} from 'lucide-react';

const RightSidebar = ({ onOpenAI, history }) => {
  const [activePanel, setActivePanel] = useState(null);
  const [expandedRun, setExpandedRun] = useState(null);

  const shortcuts = [
    { keys: ['Ctrl', '↵'], action: 'Execute Code' },
    { keys: ['Ctrl', 'S'], action: 'Execute Code' },
    { keys: ['Ctrl', 'L'], action: 'Clear Terminal' },
    { keys: ['Alt', 'P'], action: 'Toggle Preview' },
    { keys: ['Esc'], action: 'Reset Status' },
  ];

  const toggle = (id) => setActivePanel(activePanel === id ? null : id);

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {/* ── Utility Bar ── */}
      <aside className="utility-bar">
        {/* AI */}
        <button
          className="utility-btn"
          onClick={onOpenAI}
          title="Ask AI Assistant"
          style={{ color: 'var(--color-primary)' }}
        >
          <Sparkles size={18} />
        </button>

        {/* Divider */}
        <div style={{ width: '24px', height: '1px', background: 'var(--color-hairline)', margin: '2px 0' }} />

        {/* History */}
        <button
          className={`utility-btn ${activePanel === 'history' ? 'active' : ''}`}
          onClick={() => toggle('history')}
          title="Execution History"
        >
          <HistoryIcon size={18} />
        </button>

        {/* Shortcuts */}
        <button
          className={`utility-btn ${activePanel === 'shortcuts' ? 'active' : ''}`}
          onClick={() => toggle('shortcuts')}
          title="Keyboard Shortcuts"
        >
          <Keyboard size={18} />
        </button>

        {/* Settings */}
        <button className="utility-btn" title="Settings">
          <Settings size={18} />
        </button>

        {/* Info */}
        <button className="utility-btn" title="Project Info">
          <Info size={18} />
        </button>
      </aside>

      {/* ── Slide-out Panels ── */}
      <AnimatePresence>

        {/* Shortcuts */}
        {activePanel === 'shortcuts' && (
          <motion.div
            key="shortcuts"
            initial={{ opacity: 0, x: 16, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="shortcuts-panel"
          >
            {/* Header */}
            <div className="panel-header" style={{ justifyContent: 'space-between', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Command size={13} color="var(--color-muted)" />
                <span className="label-micro">Shortcuts</span>
              </div>
              <button onClick={() => setActivePanel(null)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={13} />
              </button>
            </div>

            <div className="shortcuts-list">
              {shortcuts.map((s, idx) => (
                <div key={idx} className="shortcut-item">
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    color: 'var(--color-body)',
                  }}>
                    {s.action}
                  </span>
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

        {/* History */}
        {activePanel === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 16, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="shortcuts-panel"
            style={{ width: '340px' }}
          >
            {/* Header */}
            <div className="panel-header" style={{ justifyContent: 'space-between', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HistoryIcon size={13} color="var(--color-muted)" />
                <span className="label-micro">Run History</span>
              </div>
              <button onClick={() => setActivePanel(null)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={13} />
              </button>
            </div>

            <div
              style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 120px)',
              }}
              className="no-scrollbar"
            >
              {history?.length > 0 ? (
                [...history].reverse().map((run, idx) => (
                  <div
                    key={run.id}
                    style={{
                      padding: '12px',
                      background: 'var(--color-surface-card)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${expandedRun === run.id ? 'var(--color-primary)' : 'var(--color-hairline)'}`,
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: expandedRun === run.id ? '10px' : 0,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontFamily: 'var(--font-code)',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--color-muted)',
                        }}>
                          Run #{history.length - idx}
                        </span>
                        <span className="badge-pill" style={{ fontSize: '9px', padding: '2px 7px', letterSpacing: '0.5px' }}>
                          {run.language}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-code)', fontSize: '10px', color: 'var(--color-muted)' }}>
                          {new Date(run.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {expandedRun === run.id
                          ? <ChevronUp size={11} color="var(--color-muted)" />
                          : <ChevronDown size={11} color="var(--color-muted)" />
                        }
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Zap size={10} color="var(--color-primary)" />
                        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--color-ink)', fontWeight: 600 }}>
                          {run.time}ms
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <HardDrive size={10} color="var(--color-primary)" />
                        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--color-ink)', fontWeight: 600 }}>
                          {run.memory}MB
                        </span>
                      </div>
                    </div>

                    {/* Expanded Output */}
                    <AnimatePresence>
                      {expandedRun === run.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          style={{ overflow: 'hidden', marginTop: '10px' }}
                        >
                          <div style={{
                            background: 'var(--color-canvas-soft)',
                            border: '1px solid var(--color-hairline)',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'var(--font-code)',
                            fontSize: '11px',
                            maxHeight: '140px',
                            overflowY: 'auto',
                          }}>
                            {run.stdout && (
                              <div style={{ color: 'var(--color-ink)', whiteSpace: 'pre-wrap' }}>
                                {run.stdout}
                              </div>
                            )}
                            {run.stderr && (
                              <div style={{ color: 'var(--color-error)', whiteSpace: 'pre-wrap', marginTop: run.stdout ? '8px' : 0 }}>
                                {run.stderr}
                              </div>
                            )}
                            {!run.stdout && !run.stderr && (
                              <div style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
                                No output
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.35 }}>
                  <HistoryIcon size={28} strokeWidth={1.5} color="var(--color-muted)" style={{ marginBottom: '10px' }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--color-muted)' }}>
                    No history yet
                  </p>
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
