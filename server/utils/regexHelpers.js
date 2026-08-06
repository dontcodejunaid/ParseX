/**
 * Comprehensive Regular Expressions & Dictionaries for Resume Extraction
 */

const PATTERNS = {
  // Email pattern matching standard email formats
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,

  // Phone number (supports international, US, Indian, with optional country code & dashes/spaces)
  PHONE: /(?:(?:\+?\d{1,3}[\s\-\.]?)?\(?\d{3,4}\)?[\s\-\.]?\d{3,4}[\s\-\.]?\d{3,4})/g,

  // Social & Website links
  LINKEDIN: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/gi,
  GITHUB: /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/gi,
  PORTFOLIO: /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|dev|io|me|net|org|co|tech|app)(?:\/[^\s]*)?/gi,

  // Dates & Durations
  MONTH_YEAR: /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}/gi,
  YEAR_RANGE: /(?:19|20)\d{2}\s*(?:-|\u2013|\u2014|to)\s*(?:Present|Current|(?:19|20)\d{2})/gi,
  SINGLE_YEAR: /(?:19|20)\d{2}/g,

  // Education metrics
  CGPA: /(?:CGPA|GPA|Grade)[\s:]*([0-9]\.[0-9]{1,2}(?:\s*\/\s*[0-9]+(?:\.[0-9]+)?)?)/gi,
  PERCENTAGE: /(?:Percentage|Marks|Score)[\s:]*([0-9]{2}(?:\.[0-9]{1,2})?\s*%?)/gi,

  // Degrees
  DEGREE: /\b(?:B\.?E\.?|B\.?Tech|M\.?Tech|B\.?S\.?|M\.?S\.?|B\.?C\.?A\.?|M\.?C\.?A\.?|B\.?Sc|M\.?Sc|Bachelor(?:'s)?\s+of\s+[A-Za-z\s]+|Master(?:'s)?\s+of\s+[A-Za-z\s]+|Ph\.?D|Doctor\s+of\s+[A-Za-z\s]+|Associate\s+Degree|Higher\s+Secondary|Diploma)\b/gi,

  // Location heuristic
  LOCATION: /\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*(?:[A-Z][a-z]+|[A-Z]{2})\b/g
};

// Skill Dictionaries for granular categorization
const SKILL_DICTIONARIES = {
  languages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Golang',
    'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'R', 'Scala', 'HTML', 'HTML5',
    'CSS', 'CSS3', 'Sass', 'SCSS', 'SQL', 'Bash', 'Shell', 'PowerShell'
  ],
  frameworks: [
    'React', 'React.js', 'ReactJS', 'Next.js', 'NextJS', 'Vue', 'Vue.js', 'Angular',
    'Svelte', 'Node.js', 'Express', 'Express.js', 'NestJS', 'Django', 'Flask',
    'FastAPI', 'Spring Boot', 'Spring', 'Laravel', 'ASP.NET', 'Ruby on Rails',
    'Flutter', 'React Native', 'Tailwind', 'Tailwind CSS', 'Bootstrap'
  ],
  libraries: [
    'Redux', 'Redux Toolkit', 'Zustand', 'RxJS', 'jQuery', 'Lodash', 'Axios',
    'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV',
    'Chart.js', 'D3.js', 'Three.js', 'PDF-Parse', 'Multer', 'Prisma', 'Sequelize', 'Mongoose'
  ],
  databases: [
    'MongoDB', 'PostgreSQL', 'Postgres', 'MySQL', 'SQLite', 'Redis', 'Oracle',
    'Microsoft SQL Server', 'MSSQL', 'DynamoDB', 'Cassandra', 'MariaDB', 'Firebase',
    'Supabase', 'Neo4j', 'Elasticsearch'
  ],
  tools: [
    'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services',
    'GCP', 'Google Cloud', 'Azure', 'Linux', 'Unix', 'Nginx', 'Apache', 'Postman',
    'Jira', 'Webpack', 'Vite', 'Babel', 'VS Code', 'CI/CD', 'Jenkins', 'GitHub Actions'
  ]
};

module.exports = {
  PATTERNS,
  SKILL_DICTIONARIES
};
