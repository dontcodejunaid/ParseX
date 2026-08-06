import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { Component as QuantumPulseLoader } from './ui/quantum-pulse-loade';

export default function FileUploader({ onFileSelect, onUploadSubmit, isUploading, progress }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    setErrorMsg('');
    if (!file) return false;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF document.');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10MB limit.');
      return false;
    }

    return true;
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
      }
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Zone */}
      {!selectedFile ? (
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
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            Drag & Drop your Resume PDF here
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            or <span className="text-brand-600 dark:text-brand-400 font-semibold underline">browse files</span> from your computer
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <span>Supports standard PDF formats (Max 10MB)</span>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                </p>
              </div>
            </div>

            <button
              onClick={handleRemove}
              disabled={isUploading}
              className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors disabled:opacity-50"
              title="Remove PDF"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Quantum Pulse Loader Animation & Progress Bar */}
          {isUploading && (
            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-4">
              <QuantumPulseLoader />

              <div className="w-full">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1 font-mono">
                  <span>Uploading PDF & Parsing Sections...</span>
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
                onClick={() => onUploadSubmit(selectedFile)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Extract Resume Data</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

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
