import React, { useState } from 'react';
import { analyzeEmail, AnalysisResult } from '../utils/detectorRules';
import { QUIZ_QUESTIONS } from '../data/quizData';
import {
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Play,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Hospital,
  Sparkles,
} from 'lucide-react';

export const SwingSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'detector' | 'quiz'>('detector');

  // Detector State
  const [sender, setSender] = useState('lab-reports@cl1nic-labs.com');
  const [subject, setSubject] = useState('Urgent Patient Lab Report Ready, Verify Now');
  const [body, setBody] = useState(
    "Dear Staff,\n\nThe patient's lab report is ready. Log in through the link below within 24 hours or access will be disabled.\n\nPlease verify your credentials immediately to avoid clinical delays."
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() =>
    analyzeEmail(
      'lab-reports@cl1nic-labs.com',
      'Urgent Patient Lab Report Ready, Verify Now',
      "Dear Staff,\n\nThe patient's lab report is ready. Log in through the link below within 24 hours or access will be disabled."
    )
  );
  const [statusMessage, setStatusMessage] = useState(
    'Sample phishing email loaded. Click "Analyze Email" to run rule-based detector.'
  );

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Handlers for Detector
  const handleAnalyze = () => {
    if (!sender.trim() && !subject.trim() && !body.trim()) {
      alert('Please fill in the email information before analyzing.\nAll fields cannot be empty.');
      return;
    }
    const res = analyzeEmail(sender, subject, body);
    setAnalysisResult(res);
    setStatusMessage('Python analysis complete. Review risk score and warning signs in the report.');
  };

  const handleClear = () => {
    setSender('');
    setSubject('');
    setBody('');
    setAnalysisResult(null);
    setStatusMessage('Inputs cleared. Ready for next email analysis.');
  };

  const handleLoadPhishing = () => {
    const s = 'lab-reports@cl1nic-labs.com';
    const sub = 'Urgent Patient Lab Report Ready, Verify Now';
    const b =
      "Dear Staff,\n\nThe patient's lab report is ready. Log in through the link below within 24 hours or access will be disabled.\n\nPlease verify your credentials immediately to avoid clinical delays.";
    setSender(s);
    setSubject(sub);
    setBody(b);
    setAnalysisResult(analyzeEmail(s, sub, b));
    setStatusMessage('Sample phishing email loaded and analyzed (Score 9/9 HIGH RISK).');
  };

  const handleLoadClean = () => {
    const s = 'doctor.ahmed@alshifaclinic.com';
    const sub = 'Staff Meeting on Tuesday';
    const b =
      'Dear team,\n\nPlease remember our routine weekly staff meeting will be held in conference room B on Tuesday at 10 AM.\n\nRegards,\nDr. Ahmed\nAl-Shifa Medical Clinic';
    setSender(s);
    setSubject(sub);
    setBody(b);
    setAnalysisResult(analyzeEmail(s, sub, b));
    setStatusMessage('Sample clean routine email loaded and analyzed (Score 0/9 LOW RISK).');
  };

  // Handlers for Quiz
  const currentQuestion = QUIZ_QUESTIONS[currentQuizIndex];

  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null) {
      alert('Please select one of the four options before submitting.');
      return;
    }
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
    setStatusMessage('Quiz restarted. Question 1 of 5 loaded.');
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* Desktop OS Title Bar */}
      <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="text-xs font-mono text-slate-400 ml-2">
            Java Swing Window — MedShieldApp.java (JDK 8+ / ProcessBuilder)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded border border-teal-700/50">
            Interactive Desktop Simulator
          </span>
        </div>
      </div>

      {/* MedShield Swing Header Banner */}
      <div className="bg-[#184c78] p-5 text-white border-b border-[#123859]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Hospital className="w-6 h-6 text-cyan-300" />
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                MEDSHIELD: Phishing Detector & Training Tool
              </h2>
            </div>
            <p className="text-sm text-cyan-100 font-medium mt-1">
              Al-Shifa Medical Clinic &bull; Gulberg, Sahiwal, Punjab, Pakistan
            </p>
            <p className="text-xs text-sky-200/80 mt-0.5">
              Target Staff: Receptionists, Nurses, Lab Technicians, Billing Staff, Clinic Managers
            </p>
          </div>
          <div className="bg-[#103554]/80 px-3.5 py-2 rounded-lg border border-sky-400/30 text-xs">
            <span className="text-sky-300 font-semibold block">University Project</span>
            <span className="text-sky-100">InfoSec Viva Demonstration</span>
          </div>
        </div>
      </div>

      {/* Swing Tab Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 flex gap-2 pt-2">
        <button
          onClick={() => setActiveTab('detector')}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'detector'
              ? 'bg-slate-800 text-teal-400 border-t-2 border-t-teal-400 border-x border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          1. Phishing Email Detector
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-slate-800 text-teal-400 border-t-2 border-t-teal-400 border-x border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          2. Staff Training Quiz (5 Scenarios)
        </button>
      </div>

      {/* Main Tab Content Area */}
      <div className="p-4 md:p-6 bg-slate-900/90 min-h-[520px]">
        {activeTab === 'detector' ? (
          /* TAB 1: PHISHING EMAIL DETECTOR */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Input Form */}
            <div className="lg:col-span-6 bg-slate-800/80 p-5 rounded-lg border border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
                  <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-teal-400" />
                    Email Information (Swing Inputs)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">ProcessBuilder Input</span>
                </div>

                {/* Sender Email */}
                <div className="mb-3.5">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sender Email Address:
                  </label>
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="e.g. lab-reports@cl1nic-labs.com"
                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Rule 5 checks for deceptive digits in the domain (e.g. 1 in cl1nic).
                  </span>
                </div>

                {/* Email Subject */}
                <div className="mb-3.5">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Subject Line:
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Urgent Patient Lab Report Ready, Verify Now"
                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Email Body */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Message / Body:
                  </label>
                  <textarea
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Paste email message text here..."
                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 font-sans"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-700/80 flex flex-wrap gap-2">
                <button
                  onClick={handleAnalyze}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded text-sm flex items-center gap-1.5 transition shadow"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Analyze Email
                </button>
                <button
                  onClick={handleClear}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded text-sm transition"
                >
                  Clear Fields
                </button>
                <button
                  onClick={handleLoadPhishing}
                  className="bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-700/60 px-3 py-2 rounded text-xs transition ml-auto"
                >
                  Load Phishing Sample
                </button>
                <button
                  onClick={handleLoadClean}
                  className="bg-cyan-950/70 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/60 px-3 py-2 rounded text-xs transition"
                >
                  Load Clean Sample
                </button>
              </div>
            </div>

            {/* Right: Results / Python Output */}
            <div className="lg:col-span-6 bg-slate-950 p-5 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Python Rule-Based Analysis Output (medshield_detector.py)
                  </h3>
                  {analysisResult && (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        analysisResult.riskLevel === 'HIGH RISK'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : analysisResult.riskLevel === 'MEDIUM RISK'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {analysisResult.riskLevel} &bull; {analysisResult.score}/9 Pts
                    </span>
                  )}
                </div>

                {/* Score Cards Banner */}
                {analysisResult && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Risk Score</span>
                      <span className="text-lg font-bold text-teal-400">
                        {analysisResult.score} / 9
                      </span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Threat Level</span>
                      <span
                        className={`text-sm font-bold ${
                          analysisResult.riskLevel === 'HIGH RISK'
                            ? 'text-rose-400'
                            : analysisResult.riskLevel === 'MEDIUM RISK'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {analysisResult.riskLevel}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Signs Found</span>
                      <span className="text-lg font-bold text-slate-200">
                        {analysisResult.detectedReasons.length}
                      </span>
                    </div>
                  </div>
                )}

                {/* Monospaced Raw Report (Exact Java JTextArea View) */}
                <div className="bg-slate-900/90 rounded border border-slate-800 p-3 overflow-x-auto max-h-[360px] font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
                  {analysisResult
                    ? analysisResult.formattedReport
                    : 'Click "Analyze Email" to run rule-based detector on the entered email.'}
                </div>
              </div>

              {/* Safety Recommendation Banner */}
              {analysisResult && (
                <div
                  className={`mt-3 p-3 rounded border text-xs leading-relaxed ${
                    analysisResult.riskLevel === 'HIGH RISK'
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                      : analysisResult.riskLevel === 'MEDIUM RISK'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                  }`}
                >
                  <strong className="block mb-1 flex items-center gap-1.5 font-bold">
                    {analysisResult.riskLevel === 'HIGH RISK' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    Clinic Staff Action Required:
                  </strong>
                  {analysisResult.recommendation}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* TAB 2: STAFF TRAINING QUIZ */
          <div className="max-w-3xl mx-auto bg-slate-800/80 p-6 rounded-lg border border-slate-700 shadow-md">
            {!quizCompleted ? (
              <div>
                {/* Progress & Score Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="bg-teal-900/60 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded border border-teal-700/50">
                      Scenario {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-xs text-slate-400">
                      Category: <strong className="text-slate-200">{currentQuestion.category}</strong>
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded border border-emerald-800/50">
                    Current Score: {quizScore} / {QUIZ_QUESTIONS.length}
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="mb-5 bg-slate-900/80 p-4 rounded-lg border border-slate-700/60">
                  <h4 className="text-base font-semibold text-white leading-relaxed">
                    {currentQuestion.question}
                  </h4>
                </div>

                {/* 4 Radio Options */}
                <div className="space-y-2.5 mb-5">
                  {currentQuestion.options.map((opt, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrectAnswer = index === currentQuestion.correctIndex;
                    let optionStyle = 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500';

                    if (isAnswerSubmitted) {
                      if (isCorrectAnswer) {
                        optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                      } else if (isSelected && !isCorrectAnswer) {
                        optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                      } else {
                        optionStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-teal-950/60 border-teal-500 text-teal-100 ring-1 ring-teal-500';
                    }

                    return (
                      <label
                        key={index}
                        onClick={() => {
                          if (!isAnswerSubmitted) setSelectedOption(index);
                        }}
                        className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition text-sm ${optionStyle}`}
                      >
                        <input
                          type="radio"
                          name="quizOption"
                          checked={isSelected}
                          disabled={isAnswerSubmitted}
                          onChange={() => {
                            if (!isAnswerSubmitted) setSelectedOption(index);
                          }}
                          className="mt-0.5 text-teal-500 focus:ring-teal-400"
                        />
                        <span className="flex-1 leading-snug">{opt}</span>
                        {isAnswerSubmitted && isCorrectAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Instant Feedback Box */}
                {isAnswerSubmitted && (
                  <div
                    className={`p-4 rounded-lg border mb-5 text-xs leading-relaxed animate-in fade-in ${
                      selectedOption === currentQuestion.correctIndex
                        ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-600 text-rose-200'
                    }`}
                  >
                    <strong className="block text-sm font-bold mb-1 flex items-center gap-1.5">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          CORRECT! Well done!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          INCORRECT. Option ({String.fromCharCode(65 + currentQuestion.correctIndex)}) was the correct action.
                        </>
                      )}
                    </strong>
                    <p className="mt-1">{currentQuestion.explanation}</p>
                  </div>
                )}

                {/* Quiz Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <button
                    onClick={handleRestartQuiz}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restart Quiz
                  </button>

                  <div className="flex gap-2">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitQuizAnswer}
                        className="bg-[#184c78] hover:bg-[#133d60] text-white font-semibold px-5 py-2 rounded text-sm shadow transition"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded text-sm shadow transition"
                      >
                        {currentQuizIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question >' : 'View Final Results >'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Quiz Finished Summary */
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Training Quiz Completed!
                </h3>
                <p className="text-sm text-slate-300 mb-6">
                  Al-Shifa Medical Clinic Staff Awareness Score
                </p>

                <div className="bg-slate-900 max-w-sm mx-auto p-5 rounded-lg border border-slate-700 mb-6">
                  <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">
                    Final Result
                  </span>
                  <div className="text-4xl font-extrabold text-teal-400 mb-2">
                    {quizScore} <span className="text-lg text-slate-400 font-normal">/ {QUIZ_QUESTIONS.length}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-300">
                    Accuracy: {quizScore * 20}%
                  </div>
                  <div
                    className={`mt-3 py-1.5 px-3 rounded text-xs font-bold ${
                      quizScore === 5
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : quizScore >= 3
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                        : 'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}
                  >
                    {quizScore === 5
                      ? 'EXCELLENT: Complete Phishing Awareness'
                      : quizScore >= 3
                      ? 'GOOD: Basic Awareness Confirmed'
                      : 'NEEDS IMPROVEMENT: High Risk of Phishing'}
                  </div>
                </div>

                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                  Clinic receptionists and technicians with high scores help safeguard patient confidentiality
                  and prevent clinic ransomware infections.
                </p>

                <button
                  onClick={handleRestartQuiz}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-2.5 rounded-lg text-sm shadow inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Take Quiz Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Swing Status Bar (Bottom) */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{statusMessage}</span>
        </div>
        <div className="hidden sm:block text-slate-500 font-mono text-[11px]">
          Al-Shifa Clinic &bull; Gulberg, Sahiwal
        </div>
      </div>
    </div>
  );
};
