import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import type * as Monaco from 'monaco-editor';

// Add UPL language configuration
const uplLanguageConfig = {
  keywords: ['if', 'else', 'let', 'loop', 'save', 'exit', 'async', 'await', 'promise', 'try', 'catch'],
  functions: ['print', 'add', 'multiply', 'index', 'access', 'equals', 'lessThan'],
  operators: ['=', ',', ';', '(', ')', '{', '}', '[', ']', ':'],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  tokenizer: {
    root: [
      [/[a-z_$][\w$]*/, {
        cases: {
          '@keywords': 'keyword',
          '@functions': 'function',
          'true|false|null': 'constant'
        }
      }],
      { include: '@whitespace' },
      [/\d+/, 'number'],
      [/[{}()\[\]]/, '@brackets'],
      [/[<>=\+\-\*\/]/, 'operator'],
      [/".*?"/, 'string'],
      [/\/\/.*$/, 'comment']
    ],
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment']
    ],
    comment: [
      [/[^\/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],
      ["\\*/", 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ]
  }
};

interface EditorProps {
  filename: string;
}

export function Editor({ filename }: EditorProps) {
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(`upl-file-${filename}`);
    return saved || '// Write your UPL code here';
  });

  useEffect(() => {
    localStorage.setItem(`upl-file-${filename}`, code);
  }, [code, filename]);

  const handleEditorWillMount = (monaco: typeof Monaco) => {
    monaco.languages.register({ id: 'upl' });
    monaco.languages.setMonarchTokensProvider('upl', {
      ...uplLanguageConfig,
      tokenizer: {
        ...uplLanguageConfig.tokenizer,
        root: [
          ...uplLanguageConfig.tokenizer.root,
          [/[{}()\[\]]/, '@brackets']
        ]
      }
    });

    monaco.editor.defineTheme('upl-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#C586C0' },
        { token: 'function', foreground: '#DCDCAA' },
        { token: 'number', foreground: '#B5CEA8' },
        { token: 'string', foreground: '#CE9178' },
        { token: 'comment', foreground: '#6A9955' },
        { token: 'constant', foreground: '#569CD6' },
        { token: 'operator', foreground: '#D4D4D4' },
        { token: 'brackets', foreground: '#D4D4D4' }
      ],
      colors: {
        'editor.background': '#151B2B',
        'editor.foreground': '#D4D4D4'
      }
    });
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-border bg-card">
      <MonacoEditor
        height="100%"
        defaultLanguage="upl"
        theme="upl-dark"
        beforeMount={handleEditorWillMount}
        value={code}
        onChange={(value) => setCode(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
