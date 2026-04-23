import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const PreviewPanel = ({ code, languageId }) => {
  const getPreviewDoc = () => {
    if (languageId === 'html') return code;
    if (languageId === 'css') return `<html><head><style>${code}</style></head><body><div class="card"></div><style>body{background:#08090a;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}.card{width:200px;height:140px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px;backdrop-filter:blur(10px);}</style></body></html>`;
    return '';
  };

  return (
    <motion.div key="web-preview" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="section-header" style={{ padding: '0 16px' }}>
        <Globe size={12} color="var(--brand-primary)" />
        <span className="label-micro" style={{ marginLeft: '8px' }}>Web View</span>
      </div>
      <div style={{ flex: 1, background: '#fff', borderTop: '1px solid var(--border-subtle)' }}>
        <iframe 
          title="preview"
          srcDoc={getPreviewDoc()}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </motion.div>
  );
};

export default PreviewPanel;
