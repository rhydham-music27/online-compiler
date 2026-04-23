import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Play, Eye } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

const Header = ({ languages, selectedLanguage, onLanguageChange, onExecute, loading, isWeb, onOpenAI }) => {
  return (
    <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'var(--grad-primary)', 
            padding: '6px', 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(94, 106, 210, 0.3)'
          }}>
            <Sparkles size={14} color="white" />
          </div>
          <h1 style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em' }}>Pro Compiler</h1>
        </div>
        <div style={{ 
          height: '14px', 
          width: '1px', 
          background: 'var(--border-subtle)',
          margin: '0 8px' 
        }} />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '450' }}>V2.5 Engine</span>
      </div>

      {/* CENTRE: AI Command Center */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenAI()}
          className="ai-summon-btn"
          style={{ 
            padding: '8px 24px', 
            borderRadius: '100px', 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontWeight: 800
          }}
        >
          <Sparkles size={14} className="glow-icon" />
          <span style={{ fontSize: '12px', letterSpacing: '0.05em' }}>ASK AI</span>
        </motion.button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CustomDropdown 
          options={languages}
          value={selectedLanguage}
          onChange={onLanguageChange}
        />

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExecute} 
          disabled={loading} 
          className="btn-premium"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : isWeb ? <Eye size={14} /> : <Play size={14} fill="currentColor" />}
          {isWeb ? 'Preview' : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Run</span>
              <span style={{ 
                fontSize: '9px', 
                opacity: 0.6, 
                padding: '2px 4px', 
                background: 'rgba(0,0,0,0.2)', 
                borderRadius: '3px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>^↵</span>
            </div>
          )}
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
