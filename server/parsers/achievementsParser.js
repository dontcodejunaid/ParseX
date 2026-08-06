/**
 * Achievements and Awards Parser
 */

const { splitIntoLines, cleanBulletPoints } = require('../utils/textUtils');

/**
 * Parses achievements section into structured array of achievement entries.
 * @param {string} achText
 * @returns {Array<string>} List of achievement entries
 */
function parseAchievements(achText) {
  if (!achText || achText.trim().length === 0) return [];

  const lines = splitIntoLines(achText);
  const achievements = [];

  for (const line of lines) {
    const cleaned = cleanBulletPoints(line);
    if (cleaned && cleaned.length > 3) {
      achievements.push(cleaned);
    }
  }

  return achievements;
}

module.exports = {
  parseAchievements
};
