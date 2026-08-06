import axios from 'axios';

const API_BASE_URL = '/api/parser';

export const uploadResumePdf = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('resume', file);

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

export const getSampleParsedData = async () => {
  const response = await axios.get(`${API_BASE_URL}/sample`);
  return response.data;
};

export const downloadParsedJsonUrl = (filename = 'sample_output.json') => {
  return `${API_BASE_URL}/download/${filename}`;
};
