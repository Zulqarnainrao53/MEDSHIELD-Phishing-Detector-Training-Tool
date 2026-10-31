import React, { useState } from 'react';
import { Terminal, Copy, Check, AlertCircle, Wrench, ChevronRight } from 'lucide-react';

export const WindowsRunGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      step: 'Step 1',
      title: 'Verify Python Installation',
      description: 'Open Windows Command Prompt (cmd) and check that Python 3.8+ is installed and available.',
      command: 'python --version',
      expected: 'Python 3.10.x (or Python 3.8+)',
    },
    {
      step: 'Step 2',
      title: 'Verify Java JDK Installation',
      description: 'Check that Java Compiler (javac) and Java Runtime (java) are available in PATH.',
      command: 'javac -version',
      expected: 'javac 17.0.x (or javac 1.8 / 11 / 21)',
    },
    {
      step: 'Step 3',
      title: 'Place Both Files in One Folder',
      description: 'Create a folder named "MedShield" (e.g. C:\\MedShield) and ensure both files reside together:',
      command: 'dir',
      expected: 'MedShieldApp.java\nmedshield_detector.py\nREADME.txt',
    },
    {
      step: 'Step 4',
      title: 'Navigate to Your Project Folder',
      description: 'Change directory in Command Prompt to where your files are located:',
      command: 'cd C:\\MedShield',
      expected: 'C:\\MedShield>',
    },
    {
      step: 'Step 5',
      title: 'Compile the Java Application',
      description: 'Use the standard Java compiler to generate MedShieldApp.class:',
      command: 'javac MedShieldApp.java',
      expected: '(Returns quietly with no errors, creating MedShieldApp.class)',
    },
    {
      step: 'Step 6',
      title: 'Run MedShield Desktop GUI',
      description: 'Launch the application on your Windows desktop:',
      command: 'java MedShieldApp',
      expected: '(Opens the MedShield Java Swing GUI window immediately)',
    },
  ];

  const commonErrors = [
    {
      error: "'javac' is not recognized as an internal or external command",
      cause: 'Java JDK is either not installed, or its bin directory is not in your Windows PATH environment variable.',
      solution:
        'Download and install JDK 17 or JDK 21 from Oracle or Adoptium. During installation, select "Set JAVA_HOME variable" and add C:\\Program Files\\Java\\jdk-XX\\bin to your Windows System PATH.',
    },
    {
      error: "'python' is not recognized as an internal or external command",
      cause: 'Python was installed without checking "Add python.exe to PATH".',
      solution:
        'Re-run the Python Windows installer, choose "Modify", and make sure the "Add python.exe to PATH" checkbox is checked. Or test typing "py" instead.',
    },
    {
      error: "Could not find or load main class MedShieldApp",
      cause: 'You ran "java MedShieldApp.class" (with the extension) or you are in the wrong folder.',
      solution:
        'Do NOT include ".class" when running java. Type exactly: java MedShieldApp from inside the folder where MedShieldApp.class was compiled.',
    },
    {
      error: 'ERROR: Could not execute Python! / medshield_detector.py not found',
      cause: 'medshield_detector.py was saved in a different directory than MedShieldApp.class.',
      solution:
        'Ensure medshield_detector.py is in the exact same folder where you ran "java MedShieldApp".',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2.5 text-teal-400 font-bold mb-1 text-sm">
          <Terminal className="w-4 h-4" />
          Windows Command Prompt Execution Guide
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Follow these exact step-by-step terminal commands on your Windows computer. No internet, API keys, or cloud servers are required.
        </p>
      </div>

      {/* Step by step cards */}
      <div className="space-y-3">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 transition hover:border-slate-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="bg-teal-500/20 text-teal-300 font-mono text-xs font-bold px-2 py-0.5 rounded border border-teal-500/30">
                  {item.step}
                </span>
                <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-3">{item.description}</p>

            {/* Command Box */}
            <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between gap-3 font-mono text-xs">
              <span className="text-amber-300 select-all">{item.command}</span>
              <button
                onClick={() => copyCommand(item.command, idx)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded border border-slate-700 flex items-center gap-1 transition shrink-0"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span>Expected output: <code className="text-slate-400">{item.expected}</code></span>
            </div>
          </div>
        ))}
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          Common Windows Errors and Fast Solutions
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonErrors.map((err, i) => (
            <div key={i} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-start gap-2 text-rose-400 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{err.error}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                <strong className="text-slate-300">Cause:</strong> {err.cause}
              </p>
              <p className="text-[11px] text-emerald-400/90 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                <strong className="text-emerald-300">Solution:</strong> {err.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
