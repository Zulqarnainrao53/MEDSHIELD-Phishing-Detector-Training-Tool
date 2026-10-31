import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Terminal, Cloud } from 'lucide-react';

interface CodeExplorerProps {
  pythonCode: string;
  javaCode: string;
  readmeCode: string;
  vercelCode: string;
  apiCode: string;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({
  pythonCode,
  javaCode,
  readmeCode,
  vercelCode,
  apiCode,
}) => {
  const [selectedFile, setSelectedFile] = useState<'java' | 'python' | 'vercel' | 'api' | 'readme'>('java');
  const [copied, setCopied] = useState(false);

  let activeContent = javaCode;
  let fileName = 'MedShieldApp.java';

  if (selectedFile === 'python') {
    activeContent = pythonCode;
    fileName = 'medshield_detector.py';
  } else if (selectedFile === 'vercel') {
    activeContent = vercelCode;
    fileName = 'vercel.json';
  } else if (selectedFile === 'api') {
    activeContent = apiCode;
    fileName = 'api/analyze.py';
  } else if (selectedFile === 'readme') {
    activeContent = readmeCode;
    fileName = 'README.txt';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.includes('/') ? fileName.split('/')[1] : fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* File Selector Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedFile('java')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'java'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            MedShieldApp.java
          </button>

          <button
            onClick={() => setSelectedFile('python')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'python'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            medshield_detector.py
          </button>

          <button
            onClick={() => setSelectedFile('vercel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'vercel'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            vercel.json
          </button>

          <button
            onClick={() => setSelectedFile('api')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'api'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-teal-400" />
            api/analyze.py (Serverless)
          </button>

          <button
            onClick={() => setSelectedFile('readme')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'readme'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            README.txt
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {fileName}</span>
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[600px] text-slate-300 leading-relaxed select-text">
        <pre className="whitespace-pre">
          <code>{activeContent}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900/80 px-4 py-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>
          Active file: <code className="text-teal-300">{fileName}</code>
        </span>
        <span className="text-slate-500">
          Lines: {activeContent.split('\n').length} &bull; Vercel & Desktop Ready
        </span>
      </div>
    </div>
  );
};
