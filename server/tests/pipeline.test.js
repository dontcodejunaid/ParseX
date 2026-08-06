const { parseResumeText } = require('../services/resumeParserPipeline');

describe('Full Resume Parsing Pipeline', () => {
  test('should parse a complete resume text into valid structured JSON', () => {
    const rawResumeText = `
Jane Doe
Email: jane.doe@tech.io | Phone: +1-555-019-9876
LinkedIn: linkedin.com/in/janedoe | GitHub: github.com/janedoe
Location: Seattle, WA

SUMMARY
Experienced Full Stack Engineer with expertise in building scalable cloud microservices.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python
Frameworks: React, Node.js, Express.js
Databases: PostgreSQL, MongoDB

WORK EXPERIENCE
Senior Full Stack Developer | Acme Corp | Jan 2022 - Present
Location: Seattle, WA
• Developed high-concurrency Node.js REST API service handling 500k requests/min.
• Built frontend dashboard using React and Tailwind CSS.

EDUCATION
Bachelor of Science in Computer Science | University of Washington | 2017 - 2021
CGPA: 3.85 / 4.0

PROJECTS
E-Commerce Engine | GitHub: github.com/janedoe/ecommerce
• Designed scalable microservices using Express, PostgreSQL, and Redis.

CERTIFICATIONS
• AWS Certified Cloud Practitioner

ACHIEVEMENTS
• Top Performer Award 2023
    `;

    const result = parseResumeText(rawResumeText);

    expect(result.name).toBe('Jane Doe');
    expect(result.email).toBe('jane.doe@tech.io');
    expect(result.phone).toBe('+1-555-019-9876');
    expect(result.linkedin).toBe('https://linkedin.com/in/janedoe');
    expect(result.github).toBe('https://github.com/janedoe');
    expect(result.location).toBe('Seattle, WA');
    expect(result.summary).toContain('Experienced Full Stack Engineer');
    expect(result.skills.languages).toContain('JavaScript');
    expect(result.skills.frameworks).toContain('React');
    expect(result.experience.length).toBeGreaterThan(0);
    expect(result.experience[0].company).toContain('Acme');
    expect(result.education.length).toBeGreaterThan(0);
    expect(result.education[0].cgpa).toBe('3.85 / 4.0');
    expect(result.projects.length).toBeGreaterThan(0);
    expect(result.certifications).toContain('AWS Certified Cloud Practitioner');
    expect(result.achievements).toContain('Top Performer Award 2023');
  });
});
