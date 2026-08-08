import React from 'react';
import { Target, CheckCircle2, XCircle, Lightbulb, TrendingUp } from 'lucide-react';

export default function JobMatchCard({ jdMatch }) {
  if (!jdMatch) return null;

  const { matchScore = 0, verdict = 'N/A', summary = '', matchedSkills = [], missingSkills = [], tailoringSuggestions = [] } = jdMatch;

  const getScoreColor = (score) => {
    if (score >= 75) return 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/30';
    if (score >= 55) return 'from-amber-500 to-orange-600 text-amber-400 border-amber-500/30';
    return 'from-rose-500 to-red-600 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="mb-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl p-6 shadow-xl transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-stone-200 dark:border-stone-800 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">Target Job Description Match</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Keyword gap analysis and alignment report</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl border font-bold text-sm bg-stone-100 dark:bg-stone-800 ${getScoreColor(matchScore)}`}>
            {verdict}
          </div>
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 shadow-inner">
            <span className="text-xl font-black text-stone-900 dark:text-white">{matchScore}%</span>
          </div>
        </div>
      </div>

      {summary && (
        <p className="text-sm text-stone-600 dark:text-stone-300 mb-6 bg-stone-50 dark:bg-stone-950/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800 leading-relaxed">
          {summary}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Matched Skills & Technologies ({matchedSkills.length})</span>
          </div>
          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400">No exact skill matches identified.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20">
          <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400 font-semibold text-sm">
            <XCircle className="w-4 h-4" />
            <span>Missing JD Skills & Requirements ({missingSkills.length})</span>
          </div>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-500">All core JD technical requirements matched!</p>
          )}
        </div>
      </div>

      {/* Tailoring Recommendations */}
      {tailoringSuggestions.length > 0 && (
        <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Resume Tailoring Recommendations</span>
          </div>
          <ul className="space-y-2">
            {tailoringSuggestions.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
