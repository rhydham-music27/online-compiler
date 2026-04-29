import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Play, Eye, Sparkles } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

const Header = ({ languages, selectedLanguage, onLanguageChange, onExecute, loading, isWeb, onOpenAI }) => {
  return (
    <header className="header">
      {/* Left: Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Cursor orange wordmark dot */}
          <div style={{
            width: '22px',
            height: '22px',
            background: 'var(--color-primary)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L6 2L10 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 7.5h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '-0.3px',
            color: 'var(--color-ink)',
          }}>
            Pro<span style={{ color: 'var(--color-primary)' }}>Compiler</span>
          </span>
        </div>

        <div style={{ width: '1px', height: '16px', background: 'var(--color-hairline)' }} />

        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--color-muted)',
        }}>
          v2.5 Engine
        </span>
      </div>

      {/* Centre: AI Button */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenAI}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-hairline-strong)',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            height: '36px',
          }}
        >
          <Sparkles size={13} color="var(--color-primary)" />
          <span>Ask AI</span>
        </motion.button>
      </div>

      {/* Right: Language + Run */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <CustomDropdown
          options={languages}
          value={selectedLanguage}
          onChange={onLanguageChange}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExecute}
          disabled={loading}
          className="btn-primary"
          style={{ gap: '8px' }}
        >
          {loading
            ? <Loader2 size={13} className="animate-spin" />
            : isWeb
              ? <Eye size={13} />
              : <Play size={13} fill="currentColor" />
          }
          <span>{isWeb ? 'Preview' : 'Run'}</span>
          {!isWeb && (
            <span style={{
              fontSize: '10px',
              opacity: 0.7,
              fontFamily: 'var(--font-code)',
              background: 'rgba(255,255,255,0.15)',
              padding: '2px 5px',
              borderRadius: 'var(--radius-xs)',
            }}>
              ^↵
            </span>
          )}
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
