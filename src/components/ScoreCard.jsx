import React from 'react';
import { Award, CheckCircle, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

export default function ScoreCard({ score }) {
  if (score === null || score === undefined) return null;

  let label = 'Needs Improvement';
  let badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  let textColor = 'text-rose-400';
  let strokeColor = '#f43f5e';
  let bgGlow = 'from-rose-500/10 to-rose-600/5';
  let icon = AlertCircle;

  if (score >= 80) {
    label = 'Strong Match';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    textColor = 'text-emerald-400';
    strokeColor = '#10b981';
    bgGlow = 'from-emerald-500/10 to-emerald-600/5';
    icon = CheckCircle;
  } else if (score >= 60) {
    label = 'Moderate Match';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    textColor = 'text-amber-400';
    strokeColor = '#f59e0b';
    bgGlow = 'from-amber-500/10 to-amber-600/5';
    icon = AlertTriangle;
  }

  const IconComponent = icon;
  const strokeDashoffset = 283 - (283 * Math.min(Math.max(score, 0), 100)) / 100;

  return (
    <div className={`glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-br ${bgGlow} shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden`}>
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10">
        {/* SVG Radial Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke={strokeColor}
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${textColor} tracking-tight`}>
              {score}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase -mt-1">
              / 100
            </span>
          </div>
        </div>

        {/* Text Info */}
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              ATS Compatibility Score
            </h3>
          </div>
          <p className="text-slate-300 text-sm max-w-md">
            This score reflects keyword alignment, skills coverage, and format compatibility for automated tracking systems.
          </p>

          <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
              <IconComponent className="w-3.5 h-3.5" />
              <span>{label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Decorative spark badge */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span>Analyzed via Bedrock AI</span>
      </div>
    </div>
  );
}
