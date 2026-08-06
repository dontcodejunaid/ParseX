#!/usr/bin/env node

/**
 * CLI Entry point for Resume Parser
 * Usage:
 *   node resume-parser.js sample_resume_1.pdf
 *   npm start sample_resume_1.pdf
 */

const path = require('path');
const fs = require('fs');
const { parseResumePdf } = require('./server/services/resumeParserPipeline');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Error: Please provide a PDF resume file path.');
    console.log('Usage: node resume-parser.js <path_to_resume.pdf>');
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), args[0]);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at path "${inputPath}"`);
    process.exit(1);
  }

  try {
    console.log(`Parsing resume from: ${inputPath}...`);
    const parsedData = await parseResumePdf(inputPath);

    const jsonOutput = JSON.stringify(parsedData, null, 2);
    console.log('\n--- EXTRACTED RESUME JSON ---');
    console.log(jsonOutput);
    console.log('-----------------------------\n');

    // Optionally write to output file
    const outputDir = path.resolve(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFileName = `parsed_${path.basename(inputPath, '.pdf')}.json`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, jsonOutput, 'utf8');

    console.log(`Success! Parsed result saved to: ${outputPath}`);
  } catch (error) {
    console.error(`Parsing Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
