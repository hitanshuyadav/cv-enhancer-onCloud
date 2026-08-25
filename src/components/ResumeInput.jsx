import React, { useState, useRef } from 'react';
import { FileText, Upload, Trash2, Sparkles, AlertCircle, FileCheck } from 'lucide-react';

const SAMPLE_RESUME = `Hitanshu Yadav
Senior Full-Stack Cloud & AI Engineer | Bengaluru, India
Email: hitanshu@example.com | LinkedIn: linkedin.com/in/hitanshuyadav

PROFESSIONAL SUMMARY:
Accomplished Full-Stack Engineer with 5+ years of experience designing high-scale cloud platforms, REST APIs, and modern frontend web applications. Expert in React, Node.js, Python, AWS cloud services (Lambda, API Gateway, DynamoDB, S3, Bedrock AI), and DevOps pipelines. Proven track record of optimizing application performance by 40% and deploying AI agent integrations.

SKILLS & CORE COMPETENCIES:
- Frontend: React.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, Tailwind CSS, Vite, Redux
- Backend & Cloud: Node.js, Python, Express, AWS (Lambda, API Gateway, DynamoDB, S3, ECS, CloudFront)
- AI & ML: Bedrock AI, OpenAI API, LangChain, RAG Systems, Vector Databases
- Databases: PostgreSQL, MongoDB, DynamoDB, Redis
- Tools & CI/CD: Docker, Git, GitHub Actions, Terraform, Jest, Cypress

WORK EXPERIENCE:
Senior Cloud Software Engineer | TechSolutions Inc. (2022 - Present)
- Architected resilient serverless APIs processing 2M+ daily requests on AWS Lambda & DynamoDB.
- Spearheaded migration of legacy frontend apps to React + Vite, reducing initial page load times by 45%.
- Integrated AWS Bedrock AI models for real-time natural language text processing and document analytics.
- Mentored junior engineers and enforced strict code review and accessibility standards.

Software Engineer | Innovate Cloud Labs (2020 - 2022)
- Built interactive analytics dashboards using React, Tailwind CSS, and WebSocket connections.
- Designed scalable PostgreSQL relational database schemas and optimized complex SQL queries.
- Automated deployment workflows using GitHub Actions and AWS SAM framework.

EDUCATION:
Bachelor of Technology (B.Tech) in Computer Science & Engineering
Grade: First Class with Distinction`;

export default function ResumeInput({ value, onChange, disabled }) {
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    setFileName(file.name);

    const ext = file.name.split('.').pop().toLowerCase();
    
    if (ext === 'txt' || ext === 'md') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (text && typeof text === 'string') {
          onChange(text);
        }
      };
      reader.onerror = () => {
        setFileError('Could not read text file content.');
      };
      reader.readAsText(file);
    } else {
      // For PDF / DOCX, since the endpoint expects plain text string:
      // Prompt user or read raw text if available
      setFileError(`Selected "${file.name}". Note: For best results with this API endpoint, text was extracted or paste raw text below.`);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          // Clean non-printable bytes
          const cleanedText = content.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
          if (cleanedText.length > 50) {
            onChange(cleanedText);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSample = () => {
    onChange(SAMPLE_RESUME);
    setFileName('Sample_Resume.txt');
    setFileError('');
  };

  const handleClear = () => {
    onChange('');
    setFileName('');
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col h-full border border-slate-800 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Your Resume</h2>
            <p className="text-xs text-slate-400">Paste your resume or upload a file</p>
          </div>
        </div>

        {/* Quick Sample Action */}
        <button
          type="button"
          onClick={handleLoadSample}
          disabled={disabled}
          className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          title="Fill with a high-quality sample resume"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Sample</span>
        </button>
      </div>

      {/* File Upload Dropzone / Button */}
      <div className="mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.md,.pdf,.docx,.doc"
          disabled={disabled}
          className="hidden"
          id="resume-file-input"
        />
        <label
          htmlFor="resume-file-input"
          className={`flex items-center justify-between px-4 py-2.5 rounded-xl border border-dashed text-xs font-medium cursor-pointer transition-all ${
            fileName
              ? 'bg-slate-900/80 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900/40 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex items-center gap-2 truncate">
            <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">
              {fileName ? `File: ${fileName}` : 'Upload PDF, DOCX or TXT file...'}
            </span>
          </div>
          {fileName && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shrink-0">
              Loaded
            </span>
          )}
        </label>
        {fileError && (
          <p className="mt-1.5 text-[11px] text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{fileError}</span>
          </p>
        )}
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 flex flex-col min-h-[260px]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste your resume here..."
          className="w-full flex-1 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-all font-mono leading-relaxed disabled:opacity-60"
        />
        
        {/* Footer info inside textarea */}
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500">
          <span>{value ? `${value.trim().split(/\s+/).filter(Boolean).length} words` : '0 words'}</span>
          <div className="flex items-center gap-3">
            <span>{value.length} characters</span>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
