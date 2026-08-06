/**
 * Summary / About / Objective Parser
 */

const { splitIntoLines } = require('../utils/textUtils');

/**
 * Extracts summary or objective section text.
 * @param {string} summarySectionText - Detected summary section content
 * @param {string} fullText - Full text for fallback search
 * @returns {string} Cleaned summary text
 */
function parseSummary(summarySectionText, fullText = '') {
  if (summarySectionText && summarySectionText.trim().length > 0) {
    return summarySectionText
      .split('\n')
      .map(l => l.trim())
      .join(' ')
      .trim();
  }

  // Fallback: search lines after header if they look like a paragraph summary
  const lines = splitIntoLines(fullText);
  if (lines.length > 2) {
    const candidateLines = lines.slice(1, 6);
    const summaryCandidate = candidateLines.filter(line => line.length > 60 && !line.includes('@'));
    if (summaryCandidate.length > 0) {
      return summaryCandidate.join(' ');
    }
  }

  return '';
}

module.exports = {
  parseSummary
};
