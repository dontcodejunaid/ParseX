const { parsePersonal, extractName } = require('../parsers/personalParser');

describe('Personal Information Parser', () => {
  test('should extract email address accurately', () => {
    const text = 'Contact me at alex.smith_dev@gmail.com or visit my site';
    const result = parsePersonal(text);
    expect(result.email).toBe('alex.smith_dev@gmail.com');
  });

  test('should extract phone numbers', () => {
    const text = 'John Doe | Phone: +91-9876543210 | Email: john@test.com';
    const result = parsePersonal(text);
    expect(result.phone).toBe('+91-9876543210');
  });

  test('should extract LinkedIn and GitHub URLs', () => {
    const text = 'LinkedIn: linkedin.com/in/alexsmith | GitHub: github.com/alexsmith';
    const result = parsePersonal(text);
    expect(result.linkedin).toBe('https://linkedin.com/in/alexsmith');
    expect(result.github).toBe('https://github.com/alexsmith');
  });

  test('should extract full name using heuristics', () => {
    const headerText = 'Alexander Wright\nFull Stack Developer\nalex@example.com';
    const name = extractName(headerText, '');
    expect(name).toBe('Alexander Wright');
  });
});
