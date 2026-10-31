import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Terminal,
  GitBranch,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const VercelDeployGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "Fix MedShield for Vercel deployment: added vercel.json and api/analyze.py"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/medshield.git
git push -u origin main`;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-slate-700 flex items-center justify-center text-white font-bold">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 1155 1000">
              <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Vercel Deployment Diagnosis & Fix</h3>
            <p className="text-xs text-slate-400">
              Complete breakdown of why your original deployment failed and how it is now fixed.
            </p>
          </div>
          <span className="ml-auto bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-1 rounded font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Issue Resolved
          </span>
        </div>
      </div>

      {/* The 3 Core Reasons Why Vercel Failed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cause 1 */}
        <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-500/30 space-y-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h4 className="text-sm font-semibold text-white">Java Swing on Web Cloud</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">The Problem:</strong> Java Swing (<code>MedShieldApp.java</code>) is a desktop GUI framework requiring a monitor and display server. Vercel build servers run headless cloud Linux and cannot run desktop applications.
          </p>
          <div className="text-[11px] bg-slate-950 p-2.5 rounded border border-slate-800 text-rose-300 font-mono">
            Error: javac: command not found / cannot open display
          </div>
          <p className="text-[11px] text-emerald-400">
            <strong>The Fix:</strong> We preserve <code>MedShieldApp.java</code> for local viva, while deploying the full MedShield web app to Vercel!
          </p>
        </div>

        {/* Cause 2 */}
        <div className="bg-slate-900/90 p-5 rounded-xl border border-amber-500/30 space-y-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h4 className="text-sm font-semibold text-white">Missing vercel.json & Preset</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">The Problem:</strong> Vercel did not know the build output folder (<code>dist</code>) or how to route single-page application requests, causing <code>404: NOT_FOUND</code> or build directory errors.
          </p>
          <div className="text-[11px] bg-slate-950 p-2.5 rounded border border-slate-800 text-amber-300 font-mono">
            Error: No Output Directory named "dist" found
          </div>
          <p className="text-[11px] text-emerald-400">
            <strong>The Fix:</strong> Added <code>vercel.json</code> with framework preset <code>vite</code>, <code>npm run build</code>, and SPA rewrites.
          </p>
        </div>

        {/* Cause 3 */}
        <div className="bg-slate-900/90 p-5 rounded-xl border border-sky-500/30 space-y-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h4 className="text-sm font-semibold text-white">CLI Python vs Cloud API</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">The Problem:</strong> In a browser, JavaScript cannot execute <code>python medshield_detector.py</code> via <code>ProcessBuilder</code> because browsers run in sandboxes without direct OS shell access.
          </p>
          <div className="text-[11px] bg-slate-950 p-2.5 rounded border border-slate-800 text-sky-300 font-mono">
            Error: Cannot execute local CLI process from browser
          </div>
          <p className="text-[11px] text-emerald-400">
            <strong>The Fix:</strong> Added Vercel Python Serverless Function in <code>api/analyze.py</code> and <code>requirements.txt</code>!
          </p>
        </div>
      </div>

      {/* Cause 4: npm error ERESOLVE Banner */}
      <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-500/40 space-y-3">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>npm error ERESOLVE: Peer Dependency Conflict Diagnosed & Resolved</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-rose-300 leading-relaxed overflow-x-auto">
          npm error ERESOLVE could not resolve<br />
          npm error Conflicting peer dependency: esbuild@0.28.2 (required by vite@8.3.5)<br />
          npm error Found: esbuild@0.25.0 (pinned in devDependencies)
        </div>
        <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <p>
            <strong>The Exact Cause:</strong> <code>@tailwindcss/vite</code> and <code>@vitejs/plugin-react</code> accept Vite 8. However, <code>vite@8.3.5</code> requires <code>esbuild@^0.27.0 || ^0.28.0</code>. The root <code>package.json</code> was pinning an outdated <code>esbuild: ^0.25.0</code> under devDependencies!
          </p>
          <p className="text-emerald-400 font-medium">
            <strong>The Permanent Fix:</strong> We removed the conflicting manual <code>"esbuild": "^0.25.0"</code> from <code>devDependencies</code>. Vite now automatically uses its matched internal build engine without needing <code>--force</code> or <code>--legacy-peer-deps</code>!
          </p>
        </div>
      </div>

      {/* Files Added & Changed */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          The Exact Minimal Configuration Files Added
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* vercel.json */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-amber-300 font-bold">vercel.json</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Config</span>
            </div>
            <p className="text-slate-400 text-[11px] mb-2">
              Instructs Vercel to use Vite preset, run <code>npm run build</code>, and forward <code>/api/*</code> to Python serverless functions.
            </p>
          </div>

          {/* api/analyze.py */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sky-300 font-bold">api/analyze.py</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Serverless</span>
            </div>
            <p className="text-slate-400 text-[11px] mb-2">
              Exposes the exact same 9-point rule-based detector as an HTTP handler on Vercel cloud infrastructure.
            </p>
          </div>

          {/* requirements.txt */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-emerald-300 font-bold">requirements.txt</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Runtime</span>
            </div>
            <p className="text-slate-400 text-[11px] mb-2">
              Registers the Python runtime environment for Vercel without requiring unnecessary heavy pip packages.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step GitHub & Vercel Deployment Instructions */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-teal-400" />
          Step-by-Step Guide to Deploy on Vercel
        </h4>

        {/* Step 1: Push to GitHub */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
            <GitBranch className="w-4 h-4" />
            Step 1: Commit and Push to your GitHub Repository
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs text-amber-300 overflow-x-auto">
            <pre className="whitespace-pre">{gitCommands}</pre>
            <button
              onClick={() => copyText(gitCommands, 'git')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded text-xs border border-slate-700 transition shrink-0 ml-4 flex items-center gap-1"
            >
              {copiedKey === 'git' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Git Commands</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 2: Deploy on Vercel Dashboard */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
            <Cloud className="w-4 h-4" />
            Step 2: Deploy in Vercel Dashboard
          </div>
          <ol className="list-decimal pl-5 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li>
              Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-teal-400 underline">vercel.com</a> and sign in with your GitHub account.
            </li>
            <li>Click <strong>"Add New..."</strong> &rarr; <strong>"Project"</strong>.</li>
            <li>Select your <strong>medshield</strong> repository from the GitHub list and click <strong>"Import"</strong>.</li>
            <li>
              In the <strong>Configure Project</strong> screen:
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                <li><strong>Framework Preset:</strong> Vite (automatically detected from <code>vercel.json</code>).</li>
                <li><strong>Root Directory:</strong> <code>./</code> (leave as default).</li>
                <li><strong>Build Command:</strong> <code>npm run build</code> (default).</li>
                <li><strong>Output Directory:</strong> <code>dist</code> (default).</li>
              </ul>
            </li>
            <li>Click <strong>"Deploy"</strong>.</li>
          </ol>
        </div>

        {/* Step 3: Result */}
        <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-xs text-emerald-200/90 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Expected Vercel Outcome:</strong>
            <p className="mt-0.5 text-slate-300">
              The build will complete in ~30 seconds, providing a public URL (e.g., <code>https://medshield-xxx.vercel.app</code>) that opens the full MedShield web application, runs the Python detector API, and allows users to take the training quiz from any browser or phone!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
