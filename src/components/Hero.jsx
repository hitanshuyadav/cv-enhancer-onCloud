import React from 'react';
import { ArrowRight, Sparkles, Target, Zap, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Hero({ onStartClick }) {
  return (
    <section id="hero" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Optimize your resume for the job you want</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Make Your Resume <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Job-Ready With AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Upload your resume and job description. Our AI analyzes how well your resume matches the role and gives you actionable improvements.
        </p>

        {/* Call to Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 text-base group cursor-pointer"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Pills */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-medium">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Instant ATS Scoring</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-medium">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Keyword Gap Analysis</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Rewritten Summary</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AWS Cloud Secure</span>
          </div>
        </div>
      </div>
    </section>
  );
}
