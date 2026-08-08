const { calculateFallbackJdMatch, extractJdKeywords } = require('../services/jdMatcherService');

describe('JD Matcher Service', () => {
  const sampleResume = {
    name: 'Jane Doe',
    summary: 'Experienced Full Stack Engineer specializing in React, Node.js, and MongoDB microservices.',
    skills: {
      languages: ['JavaScript', 'TypeScript', 'Python'],
      frameworks: ['React', 'Node.js', 'Express'],
      databases: ['MongoDB', 'PostgreSQL']
    },
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Corp',
        description: 'Built REST APIs and scalable React UI components.'
      }
    ]
  };

  const sampleJd = `
    We are looking for a Senior Full Stack Engineer with strong experience in React, Node.js, TypeScript, PostgreSQL, and Docker.
    Knowledge of AWS microservices and unit testing with Jest is a huge plus.
  `;

  test('extractJdKeywords identifies technical keywords from JD', () => {
    const keywords = extractJdKeywords(sampleJd);
    expect(keywords).toContain('react');
    expect(keywords).toContain('node.js');
    expect(keywords).toContain('typescript');
    expect(keywords).toContain('postgresql');
    expect(keywords).toContain('docker');
  });

  test('calculateFallbackJdMatch calculates match score and identifies matched vs missing skills', () => {
    const result = calculateFallbackJdMatch(sampleResume, sampleJd);
    expect(result).not.toBeNull();
    expect(result.matchScore).toBeGreaterThan(0);
    expect(result.matchedSkills.map(s => s.toLowerCase())).toContain('react');
    expect(result.matchedSkills.map(s => s.toLowerCase())).toContain('node.js');
    expect(result.missingSkills.map(s => s.toLowerCase())).toContain('docker');
    expect(Array.isArray(result.tailoringSuggestions)).toBe(true);
  });

  test('calculateFallbackJdMatch returns null when JD is empty', () => {
    const result = calculateFallbackJdMatch(sampleResume, '');
    expect(result).toBeNull();
  });
});
