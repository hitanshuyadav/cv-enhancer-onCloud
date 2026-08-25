import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200 text-sm">CVEnhancer AI</span>
          <span className="text-slate-600">|</span>
          <span>Optimize your resume for the job you want</span>
        </div>

        {/* Info */}
        <div className="flex items-center gap-6 text-slate-500">
          <span>Powered by Amazon Bedrock & AWS Lambda</span>
          <span>© {new Date().getFullYear()} CVEnhancer AI</span>
        </div>
      </div>
    </footer>
  );
}
