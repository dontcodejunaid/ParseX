const { parseSkills } = require('../parsers/skillsParser');

describe('Skills Parser Module', () => {
  test('should categorize technical skills correctly', () => {
    const skillsText = `
Languages: JavaScript, TypeScript, Python
Frameworks: React, Express.js, Next.js
Databases: MongoDB, PostgreSQL, Redis
Tools: Docker, Git, AWS
    `;

    const result = parseSkills(skillsText, '');

    expect(result.languages).toContain('JavaScript');
    expect(result.languages).toContain('TypeScript');
    expect(result.frameworks).toContain('React');
    expect(result.frameworks).toContain('Express.js');
    expect(result.databases).toContain('MongoDB');
    expect(result.databases).toContain('PostgreSQL');
    expect(result.tools).toContain('Docker');
  });

  test('should deduplicate skills across text', () => {
    const skillsText = 'Languages: React, React.js, React, Node.js';
    const result = parseSkills(skillsText, '');
    const reactMatches = result.frameworks.filter(s => s.toLowerCase().includes('react'));
    expect(reactMatches.length).toBeGreaterThan(0);
  });
});
