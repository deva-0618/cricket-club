require('dotenv').config();
require('./db'); // ✅ connect DB

const express = require('express');
const cors = require('cors');

const membersRouter = require('./routes/members');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/members', membersRouter);

// Home route
app.get('/', (req, res) => {
  res.json({
    status: '✅ Running',
    message: '🏏 Cricket Club API is live!',
    routes: {
      getAllMembers: 'GET /api/members',
      getMemberById: 'GET /api/members/:id',
      addMember: 'POST /api/members',
      deleteMember: 'DELETE /api/members/:id',
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});