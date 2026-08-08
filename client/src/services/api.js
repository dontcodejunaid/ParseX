import axios from 'axios';

const API_BASE_URL = '/api/parser';

export const uploadResumePdf = async (file, jobDescription = '', onUploadProgress) => {
  const formData = new FormData();
  formData.append('resume', file);
  if (jobDescription) {
    formData.append('jobDescription', jobDescription);
  }

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const uploadBatchResumes = async (files, jobDescription = '', onUploadProgress) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('resumes', files[i]);
  }
  if (jobDescription) {
    formData.append('jobDescription', jobDescription);
  }

  const response = await axios.post(`${API_BASE_URL}/upload-batch`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export const exportBatchCsvApi = async (candidates) => {
  const response = await axios.post(`${API_BASE_URL}/export-csv`, { candidates }, {
    responseType: 'blob'
  });
  return response.data;
};

export const getSampleParsedData = async () => {
  const response = await axios.get(`${API_BASE_URL}/sample`);
  return response.data;
};

export const downloadParsedJsonUrl = (filename = 'sample_output.json') => {
  return `${API_BASE_URL}/download/${filename}`;
};
