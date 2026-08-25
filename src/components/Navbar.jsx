import React from 'react';
import { Sparkles, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onReset }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CVEnhancer
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wide">
              Smart Resume Optimization
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#hero" 
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Home
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#analyzer" 
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            Analyzer
          </a>
        </nav>

        {/* Badge / Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400 ml-0.5" />
            <span className="hidden sm:inline">Powered by</span> Bedrock AI
          </div>
        </div>
      </div>
    </header>
  );
}
