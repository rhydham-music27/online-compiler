import React from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Code2, RotateCcw, Globe } from 'lucide-react';

loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs' } });

// Language Intelligence Dictionary
const INTELLISENSE = {
  python: [
    { label: 'print', kind: 'Function', insert: 'print(${1:value})' },
    { label: 'def', kind: 'Keyword', insert: 'def ${1:name}(${2:args}):\n\t${3:pass}' },
    { label: 'import', kind: 'Keyword', insert: 'import ${1:module}' },
    { label: 'if', kind: 'Keyword', insert: 'if ${1:condition}:\n\t${2:pass}' },
    { label: 'elif', kind: 'Keyword', insert: 'elif ${1:condition}:\n\t${2:pass}' },
    { label: 'else', kind: 'Keyword', insert: 'else:\n\t${1:pass}' },
    { label: 'for', kind: 'Keyword', insert: 'for ${1:i} in range(${2:10}):\n\t${3:pass}' },
    { label: 'while', kind: 'Keyword', insert: 'while ${1:condition}:\n\t${2:pass}' },
    { label: 'return', kind: 'Keyword', insert: 'return ${1:result}' },
    { label: 'class', kind: 'Class', insert: 'class ${1:ClassName}:\n\tdef __init__(self):\n\t\t${2:pass}' },
    { label: 'try', kind: 'Keyword', insert: 'try:\n\t${1:pass}\nexcept ${2:Exception} as e:\n\t${3:pass}' },
    { label: 'main', kind: 'Snippet', insert: 'if __name__ == "__main__":\n\t${1:main()}' },
  ],
  cpp: [
    { label: 'include', kind: 'Keyword', insert: '#include <${1:iostream}>' },
    { label: 'main', kind: 'Snippet', insert: 'int main() {\n\t${1}\n\treturn 0;\n}' },
    { label: 'cout', kind: 'Function', insert: 'std::cout << ${1:"message"} << std::endl;' },
    { label: 'cin', kind: 'Function', insert: 'std::cin >> ${1:variable};' },
    { label: 'vector', kind: 'Class', insert: 'std::vector<${1:int}> ${2:vec};' },
    { label: 'if', kind: 'Keyword', insert: 'if (${1:condition}) {\n\t${2}\n}' },
    { label: 'for', kind: 'Keyword', insert: 'for (int i = 0; i < ${1:10}; ++i) {\n\t${2}\n}' },
    { label: 'while', kind: 'Keyword', insert: 'while (${1:condition}) {\n\t${2}\n}' },
  ],
  java: [
    { label: 'sysout', kind: 'Snippet', insert: 'System.out.println(${1});' },
    { label: 'main', kind: 'Snippet', insert: 'public static void main(String[] args) {\n\t${1}\n}' },
    { label: 'public', kind: 'Keyword', insert: 'public ' },
    { label: 'private', kind: 'Keyword', insert: 'private ' },
    { label: 'class', kind: 'Class', insert: 'public class ${1:Main} {\n\t${2}\n}' },
    { label: 'if', kind: 'Keyword', insert: 'if (${1:condition}) {\n\t${2}\n}' },
  ],
  javascript: [
    { label: 'log', kind: 'Snippet', insert: 'console.log(${1:item});' },
    { label: 'function', kind: 'Keyword', insert: 'function ${1:name}(${2:args}) {\n\t${3}\n}' },
    { label: 'const', kind: 'Keyword', insert: 'const ${1:name} = ${2:value};' },
    { label: 'let', kind: 'Keyword', insert: 'let ${1:name} = ${2:value};' },
    { label: 'arrow', kind: 'Snippet', insert: 'const ${1:name} = (${2:args}) => {\n\t${3}\n};' },
    { label: 'async', kind: 'Keyword', insert: 'async ' },
    { label: 'await', kind: 'Keyword', insert: 'await ' },
    { label: 'import', kind: 'Keyword', insert: 'import ${1:name} from "${2:module}";' },
  ]
};

const EditorPanel = ({ language, code, onChange, onReset, isWeb, showPreview, onTogglePreview }) => {
  const editorRef = React.useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.setValue(code);

    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    // Register Multi-Language Intelligence Providers
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
            range: range
          }));

          return { suggestions };
        }
      });
    });

    monaco.editor.defineTheme('glass-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
        'editor.lineHighlightBackground': '#ffffff02',
        'editorCursor.foreground': '#5e6ad2',
        'editorSuggestWidget.background': '#0f1011',
        'editorSuggestWidget.border': '#ffffff10',
        'editorSuggestWidget.selectedBackground': '#5e6ad233',
        'editorSuggestWidget.highlightForeground': '#5e6ad2',
      }
    });
    
    monaco.editor.setTheme('glass-theme');
    setTimeout(() => editor.focus(), 200);
  }

  return (
    <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="section-header" style={{ justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={12} color="var(--brand-primary)" />
          <span className="label-micro">Omni Intelligence System</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isWeb && (
            <button onClick={onTogglePreview} className={`btn-ghost ${showPreview ? 'active' : ''}`} style={{ fontSize: '11px', gap: '6px' }}>
              <Globe size={11} /> {showPreview ? 'Canvas' : 'Code'}
            </button>
          )}
          <button onClick={onReset} className="btn-ghost" style={{ padding: '4px' }} title="Reset Code">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, borderTop: '1px solid var(--border-subtle)' }}>
        <Editor
          key={language.id}
          height="100%"
          language={language.id}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            automaticLayout: true,
            scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
            suggestSelection: 'first',
            quickSuggestionsDelay: 0,
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
