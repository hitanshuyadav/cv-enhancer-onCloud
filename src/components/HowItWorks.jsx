import React from 'react';
import { Upload, Cpu, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      step: '01',
      title: 'Provide Resume & Job Description',
      description: 'Paste your existing resume text and target job posting into the secure workspace.',
    },
    {
      icon: Cpu,
      step: '02',
      title: 'AWS Bedrock AI Analysis',
      description: 'Our cloud pipeline evaluates ATS match, keyword coverage, and section strengths in real time.',
    },
    {
      icon: CheckCircle,
      step: '03',
      title: 'Get Actionable Enhancements',
      description: 'Receive an ATS score, missing skills list, critique, and an improved professional summary.',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 border-y border-slate-800/60 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How CVEnhancer AI Works
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            3 simple steps to transform your resume into a interview-ready profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel p-6 rounded-2xl relative flex flex-col group hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-700 tracking-wider">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
