import React from 'react';
import { Cpu, ShieldCheck, CheckCircle, Code, Layers, FileCode } from 'lucide-react';

import { GradientShimmer } from '@/components/ui/gradient-shimmer';

export default function AboutPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          <GradientShimmer gradient="sunrise" className="font-extrabold">
            About ParseX Resume Engine
          </GradientShimmer>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
          ParseX is an enterprise-grade modular Node.js & React application for extracting structured candidate data from unstructured PDF resumes.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-500" />
          <span>Parser Pipeline Architecture</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The parser converts binary PDF data into normalized plaintext, uses regex-driven section detection heuristics to split the document into isolated logical text blocks, and then processes each block using specialized sub-parsers:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Section Detector</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Personal Info Parser</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Skills Categorization Engine</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Work Experience Parser</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Education & Scores Parser</li>
          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Projects & Links Parser</li>
        </ul>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-brand-500" />
          <span>REST API Endpoints</span>
        </h2>
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl flex items-center justify-between">
            <span className="font-bold text-emerald-400">POST /api/parser/upload</span>
            <span className="text-slate-400">Accepts multipart PDF resume file</span>
          </div>
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl flex items-center justify-between">
            <span className="font-bold text-blue-400">GET /api/parser/sample</span>
            <span className="text-slate-400">Returns pre-formatted sample JSON</span>
          </div>
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl flex items-center justify-between">
            <span className="font-bold text-purple-400">GET /api/parser/download/:filename</span>
            <span className="text-slate-400">Downloads extracted JSON file</span>
          </div>
        </div>
      </div>
    </div>
  );
}
