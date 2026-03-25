const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all members
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM members');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET member by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM members WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD member (UPDATED with email field)
router.post('/', async (req, res) => {
  const { name, email, role } = req.body;

  // Validation check
  if (!name || !email || !role) {
    return res.status(400).json({ error: "All fields (name, email, role) are required." });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO members (name, email, role) VALUES (?, ?, ?)',
      [name, email, role]
    );

    res.json({ id: result.insertId, name, email, role });
  } catch (err) {
    console.error("Database Insert Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE member
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM members WHERE id = ?', [req.params.id]);
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;