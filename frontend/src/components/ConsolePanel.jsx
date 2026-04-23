import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Zap, HardDrive, BarChart3, ChevronDown, ChevronUp, BrainCircuit, Cpu, Layers } from 'lucide-react';
import ComplexityGraph from './ComplexityGraph';

const ConsolePanel = ({ inputData, onInputChange, output, stderr, status, latency, executionTime, memory, samples, complexity, history }) => {
  const [activeTab, setActiveTab] = useState('output'); // 'output' or 'history'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card terminal-deck" 
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* 1. Global Header */}
      <div className="section-header" style={{ 
        justifyContent: 'space-between', 
        padding: '0 20px', 
        height: '48px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Layers size={14} color="var(--brand-primary)" />
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { id: 'output', label: 'TERMINAL' },
              { id: 'history', label: `HISTORY (${history?.length || 0})` },
              { id: 'profiler', label: 'PROFILER' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-muted)',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  padding: '12px 0'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      height: '2px', 
                      background: 'var(--grad-primary)',
                      boxShadow: '0 0 10px rgba(94, 106, 210, 0.4)'
                    }} 
                  />
                )}
              </button>
            ))}
          </div>
          
          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="complexity-badge"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: 'rgba(94, 106, 210, 0.2)', 
                  padding: '4px 12px', 
                  borderRadius: '100px',
                  border: '1px solid rgba(94, 106, 210, 0.4)',
                  marginLeft: '12px'
                }}
              >
                <BrainCircuit size={12} color="var(--brand-primary)" />
                <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--brand-primary)' }}>{complexity}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
            <HardDrive size={12} color="var(--text-muted)" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>{memory} MB</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
            <Zap size={12} color="var(--text-muted)" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>{executionTime} ms</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <AnimatePresence mode="wait">
          {activeTab === 'output' && (
            <motion.div 
              key="output-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              {/* Vertical Partitions */}
              <div style={{ height: '140px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)' }}>
                  <Cpu size={11} color="var(--text-muted)" />
                  <span className="label-micro" style={{ opacity: 0.5 }}>INPUT_STREAMS</span>
                </div>
                <textarea 
                  className="glass-input" 
                  placeholder="Provide execution data..." 
                  value={inputData} 
                  onChange={(e) => onInputChange(e.target.value)}
                  style={{ 
                    width: '100%', 
                    flex: 1, 
                    padding: '16px 20px',
                    fontSize: '13px',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--brand-primary)',
                    background: 'transparent'
                  }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <Terminal size={11} color="var(--text-muted)" />
                  <span className="label-micro" style={{ opacity: 0.5 }}>TERMINAL_OUTPUT</span>
                </div>
                
                <div className="terminal-output-container" style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(94,106,210,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div className="terminal-body" style={{ padding: '20px' }}>
                    {output && (
                      <motion.pre 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        style={{ color: '#f7f8f8', margin: 0, whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.7', fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {output}
                      </motion.pre>
                    )}
                    {stderr && (
                      <motion.pre 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        style={{ color: '#ff4d4d', margin: '12px 0 0 0', whiteSpace: 'pre-wrap', fontSize: '13px', background: 'rgba(255,77,77,0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,77,77,0.1)' }}
                      >
                        {stderr}
                      </motion.pre>
                    )}
                    {!output && !stderr && (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', opacity: 0.2, marginTop: '40px' }}>
                        <Terminal size={32} strokeWidth={1} />
                        <span style={{ fontSize: '11px', letterSpacing: '0.2em' }}>READY FOR PROCESS</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ flex: 1, padding: '24px', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history?.length > 0 ? (
                  [...history].reverse().map((run, idx) => (
                    <div 
                      key={run.id} 
                      className="glass-card" 
                      style={{ 
                        padding: '16px', 
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          background: 'var(--grad-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 10px rgba(94, 106, 210, 0.3)'
                        }}>
                          #{history.length - idx}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Execution Snapshot</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(run.id).toLocaleTimeString()}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Time</div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)' }}>{run.time} ms</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Memory</div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)' }}>{run.memory} MB</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', opacity: 0.3, marginTop: '60px' }}>
                    <Activity size={48} style={{ marginBottom: '16px' }} />
                    <p>No execution history available yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'profiler' && (
            <motion.div 
              key="profiler-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              style={{ flex: 1, padding: '24px', overflowY: 'auto' }}
            >
              <ComplexityGraph samples={samples} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default ConsolePanel;
