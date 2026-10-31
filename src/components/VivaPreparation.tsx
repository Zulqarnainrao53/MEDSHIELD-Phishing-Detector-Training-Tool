import React, { useState } from 'react';
import { VIVA_QUESTIONS, VivaQuestion } from '../data/vivaData';
import {
  GraduationCap,
  MessageSquare,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  Shield,
  Lightbulb,
  CheckCircle,
  FileText,
} from 'lucide-react';

export const VivaPreparation: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'speech' | 'demo' | 'questions' | 'architecture'>(
    'questions'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  const categories = ['All', 'Overview', 'Architecture', 'Python', 'Java', 'Security Rules', 'Limitations'];

  const filteredQuestions = VIVA_QUESTIONS.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSubTab('questions')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeSubTab === 'questions'
              ? 'bg-teal-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          22 Viva Questions & Answers
        </button>

        <button
          onClick={() => setActiveSubTab('speech')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeSubTab === 'speech'
              ? 'bg-teal-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          1-Minute Presentation Speech
        </button>

        <button
          onClick={() => setActiveSubTab('demo')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeSubTab === 'demo'
              ? 'bg-teal-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Teacher Demonstration Script
        </button>

        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeSubTab === 'architecture'
              ? 'bg-teal-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          Architecture & Flow
        </button>
      </div>

      {/* TAB: 22 VIVA QUESTIONS */}
      {activeSubTab === 'questions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search viva questions..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Question List Accordion */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isOpen = expandedQuestion === q.id;
              return (
                <div
                  key={q.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedQuestion(isOpen ? null : q.id)}
                    className="w-full text-left p-4 flex items-start justify-between gap-4 hover:bg-slate-850/60 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {q.id}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">{q.question}</h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400/80 mt-0.5 inline-block">
                          Category: {q.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs font-mono shrink-0">
                      {isOpen ? '▲ Hide' : '▼ Show'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-300 space-y-3">
                      <div className="p-3.5 bg-slate-900/90 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-line">
                        <strong className="text-teal-300 block mb-1 font-semibold">
                          Recommended Answer for Examiner:
                        </strong>
                        {q.answer}
                      </div>

                      {q.proTip && (
                        <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded text-amber-200/90 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Viva Tip:</strong> {q.proTip}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No viva questions match your search query. Try another term.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: 1-MINUTE PRESENTATION SPEECH */}
      {activeSubTab === 'speech' && (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Clock className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white">
              1-Minute Presentation Speech (Easy to Memorize)
            </h3>
          </div>

          <div className="bg-slate-950 p-5 rounded-lg border border-teal-500/30 text-slate-200 text-sm leading-relaxed space-y-3">
            <p className="font-semibold text-teal-300">
              "Respected teachers and examiner, good morning."
            </p>
            <p>
              "My project is titled <strong>MedShield</strong>: an Information Security Phishing Detector and
              Training Tool designed specifically for <strong>Al-Shifa Medical Clinic</strong> in Gulberg, Sahiwal.
            </p>
            <p>
              "Healthcare clinic staff—such as receptionists, lab technicians, and nurses—handle confidential patient
              medical records daily. Attackers frequently send deceptive emails, such as fake laboratory reports or urgent
              billing alerts, trying to steal credentials or infect clinic computers."
            </p>
            <p>
              "To solve this problem, MedShield provides two simple, working solutions:
              <br />
              <strong>First</strong>, a <strong>Phishing Email Detector</strong> implemented in Python using rule-based
              scoring. It checks urgent wording, credential requests, suspicious links, deadlines, and look-alike domains,
              calculating an explainable score out of 9.
              <br />
              <strong>Second</strong>, an interactive <strong>Staff Training Quiz</strong> built into a Java Swing desktop
              GUI with 5 real healthcare scenarios to educate staff."
            </p>
            <p>
              "The Java GUI connects seamlessly to the Python detector using Java's <code>ProcessBuilder</code>, requiring
              no external servers or heavy libraries. I am now ready to demonstrate the working application."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded border border-slate-800">
              <strong className="text-teal-400 block mb-1">Time to Deliver</strong>
              <p className="text-slate-400">Approximately 55 to 65 seconds when spoken at a calm, confident pace.</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded border border-slate-800">
              <strong className="text-teal-400 block mb-1">Key Keywords Mentioned</strong>
              <p className="text-slate-400">Al-Shifa Clinic, Java Swing, Python Rule-Based, ProcessBuilder, Score /9.</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded border border-slate-800">
              <strong className="text-teal-400 block mb-1">Examiner Impression</strong>
              <p className="text-slate-400">Shows deep problem understanding and clear division between UI and engine.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TEACHER DEMONSTRATION SCRIPT */}
      {activeSubTab === 'demo' && (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white">
              Teacher Demonstration Script (Exact Steps for High Marks)
            </h3>
          </div>

          <p className="text-xs text-slate-300">
            Follow these 4 sequential steps when the examiner asks you to demonstrate MedShield running live on your laptop:
          </p>

          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs">1</span>
                Launch the Application
              </div>
              <p className="text-xs text-slate-300">
                Open Command Prompt in your folder and run <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">java MedShieldApp</code>.
                Show the examiner the clean Java Swing window with the Al-Shifa Clinic branding and the two tabs.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs">2</span>
                Test the Phishing Email Example (High Risk)
              </div>
              <p className="text-xs text-slate-300">
                Click <strong>"Load Phishing Sample"</strong>. Point out to the examiner:
                <br />- Sender: <code className="text-sky-300">lab-reports@cl1nic-labs.com</code> (digit '1' instead of 'i').
                <br />- Subject: <em>"Urgent Patient Lab Report Ready, Verify Now"</em> (urgent language).
                <br />- Body: Mentions <em>"within 24 hours"</em>, <em>"link below"</em>, and <em>"log in"</em>.
                <br />Click <strong>"Analyze Email"</strong>. Show how Python returned <strong>Score 9 / 9 Points (HIGH RISK)</strong> with all 5 warning signs listed.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs">3</span>
                Test the Routine Clinic Email Example (Low Risk)
              </div>
              <p className="text-xs text-slate-300">
                Click <strong>"Load Clean Sample"</strong>. It enters Dr. Ahmed's routine meeting announcement.
                Click <strong>"Analyze Email"</strong>. Point out that the output displays <strong>Score 0 / 9 (LOW RISK)</strong> and explicitly states:
                <em>"No obvious warning signs found"</em> rather than naively claiming "completely safe".
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs">4</span>
                Demonstrate the Staff Training Quiz
              </div>
              <p className="text-xs text-slate-300">
                Switch to Tab 2 (Staff Training Quiz). Select Option C for Question 1 (verifying directly with lab phone number).
                Click <strong>"Submit Answer"</strong> to show the instant green feedback explanation.
                Click <strong>"Next Question"</strong> to show smooth progression and final scoring.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ARCHITECTURE & FLOW */}
      {activeSubTab === 'architecture' && (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white">System Architecture & Data Flow</h3>
          </div>

          {/* Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-teal-500/30">
              <div className="text-xs font-bold uppercase text-teal-400 mb-2">1. Java Swing UI</div>
              <h4 className="font-semibold text-white text-sm mb-2">MedShieldApp.java</h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                <li>User inputs sender, subject, and body text.</li>
                <li>Validates non-empty fields.</li>
                <li>Invokes <code>ProcessBuilder("python", ...)</code>.</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-sky-500/30">
              <div className="text-xs font-bold uppercase text-sky-400 mb-2">2. Inter-Process Pipe</div>
              <h4 className="font-semibold text-white text-sm mb-2">ProcessBuilder & Streams</h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                <li>Passes text safely into Python process.</li>
                <li>Zero HTTP/REST API overhead.</li>
                <li>BufferedReader reads stdout text stream.</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-emerald-500/30">
              <div className="text-xs font-bold uppercase text-emerald-400 mb-2">3. Python Engine</div>
              <h4 className="font-semibold text-white text-sm mb-2">medshield_detector.py</h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                <li>Applies 5 rule-based checks.</li>
                <li>Calculates score out of 9.</li>
                <li>Formats report and prints to stdout.</li>
              </ul>
            </div>
          </div>

          {/* Scoring Table */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-300 mb-3">
              MedShield 9-Point Scoring Matrix
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-teal-300">
                    <th className="py-2 px-3">Rule #</th>
                    <th className="py-2 px-3">Warning Sign Checked</th>
                    <th className="py-2 px-3">Points</th>
                    <th className="py-2 px-3">Keywords / Patterns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-2 px-3 font-mono">Rule 1</td>
                    <td className="py-2 px-3">Urgent / Pressure Language</td>
                    <td className="py-2 px-3 font-bold text-teal-400">2 pts</td>
                    <td className="py-2 px-3 text-slate-400">urgent, immediately, act now, asap</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">Rule 2</td>
                    <td className="py-2 px-3">Login / Password Requests</td>
                    <td className="py-2 px-3 font-bold text-teal-400">2 pts</td>
                    <td className="py-2 px-3 text-slate-400">login, password, verify account, sign in</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">Rule 3</td>
                    <td className="py-2 px-3">Suspicious Links / Wording</td>
                    <td className="py-2 px-3 font-bold text-teal-400">2 pts</td>
                    <td className="py-2 px-3 text-slate-400">http://, https://, click here, link below</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">Rule 4</td>
                    <td className="py-2 px-3">Threatening Deadlines</td>
                    <td className="py-2 px-3 font-bold text-teal-400">2 pts</td>
                    <td className="py-2 px-3 text-slate-400">within 24 hours, account disabled, suspended</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">Rule 5</td>
                    <td className="py-2 px-3">Unusual Digits in Domain</td>
                    <td className="py-2 px-3 font-bold text-teal-400">1 pt</td>
                    <td className="py-2 px-3 text-slate-400">Domain portion contains digits (cl1nic-labs.com)</td>
                  </tr>
                  <tr className="bg-slate-900/60 font-semibold text-white">
                    <td colSpan={2} className="py-2.5 px-3">Maximum Total Possible Score:</td>
                    <td colSpan={2} className="py-2.5 px-3 text-teal-400 font-bold">9 Points</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
