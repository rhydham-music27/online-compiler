import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Activity, Zap, HardDrive, BarChart3,
  BrainCircuit, Cpu, Layers
} from 'lucide-react';
import ComplexityGraph from './ComplexityGraph';

const ConsolePanel = ({ inputData, onInputChange, output, stderr, status, latency, executionTime, memory, samples, complexity, history }) => {
  const [activeTab, setActiveTab] = useState('output');

  const tabs = [
    { id: 'output', label: 'Terminal' },
    { id: 'history', label: `History (${history?.length || 0})` },
    { id: 'profiler', label: 'Profiler' },
  ];

  const statusMap = {
    success: { cls: 'success', label: 'Success' },
    error:   { cls: 'error',   label: 'Error' },
    running: { cls: 'running', label: 'Running' },
    idle:    { cls: 'idle',    label: 'Ready' },
  };
  const st = statusMap[status] || statusMap.idle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="ide-panel"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* ── Panel Header ── */}
      <div className="panel-header" style={{ height: '48px', padding: '0 20px', gap: '16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', height: '100%', alignItems: 'stretch' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                borderBottom: 'none',
                color: activeTab === tab.id ? 'var(--color-ink)' : 'var(--color-muted)',
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                padding: '0 12px',
                transition: 'color 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="consoletab"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '12px',
                    right: '12px',
                    height: '2px',
                    background: 'var(--color-primary)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right: status + metrics */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Status pill */}
          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className={`status-dot ${st.cls}`} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--color-body)', fontWeight: 500 }}>
                  {st.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complexity badge */}
          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="badge-pill"
                style={{ gap: '5px' }}
              >
                <BrainCircuit size={10} color="var(--color-primary)" />
                {complexity}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Memory */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <HardDrive size={11} color="var(--color-muted)" />
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--color-body)' }}>
              {memory} MB
            </span>
          </div>

          {/* Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Zap size={11} color="var(--color-muted)" />
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--color-body)' }}>
              {executionTime} ms
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">

          {/* OUTPUT TAB */}
          {activeTab === 'output' && (
            <motion.div
              key="output"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              {/* stdin */}
              <div style={{
                height: '120px',
                borderBottom: '1px solid var(--color-hairline)',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-canvas-soft)',
              }}>
                <div style={{
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: '1px solid var(--color-hairline-soft)',
                }}>
                  <Cpu size={11} color="var(--color-muted)" />
                  <span className="label-micro">stdin</span>
                </div>
                <textarea
                  className="glass-input"
                  placeholder="Provide stdin input..."
                  value={inputData}
                  onChange={(e) => onInputChange(e.target.value)}
                  style={{ width: '100%', flex: 1, padding: '12px 20px', color: 'var(--color-ink)' }}
                />
              </div>

              {/* stdout / stderr */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: '1px solid var(--color-hairline-soft)',
                  background: 'var(--color-canvas-soft)',
                }}>
                  <Terminal size={11} color="var(--color-muted)" />
                  <span className="label-micro">stdout</span>
                </div>

                <div
                  className="terminal-output-container"
                  style={{ flex: 1, overflowY: 'auto', padding: '20px' }}
                >
                  {output && (
                    <motion.pre
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        color: 'var(--color-ink)',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'var(--font-code)',
                        fontSize: '13px',
                        lineHeight: '1.6',
                      }}
                    >
                      {output}
                    </motion.pre>
                  )}

                  {stderr && (
                    <motion.pre
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        color: 'var(--color-error)',
                        margin: output ? '16px 0 0 0' : 0,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'var(--font-code)',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        background: 'rgba(207, 45, 86, 0.05)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(207, 45, 86, 0.15)',
                      }}
                    >
                      {stderr}
                    </motion.pre>
                  )}

                  {!output && !stderr && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      marginTop: '40px',
                      opacity: 0.3,
                    }}>
                      <Terminal size={28} strokeWidth={1.5} color="var(--color-muted)" />
                      <span style={{
                        fontFamily: 'var(--font-code)',
                        fontSize: '12px',
                        color: 'var(--color-muted)',
                        letterSpacing: '0.05em',
                      }}>
                        Ready to run
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ flex: 1, padding: '20px', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history?.length > 0 ? (
                  [...history].reverse().map((run, idx) => (
                    <div
                      key={run.id}
                      style={{
                        padding: '14px 16px',
                        background: 'var(--color-surface-card)',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-canvas-soft)',
                          border: '1px solid var(--color-hairline)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-code)',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--color-muted)',
                        }}>
                          #{history.length - idx}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                            Execution Snapshot
                          </div>
                          <div style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
                            {new Date(run.id).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--color-muted)' }}>Time</div>
                          <div style={{ fontFamily: 'var(--font-code)', fontSize: '12px', fontWeight: 600, color: 'var(--color-ink)' }}>
                            {run.time} ms
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--color-muted)' }}>Memory</div>
                          <div style={{ fontFamily: 'var(--font-code)', fontSize: '12px', fontWeight: 600, color: 'var(--color-ink)' }}>
                            {run.memory} MB
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', opacity: 0.35, marginTop: '48px' }}>
                    <Activity size={36} strokeWidth={1.5} color="var(--color-muted)" style={{ marginBottom: '12px' }} />
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--color-muted)' }}>
                      No execution history yet.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PROFILER TAB */}
          {activeTab === 'profiler' && (
            <motion.div
              key="profiler"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ flex: 1, padding: '20px', overflowY: 'auto' }}
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
