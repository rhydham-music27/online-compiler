import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const PreviewPanel = ({ code, languageId }) => {
  const previewDoc = useMemo(() => {
    if (languageId === 'html') {
      return code;
    }

    if (languageId === 'css') {
      // Provide a rich scaffold of demo HTML elements so the user's CSS
      // has real things to target — without any overriding inline styles.
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    /* User's CSS */
    ${code}
  </style>
</head>
<body>
  <!-- Demo scaffold — remove / modify freely -->
  <div class="container">
    <div class="card">
      <h1 class="title">Hello, CSS!</h1>
      <p class="text">Edit the CSS in the editor to style these elements.</p>
      <button class="btn">Click me</button>
    </div>
    <div class="card">
      <h2 class="subtitle">Another Card</h2>
      <p class="text">Use <code>.card</code>, <code>.btn</code>, <code>.title</code>, etc.</p>
    </div>
  </div>
</body>
</html>`;
    }

    return '';
  }, [code, languageId]);

  return (
    <motion.div
      key="web-preview"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="ide-panel"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={13} color="var(--color-muted)" />
          <span className="label-micro">Web View</span>
        </div>
      </div>

      {/* iframe */}
      <div style={{ flex: 1, borderTop: '1px solid var(--color-hairline-soft)' }}>
        <iframe
          title="preview"
          srcDoc={previewDoc}
          style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
          sandbox="allow-scripts"
        />
      </div>
    </motion.div>
  );
};

export default PreviewPanel;
