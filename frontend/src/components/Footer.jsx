import React from 'react';
import { Cpu, ShieldCheck, Layout } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer" style={{ display: 'flex', alignItems: 'center', height: '32px', background: 'rgba(8,9,10,0.5)', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={11} color="var(--text-dim)" />
          <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '500' }}>Cloud-Compute Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={11} color="var(--text-dim)" />
          <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '500' }}>Sandbox V2</span>
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '10px', color: 'var(--brand-primary)', fontWeight: '700', letterSpacing: '0.1em' }}>PRECISION STACK</span>
        <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>UTF-8 Ready</span>
      </div>
    </footer>
  );
};

export default Footer;
