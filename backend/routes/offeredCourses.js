const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');
const router = express.Router();
router.get('/', authenticate, (req, res) => {
  db.all(`SELECT * FROM offered_courses`, [], (e, rows) => {
    if (e) return res.status(500).json({ error: e.message });
    res.json(rows);
  });
});
module.exports = router;
