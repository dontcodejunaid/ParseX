import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import Toast from '../components/Toast';
import { uploadResumePdf, uploadBatchResumes } from '../services/api';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  const handleUploadSubmit = async ({ files, jobDescription }) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    try {
      if (files.length === 1) {
        // Single File Upload
        const file = files[0];
        const result = await uploadResumePdf(file, jobDescription, (percent) => {
          setProgress(percent);
        });

        if (result.success) {
          setToastType('success');
          setToastMessage('Resume parsed successfully!');
          localStorage.removeItem('parsedBatchCandidates');
          localStorage.setItem('parsedResumeResult', JSON.stringify(result.data));
          localStorage.setItem('parsedFileName', result.fileName || file.name);

          setTimeout(() => {
            navigate('/result');
          }, 800);
        } else {
          throw new Error(result.error || 'Failed to parse resume');
        }
      } else {
        // Multi-File Batch Processing
        const result = await uploadBatchResumes(files, jobDescription, (percent) => {
          setProgress(percent);
        });

        if (result.success && result.candidates) {
          setToastType('success');
          setToastMessage(`Batch of ${result.candidates.length} resumes processed!`);
          localStorage.removeItem('parsedResumeResult');
          localStorage.setItem('parsedBatchCandidates', JSON.stringify(result.candidates));

          setTimeout(() => {
            navigate('/result');
          }, 800);
        } else {
          throw new Error(result.error || 'Failed to process batch resumes');
        }
      }
    } catch (err) {
      setToastType('error');
      setToastMessage(err.response?.data?.error || err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          <GradientShimmer gradient="sunrise" className="font-extrabold">
            Upload PDF Resumes
          </GradientShimmer>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Select single or batch PDF files to extract structured details, score ATS compliance, and match against target job postings.
        </p>
      </div>

      <FileUploader
        onUploadSubmit={handleUploadSubmit}
        isUploading={isUploading}
        progress={progress}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
}
