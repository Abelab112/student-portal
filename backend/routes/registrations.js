const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');
const router = express.Router();
router.get('/', authenticate, (req, res) => {
  db.all(`SELECT course_code FROM registrations WHERE student_id = ?`, [req.student.studentId], (e, rows) => {
    if (e) return res.status(500).json({ error: e.message });
    res.json(rows.map(r => r.course_code));
  });
});
router.post('/', authenticate, (req, res) => {
  const { courseCode } = req.body;
  db.run(`INSERT OR IGNORE INTO registrations (student_id,course_code) VALUES (?,?)`, [req.student.studentId, courseCode], function (e) {
    if (e) return res.status(500).json({ error: e.message });
    res.json({ ok: true });
  });
});
router.delete('/:code', authenticate, (req, res) => {
  db.run(`DELETE FROM registrations WHERE student_id = ? AND course_code = ?`, [req.student.studentId, req.params.code], function (e) {
    if (e) return res.status(500).json({ error: e.message });
    res.json({ ok: true });
  });
});
module.exports = router;
