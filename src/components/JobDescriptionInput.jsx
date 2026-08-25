import React from 'react';
import { Briefcase, Sparkles, Trash2 } from 'lucide-react';

const SAMPLE_JOB_DESCRIPTION = `Job Title: Senior Full-Stack Cloud Engineer (AI Solutions)
Location: Remote / Hybrid | Department: Cloud Engineering

ABOUT THE ROLE:
We are seeking an experienced Senior Full-Stack Cloud Engineer to lead the design and execution of next-generation AI-powered cloud applications. In this role, you will build scalable RESTful APIs on AWS serverless architecture, craft ultra-responsive React frontends, and integrate generative AI foundation models (Bedrock, OpenAI, RAG).

KEY RESPONSIBILITIES:
- Architect and develop modern, responsive web applications using React.js, JavaScript, HTML5/Tailwind CSS, and Vite.
- Design high-performance serverless microservices on AWS (Lambda, API Gateway, DynamoDB, S3, ECS).
- Build and optimize LLM integrations, AI agents, and RAG pipelines using AWS Bedrock and Python/Node.js.
- Champion CI/CD automation, Docker containerization, Terraform infrastructure as code, and unit/integration testing.
- Collaborate with product managers and UX designers to build accessible, user-centric interfaces.
- Perform code reviews, conduct security audits, and mentor engineering team members.

REQUIRED QUALIFICATIONS:
- 4+ years of professional full-stack web development experience.
- Deep expertise in React.js, JavaScript/TypeScript, and modern CSS frameworks.
- Strong practical knowledge of AWS Serverless (Lambda, API Gateway, DynamoDB, S3).
- Hands-on experience with AI APIs (AWS Bedrock, OpenAI, Anthropic) and vector databases.
- Proficient in Docker, Git, CI/CD automated pipelines (GitHub Actions), and Terraform.
- Excellent communication, problem-solving skills, and ownership mindset.

PREFERRED QUALIFICATIONS:
- AWS Certified Solutions Architect or Developer Associate.
- Experience with Kubernetes, Redis caching, and micro-frontend architecture.`;

export default function JobDescriptionInput({ value, onChange, disabled }) {
  const handleLoadSample = () => {
    onChange(SAMPLE_JOB_DESCRIPTION);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col h-full border border-slate-800 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Job Description</h2>
            <p className="text-xs text-slate-400">Paste target job description & requirements</p>
          </div>
        </div>

        {/* Quick Sample Action */}
        <button
          type="button"
          onClick={handleLoadSample}
          disabled={disabled}
          className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 hover:bg-blue-900/50 hover:border-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          title="Fill with a sample job description"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Load Sample</span>
        </button>
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 flex flex-col min-h-[300px]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste the job description here..."
          className="w-full flex-1 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all font-mono leading-relaxed disabled:opacity-60"
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
