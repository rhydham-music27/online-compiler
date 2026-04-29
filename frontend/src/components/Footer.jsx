import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={11} color="var(--color-muted)" />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            color: 'var(--color-muted)',
            fontWeight: 400,
          }}>
            Cloud Compute Active
          </span>
        </div>
        <div style={{ width: '1px', height: '12px', background: 'var(--color-hairline)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={11} color="var(--color-muted)" />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            color: 'var(--color-muted)',
            fontWeight: 400,
          }}>
            Sandbox v2
          </span>
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--color-primary)',
          letterSpacing: '0.5px',
        }}>
          ProCompiler
        </span>
        <span style={{
          fontFamily: 'var(--font-code)',
          fontSize: '11px',
          color: 'var(--color-muted)',
        }}>
          UTF-8
        </span>
      </div>
    </footer>
  );
};

export default Footer;
