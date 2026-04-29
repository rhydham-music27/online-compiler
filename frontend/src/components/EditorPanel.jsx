import React, { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Code2, RotateCcw, Globe, Download, ZoomIn, ZoomOut } from 'lucide-react';

loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs' } });

// Language → file extension map for downloads
const EXT_MAP = {
  python: 'py',
  cpp: 'cpp',
  java: 'java',
  javascript: 'js',
  html: 'html',
  css: 'css',
};

const MIN_FONT = 10;
const MAX_FONT = 24;
const DEFAULT_FONT = 13;

// Language Intelligence Dictionary
const INTELLISENSE = {
  python: [
    { label: 'print',  kind: 'Function', insert: 'print(${1:value})' },
    { label: 'def',    kind: 'Keyword',  insert: 'def ${1:name}(${2:args}):\n\t${3:pass}' },
    { label: 'import', kind: 'Keyword',  insert: 'import ${1:module}' },
    { label: 'if',     kind: 'Keyword',  insert: 'if ${1:condition}:\n\t${2:pass}' },
    { label: 'elif',   kind: 'Keyword',  insert: 'elif ${1:condition}:\n\t${2:pass}' },
    { label: 'else',   kind: 'Keyword',  insert: 'else:\n\t${1:pass}' },
    { label: 'for',    kind: 'Keyword',  insert: 'for ${1:i} in range(${2:10}):\n\t${3:pass}' },
    { label: 'while',  kind: 'Keyword',  insert: 'while ${1:condition}:\n\t${2:pass}' },
    { label: 'return', kind: 'Keyword',  insert: 'return ${1:result}' },
    { label: 'class',  kind: 'Class',    insert: 'class ${1:ClassName}:\n\tdef __init__(self):\n\t\t${2:pass}' },
    { label: 'try',    kind: 'Keyword',  insert: 'try:\n\t${1:pass}\nexcept ${2:Exception} as e:\n\t${3:pass}' },
    { label: 'main',   kind: 'Snippet',  insert: 'if __name__ == "__main__":\n\t${1:main()}' },
  ],
  cpp: [
    { label: 'include', kind: 'Keyword',  insert: '#include <${1:iostream}>' },
    { label: 'main',    kind: 'Snippet',  insert: 'int main() {\n\t${1}\n\treturn 0;\n}' },
    { label: 'cout',    kind: 'Function', insert: 'std::cout << ${1:"message"} << std::endl;' },
    { label: 'cin',     kind: 'Function', insert: 'std::cin >> ${1:variable};' },
    { label: 'vector',  kind: 'Class',    insert: 'std::vector<${1:int}> ${2:vec};' },
    { label: 'if',      kind: 'Keyword',  insert: 'if (${1:condition}) {\n\t${2}\n}' },
    { label: 'for',     kind: 'Keyword',  insert: 'for (int i = 0; i < ${1:10}; ++i) {\n\t${2}\n}' },
    { label: 'while',   kind: 'Keyword',  insert: 'while (${1:condition}) {\n\t${2}\n}' },
  ],
  java: [
    { label: 'sysout',  kind: 'Snippet', insert: 'System.out.println(${1});' },
    { label: 'main',    kind: 'Snippet', insert: 'public static void main(String[] args) {\n\t${1}\n}' },
    { label: 'public',  kind: 'Keyword', insert: 'public ' },
    { label: 'private', kind: 'Keyword', insert: 'private ' },
    { label: 'class',   kind: 'Class',   insert: 'public class ${1:Main} {\n\t${2}\n}' },
    { label: 'if',      kind: 'Keyword', insert: 'if (${1:condition}) {\n\t${2}\n}' },
  ],
  javascript: [
    { label: 'log',      kind: 'Snippet', insert: 'console.log(${1:item});' },
    { label: 'function', kind: 'Keyword', insert: 'function ${1:name}(${2:args}) {\n\t${3}\n}' },
    { label: 'const',    kind: 'Keyword', insert: 'const ${1:name} = ${2:value};' },
    { label: 'let',      kind: 'Keyword', insert: 'let ${1:name} = ${2:value};' },
    { label: 'arrow',    kind: 'Snippet', insert: 'const ${1:name} = (${2:args}) => {\n\t${3}\n};' },
    { label: 'async',    kind: 'Keyword', insert: 'async ' },
    { label: 'await',    kind: 'Keyword', insert: 'await ' },
    { label: 'import',   kind: 'Keyword', insert: 'import ${1:name} from "${2:module}";' },
  ],
};

