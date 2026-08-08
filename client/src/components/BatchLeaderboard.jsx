import React, { useState } from 'react';
import { Award, Download, Search, FileText, ArrowUpDown, ChevronRight, CheckCircle2, User } from 'lucide-react';
import { exportBatchCsvApi } from '../services/api';

export default function BatchLeaderboard({ candidates = [], onSelectCandidate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('atsScore'); // 'atsScore', 'jdMatchScore', 'name'
  const [sortOrder, setSortOrder] = useState('desc');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const data = await exportBatchCsvApi(candidates);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `candidate_leaderboard_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredCandidates = candidates
    .filter((c) => {
      const q = searchTerm.toLowerCase();
      return (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.topSkills && c.topSkills.some((s) => s.toLowerCase().includes(q)))
      );
    })
    .sort((a, b) => {
      let valA = a[sortBy] ?? -1;
      let valB = b[sortBy] ?? -1;
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl p-6 shadow-2xl">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">Batch Candidate Leaderboard</h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Processed {candidates.length} resumes sorted by suitability & score
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search candidate or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600 dark:text-stone-300">
          <thead className="bg-stone-100 dark:bg-stone-950/80 text-stone-500 dark:text-stone-400 uppercase font-semibold border-b border-stone-200 dark:border-stone-800">
            <tr>
              <th className="py-3 px-4 w-12 text-center">Rank</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Candidate</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer text-center" onClick={() => toggleSort('atsScore')}>
                <div className="flex items-center justify-center gap-1">
                  <span>ATS Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer text-center" onClick={() => toggleSort('jdMatchScore')}>
                <div className="flex items-center justify-center gap-1">
                  <span>JD Match</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Top Technical Skills</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((c, idx) => (
                <tr
                  key={c.id || idx}
                  className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectCandidate && onSelectCandidate(c.fullData)}
                >
                  <td className="py-3 px-4 text-center font-bold text-stone-400">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                        {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div>{c.name}</div>
                        <div className="text-[10px] text-stone-400 font-normal">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-bold text-xs ${
                        c.atsScore >= 75
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : c.atsScore >= 55
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {c.atsScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {c.jdMatchScore !== null && c.jdMatchScore !== undefined ? (
                      <span className="inline-block px-2.5 py-1 rounded-full font-bold text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {c.jdMatchScore}%
                      </span>
                    ) : (
                      <span className="text-stone-400 font-normal">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {(c.topSkills || []).slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] font-medium rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-500 hover:text-white transition-all text-stone-500 dark:text-stone-300">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-stone-400">
                  No candidate records matched your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
