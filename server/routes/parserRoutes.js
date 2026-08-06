/**
 * Express REST API Routes for Resume Parser
 */

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
  uploadAndParseResume,
  getSampleParsedData,
  downloadParsedJson
} = require('../controllers/parserController');

// POST /api/parser/upload
router.post('/upload', upload.single('resume'), uploadAndParseResume);

// GET /api/parser/sample
router.get('/sample', getSampleParsedData);

// GET /api/parser/download/:filename
router.get('/download/:filename', downloadParsedJson);

// GET /api/parser/download (fallback default sample download)
router.get('/download', downloadParsedJson);

module.exports = router;
