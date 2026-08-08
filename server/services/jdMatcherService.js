/**
 * Job Description (JD) Matcher & Keyword Gap Analysis Service
 * Uses Google Gemini 1.5 Flash API with a deterministic rule-based fallback.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Extracts key technical terms and skills from plain text JD.
 * @param {string} jdText
 * @returns {Array<string>}
 */
function extractJdKeywords(jdText) {
  if (!jdText || typeof jdText !== 'string') return [];

  // Common technical skills and domain terms
  const commonTech = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
    'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'nest.js', 'django', 'flask', 'spring boot',
    'html', 'css', 'tailwind', 'bootstrap', 'sass', 'redux', 'graphql', 'rest api', 'microservices',
    'mongodb', 'postgresql', 'mysql', 'redis', 'dynamodb', 'sqlite', 'oracle',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd', 'git', 'github', 'jira',
    'jest', 'cypress', 'selenium', 'mocha', 'chai', 'unit testing', 'agile', 'scrum'
  ];

  const lowerJd = jdText.toLowerCase();
  const matched = [];

  for (const tech of commonTech) {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lowerJd)) {
      matched.push(tech);
    }
  }

  return Array.from(new Set(matched));
}

/**
 * Fallback deterministic JD Matcher algorithm
 * @param {Object} resumeData
 * @param {string} jdText
 * @returns {Object} JD Match Assessment
 */
function calculateFallbackJdMatch(resumeData, jdText) {
  if (!jdText || !jdText.trim()) {
    return null;
  }

  const jdKeywords = extractJdKeywords(jdText);
  
  // Aggregate candidate skills
  const candidateSkills = new Set();
  if (resumeData.skills) {
    Object.values(resumeData.skills).forEach((skillGroup) => {
      if (Array.isArray(skillGroup)) {
        skillGroup.forEach((s) => candidateSkills.add(String(s).toLowerCase().trim()));
      }
    });
  }

  // Also extract words from summary and experience description
  const candidateText = (
    (resumeData.summary || '') + ' ' +
    (resumeData.experience || []).map((e) => `${e.title || ''} ${e.description || ''}`).join(' ')
  ).toLowerCase();

  const matchedSkills = [];
  const missingSkills = [];

  jdKeywords.forEach((kw) => {
    const inSkills = Array.from(candidateSkills).some((cs) => cs.includes(kw) || kw.includes(cs));
    const inText = candidateText.includes(kw);

    if (inSkills || inText) {
      matchedSkills.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    } else {
      missingSkills.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  });

  const totalJdSkills = jdKeywords.length || 1;
  const matchRatio = matchedSkills.length / totalJdSkills;
  const matchScore = Math.min(Math.round(matchRatio * 100) + 15, 98);

  const tailoringSuggestions = [];
  if (missingSkills.length > 0) {
    tailoringSuggestions.push(`Add or highlight key missing skills: ${missingSkills.slice(0, 4).join(', ')}.`);
  }
  if (!resumeData.summary || resumeData.summary.length < 50) {
    tailoringSuggestions.push('Incorporate target job title keywords directly into your professional summary.');
  }
  tailoringSuggestions.push('Quantify key achievements in work experience to closely align with JD impact requirements.');

  return {
    matchScore,
    matchedSkills: Array.from(new Set(matchedSkills)),
    missingSkills: Array.from(new Set(missingSkills)),
    verdict: matchScore >= 75 ? 'Strong Match' : (matchScore >= 55 ? 'Moderate Match' : 'Potential Gap'),
    summary: `Candidate matches ${matchedSkills.length} out of ${totalJdSkills} key skill requirements identified in the job description.`,
    tailoringSuggestions
  };
}

/**
 * Evaluates Resume against Job Description using Google Gemini 1.5 Flash API
 * @param {Object} resumeData
 * @param {string} jdText
 * @returns {Promise<Object|null>} JD Match Analysis
 */
async function matchResumeWithJd(resumeData, jdText) {
  if (!jdText || typeof jdText !== 'string' || !jdText.trim()) {
    return null;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    return calculateFallbackJdMatch(resumeData, jdText);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeAIModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert HR Talent Acquisition Specialist. 
      Compare the candidate resume JSON data with the provided Job Description (JD).
      Calculate a accurate Job Match Score (0 to 100%) and identify skill matches and gaps.

      Return ONLY a valid JSON object matching EXACTLY this structure:
      {
        "matchScore": 85,
        "verdict": "Strong Match",
        "summary": "Concise 2-line summary of candidate alignment with this role.",
        "matchedSkills": ["Skill 1", "Skill 2"],
        "missingSkills": ["Skill A", "Skill B"],
        "tailoringSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
      }

      Job Description:
      ${jdText}

      Candidate Resume Data:
      ${JSON.stringify(resumeData, null, 2)}
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.warn(`[JD Matcher Warning] Falling back to rule-based JD analysis: ${error.message}`);
    return calculateFallbackJdMatch(resumeData, jdText);
  }
}

module.exports = {
  matchResumeWithJd,
  calculateFallbackJdMatch,
  extractJdKeywords
};
