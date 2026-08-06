/**
 * Script to generate test sample resumes in PDF format using PDFKit
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generatePDF(outputPath, contentCallback) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);
    contentCallback(doc);
    doc.end();

    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

async function createSampleResume1() {
  const filePath = path.resolve(__dirname, '../sample_resume_1.pdf');
  await generatePDF(filePath, (doc) => {
    doc.fontSize(20).font('Helvetica-Bold').text('John Doe');
    doc.fontSize(10).font('Helvetica').text('Email: john.doe@example.com | Phone: +91-9876543210');
    doc.fontSize(10).text('LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe');
    doc.fontSize(10).text('Location: San Francisco, CA | Website: https://johndoe.dev');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
    doc.fontSize(10).font('Helvetica').text('Senior Full Stack Software Engineer with 5+ years of experience building scalable web apps. Passionate about clean architecture, microservices, and modern Node.js APIs.');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('TECHNICAL SKILLS');
    doc.fontSize(10).font('Helvetica').text('Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL');
    doc.fontSize(10).text('Frameworks & Libraries: React, Node.js, Express.js, Next.js, Redux, Tailwind CSS');
    doc.fontSize(10).text('Databases & Tools: MongoDB, PostgreSQL, Redis, Docker, Git, AWS');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('WORK EXPERIENCE');
    doc.fontSize(11).font('Helvetica-Bold').text('Senior Software Engineer | ABC Technologies | Jan 2023 - Present');
    doc.fontSize(10).font('Helvetica').text('Location: San Francisco, CA');
    doc.fontSize(10).text('• Architected RESTful microservices processing 1M+ daily transactions using Node.js and MongoDB.');
    doc.fontSize(10).text('• Led frontend modernization project using React, Redux, and Tailwind CSS improving speed by 40%.');
    doc.moveDown();

    doc.fontSize(11).font('Helvetica-Bold').text('Software Engineer | Tech Solutions Inc | Jun 2020 - Dec 2022');
    doc.fontSize(10).font('Helvetica').text('• Developed internal developer dashboard using Express.js, PostgreSQL, and React.');
    doc.fontSize(10).text('• Integrated automated CI/CD pipeline using Docker and GitHub Actions.');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('EDUCATION');
    doc.fontSize(10).font('Helvetica-Bold').text('Bachelor of Technology in Computer Science | Stanford University | 2016 - 2020');
    doc.fontSize(10).font('Helvetica').text('CGPA: 3.9 / 4.0');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('PROJECTS');
    doc.fontSize(10).font('Helvetica-Bold').text('Cloud AI Resume Parser | GitHub: github.com/johndoe/resume-parser');
    doc.fontSize(10).font('Helvetica').text('• Built high-performance Node.js PDF parsing backend with 95% section extraction accuracy.');
    doc.fontSize(10).text('• Tech Stack: Node.js, Express, React, Vite, Jest');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('CERTIFICATIONS');
    doc.fontSize(10).font('Helvetica').text('• AWS Certified Solutions Architect Associate (2023)');
    doc.fontSize(10).text('• Meta Certified Senior Frontend Developer (2022)');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('ACHIEVEMENTS');
    doc.fontSize(10).font('Helvetica').text('• Winner of Hackathon 2023 out of 150 competing engineering teams.');
    doc.fontSize(10).text('• Published open-source JavaScript utility package with over 50,000 weekly downloads.');
  });
  console.log('Created sample_resume_1.pdf via PDFKit');
}

async function createSampleResume2() {
  const filePath = path.resolve(__dirname, '../sample_resume_2.pdf');
  await generatePDF(filePath, (doc) => {
    doc.fontSize(20).font('Helvetica-Bold').text('Sarah Jenkins');
    doc.fontSize(10).font('Helvetica').text('Email: sarah.jenkins@devmail.org | Phone: +1-415-555-0199');
    doc.fontSize(10).text('LinkedIn: linkedin.com/in/sarahjenkins-dev | GitHub: github.com/sarah-jenkins');
    doc.fontSize(10).text('Location: Austin, TX | Website: https://sarahjenkins.io');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('ABOUT ME');
    doc.fontSize(10).font('Helvetica').text('Backend & Cloud Engineer specializing in distributed databases, Node.js microservices, and Python.');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('SKILLS & EXPERTISE');
    doc.fontSize(10).font('Helvetica').text('Programming Languages: Python, JavaScript, Go, C++');
    doc.fontSize(10).text('Frameworks: Django, FastAPI, Express.js, NestJS');
    doc.fontSize(10).text('Databases: PostgreSQL, MongoDB, Redis, Elasticsearch');
    doc.fontSize(10).text('Tools & DevOps: Kubernetes, Docker, Terraform, Git, GCP');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('WORK EXPERIENCE');
    doc.fontSize(11).font('Helvetica-Bold').text('Backend Lead | CloudScale Labs | Mar 2021 - Present');
    doc.fontSize(10).font('Helvetica').text('• Engineered real-time data ingestion pipeline handling 50k events per second.');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('EDUCATION');
    doc.fontSize(10).font('Helvetica-Bold').text('Master of Science in Computer Engineering | UT Austin | 2019 - 2021');
    doc.fontSize(10).font('Helvetica').text('Percentage: 92.5%');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('PROJECTS');
    doc.fontSize(10).font('Helvetica-Bold').text('Distributed Task Queue | GitHub: github.com/sarah-jenkins/task-queue');
    doc.fontSize(10).font('Helvetica').text('• Built robust Redis-backed async task processing system for high-concurrency microservices.');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('CERTIFICATIONS');
    doc.fontSize(10).font('Helvetica').text('• Certified Kubernetes Administrator (CKA)');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('ACHIEVEMENTS');
    doc.fontSize(10).font('Helvetica').text('• Employee of the Year 2022 at CloudScale Labs.');
  });
  console.log('Created sample_resume_2.pdf via PDFKit');
}

async function main() {
  await createSampleResume1();
  await createSampleResume2();
}

main().catch(console.error);
