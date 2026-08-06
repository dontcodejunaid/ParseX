/**
 * Express Server Application Entrypoint
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const parserRoutes = require('./routes/parserRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static serve output and client build if production
app.use('/output', express.static(config.OUTPUT_DIR));

// API Routes
app.use('/api/parser', parserRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Resume Parser API is active', timestamp: new Date() });
});

// Serve frontend build if exists
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ message: 'Resume Parser API running. Frontend client available at http://localhost:5173' });
  }
});

// Error handling middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    console.log(`=================================================`);
    console.log(` Resume Parser Server running on port ${config.PORT}`);
    console.log(` API Endpoint: http://localhost:${config.PORT}/api/parser/upload`);
    console.log(` Health Check: http://localhost:${config.PORT}/api/health`);
    console.log(`=================================================`);
  });
}

module.exports = app;
