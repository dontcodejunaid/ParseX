/**
 * Text processing utilities for resume parsing
 */

/**
 * Normalizes raw PDF text by standardizing newlines, tabs, and spaces.
 * @param {string} text - Raw input text from PDF
 * @returns {string} Cleaned normalized string
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u00A0/g, ' ') // Non-breaking space
    .replace(/[ \t]+/g, ' ') // Collapse multiple spaces
    .replace(/\n\s+\n/g, '\n\n') // Normalize multiple empty lines
    .trim();
}

/**
 * Splits text into non-empty trimmed lines.
 * @param {string} text
 * @returns {string[]}
 */
function splitIntoLines(text) {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Checks if a string is in UPPERCASE or Title Case (looks like a section header).
 * @param {string} line
 * @returns {boolean}
 */
function isHeaderCase(line) {
  if (!line || line.length > 50) return false;
  const isUpper = line === line.toUpperCase() && /[A-Z]/.test(line);
  const isTitle = /^[A-Z][a-zA-Z0-9\s&/-]{2,35}$/.test(line);
  return isUpper || isTitle;
}

/**
 * Removes bullet points, dashes, or leading numbers from a text line.
 * @param {string} text
 * @returns {string}
 */
function cleanBulletPoints(text) {
  if (!text) return '';
  return text
    .replace(/^[\s•\-\*▪–—◦▸▪♦]+\s*/, '')
    .replace(/^\d+[\.\)]\s*/, '')
    .trim();
}

/**
 * Deduplicates array elements (case-insensitive string trim).
 * @param {string[]} arr
 * @returns {string[]}
 */
function uniqueArray(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr.filter(item => {
    if (!item) return false;
    const lower = item.trim().toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
}

module.exports = {
  normalizeText,
  splitIntoLines,
  isHeaderCase,
  cleanBulletPoints,
  uniqueArray
};
