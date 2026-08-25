import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ResumeInput from './components/ResumeInput';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisProgress from './components/AnalysisProgress';
import AnalysisResults from './components/AnalysisResults';
import Footer from './components/Footer';

import { submitResume, getAnalysis } from './services/api';
import { Sparkles, AlertCircle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const POLLING_INTERVAL_MS = 2000;
const MAX_POLLING_DURATION_MS = 300000; // 5 minutes

export default function App() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'processing' | 'completed' | 'failed'
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const pollTimerRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const analyzerRef = useRef(null);

  // Clear all timers safely
  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const scrollToAnalyzer = () => {
    if (analyzerRef.current) {
      analyzerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    stopPolling();
    setResume('');
    setJobDescription('');
    setRequestId(null);
    setStatus('idle');
    setAnalysisData(null);
    setError(null);
    setElapsedSeconds(0);
    scrollToAnalyzer();
  };

  // Submit Handler
  const handleAnalyzeResume = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    // 1. Validation
    if (!resume || !resume.trim()) {
      setError('Please enter or upload your resume before analyzing.');
      return;
    }
    if (!jobDescription || !jobDescription.trim()) {
      setError('Please enter a job description before analyzing.');
      return;
    }

    // 2. Set submitting state
    setStatus('submitting');

    try {
      // 3. Send POST request ONLY ONCE
      console.log('[App] Starting POST /analyze-cv');
      const submitResult = await submitResume(resume, jobDescription);
      console.log('[App] POST success:', submitResult);

      const returnedId = submitResult.request_id;
      if (!returnedId) {
        throw new Error('Server response did not include a valid request_id.');
      }

      // 4. Save returned request_id & transition state
      setRequestId(returnedId);
      setStatus('processing');
      setElapsedSeconds(0);
      startTimeRef.current = Date.now();

      // Start elapsed seconds ticker
      elapsedTimerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      // 5. Start Polling GET /analysis/{request_id}
      startPollingLoop(returnedId);

    } catch (err) {
      console.error('[App Error] Submit failed:', err);
      setStatus('idle');

      if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
        setError('Unable to connect to the analysis service. Please check your internet connection.');
      } else {
        setError('Unable to submit your resume. Please try again.');
      }
    }
  };

  // Polling loop logic
  const startPollingLoop = (idToPoll) => {
    stopPolling();

    // Re-start elapsed timer
    startTimeRef.current = startTimeRef.current || Date.now();
    elapsedTimerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    const executePoll = async () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;

      // Check max timeout (5 minutes)
      if (elapsed >= MAX_POLLING_DURATION_MS) {
        console.warn(`[App] Polling timed out after ${elapsed} ms.`);
        stopPolling();
        setStatus('failed');
        setError('Analysis is taking longer than expected. Please try again later.');
        return;
      }

      try {
        const pollResult = await getAnalysis(idToPoll);
        console.log('[App] Poll result status:', pollResult?.status);

        if (pollResult.status === 'COMPLETED') {
          stopPolling();
          setAnalysisData(pollResult);
          setStatus('completed');
          console.log('[App] Polling COMPLETED successfully!');
        } else if (pollResult.status === 'FAILED') {
          stopPolling();
          setStatus('failed');
          setError(pollResult.message || 'AI analysis failed. Please try submitting your resume again.');
        } else {
          // Status is PROCESSING or unknown, continue polling...
          console.log('[App] Still PROCESSING. Waiting for next interval...');
        }
      } catch (err) {
        console.error('[App Error] Polling request error:', err);
        // If single poll fails due to transient network error, continue polling unless explicitly fatal
      }
    };

    // Immediate first check
    executePoll();

    // Set recurring 2000ms interval
    pollTimerRef.current = setInterval(executePoll, POLLING_INTERVAL_MS);
  };

  const isInputDisabled = status === 'submitting' || status === 'processing';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar onReset={handleReset} />

      {/* Hero Section */}
      <Hero onStartClick={scrollToAnalyzer} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Main Workspace / Analyzer Section */}
      <main id="analyzer" ref={analyzerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Workspace Title Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Workspace</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            CV & Job Description Matcher
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Provide your details below to generate instant ATS score & optimization insights
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm flex items-start justify-between gap-3 shadow-xl animate-fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Submission Notice</span>
                <span>{error}</span>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 text-xs font-bold px-2 py-1 rounded bg-rose-900/40 border border-rose-500/30 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Display based on status */}
        {status === 'processing' ? (
          <AnalysisProgress 
            requestId={requestId} 
            elapsedSeconds={elapsedSeconds} 
          />
        ) : status === 'completed' ? (
          <AnalysisResults 
            analysisData={analysisData} 
            requestId={requestId} 
            onReset={handleReset} 
          />
        ) : (
          /* Input Form & Analyze Button */
          <form onSubmit={handleAnalyzeResume} className="space-y-8">
            {/* Two Column Input Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[420px]">
              {/* Left Column: Resume Input */}
              <ResumeInput
                value={resume}
                onChange={setResume}
                disabled={isInputDisabled}
              />

              {/* Right Column: Job Description Input */}
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                disabled={isInputDisabled}
              />
            </div>

            {/* Analyze Action Button */}
            <div className="flex flex-col items-center justify-center pt-4">
              <button
                type="submit"
                disabled={isInputDisabled}
                className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${
                  status === 'submitting' || status === 'processing'
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01]'
                }`}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    <span>Submitting...</span>
                  </>
                ) : status === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    <span>AI Analysis in Progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                    <span>Analyze Resume</span>
                    <ArrowRight className="w-5 h-5 text-white/80" />
                  </>
                )}
              </button>

              <p className="text-slate-500 text-xs mt-3 flex items-center gap-1">
                <span>Free instant analysis</span> • <span>No credentials required</span>
              </p>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
