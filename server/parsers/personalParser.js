/**
 * Personal Information Parser
 * Extracts Full Name, Email, Phone, Social Profiles, Portfolio, and Location.
 */

const { PATTERNS } = require('../utils/regexHelpers');
const { splitIntoLines } = require('../utils/textUtils');

/**
 * Extracts candidate name from header lines or top text.
 * @param {string} headerText
 * @param {string} fullText
 * @returns {string}
 */
function extractName(headerText, fullText) {
  const lines = splitIntoLines(headerText || fullText).slice(0, 10);

  for (const line of lines) {
    // Ignore lines with emails, links, or digits
    if (PATTERNS.EMAIL.test(line) || PATTERNS.LINKEDIN.test(line) || PATTERNS.GITHUB.test(line) || /\d/.test(line)) {
      continue;
    }

    const cleanLine = line.replace(/[^a-zA-Z\s.-]/g, '').trim();

    // Ignore title terms like Resume, Curriculum Vitae, Software Engineer
    if (/^(resume|curriculum vitae|cv|page|profile|contact)$/i.test(cleanLine)) {
      continue;
    }

    // Name heuristic: 2 to 4 words, each starting with uppercase or standard title case
    const nameMatch = cleanLine.match(/^[A-Z][a-zA-Z.-]+(?:\s+[A-Z][a-zA-Z.-]+){1,3}$/);
    if (nameMatch) {
      return nameMatch[0].trim();
    }
  }

  // Fallback: check first line if non-empty
  if (lines.length > 0 && lines[0].length < 40 && !/\d/.test(lines[0])) {
    return lines[0].trim();
  }

  return '';
}

/**
 * Extracts Personal Information from full text and header section.
 * @param {string} fullText
 * @param {string} headerText
 * @returns {Object} Structured personal details
 */
function parsePersonal(fullText, headerText = '') {
  const searchSpace = `${headerText}\n${fullText}`;

  // 1. Email
  const emails = searchSpace.match(PATTERNS.EMAIL) || [];
  const email = emails.length > 0 ? emails[0].toLowerCase() : '';

  // 2. Phone
  const phones = searchSpace.match(PATTERNS.PHONE) || [];
  const validPhone = phones.find(p => p.replace(/\D/g, '').length >= 10);
  const phone = validPhone ? validPhone.trim() : '';

  // 3. LinkedIn
  const linkedinMatches = searchSpace.match(PATTERNS.LINKEDIN) || [];
  let linkedin = linkedinMatches.length > 0 ? linkedinMatches[0] : '';
  if (linkedin && !linkedin.startsWith('http')) {
    linkedin = `https://${linkedin}`;
  }

  // 4. GitHub
  const githubMatches = searchSpace.match(PATTERNS.GITHUB) || [];
  let github = githubMatches.length > 0 ? githubMatches[0] : '';
  if (github && !github.startsWith('http')) {
    github = `https://${github}`;
  }

  // 5. Portfolio / Website
  const websiteMatches = searchSpace.match(PATTERNS.PORTFOLIO) || [];
  let portfolio = '';
  for (const url of websiteMatches) {
    if (!url.includes('linkedin.com') && !url.includes('github.com') && !url.endsWith('.pdf')) {
      portfolio = url.startsWith('http') ? url : `https://${url}`;
      break;
    }
  }

  // 6. Location
  const locationMatches = searchSpace.match(PATTERNS.LOCATION) || [];
  const location = locationMatches.length > 0 ? locationMatches[0].trim() : '';

  // 7. Name
  const name = extractName(headerText, fullText);

  return {
    name,
    email,
    phone,
    linkedin,
    github,
    portfolio,
    location
  };
}

module.exports = {
  extractName,
  parsePersonal
};
