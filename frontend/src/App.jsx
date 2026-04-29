import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header';
import EditorPanel from './components/EditorPanel';
import ConsolePanel from './components/ConsolePanel';
import PreviewPanel from './components/PreviewPanel';
import AIChatPanel from './components/AIChatPanel';
import Footer from './components/Footer';
import RightSidebar from './components/RightSidebar';

const API_URL = 'http://127.0.0.1:8000';

const LANGUAGES = [
  { id: 'python', name: 'Python 3', defaultCode: 'def magic():\n    print("🔮 Deep Glassmorphism Activated")\n    print("✨ Performance: Optimized")\n\nmagic()' },
  { id: 'cpp', name: 'C++ (G++)', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "🔮 Deep Glassmorphism Activated" << std::endl;\n    return 0;\n}' },
  { id: 'java', name: 'Java 17', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("🔮 Java Glassmorphism Active");\n    }\n}' },
  { id: 'javascript', name: 'JavaScript (Node)', defaultCode: 'console.log("🔮 JavaScript Glassmorphism Active");\nconsole.log("Node.js Runtime: " + process.version);' },
  { id: 'html', name: 'HTML5', defaultCode: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { background: #08090a; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }\n  .box { padding: 40px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); border-radius: 20px; box-shadow: 0 0 40px rgba(94, 106, 210, 0.4); }\n</style>\n</head>\n<body>\n  <div class="box">\n    <h1>🔮 HTML Preview</h1>\n    <p>Live from Pro Compiler v2.5</p>\n  </div>\n</body>\n</html>' },
  { id: 'css', name: 'Pure CSS', defaultCode: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f4;
  font-family: system-ui, sans-serif;
}

.container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 40px;
}

.card {
  background: #ffffff;
  border: 1px solid #e6e5e0;
  border-radius: 12px;
  padding: 28px 32px;
  max-width: 300px;
}

.title {
  font-size: 22px;
  font-weight: 400;
  color: #26251e;
  margin: 0 0 12px;
  letter-spacing: -0.3px;
}

.subtitle {
  font-size: 18px;
  font-weight: 400;
  color: #26251e;
  margin: 0 0 12px;
}

.text {
  font-size: 14px;
  color: #5a5852;
  line-height: 1.6;
  margin: 0 0 20px;
}

code {
  font-family: monospace;
  font-size: 13px;
  background: #f7f7f4;
  padding: 2px 6px;
  border-radius: 4px;
  color: #f54e00;
}

.btn {
  background: #f54e00;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn:hover {
  background: #d04200;
}` },
];

function App() {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(language.defaultCode);
  const [inputData, setInputData] = useState('');
  const [output, setOutput] = useState('');
  const [stderr, setStderr] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [latency, setLatency] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [currentSamples, setCurrentSamples] = useState([]);
  const [complexity, setComplexity] = useState('O(1)');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const isWeb = ['html', 'css'].includes(language.id);

  // Keyboard Shortcuts (Restored & Enhanced)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter or Ctrl+S to Run
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key === 's')) {
        e.preventDefault();
        const runBtn = document.querySelector('.btn-primary');
        if (runBtn) runBtn.click();
      }
      
      // Escape to hide sidebars/reset status
      if (e.key === 'Escape') {
        setStatus('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(lang.defaultCode);
    setResetKey(prev => prev + 1);
    setShowPreview(['html', 'css'].includes(lang.id));
  };

  const estimateComplexity = (code) => {
    const loops = (code.match(/for|while/g) || []).length;
    const nested = (code.match(/for.*for|for.*while|while.*for|while.*while/s) || []).length;
    if (nested > 0) return 'O(N²)';
    if (loops > 0) return 'O(N)';
    return 'O(1)';
  };

  const handleExecute = async () => {
    if (isWeb) return;
    const start = performance.now();
    setLoading(true);
    setStatus('running');
    setOutput('');
    setStderr('');
    try {
      const response = await axios.post(`${API_URL}/execute`, {
        code: code, language: language.id, input_data: inputData
      });
      setLatency(Math.round(performance.now() - start));
      setExecutionTime(response.data.time);
      setMemory(response.data.memory);
      setCurrentSamples(response.data.samples);
      setComplexity(estimateComplexity(code));
      setHistory(prev => [...prev.slice(-9), { 
        id: Date.now(), 
        time: response.data.time, 
        memory: response.data.memory,
        stdout: response.data.stdout,
        stderr: response.data.stderr,
        language: language.id
      }]);
      setOutput(response.data.stdout);
      setStderr(response.data.stderr);
      setStatus(response.data.exit_code === 0 && !response.data.stderr ? 'success' : 'error');
    } catch (error) {
      setStderr('Engine connection failed.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">

      <Header 
        languages={LANGUAGES}
        selectedLanguage={language}
        onLanguageChange={handleLanguageChange}
        onExecute={handleExecute}
        loading={loading}
        isWeb={isWeb}
        onOpenAI={() => setIsAIChatOpen(true)}
      />

      <main className="main-content">
        <EditorPanel 
          key={resetKey}
          language={language}
          code={code}
          onChange={(val) => setCode(val)}
          onReset={() => {
            setResetKey(prev => prev + 1);
          }}
          isWeb={isWeb}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />

        <div style={{ width: showPreview ? '50%' : '420px', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence mode="wait">
            {!showPreview ? (
              <ConsolePanel 
                key="console"
                inputData={inputData}
                onInputChange={setInputData}
                output={output}
                stderr={stderr}
                status={status}
                latency={latency}
                executionTime={executionTime}
                memory={memory}
                history={history}
                samples={currentSamples}
                complexity={complexity}
              />
            ) : (
              <PreviewPanel 
                key="preview"
                code={code}
                languageId={language.id}
              />
            )}
          </AnimatePresence>
        </div>
        
        <RightSidebar onOpenAI={() => setIsAIChatOpen(true)} history={history} />
      </main>

      <AIChatPanel 
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        currentCode={code}
        language={language.id}
        lastOutput={output}
        lastError={stderr}
      />

      <Footer />
    </div>
  );
}

export default App;
