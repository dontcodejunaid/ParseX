/**
 * Express REST API Routes for Resume Parser
 */

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
  uploadAndParseResume,
  uploadAndParseBatchResumes,
  matchJdController,
  exportBatchCsv,
  getSampleParsedData,
  downloadParsedJson
} = require('../controllers/parserController');

// POST /api/parser/upload (Single file resume + optional JD)
router.post('/upload', upload.single('resume'), uploadAndParseResume);

// POST /api/parser/upload-batch (Multiple files resume + optional JD)
router.post('/upload-batch', upload.array('resumes', 20), uploadAndParseBatchResumes);

// POST /api/parser/match-jd (Standalone JD matcher)
router.post('/match-jd', matchJdController);

// POST /api/parser/export-csv (Download candidate leaderboard CSV)
router.post('/export-csv', exportBatchCsv);

// GET /api/parser/sample
router.get('/sample', getSampleParsedData);

// GET /api/parser/download/:filename
router.get('/download/:filename', downloadParsedJson);

// GET /api/parser/download (fallback default sample download)
router.get('/download', downloadParsedJson);

module.exports = router;
