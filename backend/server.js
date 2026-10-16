const express = require('express');
const cors = require('cors');
const path = require('path');
require('./db');

const authRoutes         = require('./routes/auth');
const courseRoutes       = require('./routes/courses');
const offeredRoutes      = require('./routes/offeredCourses');
const registrationRoutes = require('./routes/registrations');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------- API routes ----------
app.use('/api', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/offered-courses', offeredRoutes);
app.use('/api/registrations', registrationRoutes);

// ---------- Health check ----------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ---------- Serve frontend static files ----------
app.use(express.static(path.join(__dirname, '../frontend')));

// ---------- Catch-all: send index.html for non-API routes ----------
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});