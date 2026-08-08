/**
 * Controller for Resume Parser REST API
 * Supports single resume upload, multi-resume batch processing, JD matching, and CSV export.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('../config/config');
const { parseResumePdf } = require('../services/resumeParserPipeline');
const { matchResumeWithJd } = require('../services/jdMatcherService');

/**
 * Handles Single PDF Upload and returns parsed JSON.
 * POST /api/parser/upload
 */
async function uploadAndParseResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file uploaded. Please select a valid PDF file.'
      });
    }

    const filePath = req.file.path;
    const jobDescription = req.body.jobDescription || '';

    const parsedData = await parseResumePdf(filePath, jobDescription);

    let outputFileName = `parsed_${Date.now()}.json`;

    // Safely attempt to write output file to output dir
    try {
      if (!fs.existsSync(config.OUTPUT_DIR)) {
        fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
      }
      const outputPath = path.join(config.OUTPUT_DIR, outputFileName);
      fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2), 'utf8');
    } catch (writeErr) {
      console.warn('Could not write output file to disk:', writeErr.message);
    }

    // Clean up temporary uploaded PDF
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanErr) {}

    return res.status(200).json({
      success: true,
      message: 'Resume parsed successfully',
      fileName: outputFileName,
      data: parsedData
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanErr) {}
    }
    next(error);
  }
}

/**
 * Handles Multi-File Batch PDF Upload and returns ranked candidates.
 * POST /api/parser/upload-batch
 */
async function uploadAndParseBatchResumes(req, res, next) {
  try {
    const files = req.files || [];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No PDF files uploaded for batch processing.'
      });
    }

    const jobDescription = req.body.jobDescription || '';

    const results = await Promise.allSettled(
      files.map(async (file) => {
        try {
          const parsed = await parseResumePdf(file.path, jobDescription);
          return {
            fileName: file.originalname,
            status: 'success',
            candidate: parsed
          };
        } finally {
          if (fs.existsSync(file.path)) {
            try {
              fs.unlinkSync(file.path);
            } catch (err) {}
          }
        }
      })
    );

    const candidates = [];
    results.forEach((resItem, idx) => {
      if (resItem.status === 'fulfilled') {
        const item = resItem.value;
        const cData = item.candidate;
        candidates.push({
          id: `candidate-${idx + 1}-${Date.now()}`,
          fileName: item.fileName,
          name: cData.name || item.fileName,
          email: cData.email || 'N/A',
          phone: cData.phone || 'N/A',
          summary: cData.summary || '',
          atsScore: cData.aiAssessment?.atsScore || 50,
          assetVerdict: cData.aiAssessment?.assetVerdict || 'N/A',
          jdMatchScore: cData.jdMatch?.matchScore || null,
          jdVerdict: cData.jdMatch?.verdict || null,
          topSkills: [
            ...(cData.skills?.languages || []),
            ...(cData.skills?.frameworks || [])
          ].slice(0, 5),
          fullData: cData
        });
      }
    });

    // Sort candidates by JD match score (if present) or ATS score descending
    candidates.sort((a, b) => {
      if (a.jdMatchScore !== null && b.jdMatchScore !== null) {
        return b.jdMatchScore - a.jdMatchScore;
      }
      return b.atsScore - a.atsScore;
    });

    return res.status(200).json({
      success: true,
      count: candidates.length,
      message: `Successfully processed batch of ${candidates.length} resumes`,
      candidates
    });
  } catch (error) {
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((f) => {
        if (fs.existsSync(f.path)) {
          try {
            fs.unlinkSync(f.path);
          } catch (e) {}
        }
      });
    }
    next(error);
  }
}

/**
 * Handles Standalone JD Matching on existing candidate data.
 * POST /api/parser/match-jd
 */
async function matchJdController(req, res, next) {
  try {
    const { candidateData, jobDescription } = req.body;
    if (!candidateData || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Missing candidateData or jobDescription in request body'
      });
    }

    const jdMatch = await matchResumeWithJd(candidateData, jobDescription);

    return res.status(200).json({
      success: true,
      jdMatch
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Generates and downloads CSV file for candidate batch leaderboard.
 * POST /api/parser/export-csv
 */
function exportBatchCsv(req, res, next) {
  try {
    const { candidates } = req.body;
    if (!candidates || !Array.isArray(candidates)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid candidate dataset for CSV export'
      });
    }

    const headers = ['Rank', 'Candidate Name', 'Email', 'Phone', 'ATS Score', 'Asset Verdict', 'JD Match Score', 'Top Skills', 'File Name'];
    const rows = candidates.map((c, idx) => [
      idx + 1,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      c.atsScore || 'N/A',
      `"${(c.assetVerdict || '').replace(/"/g, '""')}"`,
      c.jdMatchScore !== null && c.jdMatchScore !== undefined ? `${c.jdMatchScore}%` : 'N/A',
      `"${(c.topSkills || []).join(', ').replace(/"/g, '""')}"`,
      `"${(c.fileName || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=candidate_leaderboard_${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns sample parsed JSON output.
 * GET /api/parser/sample
 */
function getSampleParsedData(req, res, next) {
  try {
    if (!fs.existsSync(config.SAMPLE_JSON_PATH)) {
      return res.status(404).json({
        success: false,
        error: 'Sample JSON file not found'
      });
    }

    const sampleContent = fs.readFileSync(config.SAMPLE_JSON_PATH, 'utf8');
    const data = JSON.parse(sampleContent);

    return res.status(200).json({
      success: true,
      message: 'Sample data retrieved',
      data
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Allows downloading parsed JSON file.
 * GET /api/parser/download/:filename
 */
function downloadParsedJson(req, res, next) {
  try {
    const fileName = req.params.filename || 'sample_output.json';
    let filePath;

    if (fileName === 'sample_output.json') {
      filePath = config.SAMPLE_JSON_PATH;
    } else {
      filePath = path.join(config.OUTPUT_DIR, path.basename(fileName));
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Requested JSON output file does not exist.'
      });
    }

    res.download(filePath, fileName, (err) => {
      if (err && !res.headersSent) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadAndParseResume,
  uploadAndParseBatchResumes,
  matchJdController,
  exportBatchCsv,
  getSampleParsedData,
  downloadParsedJson
};
