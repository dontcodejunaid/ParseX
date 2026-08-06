/**
 * Main Resume Parser Orchestration Pipeline
 */

const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const pdfParse = require('pdf-parse');
const PDFParser = require('pdf2json');
const fs = require('fs');
const { normalizeText } = require('../utils/textUtils');
const { detectSections } = require('../parsers/sectionDetector');
const { parsePersonal } = require('../parsers/personalParser');
const { parseSummary } = require('../parsers/summaryParser');
const { parseSkills } = require('../parsers/skillsParser');
const { parseExperience } = require('../parsers/experienceParser');
const { parseEducation } = require('../parsers/educationParser');
const { parseProjects } = require('../parsers/projectsParser');
const { parseCertifications } = require('../parsers/certificationsParser');
const { parseAchievements } = require('../parsers/achievementsParser');

/**
 * Extracts raw text from PDF buffer using pdfjs-dist
 * @param {Buffer} dataBuffer
 * @returns {Promise<string>}
 */
async function extractTextPdfjs(dataBuffer) {
  const data = new Uint8Array(dataBuffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDocument = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    const pageLines = [];
    let lastY = null;
    let currentLine = '';

    for (const item of textContent.items) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        pageLines.push(currentLine.trim());
        currentLine = '';
      }
      currentLine += item.str + ' ';
      lastY = item.transform[5];
    }
    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    fullText += pageLines.join('\n') + '\n\n';
  }

  return fullText;
}

/**
 * Extracts raw text from PDF using pdf2json as fallback.
 * @param {Buffer} dataBuffer
 * @returns {Promise<string>}
 */
function extractTextPdf2Json(dataBuffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on('pdfParser_dataReady', () => {
      try {
        resolve(pdfParser.getRawTextContent());
      } catch (err) {
        reject(err);
      }
    });
    pdfParser.on('pdfParser_dataError', (errData) => {
      reject(new Error(errData.parserError || 'pdf2json error'));
    });
    pdfParser.parseBuffer(dataBuffer);
  });
}

/**
 * Parses raw text content extracted from a resume.
 * @param {string} rawText
 * @returns {Object} Structured resume JSON
 */
function parseResumeText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Invalid text input provided to parser');
  }

  const normalized = normalizeText(rawText);
  const sections = detectSections(normalized);

  const personal = parsePersonal(normalized, sections.header);
  const summary = parseSummary(sections.summary, normalized);
  const skills = parseSkills(sections.skills, normalized);
  const experience = parseExperience(sections.experience);
  const education = parseEducation(sections.education);
  const projects = parseProjects(sections.projects);
  const certifications = parseCertifications(sections.certifications);
  const achievements = parseAchievements(sections.achievements);

  return {
    name: personal.name,
    email: personal.email,
    phone: personal.phone,
    linkedin: personal.linkedin,
    github: personal.github,
    portfolio: personal.portfolio,
    location: personal.location,
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    achievements
  };
}

const { generateAIAssessment } = require('./aiAssessmentService');

/**
 * Parses PDF file buffer or path into structured JSON resume.
 * Uses high-accuracy pdfjs-dist with pdf-parse and pdf2json fallbacks.
 * @param {Buffer|string} input - PDF buffer or file path
 * @returns {Promise<Object>} Structured JSON output
 */
async function parseResumePdf(input) {
  let dataBuffer;

  if (Buffer.isBuffer(input)) {
    dataBuffer = input;
  } else if (typeof input === 'string') {
    if (!fs.existsSync(input)) {
      throw new Error(`File not found: ${input}`);
    }
    dataBuffer = fs.readFileSync(input);
  } else {
    throw new Error('Invalid input: must be file path or buffer');
  }

  let extractedText = '';

  // 1. Try pdfjs-dist (Primary)
  try {
    extractedText = await extractTextPdfjs(dataBuffer);
  } catch (err1) {
    // 2. Try pdf-parse
    try {
      const pdfData = await pdfParse(dataBuffer);
      if (pdfData && pdfData.text) {
        extractedText = pdfData.text;
      }
    } catch (err2) {
      // 3. Try pdf2json
      try {
        extractedText = await extractTextPdf2Json(dataBuffer);
      } catch (err3) {
        throw new Error(`Failed to extract text from PDF: ${err3.message}`);
      }
    }
  }

  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('No readable text found in PDF document');
  }

  const parsedData = parseResumeText(extractedText);
  
  // Attach Gemini AI ATS score & asset evaluation
  parsedData.aiAssessment = await generateAIAssessment(parsedData);

  return parsedData;
}

module.exports = {
  parseResumeText,
  parseResumePdf
};
