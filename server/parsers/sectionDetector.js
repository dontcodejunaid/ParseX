/**
 * Section Detector Module
 * Identifies standard resume section headings and segments the document into sections.
 */

const { splitIntoLines } = require('../utils/textUtils');

const SECTION_HEADERS = {
  summary: [
    'summary', 'professional summary', 'executive summary', 'profile',
    'about', 'about me', 'career objective', 'objective'
  ],
  skills: [
    'skills', 'technical skills', 'core competencies', 'key skills',
    'technologies', 'expertise', 'skills & abilities', 'technical expertise'
  ],
  experience: [
    'experience', 'work experience', 'employment history', 'professional experience',
    'work history', 'career history', 'relevant experience', 'internships'
  ],
  education: [
    'education', 'academic background', 'educational background',
    'academics', 'qualifications', 'education & training'
  ],
  projects: [
    'projects', 'personal projects', 'key projects', 'academic projects',
    'featured projects', 'open source projects'
  ],
  certifications: [
    'certifications', 'licenses', 'courses', 'certificates',
    'certifications & licenses', 'professional certifications'
  ],
  achievements: [
    'achievements', 'awards', 'honors', 'accomplishments',
    'awards & achievements', 'honors & awards', 'awards & honors',
    'extracurricular activities', 'extracurriculars'
  ]
};

/**
 * Normalizes header string to match standard section key
 * @param {string} line
 * @returns {string|null} Key of section header or null if not a header match
 */
function identifyHeaderKey(line) {
  if (!line || line.length > 50) return null;

  // Clean punctuation and uppercase artifacts
  const cleanLine = line
    .toLowerCase()
    .replace(/^[:\-\*\s]+/, '')
    .replace(/[:\-\*\s]+$/, '')
    .trim();

  for (const [sectionKey, aliases] of Object.entries(SECTION_HEADERS)) {
    if (aliases.includes(cleanLine)) {
      return sectionKey;
    }
  }

  return null;
}

/**
 * Detects sections in normalized resume text.
 * @param {string} fullText
 * @returns {Object.<string, string>} Mapping of section names to section text blocks
 */
function detectSections(fullText) {
  const lines = splitIntoLines(fullText);
  const sections = {
    header: [],
    summary: [],
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: []
  };

  let currentSection = 'header';

  for (const line of lines) {
    const detectedKey = identifyHeaderKey(line);

    if (detectedKey) {
      currentSection = detectedKey;
    } else {
      sections[currentSection].push(line);
    }
  }

  // Convert array of lines to single text blocks per section
  const sectionTexts = {};
  for (const [key, valueLines] of Object.entries(sections)) {
    sectionTexts[key] = valueLines.join('\n').trim();
  }

  return sectionTexts;
}

module.exports = {
  SECTION_HEADERS,
  identifyHeaderKey,
  detectSections
};
