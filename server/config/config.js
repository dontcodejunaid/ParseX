/**
 * Application Configuration & Environment Variables
 */

const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB limit
  UPLOAD_DIR: path.resolve(__dirname, '../uploads'),
  OUTPUT_DIR: path.resolve(__dirname, '../output'),
  SAMPLE_JSON_PATH: path.resolve(__dirname, '../../sample_output.json')
};
