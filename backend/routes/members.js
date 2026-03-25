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

// ADD member
router.post('/', async (req, res) => {
  const { name, role } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO members (name, role) VALUES (?, ?)',
      [name, role]
    );

    res.json({ id: result.insertId, name, role });
  } catch (err) {
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