import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, Trash2, ArrowRight, Target, ChevronDown, ChevronUp, Files } from 'lucide-react';
import { Component as QuantumPulseLoader } from './ui/quantum-pulse-loade';

export default function FileUploader({ onUploadSubmit, isUploading, progress }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const validateAndAddFiles = (fileList) => {
    setErrorMsg('');
    const valid = [];
    let err = '';

    Array.from(fileList).forEach((file) => {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        err = 'Only PDF files are supported.';
      } else if (file.size > 10 * 1024 * 1024) {
        err = 'Files must be under 10MB each.';
      } else {
        valid.push(file);
      }
    });

    if (err) setErrorMsg(err);
    if (valid.length > 0) {
      setSelectedFiles((prev) => {
        const combined = [...prev, ...valid];
        // unique by name
        const unique = [];
        const seen = new Set();
        combined.forEach(f => {
          if (!seen.has(f.name)) {
            seen.add(f.name);
            unique.push(f);
          }
        });
        return unique;
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (selectedFiles.length <= 1 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;
    onUploadSubmit({
      files: selectedFiles,
      jobDescription
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Upload Zone */}
      {selectedFiles.length === 0 ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50/80 dark:hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Drag & Drop your Resume PDF(s) here
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Support single PDF or <span className="text-brand-600 dark:text-brand-400 font-semibold underline">batch upload multiple resumes</span>
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <span>Supports standard PDF formats (Up to 20 files, 10MB each)</span>
          </div>
        </div>
      ) : (
        /* Selected Files List Card */
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Files className="w-5 h-5 text-brand-500" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Selected Resumes ({selectedFiles.length})
              </span>
            </div>

            <button
              onClick={handleClearAll}
              disabled={isUploading}
              className="text-xs text-rose-500 hover:underline disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                {!isUploading && (
                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {!isUploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              + Add more resumes
            </button>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
          />

          {/* Loader */}
          {isUploading && (
            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-4">
              <QuantumPulseLoader />

              <div className="w-full">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1 font-mono">
                  <span>Processing & Parsing Resumes...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isUploading && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>
                  {selectedFiles.length > 1 ? `Process Batch (${selectedFiles.length})` : 'Extract Resume Data'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Target Job Description Collapsible Box */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 transition-all">
        <button
          type="button"
          onClick={() => setShowJdInput(!showJdInput)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Target className="w-4 h-4 text-amber-500" />
            <span>🎯 Target Job Description Matcher (Optional)</span>
            {jobDescription && <span className="text-[10px] text-emerald-500 font-normal">(JD Attached)</span>}
          </div>
          {showJdInput ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showJdInput && (
          <div className="mt-3">
            <textarea
              rows={4}
              placeholder="Paste job posting or role requirements text here to calculate Match Score (%) and identify missing skills..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        )}
      </div>

      {/* Error Toast / Alert */}
      {errorMsg && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
