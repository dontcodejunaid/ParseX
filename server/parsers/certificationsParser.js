/**
 * Certifications Parser
 * Extracts certification titles, issuers, and dates if present.
 */

const { splitIntoLines, cleanBulletPoints } = require('../utils/textUtils');

/**
 * Parses certifications section into structured list.
 * @param {string} certsText
 * @returns {Array<string>} Array of certification strings
 */
function parseCertifications(certsText) {
  if (!certsText || certsText.trim().length === 0) return [];

  const lines = splitIntoLines(certsText);
  const certs = [];

  for (const line of lines) {
    const cleaned = cleanBulletPoints(line);
    if (cleaned && cleaned.length > 3) {
      certs.push(cleaned);
    }
  }

  return certs;
}

module.exports = {
  parseCertifications
};
