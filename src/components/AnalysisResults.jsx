import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, Lightbulb, UserCheck, Award, 
  FileText, Copy, Check, RefreshCw, Layers, ShieldCheck, HelpCircle, AlertCircle
} from 'lucide-react';
import ScoreCard from './ScoreCard';

/**
 * Intelligent helper to extract numeric ATS score from raw text
 */
function extractAtsScore(rawText) {
  if (!rawText) return null;

  // Try matching "82/100", "82 / 100", "Score: 82", etc.
  const scoreRegex = /(?:ATS\s*(?:Compatibility\s*)?Score|Score|Compatibility)[:\s]*(\d{1,3})\s*(?:\/|out of|\s*)\s*100/i;
  const match = rawText.match(scoreRegex);
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    if (!isNaN(val) && val >= 0 && val <= 100) return val;
  }

  // Fallback: search any "XX/100" or "XX / 100" pattern
  const fallbackRegex = /(\d{1,3})\s*\/\s*100/;
  const fallbackMatch = rawText.match(fallbackRegex);
  if (fallbackMatch && fallbackMatch[1]) {
    const val = parseInt(fallbackMatch[1], 10);
    if (!isNaN(val) && val >= 0 && val <= 100) return val;
  }

  return null;
}

/**
 * Smart section extractor for bedock response text
 */
function parseAnalysisSections(rawText) {
  if (!rawText) return {};

  const sections = {
    atsScore: extractAtsScore(rawText),
    matchingSkills: [],
    missingSkills: [],
    weaknesses: [],
    recommendations: [],
    improvedSummary: '',
    finalVerdict: '',
  };

  // Helper to split text by lines or bullet points
  const extractItems = (textChunk) => {
    if (!textChunk) return [];
    return textChunk
      .split('\n')
      .map(line => line.replace(/^[\s\-\*\•\d\.\)]+/, '').trim())
      .filter(line => line.length > 1 && !line.match(/^(matching|missing|skills|recommendations|weaknesses|verdict)/i));
  };

  try {
    // Regex matching section headers regardless of markdown syntax or numbers
    const findSection = (keywords) => {
      const regexStr = `(?:(?:\\d+\\.\\s*)|(?:#{1,6}\\s*)|(?:\\*\\*))?(${keywords.join('|')})(?:\\*\\*)?[:\\n]`;
      const regex = new RegExp(regexStr, 'i');
      const match = rawText.match(regex);
      if (!match) return '';

      const startIndex = match.index + match[0].length;
      // Look for next section header or end of string
      const nextHeaderRegex = /(?:\n\s*(?:\d+\.|\#{1,6}|\*\*[A-Z])|\n\s*(?:Matching|Missing|Weaknesses|Recommendations|Improved|Final Verdict))/i;
      const subText = rawText.slice(startIndex);
      const nextMatch = subText.match(nextHeaderRegex);

      if (nextMatch) {
        return subText.slice(0, nextMatch.index).trim();
      }
      return subText.trim();
    };

    const matchingChunk = findSection(['Matching Skills', 'Matched Skills', 'Key Skills Matched']);
    const missingChunk = findSection(['Missing Skills', 'Key Skills Missing', 'Skills Gaps', 'Missing Qualifications']);
    const weaknessesChunk = findSection(['Resume Weaknesses', 'Weaknesses', 'Areas for Improvement', 'Resume Gaps']);
    const recommendationsChunk = findSection(['Recommendations', 'Actionable Recommendations', 'Suggested Improvements']);
    const summaryChunk = findSection(['Improved Professional Summary', 'Enhanced Summary', 'Suggested Summary', 'Professional Summary']);
    const verdictChunk = findSection(['Final Verdict', 'Verdict', 'Overall Assessment', 'Conclusion']);

    if (matchingChunk) sections.matchingSkills = extractItems(matchingChunk);
    if (missingChunk) sections.missingSkills = extractItems(missingChunk);
    if (weaknessesChunk) sections.weaknesses = extractItems(weaknessesChunk);
    if (recommendationsChunk) sections.recommendations = extractItems(recommendationsChunk);
    if (summaryChunk) sections.improvedSummary = summaryChunk.replace(/^["'\s]+|["'\s]+$/g, '');
    if (verdictChunk) sections.finalVerdict = verdictChunk;

  } catch (err) {
    console.warn('[Parser] Custom section parse failed, falling back to full text render:', err);
  }

  return sections;
}

export default function AnalysisResults({ analysisData, requestId, onReset }) {
  const [summaryCopied, setSummaryCopied] = useState(false);

  const rawAnalysis = analysisData?.analysis || (typeof analysisData === 'string' ? analysisData : '');
  const processedAt = analysisData?.processed_at ? new Date(analysisData.processed_at).toLocaleString() : new Date().toLocaleString();

  const parsed = parseAnalysisSections(rawAnalysis);
  const atsScore = parsed.atsScore;

  const handleCopySummary = () => {
    if (parsed.improvedSummary) {
      navigator.clipboard.writeText(parsed.improvedSummary);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 2000);
    }
  };

  return (
    <div id="results" className="max-w-5xl mx-auto my-8 space-y-8 animate-fade-in">
      {/* Top Results Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Analysis Completed</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {processedAt}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Resume Analysis
          </h2>
          
          <p className="text-xs text-slate-400 font-mono mt-1">
            Request ID: <span className="text-cyan-300 font-bold">{requestId}</span>
          </p>
        </div>

        {/* Action Button: Analyze Another Resume */}
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-sm font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>Analyze Another Resume</span>
        </button>
      </div>

      {/* ATS Score Card Component */}
      {atsScore !== null && (
        <ScoreCard score={atsScore} />
      )}

      {/* Main Extracted Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matching Skills */}
        {parsed.matchingSkills.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-slate-950/40 flex flex-col shadow-lg">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Matching Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsed.matchingSkills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {parsed.missingSkills.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-slate-950/40 flex flex-col shadow-lg">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Missing Skills & Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsed.missingSkills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 rounded-lg bg-amber-950/50 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resume Weaknesses */}
      {parsed.weaknesses.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 bg-slate-950/40 shadow-lg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Resume Weaknesses</h3>
          </div>
          <ul className="space-y-2.5">
            {parsed.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {parsed.recommendations.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-slate-950/40 shadow-lg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Actionable Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {parsed.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-200 leading-relaxed">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improved Professional Summary with 1-click Copy */}
      {parsed.improvedSummary && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-slate-950/40 to-slate-950/60 shadow-xl relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Improved Professional Summary</h3>
                <p className="text-xs text-slate-400">AI-optimized for impact and key job keywords</p>
              </div>
            </div>

            <button
              onClick={handleCopySummary}
              className="px-3.5 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800/80 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Copy summary to clipboard"
            >
              {summaryCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-blue-400" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 text-sm leading-relaxed font-sans italic relative">
            "{parsed.improvedSummary}"
          </div>
        </div>
      )}

      {/* Final Verdict */}
      {parsed.finalVerdict && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 shadow-xl">
          <div className="flex items-center gap-2.5 mb-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Final Verdict</h3>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed font-medium">
            {parsed.finalVerdict}
          </p>
        </div>
      )}

      {/* Complete Formatted Analysis View (Always available for full accuracy) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Full AI Analysis Text
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Raw Bedrock Response</span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 overflow-x-auto max-h-[500px] overflow-y-auto">
          {rawAnalysis}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Analyze Another Resume</span>
        </button>
      </div>
    </div>
  );
}