const EditorPanel = ({ language, code, onChange, onReset, isWeb, showPreview, onTogglePreview }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT);

  // ── Ctrl + / Ctrl - font size shortcut (editor only) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;

      // Ctrl+= or Ctrl++ → zoom in
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setFontSize(prev => {
          const next = Math.min(prev + 1, MAX_FONT);
          editorRef.current?.updateOptions({ fontSize: next });
          return next;
        });
      }

      // Ctrl+- → zoom out
      if (e.key === '-') {
        e.preventDefault();
        setFontSize(prev => {
          const next = Math.max(prev - 1, MIN_FONT);
          editorRef.current?.updateOptions({ fontSize: next });
          return next;
        });
      }

      // Ctrl+0 → reset font size
      if (e.key === '0') {
        e.preventDefault();
        setFontSize(DEFAULT_FONT);
        editorRef.current?.updateOptions({ fontSize: DEFAULT_FONT });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Download current code ──
  const handleDownload = () => {
    const content = editorRef.current ? editorRef.current.getValue() : code;
    const ext = EXT_MAP[language.id] || 'txt';
    const filename = `code.${ext}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.setValue(code);

    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    // Register intellisense providers
    Object.keys(INTELLISENSE).forEach(langId => {
      monaco.languages.registerCompletionItemProvider(langId, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          const suggestions = INTELLISENSE[langId].map(item => ({
            label: item.label,
            kind: monaco.languages.CompletionItemKind[item.kind],
            insertText: item.insert,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          }));
          return { suggestions };
        },
      });
    });

    // Cursor design system Monaco theme — warm cream, ink text
    monaco.editor.defineTheme('cursor-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment',  foreground: 'a09c92', fontStyle: 'italic' },
        { token: 'keyword',  foreground: 'f54e00' },
        { token: 'string',   foreground: '1f8a65' },
        { token: 'number',   foreground: 'c08532' },
        { token: 'type',     foreground: '5a5852' },
      ],
      colors: {
        'editor.background':                    '#ffffff',
        'editor.foreground':                    '#26251e',
        'editor.lineHighlightBackground':       '#f7f7f4',
        'editor.selectionBackground':           '#f54e0022',
        'editorCursor.foreground':              '#f54e00',
        'editorLineNumber.foreground':          '#a09c92',
        'editorLineNumber.activeForeground':    '#26251e',
        'editorIndentGuide.background':         '#e6e5e0',
        'editorSuggestWidget.background':       '#ffffff',
        'editorSuggestWidget.border':           '#e6e5e0',
        'editorSuggestWidget.selectedBackground': 'rgba(245,78,0,0.07)',
        'editorSuggestWidget.highlightForeground': '#f54e00',
        'editorWidget.background':              '#ffffff',
        'editorWidget.border':                  '#e6e5e0',
        'scrollbar.shadow':                     '#00000000',
        'scrollbarSlider.background':           '#e6e5e0',
        'scrollbarSlider.hoverBackground':      '#cfcdc4',
      },
    });

    monaco.editor.setTheme('cursor-theme');
    setTimeout(() => editor.focus(), 200);
  }

  return (
    <div className="ide-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* ── Panel Header ── */}
      <div className="panel-header">
        {/* Left: label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={13} color="var(--color-muted)" />
          <span className="label-micro">Editor</span>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          {/* Font size indicator + zoom buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px',
          }}>
            <button
              onClick={() => setFontSize(prev => {
                const next = Math.max(prev - 1, MIN_FONT);
                editorRef.current?.updateOptions({ fontSize: next });
                return next;
              })}
              className="btn-ghost"
              style={{ padding: '3px 5px', minWidth: 0 }}
              title="Decrease font size (Ctrl+-)"
            >
              <ZoomOut size={12} />
            </button>

            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              color: 'var(--color-muted)',
              minWidth: '22px',
              textAlign: 'center',
              userSelect: 'none',
            }}>
              {fontSize}
            </span>

            <button
              onClick={() => setFontSize(prev => {
                const next = Math.min(prev + 1, MAX_FONT);
                editorRef.current?.updateOptions({ fontSize: next });
                return next;
              })}
              className="btn-ghost"
              style={{ padding: '3px 5px', minWidth: 0 }}
              title="Increase font size (Ctrl++)"
            >
              <ZoomIn size={12} />
            </button>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="btn-ghost"
            style={{ padding: '5px 7px', gap: '5px' }}
            title={`Download as .${EXT_MAP[language.id] || 'txt'}`}
          >
            <Download size={12} />
            <span style={{ fontSize: '12px' }}>Download</span>
          </button>

          {/* Web preview toggle */}
          {isWeb && (
            <button
              onClick={onTogglePreview}
              className={`btn-ghost ${showPreview ? 'active' : ''}`}
              style={{ padding: '5px 7px', gap: '5px' }}
            >
              <Globe size={12} />
              <span style={{ fontSize: '12px' }}>{showPreview ? 'Code' : 'Preview'}</span>
            </button>
          )}

          {/* Reset */}
          <button
            onClick={onReset}
            className="btn-ghost"
            style={{ padding: '5px' }}
            title="Reset Code"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* ── Monaco Editor ── */}
      <div className="editor-wrapper">
        <Editor
          key={language.id}
          height="100%"
          language={language.id}
          onMount={handleEditorDidMount}
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
            },
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
            suggestSelection: 'first',
            quickSuggestionsDelay: 0,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
