/**
 * Education Parser
 * Extracts Degree, College/University, CGPA/Percentage, Start Year, End Year.
 */

const { PATTERNS } = require('../utils/regexHelpers');
const { splitIntoLines } = require('../utils/textUtils');

/**
 * Parses Education section text into array of structured education entries.
 * @param {string} eduText
 * @returns {Array<Object>}
 */
function parseEducation(eduText) {
  if (!eduText || eduText.trim().length === 0) return [];

  const lines = splitIntoLines(eduText);
  const educationEntries = [];
  let currentEntry = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Degree match
    const degreeMatch = line.match(PATTERNS.DEGREE);
    const yearMatches = line.match(PATTERNS.SINGLE_YEAR) || [];
    const cgpaMatch = line.match(PATTERNS.CGPA);
    const percentMatch = line.match(PATTERNS.PERCENTAGE);

    const isNewEduLine = degreeMatch || yearMatches.length > 0 || (i === 0 && line.length > 3);

    if (isNewEduLine) {
      if (currentEntry) {
        educationEntries.push(formatEduEntry(currentEntry));
      }

      currentEntry = {
        degree: degreeMatch ? degreeMatch[0] : '',
        college: '',
        university: '',
        cgpa: cgpaMatch ? cgpaMatch[0].replace(/^(?:CGPA|GPA|Grade)[\s:]*/i, '').trim() : '',
        percentage: percentMatch ? percentMatch[0].replace(/^(?:Percentage|Marks|Score)[\s:]*/i, '').trim() : '',
        startYear: yearMatches[0] || '',
        endYear: yearMatches[1] || (yearMatches.length === 1 ? yearMatches[0] : ''),
        rawLines: [line]
      };

      // Try extracting institution name (College/University)
      const cleanLine = line.replace(PATTERNS.DEGREE, '').replace(PATTERNS.SINGLE_YEAR, '').replace(/[\-\|,]/g, '').trim();
      if (cleanLine) {
        if (/university|institute|college|school|academy/i.test(cleanLine)) {
          currentEntry.college = cleanLine;
          currentEntry.university = cleanLine;
        } else {
          currentEntry.college = cleanLine;
        }
      }
    } else if (currentEntry) {
      currentEntry.rawLines.push(line);

      if (!currentEntry.degree && degreeMatch) {
        currentEntry.degree = degreeMatch[0];
      }
      if (!currentEntry.cgpa && cgpaMatch) {
        currentEntry.cgpa = cgpaMatch[0].replace(/^(?:CGPA|GPA|Grade)[\s:]*/i, '').trim();
      }
      if (!currentEntry.percentage && percentMatch) {
        currentEntry.percentage = percentMatch[0].replace(/^(?:Percentage|Marks|Score)[\s:]*/i, '').trim();
      }
      if (/university|institute|college|school|academy/i.test(line)) {
        currentEntry.college = line.trim();
        currentEntry.university = line.trim();
      }
    }
  }

  if (currentEntry) {
    educationEntries.push(formatEduEntry(currentEntry));
  }

  return educationEntries;
}

function formatEduEntry(entry) {
  // Infer start and end years if not found
  const fullText = entry.rawLines.join(' ');
  const years = fullText.match(PATTERNS.SINGLE_YEAR) || [];

  const startYear = entry.startYear || (years.length > 0 ? years[0] : '');
  const endYear = entry.endYear || (years.length > 1 ? years[1] : startYear);

  return {
    degree: entry.degree || 'Bachelor of Technology',
    college: entry.college || entry.university || 'University',
    university: entry.university || entry.college || 'University',
    cgpa: entry.cgpa || '',
    percentage: entry.percentage || '',
    startYear: startYear || '',
    endYear: endYear || ''
  };
}

module.exports = {
  parseEducation
};
