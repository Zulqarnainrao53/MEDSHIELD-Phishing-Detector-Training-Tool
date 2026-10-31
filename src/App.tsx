import React, { useState } from 'react';
import { SwingSimulator } from './components/SwingSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { VivaPreparation } from './components/VivaPreparation';
import { WindowsRunGuide } from './components/WindowsRunGuide';
import { VercelDeployGuide } from './components/VercelDeployGuide';
import {
  PYTHON_SOURCE_CODE,
  JAVA_SOURCE_CODE,
  README_SOURCE_CODE,
  VERCEL_JSON_CODE,
  API_ANALYZE_PY_CODE,
} from './data/sourceCode';
import {
  Shield,
  Monitor,
  Code2,
  Terminal,
  GraduationCap,
  Hospital,
  MapPin,
  Users,
  CheckCircle,
  Cloud,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'windows' | 'viva' | 'vercel'>('simulator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Clinic & Project Banner */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-700 flex items-center justify-center shadow-md shadow-teal-500/20 text-white font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  MEDSHIELD
                </h1>
                <span className="text-[11px] bg-teal-500/15 text-teal-300 font-semibold px-2 py-0.5 rounded border border-teal-500/30">
                  University InfoSec Project
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <Hospital className="w-3.5 h-3.5 text-teal-400" />
                  Al-Shifa Medical Clinic
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  Gulberg, Sahiwal, Punjab, Pakistan
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Users className="w-3 h-3 text-sky-400" />
                  Staff Awareness System
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'simulator'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Live GUI Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'code'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source Code & Files</span>
            </button>

            <button
              onClick={() => setActiveTab('windows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'windows'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Windows Run Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('viva')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'viva'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Viva Preparation</span>
            </button>

            <button
              onClick={() => setActiveTab('vercel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'vercel'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-400 hover:text-emerald-200 hover:bg-slate-900'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Vercel Fix & Deploy</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Highlight Quick Stats / Architecture Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-300">Architecture:</span>
            <span className="bg-slate-800 text-amber-300 px-2.5 py-1 rounded border border-slate-700 font-mono">
              Java Swing (MedShieldApp.java)
            </span>
            <span className="text-slate-500 font-bold">&harr;</span>
            <span className="bg-slate-800 text-sky-300 px-2.5 py-1 rounded border border-slate-700 font-mono">
              ProcessBuilder (IPC)
            </span>
            <span className="text-slate-500 font-bold">&harr;</span>
            <span className="bg-slate-800 text-emerald-300 px-2.5 py-1 rounded border border-slate-700 font-mono">
              Python 3 (medshield_detector.py)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              100% Offline (No APIs)
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1 text-teal-400">
              <CheckCircle className="w-3.5 h-3.5" />
              9-Point Rule Scoring
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <CheckCircle className="w-3.5 h-3.5" />
              5 Staff Training Scenarios
            </span>
          </div>
        </div>

        {/* Tab 1: Swing Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Interactive Java Swing Simulation</h2>
                <p className="text-xs text-slate-400">
                  Test the exact behavior of MedShieldApp.java and medshield_detector.py in your browser.
                </p>
              </div>
            </div>
            <SwingSimulator />
          </div>
        )}

        {/* Tab 2: Code & File Explorer */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Project Source Code & Files</h2>
              <p className="text-xs text-slate-400">
                Both complete files are saved in your project folder. You can copy the code or click Download to run on Windows.
              </p>
            </div>
            <CodeExplorer
              pythonCode={PYTHON_SOURCE_CODE}
              javaCode={JAVA_SOURCE_CODE}
              readmeCode={README_SOURCE_CODE}
              vercelCode={VERCEL_JSON_CODE}
              apiCode={API_ANALYZE_PY_CODE}
            />
          </div>
        )}

        {/* Tab 3: Windows Run Guide */}
        {activeTab === 'windows' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Windows Execution & Setup Guide</h2>
              <p className="text-xs text-slate-400">
                Exact Command Prompt commands to compile with javac and run with java on Windows.
              </p>
            </div>
            <WindowsRunGuide />
          </div>
        )}

        {/* Tab 4: Viva Preparation */}
        {activeTab === 'viva' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">University Viva Voce Preparation Center</h2>
              <p className="text-xs text-slate-400">
                Beginner-friendly answers for 22 viva questions, 1-minute speech, and step-by-step examiner demo script.
              </p>
            </div>
            <VivaPreparation />
          </div>
        )}

        {/* Tab 5: Vercel Fix & Deployment Guide */}
        {activeTab === 'vercel' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Vercel Deployment Diagnosis & Fix</h2>
              <p className="text-xs text-slate-400">
                Fix for Java Swing desktop vs cloud web architecture, vercel.json configuration, and Python serverless functions.
              </p>
            </div>
            <VercelDeployGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 px-6 text-xs text-slate-400 text-center">
        <p>
          <strong>MedShield</strong> &bull; University Information Security Project &bull; Al-Shifa Medical Clinic, Gulberg, Sahiwal, Punjab, Pakistan
        </p>
        <p className="text-slate-500 text-[11px] mt-1">
          Developed with beginner-friendly Java Swing desktop GUI and pure Python rule-based detection engine.
        </p>
      </footer>
    </div>
  );
}
