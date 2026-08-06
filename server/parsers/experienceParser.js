/**
 * Work Experience Parser
 * Extracts Company Name, Job Title, Duration, Location, and Responsibilities for each entry.
 */

const { PATTERNS } = require('../utils/regexHelpers');
const { splitIntoLines, cleanBulletPoints } = require('../utils/textUtils');

const KNOWN_TITLES = [
  'Software Engineer', 'Senior Software Engineer', 'Full Stack Developer', 'Frontend Developer',
  'Backend Developer', 'Web Developer', 'DevOps Engineer', 'Data Scientist', 'Data Analyst',
  'Product Manager', 'Project Manager', 'System Architect', 'Solutions Architect', 'UI/UX Designer',
  'QA Engineer', 'Test Engineer', 'Software Developer', 'Intern', 'Software Engineering Intern',
  'Lead Developer', 'Technical Lead', 'Engineering Manager'
];

/**
 * Parses the Work Experience section text into structured array of items.
 * @param {string} expText
 * @returns {Array<Object>} List of work experience entries
 */
function parseExperience(expText) {
  if (!expText || expText.trim().length === 0) return [];

  const lines = splitIntoLines(expText);
  const experiences = [];
  let currentEntry = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for employment date pattern (e.g. "Jan 2023 - Present" or "2020 - 2022")
    const dateRangeMatch = line.match(PATTERNS.YEAR_RANGE) || line.match(PATTERNS.MONTH_YEAR);
    const durationStr = dateRangeMatch ? dateRangeMatch[0] : '';

    // Check if line contains a known job title or looks like a company / title header line
    const matchedTitle = KNOWN_TITLES.find(title => new RegExp(`\\b${title}\\b`, 'i').test(line));

    const isHeaderLine = durationStr || matchedTitle || (i === 0 && !line.startsWith('•') && !line.startsWith('-'));

    if (isHeaderLine) {
      if (currentEntry) {
        experiences.push(formatEntry(currentEntry));
      }

      currentEntry = {
        company: '',
        title: matchedTitle || '',
        duration: durationStr,
        location: '',
        responsibilities: []
      };

      // Extract location if present (e.g., "San Francisco, CA" or "New York, USA")
      const locMatch = line.match(PATTERNS.LOCATION);
      if (locMatch) {
        currentEntry.location = locMatch[0];
      }

      // Try to parse Company and Title from the header line
      const cleanLineWithoutDate = line.replace(PATTERNS.YEAR_RANGE, '').replace(PATTERNS.MONTH_YEAR, '').replace(PATTERNS.LOCATION, '').trim();

      if (cleanLineWithoutDate) {
        const parts = cleanLineWithoutDate.split(/\s+[\-\|@–—]\s+/);
        if (parts.length >= 2) {
          if (!currentEntry.title) currentEntry.title = parts[0].trim();
          currentEntry.company = parts[1].trim();
        } else if (!currentEntry.company && !currentEntry.title) {
          if (matchedTitle) {
            currentEntry.company = cleanLineWithoutDate.replace(new RegExp(matchedTitle, 'gi'), '').replace(/[\-\|@,]/g, '').trim();
          } else {
            currentEntry.company = cleanLineWithoutDate;
          }
        }
      }
    } else if (currentEntry) {
      const cleanedPoint = cleanBulletPoints(line);
      if (cleanedPoint) {
        currentEntry.responsibilities.push(cleanedPoint);
      }
    }
  }

  if (currentEntry) {
    experiences.push(formatEntry(currentEntry));
  }

  return experiences;
}

function formatEntry(entry) {
  return {
    company: entry.company || 'N/A',
    title: entry.title || 'Software Engineer',
    duration: entry.duration || 'N/A',
    location: entry.location || '',
    description: entry.responsibilities.join(' ').trim()
  };
}

module.exports = {
  parseExperience
};
