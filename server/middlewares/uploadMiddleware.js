/**
 * Multer File Upload Middleware with PDF MIME & size validation
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const config = require('../config/config');

// Ensure uploads folder exists safely
try {
  if (!fs.existsSync(config.UPLOAD_DIR)) {
    fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
  }
} catch (err) {
  config.UPLOAD_DIR = os.tmpdir();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(config.UPLOAD_DIR)) {
        fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
      }
    } catch (e) {
      config.UPLOAD_DIR = os.tmpdir();
    }
    cb(null, config.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF files are supported.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: config.MAX_FILE_SIZE },
  fileFilter
});

module.exports = upload;
