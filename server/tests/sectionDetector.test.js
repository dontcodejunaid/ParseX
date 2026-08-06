const { identifyHeaderKey, detectSections } = require('../parsers/sectionDetector');

describe('Section Detector Module', () => {
  test('should correctly identify standard section titles', () => {
    expect(identifyHeaderKey('WORK EXPERIENCE')).toBe('experience');
    expect(identifyHeaderKey('Technical Skills')).toBe('skills');
    expect(identifyHeaderKey('ACADEMIC BACKGROUND')).toBe('education');
    expect(identifyHeaderKey('PERSONAL PROJECTS')).toBe('projects');
    expect(identifyHeaderKey('Certifications')).toBe('certifications');
    expect(identifyHeaderKey('AWARDS & HONORS')).toBe('achievements');
    expect(identifyHeaderKey('PROFESSIONAL SUMMARY')).toBe('summary');
  });

  test('should return null for non-header text', () => {
    expect(identifyHeaderKey('Building scalable web applications with Node.js')).toBeNull();
    expect(identifyHeaderKey('john.doe@example.com')).toBeNull();
  });

  test('should segment full resume text into section blocks', () => {
    const rawText = `
John Doe
Software Engineer

PROFESSIONAL SUMMARY
Senior developer with 5 years experience.

TECHNICAL SKILLS
Languages: JavaScript, Python

WORK EXPERIENCE
Senior Engineer at Tech Corp
2021 - Present

EDUCATION
B.Tech from Stanford
    `;

    const sections = detectSections(rawText);

    expect(sections.summary).toContain('Senior developer with 5 years experience');
    expect(sections.skills).toContain('Languages: JavaScript, Python');
    expect(sections.experience).toContain('Senior Engineer at Tech Corp');
    expect(sections.education).toContain('B.Tech from Stanford');
  });
});
