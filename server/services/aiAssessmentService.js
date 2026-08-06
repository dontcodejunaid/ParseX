/**
 * AI Assessment & ATS Scoring Service using Google Gemini 1.5 Flash
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Calculates rule-based fallback ATS score and candidate evaluation
 * when Gemini API key is missing or quota is exceeded.
 * @param {Object} resumeData
 * @returns {Object} Fallback AI Assessment
 */
function calculateFallbackAssessment(resumeData) {
  let score = 50;

  // Contact details (+15)
  if (resumeData.email) score += 5;
  if (resumeData.phone) score += 5;
  if (resumeData.linkedin || resumeData.github) score += 5;

  // Summary (+10)
  if (resumeData.summary && resumeData.summary.length > 30) score += 10;

  // Skills (+15)
  const totalSkills = Object.values(resumeData.skills || {}).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
  if (totalSkills > 5) score += 15;
  else if (totalSkills > 0) score += 8;

  // Experience (+20)
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += 20;
  }

  // Education (+15)
  if (resumeData.education && resumeData.education.length > 0) score += 15;

  // Projects (+10)
  if (resumeData.projects && resumeData.projects.length > 0) score += 10;

  // Cap at 98 max
  score = Math.min(score, 95);

  const isHighValue = score >= 75;
  const isModerate = score >= 55;

  return {
    atsScore: score,
    scoreBreakdown: {
      formatting: Math.min(score + 2, 98),
      skillRelevance: Math.min(score - 3, 95),
      experienceImpact: Math.min(score - 5, 92),
      educationQualifications: Math.min(score + 4, 96)
    },
    assetVerdict: isHighValue ? 'High-Value Asset' : (isModerate ? 'Promising Candidate' : 'Requires Enhancement'),
    verdictSummary: isHighValue
      ? `${resumeData.name || 'The candidate'} demonstrates strong technical qualifications, clear professional formatting, and relevant industry skills.`
      : `${resumeData.name || 'The candidate'} has a solid foundational resume but could benefit from adding more quantifiable metrics and expanded project descriptions.`,
    keyStrengths: [
      totalSkills > 0 ? `Strong skill set across ${totalSkills} technical competencies.` : 'Clear contact information provided.',
      resumeData.experience && resumeData.experience.length > 0 ? `Proven work history with ${resumeData.experience.length} experience entries.` : 'Valid educational background.',
      resumeData.github || resumeData.linkedin ? 'Active professional social profiles provided.' : 'Formatted section headers.'
    ],
    areasForImprovement: [
      'Add quantifiable metric achievements (e.g. percentages, user counts, performance gains).',
      'Include specific project live demo URLs alongside GitHub repository links.',
      'Ensure all employment durations include full start and end months.'
    ],
    recommendedRoles: [
      resumeData.skills?.languages?.includes('JavaScript') ? 'Full Stack Developer' : 'Software Engineer',
      'Backend Engineer',
      'Frontend Specialist'
    ]
  };
}

/**
 * Evaluates Candidate ATS Score and Asset Verdict using Google Gemini API.
 * @param {Object} resumeData
 * @returns {Promise<Object>} Structured Assessment Object
 */
async function generateAIAssessment(resumeData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    return calculateFallbackAssessment(resumeData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeAIModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert HR Executive & Senior Technical Recruiter. Analyze the following candidate resume JSON data.
      Calculate an accurate Applicant Tracking System (ATS) Score (0 to 100) and evaluate whether the candidate is a valuable asset to hiring teams.

      Return ONLY a valid JSON object matching EXACTLY this structure:
      {
        "atsScore": 88,
        "scoreBreakdown": {
          "formatting": 90,
          "skillRelevance": 85,
          "experienceImpact": 85,
          "educationQualifications": 90
        },
        "assetVerdict": "High-Value Asset",
        "verdictSummary": "Detailed summary explaining why the candidate is or isn't a valuable asset.",
        "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
        "areasForImprovement": ["Improvement 1", "Improvement 2", "Improvement 3"],
        "recommendedRoles": ["Role 1", "Role 2", "Role 3"]
      }

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
    console.warn(`[Gemini API Warning] Falling back to rule-based evaluation: ${error.message}`);
    return calculateFallbackAssessment(resumeData);
  }
}

module.exports = {
  generateAIAssessment,
  calculateFallbackAssessment
};
