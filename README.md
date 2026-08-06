# ParseX - Enterprise PDF Resume Parser

[![Node.js Version](https://img.shields.io/badge/node.js-v18%2B%20%2F%20v22%20LTS-brightgreen)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18%20%2F%2019-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com)
[![Jest](https://img.shields.io/badge/Jest-Unit%20Tests-red)](https://jestjs.io)

An enterprise-grade, modular Node.js & React application that extracts structured information from PDF resumes using pattern matching, heuristic algorithms, and regex rules.

---

## 📌 Project Overview

**ParseX** accepts PDF resumes with various candidate section layouts and transforms raw document text into standardized, validated JSON objects. 

The application offers two modes of operation:
1. **CLI Script Runner**: Execute `node resume-parser.js sample_resume_1.pdf` or `npm start sample_resume_1.pdf` for terminal parsing.
2. **Full-Stack Web Dashboard & REST API**: Interactive React Vite UI with drag-and-drop PDF uploads, structured section cards, JSON code viewer, copy/download features, and dark mode.

---

## ✨ Key Features

- **Automated Section Detection**: Intelligently identifies headers like *Experience*, *Education*, *Skills*, *Projects*, *Certifications*, *Achievements*, and *Summary*.
- **Personal Detail Extraction**: Extracts candidate full name, email, phone number, LinkedIn URL, GitHub URL, portfolio website, and location.
- **Categorized Technical Skills**: Automatically groups skills into `Languages`, `Frameworks`, `Libraries`, `Databases`, `Tools`, and `Technologies`.
- **Work History Parsing**: Segments company names, job titles, durations (e.g. `Jan 2023 - Present`), locations, and key responsibilities.
- **Academic Credentials**: Extracts degree, university/college, CGPA / percentage scores, and start/end years.
- **Projects & Links**: Captures project name, description, tech stack used, and GitHub repository links.
- **Certifications & Achievements**: Lists professional licenses, certifications, awards, and hackathon achievements.
- **Failure-Tolerant Engine**: Gracefully handles missing sections, unique layouts, or malformed data without crashing.

---

## 🛠️ Tech Stack

### Backend
- **Node.js (v18+ / v22 LTS)**: Core runtime
- **Express.js**: REST API server
- **pdf-parse**: Fast PDF text extraction
- **Multer**: Multipart upload handling with file type & size limits
- **Jest**: Unit testing framework for parsers

### Frontend
- **React 18/19**: Dynamic dashboard components
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Modern glassmorphism UI with Dark/Light modes
- **Lucide Icons**: Clean UI icons
- **Axios**: API requests with progress bar support

---

## 📂 Project Structure

```
ParseX/
├── package.json                   # Root package & scripts (dev, start, test)
├── resume-parser.js               # CLI Entry point (node resume-parser.js <file.pdf>)
├── jest.config.js                 # Jest unit test configuration
├── sample_output.json             # Reference output JSON format
├── sample_resume_1.pdf            # Sample resume 1 (Software Engineer)
├── sample_resume_2.pdf            # Sample resume 2 (Backend & Cloud Lead)
├── README.md                      # Complete documentation
│
├── scripts/
│   └── generate_sample_pdfs.js    # PDF generator script for sample resumes
│
├── server/                        # Backend Engine & REST API
│   ├── config/                    # Environment & configuration paths
│   ├── controllers/               # Express request handlers
│   ├── middlewares/               # Multer upload & error handling
│   ├── routes/                    # REST API routes (/api/parser/...)
│   ├── services/                  # Main parsing pipeline orchestration
│   ├── parsers/                   # Modular extraction sub-parsers
│   │   ├── sectionDetector.js     # Header classifier & block segmentation
│   │   ├── personalParser.js      # Name, email, phone, links, location
│   │   ├── summaryParser.js       # Summary/about text extraction
│   │   ├── skillsParser.js        # Technical skills categorizer
│   │   ├── experienceParser.js    # Work experience entries
│   │   ├── educationParser.js     # Education records & scores
│   │   ├── projectsParser.js      # Project details & repository links
│   │   ├── certificationsParser.js# Certifications list
│   │   └── achievementsParser.js  # Awards & accomplishments
│   ├── utils/                     # Regex patterns & text helpers
│   │   ├── regexHelpers.js
│   │   └── textUtils.js
│   ├── tests/                     # Jest unit tests
│   │   ├── sectionDetector.test.js
│   │   ├── personalParser.test.js
│   │   ├── skillsParser.test.js
│   │   └── pipeline.test.js
│   ├── uploads/                   # Temporary upload directory
│   └── output/                    # Stored output JSON files
│
└── client/                        # React + Vite + Tailwind CSS Frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── components/            # Navbar, Footer, FileUploader, SectionCard, JSONViewer
        ├── context/               # ThemeContext (Dark/Light mode)
        ├── pages/                 # Home, Upload, Result, About, NotFound
        ├── services/              # Axios API calls
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22 LTS recommended)
- **npm**: v9.0.0 or higher

### 1. Install Dependencies

Install root backend dependencies:
```bash
npm install
```

Install client frontend dependencies:
```bash
cd client
npm install
cd ..
```

### 2. Generate Sample PDFs (Optional)

To regenerate `sample_resume_1.pdf` and `sample_resume_2.pdf`:
```bash
npm run build:sample-pdfs
```

---

## 💻 Usage & Execution

### Running via CLI (Command Line)

You can parse any PDF resume file directly from the command line:

```bash
node resume-parser.js sample_resume_1.pdf
```

or using `npm start`:

```bash
npm start sample_resume_2.pdf
```

Output: The formatted JSON will be printed to `stdout` and saved to `server/output/`.

---

### Running the Full-Stack Web Application

To run both the Express backend API (Port 5000) and the React Vite client (Port 5173) concurrently:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

Alternatively, run backend and client individually in separate terminals:
- Backend: `npm run server` (runs on http://localhost:5000)
- Client: `npm run client` (runs on http://localhost:5173)

---

## 🧪 Running Unit Tests

Run the full Jest test suite verifying text normalization, section detection, sub-parsers, and full pipeline integration:

```bash
npm test
```

---

## 🌐 REST API Documentation

### 1. Upload & Parse Resume PDF
- **Endpoint**: `POST /api/parser/upload`
- **Content-Type**: `multipart/form-data`
- **Body Parameter**: `resume` (PDF file)
- **Response**:
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "fileName": "parsed_1722987600000.json",
  "data": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+91-9876543210",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "portfolio": "https://johndoe.dev",
    "location": "San Francisco, CA",
    "summary": "Senior Full Stack Software Engineer...",
    "skills": {
      "languages": ["JavaScript", "TypeScript", "Python"],
      "frameworks": ["React", "Node.js", "Express.js"],
      "libraries": ["Redux", "Tailwind CSS"],
      "databases": ["MongoDB", "PostgreSQL"],
      "tools": ["Docker", "Git", "AWS"]
    },
    "experience": [...],
    "education": [...],
    "projects": [...],
    "certifications": [...],
    "achievements": [...]
  }
}
```

### 2. Get Sample Parsed JSON
- **Endpoint**: `GET /api/parser/sample`
- **Response**: Returns standard sample JSON format.

### 3. Download Parsed JSON File
- **Endpoint**: `GET /api/parser/download/:filename`
- **Response**: Downloads the requested extracted `.json` output file.

---

## 📋 Sample Output JSON Format

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+91-9876543210",
  "linkedin": "https://linkedin.com/in/johndoe",
  "github": "https://github.com/johndoe",
  "portfolio": "https://johndoe.dev",
  "location": "San Francisco, CA",
  "summary": "Senior Full Stack Software Engineer with 5+ years of experience...",
  "skills": {
    "languages": ["JavaScript", "TypeScript", "Python", "SQL"],
    "frameworks": ["React", "Node.js", "Express.js", "Next.js"],
    "libraries": ["Redux", "Tailwind CSS"],
    "databases": ["MongoDB", "PostgreSQL", "Redis"],
    "tools": ["Docker", "Git", "AWS"]
  },
  "experience": [
    {
      "company": "ABC Technologies",
      "title": "Senior Software Engineer",
      "duration": "Jan 2023 - Present",
      "location": "San Francisco, CA",
      "description": "Architected RESTful microservices processing 1M+ daily transactions using Node.js and MongoDB."
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Technology",
      "college": "Stanford University",
      "university": "Stanford University",
      "cgpa": "3.9 / 4.0",
      "percentage": "",
      "startYear": "2016",
      "endYear": "2020"
    }
  ],
  "projects": [
    {
      "name": "Cloud AI Resume Parser",
      "description": "Built high-performance Node.js PDF parsing backend...",
      "technologies": ["Node.js", "Express", "React", "Vite", "Jest"],
      "github": "https://github.com/johndoe/resume-parser"
    }
  ],
  "certifications": [
    "AWS Certified Solutions Architect Associate (2023)"
  ],
  "achievements": [
    "Winner of Hackathon 2023 out of 150 competing engineering teams."
  ]
}
```

---

## 💡 Assumptions & Limitations

1. **Digital PDF Format**: The core parser relies on digital text layers extracted via `pdf-parse`. Pure scanned image PDFs require an OCR engine (e.g., Tesseract.js).
2. **Text Normalization**: Multi-column PDF templates are extracted sequentially line by line. Section detection uses clean line splitting and fuzzy matching.
3. **Language**: Designed for English language resumes.

---

## 🔮 Future Improvements

- Add Tesseract.js OCR integration for scanned image PDFs.
- Add support for Word `.docx` file formats.
- Add AI/LLM semantic extraction fallback option for unformatted resumes.
