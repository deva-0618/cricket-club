require('dotenv').config();
require('./db'); // ✅ Connects to TiDB/MySQL

const express = require('express');
const cors = require('cors');
const path = require('path'); // Required to handle file paths

const membersRouter = require('./routes/members');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// 1. SERVE STATIC FILES
// This allows the browser to find your style.css and script.js 
// located in the 'frontend' folder.
app.use(express.static(path.join(__dirname, '../frontend')));

// --- API Routes ---
app.use('/api/members', membersRouter);

// 2. SERVE THE FRONTEND
// When you visit http://localhost:3000, this sends the index.html file.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 3. HEALTH CHECK ROUTE (Optional)
// You can still check your API status at http://localhost:3000/status
app.get('/status', (req, res) => {
  res.json({
    status: '✅ Running',
    message: '🏏 Cricket Club API is live!',
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📂 Serving frontend from: ${path.join(__dirname, '../frontend')}`);
});