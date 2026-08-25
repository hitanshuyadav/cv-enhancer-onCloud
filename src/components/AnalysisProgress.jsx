import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Clock, Copy, Check, Sparkles, Server, ShieldCheck, Cpu, FileCheck } from 'lucide-react';

export default function AnalysisProgress({ requestId, elapsedSeconds }) {
  const [copied, setCopied] = useState(false);

  const handleCopyRequestId = () => {
    if (requestId) {
      navigator.clipboard.writeText(requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto my-8 glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-center relative overflow-hidden animate-fade-in">
      {/* Top glowing ambient effect */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Animated Spinner Icon */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div className="absolute -inset-2 border-2 border-cyan-500/30 rounded-3xl animate-spin border-t-cyan-400 border-r-transparent pointer-events-none" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Analyzing Your Resume
      </h2>

      {/* Description */}
      <p className="mt-2 text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
        Your resume has been submitted successfully. Our AI is comparing your skills, experience and profile against the job description.
      </p>

      {/* Request ID Banner */}
      <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
        <span className="text-slate-500 font-semibold">Request ID:</span>
        <span className="text-cyan-300 font-bold tracking-wider">{requestId || 'Generating...'}</span>
        <button
          onClick={handleCopyRequestId}
          disabled={!requestId}
          className="ml-1 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Copy Request ID"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Timer & Live Polling Status */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Elapsed: {formatTime(elapsedSeconds)}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>Polling API every 2s</span>
        </div>
      </div>

      {/* Workflow Stages Checklist */}
      <div className="mt-8 border-t border-slate-800/80 pt-6 text-left max-w-md mx-auto space-y-3.5">
        {/* Stage 1 */}
        <div className="flex items-center gap-3 text-sm text-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">Resume submitted</span>
        </div>

        {/* Stage 2 */}
        <div className="flex items-center gap-3 text-sm text-emerald-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">Resume stored securely</span>
        </div>

        {/* Stage 3 */}
        <div className="flex items-center gap-3 text-sm text-cyan-300 font-semibold bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20">
          <div className="relative flex h-3 w-3 shrink-0 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <span>AI analysis in progress</span>
        </div>

        {/* Stage 4 */}
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 ml-0.5" />
          <span>Results ready</span>
        </div>
      </div>
    </div>
  );
}
