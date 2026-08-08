import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Briefcase, GraduationCap, Code2, Award, FileText, CheckCircle2,
  ExternalLink, Github, Linkedin, Globe, Mail, Phone, MapPin, Download, RefreshCw, Layers,
  ShieldCheck, Target, AlertTriangle, Check, ArrowLeft, Users
} from 'lucide-react';

import SectionCard from '../components/SectionCard';
import JSONViewer from '../components/JSONViewer';
import LoadingSkeleton from '../components/LoadingSkeleton';
import JobMatchCard from '../components/JobMatchCard';
import BatchLeaderboard from '../components/BatchLeaderboard';
import { getSampleParsedData } from '../services/api';

export default function ResultPage() {
  const [data, setData] = useState(null);
  const [batchCandidates, setBatchCandidates] = useState(null);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null);
  const [fileName, setFileName] = useState('sample_output.json');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'json', or 'leaderboard'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedBatch = localStorage.getItem('parsedBatchCandidates');
    const cachedSingle = localStorage.getItem('parsedResumeResult');
    const cachedName = localStorage.getItem('parsedFileName');

    if (cachedBatch) {
      try {
        const candidates = JSON.parse(cachedBatch);
        if (candidates && candidates.length > 0) {
          setBatchCandidates(candidates);
          setData(candidates[0].fullData);
          setFileName(candidates[0].fileName || 'batch_resumes.json');
          setActiveTab('leaderboard');
          setLoading(false);
          return;
        }
      } catch (e) {}
    }

    if (cachedSingle) {
      try {
        setData(JSON.parse(cachedSingle));
        if (cachedName) setFileName(cachedName);
        setActiveTab('dashboard');
        setLoading(false);
      } catch (e) {
        fetchSampleData();
      }
    } else {
      fetchSampleData();
    }
  }, []);

  const fetchSampleData = async () => {
    setLoading(true);
    try {
      const res = await getSampleParsedData();
      if (res.success) {
        setData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidateFromBatch = (candidateFullData) => {
    setData(candidateFullData);
    setActiveTab('dashboard');
  };

  if (loading) return <LoadingSkeleton />;
  if (!data && !batchCandidates) {
    return <div className="text-center py-20 text-[#001524]/60 dark:text-[#FDE5D4]/60">No parsed resume data available.</div>;
  }

  const ai = data?.aiAssessment || {};
  const atsScore = ai.atsScore || 85;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-[#D6CC99]/40 dark:border-[#445D48]/40">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#445D48] dark:text-[#D6CC99]">
            Extraction & AI Analysis Results
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001524] dark:text-[#FDE5D4]">
            {activeTab === 'leaderboard' ? 'Batch Candidate Leaderboard' : (data?.name || 'Candidate Resume')}
          </h1>
          <p className="text-xs text-[#001524]/60 dark:text-[#FDE5D4]/60 mt-1 font-medium">
            {batchCandidates ? `${batchCandidates.length} Resumes Batch Processed` : `File: ${fileName}`}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#FDE5D4]/40 dark:bg-[#071E2E] p-1 rounded-xl border border-[#D6CC99]/40 dark:border-[#445D48]/40">
            {batchCandidates && (
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'leaderboard'
                    ? 'bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] shadow-sm'
                    : 'text-[#001524]/70 dark:text-[#FDE5D4]/70'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Leaderboard</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] shadow-sm'
                  : 'text-[#001524]/70 dark:text-[#FDE5D4]/70'
              }`}
            >
              Structured View
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'json'
                  ? 'bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] shadow-sm'
                  : 'text-[#001524]/70 dark:text-[#FDE5D4]/70'
              }`}
            >
              Raw JSON
            </button>
          </div>

          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-[#FDE5D4] dark:text-[#001524] bg-gradient-to-r from-[#445D48] to-[#5E3023] dark:from-[#D6CC99] dark:to-[#FDE5D4] shadow-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Upload Another</span>
          </Link>
        </div>
      </div>

      {/* Render Leaderboard View */}
      {activeTab === 'leaderboard' && batchCandidates ? (
        <BatchLeaderboard
          candidates={batchCandidates}
          onSelectCandidate={handleSelectCandidateFromBatch}
        />
      ) : activeTab === 'json' ? (
        <JSONViewer data={data} filename={fileName} />
      ) : (
        /* Render Structured Single Candidate View */
        <div className="space-y-8">
          
          {batchCandidates && (
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-[#445D48] dark:text-[#D6CC99] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Candidate Leaderboard</span>
            </button>
          )}

          {/* Feature 1: Target Job Description Match Card */}
          {data.jdMatch && <JobMatchCard jdMatch={data.jdMatch} />}

          {/* Google Gemini AI Assessment & ATS Score Hero Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#D6CC99]/60 dark:border-[#445D48]/50 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#D6CC99]/40 dark:border-[#445D48]/40">
              
              {/* Score Dial & Verdict Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#445D48] via-[#5E3023] to-[#D6CC99] p-1 flex items-center justify-center shadow-xl shrink-0">
                  <div className="w-full h-full rounded-full bg-[#FAF4ED] dark:bg-[#001524] flex flex-col items-center justify-center text-center p-2">
                    <span className="text-2xl font-black text-[#001524] dark:text-[#FDE5D4] leading-none">
                      {atsScore}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#445D48] dark:text-[#D6CC99] mt-0.5">
                      ATS SCORE
                    </span>
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] shadow-sm mb-2">
                    <span>{ai.assetVerdict || 'High-Value Asset'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#001524] dark:text-[#FDE5D4]">
                    Gemini AI Candidate Assessment
                  </h2>
                  <p className="text-xs text-[#001524]/75 dark:text-[#FDE5D4]/75 font-medium mt-1 max-w-2xl leading-relaxed">
                    {ai.verdictSummary || 'Candidate demonstrates excellent technical qualifications, structured layout formatting, and strong industry alignment.'}
                  </p>
                </div>
              </div>

              {/* Recommended Job Roles */}
              {ai.recommendedRoles && ai.recommendedRoles.length > 0 && (
                <div className="w-full md:w-auto space-y-2 shrink-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#445D48] dark:text-[#D6CC99] block">
                    Recommended Roles
                  </span>
                  <div className="flex flex-wrap md:flex-col gap-1.5">
                    {ai.recommendedRoles.map((role, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-xs font-extrabold bg-[#FDE5D4] dark:bg-[#445D48]/40 text-[#445D48] dark:text-[#D6CC99] border border-[#D6CC99]/40">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ATS Score Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(ai.scoreBreakdown || { formatting: 90, skillRelevance: 88, experienceImpact: 85, educationQualifications: 92 }).map(([key, val]) => (
                <div key={key} className="p-3.5 rounded-2xl bg-[#FDE5D4]/50 dark:bg-[#071E2E]/60 border border-[#D6CC99]/40 dark:border-[#445D48]/40">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#001524]/70 dark:text-[#FDE5D4]/70 tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-xs font-black text-[#445D48] dark:text-[#D6CC99]">
                      {val}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#D6CC99]/40 dark:bg-[#445D48]/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#445D48] to-[#5E3023] dark:from-[#D6CC99] dark:to-[#FDE5D4] rounded-full"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Key Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Strengths */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#445D48] dark:text-[#D6CC99] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Key Candidate Strengths</span>
                </h4>
                <ul className="space-y-1.5 text-xs font-medium text-[#001524]/85 dark:text-[#FDE5D4]/85">
                  {(ai.keyStrengths || [
                    'Extensive experience with modern technical stacks.',
                    'Clear, readable resume structure with zero formatting errors.',
                    'Proven project accomplishments with measurable technical metrics.'
                  ]).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99] shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#5E3023] dark:text-[#D6CC99] flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span>ATS Improvement Suggestions</span>
                </h4>
                <ul className="space-y-1.5 text-xs font-medium text-[#001524]/85 dark:text-[#FDE5D4]/85">
                  {(ai.areasForImprovement || [
                    'Add quantifiable metric achievements to secondary work experience.',
                    'Include certification credential URLs for instant recruiter verification.',
                    'Ensure all project entries list specific frameworks used.'
                  ]).map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#5E3023] dark:text-[#D6CC99] shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Structured Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Personal Info & Skills */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Personal Details Card */}
              <SectionCard title="Personal Details" icon={User}>
                <div className="space-y-3">
                  {data.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99] shrink-0" />
                      <span className="truncate font-mono">{data.email}</span>
                    </div>
                  )}
                  {data.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99] shrink-0" />
                      <span className="font-mono">{data.phone}</span>
                    </div>
                  )}
                  {data.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99] shrink-0" />
                      <span>{data.location}</span>
                    </div>
                  )}
                  {data.linkedin && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99] shrink-0" />
                      <a href={data.linkedin} target="_blank" rel="noreferrer" className="hover:underline truncate font-mono text-xs">
                        {data.linkedin}
                      </a>
                    </div>
                  )}
                  {data.github && (
                    <div className="flex items-center gap-3">
                      <Github className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99] shrink-0" />
                      <a href={data.github} target="_blank" rel="noreferrer" className="hover:underline truncate font-mono text-xs">
                        {data.github}
                      </a>
                    </div>
                  )}
                  {data.portfolio && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99] shrink-0" />
                      <a href={data.portfolio} target="_blank" rel="noreferrer" className="hover:underline truncate font-mono text-xs">
                        {data.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Categorized Skills Card */}
              <SectionCard title="Categorized Skills" icon={Code2}>
                <div className="space-y-4">
                  {Object.entries(data.skills || {}).map(([cat, skillsList]) => {
                    if (!Array.isArray(skillsList) || skillsList.length === 0) return null;
                    return (
                      <div key={cat} className="space-y-1.5">
                        <h4 className="text-[10px] font-extrabold uppercase text-[#001524]/60 dark:text-[#FDE5D4]/60 tracking-wider">
                          {cat}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsList.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#FDE5D4] dark:bg-[#445D48]/40 text-[#445D48] dark:text-[#D6CC99] border border-[#D6CC99]/40"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>

            {/* Right Column: Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Summary */}
              {data.summary && (
                <SectionCard title="Professional Summary" icon={FileText}>
                  <p className="leading-relaxed font-medium">
                    {data.summary}
                  </p>
                </SectionCard>
              )}

              {/* Work Experience */}
              {data.experience && data.experience.length > 0 && (
                <SectionCard title="Work Experience" icon={Briefcase} badgeCount={data.experience.length}>
                  <div className="space-y-6">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-[#445D48] dark:border-[#D6CC99] pl-4 space-y-1">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <h4 className="font-extrabold text-[#001524] dark:text-[#FDE5D4] text-base">
                            {exp.title}
                          </h4>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FDE5D4] dark:bg-[#071E2E] text-[#445D48] dark:text-[#D6CC99] border border-[#D6CC99]/40">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-[#5E3023] dark:text-[#D6CC99]">
                          {exp.company} {exp.location ? `• ${exp.location}` : ''}
                        </p>
                        <p className="text-xs pt-1 leading-relaxed font-medium">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Education */}
              {data.education && data.education.length > 0 && (
                <SectionCard title="Education" icon={GraduationCap} badgeCount={data.education.length}>
                  <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#FDE5D4]/40 dark:bg-[#071E2E]/60 border border-[#D6CC99]/40 dark:border-[#445D48]/40">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-extrabold text-[#001524] dark:text-[#FDE5D4]">
                              {edu.degree}
                            </h4>
                            <p className="text-xs font-bold text-[#445D48] dark:text-[#D6CC99]">
                              {edu.college || edu.university}
                            </p>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#001524]/60 dark:text-[#FDE5D4]/60">
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>
                        {(edu.cgpa || edu.percentage) && (
                          <p className="text-xs font-extrabold text-[#445D48] dark:text-[#D6CC99] mt-2">
                            Score: {edu.cgpa || edu.percentage}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Projects */}
              {data.projects && data.projects.length > 0 && (
                <SectionCard title="Projects" icon={Layers} badgeCount={data.projects.length}>
                  <div className="space-y-4">
                    {data.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#FDE5D4]/40 dark:bg-[#071E2E]/60 border border-[#D6CC99]/40 dark:border-[#445D48]/40 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-[#001524] dark:text-[#FDE5D4]">
                            {proj.name}
                          </h4>
                          {proj.github && (
                            <a href={proj.github} target="_blank" rel="noreferrer" className="text-xs font-bold hover:underline flex items-center gap-1 text-[#445D48] dark:text-[#D6CC99]">
                              <span>GitHub</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed font-medium">
                          {proj.description}
                        </p>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.technologies.map((t, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524]">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Certifications & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.certifications && data.certifications.length > 0 && (
                  <SectionCard title="Certifications" icon={Award}>
                    <ul className="space-y-2 text-xs font-medium">
                      {data.certifications.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99] shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                )}

                {data.achievements && data.achievements.length > 0 && (
                  <SectionCard title="Achievements" icon={Award}>
                    <ul className="space-y-2 text-xs font-medium">
                      {data.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#5E3023] dark:text-[#D6CC99] shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
