import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ComplexityGraph = ({ data, type, label }) => {
  const isMemory = type === 'memory';
  const color = '#7170ff'; // Unified Brand Purple
  const unit = 'MB';

  if (!data || data.length === 0) {
    return (
      <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>INITIALIZING TELEMETRY...</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'rgba(15, 16, 17, 0.8)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(113, 112, 255, 0.3)',
          padding: '10px 14px',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>TIMESTAMP: {payload[0].payload.t}ms</p>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#fff' }}>{payload[0].value} <span style={{ fontSize: '10px', opacity: 0.5 }}>MB</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ height: '220px', width: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-end' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-main)' }}>{label}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: 'var(--text-muted)' }}>REAL-TIME MEMORY FREQUENCY ANALYSIS</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '18px', fontWeight: 900, color: color, display: 'block' }}>{data[data.length-1].m} <span style={{ fontSize: '10px', opacity: 0.5 }}>MB</span></span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>CURRENT RSS</span>
        </div>
      </div>

      <div style={{ height: '140px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(255,255,255,0.03)" 
            />
            <XAxis 
              dataKey="t" 
              hide
            />
            <YAxis 
              hide
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(113, 112, 255, 0.2)', strokeWidth: 2 }} />
            <Area 
              type="monotone" 
              dataKey="m" 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPulse)" 
              animationDuration={1500}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ComplexityGraph;
