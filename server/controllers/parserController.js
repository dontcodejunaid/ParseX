/**
 * Controller for Resume Parser REST API
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { parseResumePdf } = require('../services/resumeParserPipeline');

/**
 * Handles PDF Upload and returns parsed JSON.
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
    const parsedData = await parseResumePdf(filePath);

    // Save parsed JSON file into output directory
    if (!fs.existsSync(config.OUTPUT_DIR)) {
      fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
    }

    const outputFileName = `parsed_${Date.now()}.json`;
    const outputPath = path.join(config.OUTPUT_DIR, outputFileName);

    fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2), 'utf8');

    // Clean up temporary uploaded PDF
    fs.unlink(filePath, () => {});

    return res.status(200).json({
      success: true,
      message: 'Resume parsed successfully',
      fileName: outputFileName,
      data: parsedData
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
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
      return res.status(444).json({
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
  getSampleParsedData,
  downloadParsedJson
};
