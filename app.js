require("dotenv").config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const cors = require('cors');

const app = express();

// ─── View Engine Setup ─────────────────────────────────────────────────────────
// Use EJS templates in /views for all HTML rendering
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ─── Global Middleware ──────────────────────────────────────────────────────────
// Enable CORS for all routes
app.use(cors());
// Parse JSON bodies (for API clients)
app.use(express.json());
// Parse URL-encoded bodies (for HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// ─── Static Assets ───────────────────────────────────────────────────────────────
// Serve CSS, JS, images, etc. from /public
app.use(express.static(path.join(__dirname, 'public')));

// ─── Route Modules ──────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/authRoutes');
const enseignantRoutes   = require('./routes/enseignantRoutes');
const protectedRoutes    = require('./routes/protectedRoutes');
const moduleRoutes       = require('./routes/moduleRoutes');
const voeuRoutes         = require('./routes/voeuRoute');
const chefRoutes         = require('./routes/chefRoutes');
const veouModules   = require('./routes/veouModules');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoute');
app.use('/messages', messageRoutes);
// ─── API Endpoints ──────────────────────────────────────────────────────────────
// Authentication (login/signup, token refresh, etc.)
app.use('/api/auth', authRoutes);
// CRUD for enseignants
app.use('/api/enseignants', enseignantRoutes);
// Example protected endpoints
app.use('/api/protected', protectedRoutes);
// Modules management (renamed from generic '/api' to '/api/modules')
app.use('/api/modules', moduleRoutes);
// Vœux (requests) management
app.use('/api/voeux', voeuRoutes);
app.use('/voeumodules', veouModules);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notifications', notificationRoutes);
//const chefController = require('./controllers/chefController');
// ─── Chef Dashboard & Teacher-Preferences API ──────────────────────────────────
// All routes under /chef:
// - GET  /chef                  → Renders the EJS dashboard (chefController.dashboard)
// - GET  /chef/teacher-preferences → Returns JSON with each teacher’s preferences
app.use('/chef', voeuRoutes);

// ─── Root Route ────────────────────────────────────────────────────────────────
// Serve a plain HTML login/signup page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loginsignup.html'));
});


// ─── Error Handler ──────────────────────────────────────────────────────────────
// Catches any errors thrown in the routes above
app.use((err, req, res, next) => {
  console.error('💥 Unexpected error:', err.stack);
  // If the request expects JSON (API), send JSON; otherwise, simple text
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  res.status(500).send('Something broke!');
});

// ─── Database Sync & Server Startup ─────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
sequelize.sync({ alter: true })   // ⚠️ In production, consider disabling `alter`!
  .then(() => {
    console.log('✅ Database synchronized!');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Chef Dashboard available at http://localhost:${PORT}/chef/dashboard`);
    });
  })
  .catch(err => {
    console.error('❌ Database sync error:', err);
  });
