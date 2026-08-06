/**
 * Projects Parser
 * Extracts Project Name, Description, Technologies Used, and GitHub Links.
 */

const { PATTERNS, SKILL_DICTIONARIES } = require('../utils/regexHelpers');
const { splitIntoLines, cleanBulletPoints } = require('../utils/textUtils');

/**
 * Parses project section text into array of project entries.
 * @param {string} projectsText
 * @returns {Array<Object>}
 */
function parseProjects(projectsText) {
  if (!projectsText || projectsText.trim().length === 0) return [];

  const lines = splitIntoLines(projectsText);
  const projects = [];
  let currentProject = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for GitHub link
    const ghMatch = line.match(PATTERNS.GITHUB);
    const githubLink = ghMatch ? (ghMatch[0].startsWith('http') ? ghMatch[0] : `https://${ghMatch[0]}`) : '';

    // Check for tech stack indicators (e.g. "Tech: React, Node.js" or "Stack: Python, Django")
    const isTechLine = /^(tech(nologies)?(\s+used)?|stack|built\s+with)[:\-]/i.test(line);

    // Headline detection for project title (short line, not starting with bullet point)
    const isHeadline = (i === 0 || (!line.startsWith('•') && !line.startsWith('-') && line.length < 60 && !isTechLine));

    if (isHeadline && !isTechLine) {
      if (currentProject) {
        projects.push(formatProject(currentProject));
      }

      const cleanTitle = line.replace(PATTERNS.GITHUB, '').replace(/[\-\|:]/g, '').trim();

      currentProject = {
        name: cleanTitle || `Project ${projects.length + 1}`,
        description: [],
        technologies: [],
        github: githubLink
      };
    } else if (currentProject) {
      if (githubLink && !currentProject.github) {
        currentProject.github = githubLink;
      }

      if (isTechLine) {
        const techStr = line.split(/[:\-]/).slice(1).join(' ');
        const extractedTechs = techStr.split(/[,•|;\/]/).map(t => t.trim()).filter(Boolean);
        currentProject.technologies.push(...extractedTechs);
      } else {
        const cleanedBullet = cleanBulletPoints(line);
        if (cleanedBullet) {
          currentProject.description.push(cleanedBullet);

          // Find embedded skill names in description line
          for (const skillList of Object.values(SKILL_DICTIONARIES)) {
            for (const skill of skillList) {
              const regex = new RegExp(`\\b${skill.replace(/\+/g, '\\+')}\\b`, 'i');
              if (regex.test(cleanedBullet) && !currentProject.technologies.includes(skill)) {
                currentProject.technologies.push(skill);
              }
            }
          }
        }
      }
    }
  }

  if (currentProject) {
    projects.push(formatProject(currentProject));
  }

  return projects;
}

function formatProject(p) {
  return {
    name: p.name || 'Unnamed Project',
    description: p.description.join(' ').trim(),
    technologies: Array.from(new Set(p.technologies)),
    github: p.github || ''
  };
}

module.exports = {
  parseProjects
};
