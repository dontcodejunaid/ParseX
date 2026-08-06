/**
 * Technical Skills Parser
 * Extracts and categorizes technical skills into languages, frameworks, libraries, databases, tools & general technologies.
 */

const { SKILL_DICTIONARIES } = require('../utils/regexHelpers');
const { uniqueArray } = require('../utils/textUtils');

/**
 * Extracts and categorizes skills from the dedicated skills section and full text.
 * @param {string} skillsText - Text content of the skills section
 * @param {string} fullText - Entire resume text for contextual extraction
 * @returns {Object} Categorized skills object
 */
function parseSkills(skillsText = '', fullText = '') {
  const searchSpace = `${skillsText}\n${fullText}`;
  const lowerSpace = searchSpace.toLowerCase();

  const extracted = {
    languages: [],
    frameworks: [],
    libraries: [],
    databases: [],
    tools: [],
    technologies: []
  };

  // Match skills against dictionary terms
  for (const [category, skillList] of Object.entries(SKILL_DICTIONARIES)) {
    for (const skill of skillList) {
      // Escape special characters in skill names (e.g. C++, .NET, React.js)
      const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escapedSkill}(?:$|[^a-zA-Z0-9#+])`, 'i');

      if (regex.test(searchSpace)) {
        if (extracted[category]) {
          extracted[category].push(skill);
        }
      }
    }
  }

  // Extract explicit lists from skills section (e.g., lines starting with category titles)
  if (skillsText) {
    const lines = skillsText.split('\n');
    for (const line of lines) {
      const parts = line.split(/[:\-]/);
      if (parts.length > 1) {
        const key = parts[0].toLowerCase().trim();
        const values = parts.slice(1).join(' ').split(/[,•|;\/]/).map(v => v.trim()).filter(Boolean);

        if (key.includes('language')) {
          extracted.languages.push(...values);
        } else if (key.includes('framework')) {
          extracted.frameworks.push(...values);
        } else if (key.includes('database')) {
          extracted.databases.push(...values);
        } else if (key.includes('tool')) {
          extracted.tools.push(...values);
        } else if (key.includes('library') || key.includes('libraries')) {
          extracted.libraries.push(...values);
        } else {
          extracted.technologies.push(...values);
        }
      }
    }
  }

  // Deduplicate and format each category
  return {
    languages: uniqueArray(extracted.languages),
    frameworks: uniqueArray(extracted.frameworks),
    libraries: uniqueArray(extracted.libraries),
    databases: uniqueArray(extracted.databases),
    tools: uniqueArray(extracted.tools),
    technologies: uniqueArray(extracted.technologies)
  };
}

module.exports = {
  parseSkills
};
