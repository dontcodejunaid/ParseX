import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import Toast from '../components/Toast';
import { uploadResumePdf } from '../services/api';

import { GradientShimmer } from '@/components/ui/gradient-shimmer';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadResumePdf(file, (percent) => {
        setProgress(percent);
      });

      if (result.success) {
        setToastType('success');
        setToastMessage('Resume parsed successfully!');
        
        // Save parsed result to localStorage for Result view
        localStorage.setItem('parsedResumeResult', JSON.stringify(result.data));
        localStorage.setItem('parsedFileName', result.fileName || file.name);

        setTimeout(() => {
          navigate('/result');
        }, 800);
      } else {
        throw new Error(result.error || 'Failed to parse resume');
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
            Upload PDF Resume
          </GradientShimmer>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Select a resume file to extract structured personal details, skills, experience, and education.
        </p>
      </div>

      <FileUploader
        onFileSelect={setSelectedFile}
        onUploadSubmit={handleUpload}
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
