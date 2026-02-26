require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── SECURITY MIDDLEWARE ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. Please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter for auth routes
  message: { error: 'Too many login attempts. Please try again later.' }
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/gmail', require('./routes/gmailRoutes'));
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const start = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`\n🚀 Crystal FailSafe API running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\nEndpoints:`);
    console.log(`  POST /api/auth/signup`);
    console.log(`  POST /api/auth/login`);
    console.log(`  GET  /api/auth/me`);
    console.log(`  GET  /api/tickets`);
    console.log(`  POST /api/tickets`);
    console.log(`  GET  /api/tickets/analytics`);
    console.log(`  GET  /api/admin/users`);
    console.log(`  PATCH /api/admin/users/:id/approve`);
  });
};

start();
