const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authenticate = require('../middleware/auth');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';
router.post('/login', (req, res) => {
  const { studentId, password } = req.body;
  db.get(`SELECT * FROM students WHERE student_id = ?`, [studentId], (err, s) => {
    if (err || !s) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, s.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ studentId: s.student_id, name: s.name }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, student: { studentId: s.student_id, name: s.name, program: s.program, yearOfStudy: s.year_of_study }});
  });
});
router.get('/profile', authenticate, (req, res) => {
  db.get(`SELECT student_id,name,program,year_of_study FROM students WHERE student_id = ?`, [req.student.studentId], (e, row) => {
    if (e || !row) return res.status(404).json({ error: 'Not found' });
    res.json({ studentId: row.student_id, name: row.name, program: row.program, yearOfStudy: row.year_of_study });
  });
});
module.exports = router;
