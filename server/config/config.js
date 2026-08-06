/**
 * Application Configuration & Environment Variables
 */

const path = require('path');
const os = require('os');
require('dotenv').config();

const isVercel = Boolean(process.env.VERCEL || process.env.NOW_REGION || process.env.AWS_EXECUTION_ENV);
const tmpDir = os.tmpdir();

module.exports = {
  PORT: process.env.PORT || 5000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB limit
  UPLOAD_DIR: isVercel ? tmpDir : path.resolve(__dirname, '../uploads'),
  OUTPUT_DIR: isVercel ? tmpDir : path.resolve(__dirname, '../output'),
  SAMPLE_JSON_PATH: path.resolve(__dirname, '../../sample_output.json')
};
