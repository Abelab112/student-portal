const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');
const router = express.Router();

// ---------- GET all courses ----------
router.get('/', authenticate, (req, res) => {
  db.all(
    `SELECT id, academic_year, semester, code, name, credits, grade, grade_points
     FROM courses WHERE student_id = ?
     ORDER BY academic_year, semester, code`,
    [req.student.studentId],
    (e, rows) => {
      if (e) return res.status(500).json({ error: e.message });
      res.json(rows);
    }
  );
});

// ---------- POST new course ----------
router.post('/', authenticate, (req, res) => {
  const { academic_year, semester, code, name, credits, grade, grade_points } = req.body;
  if (!name) return res.status(400).json({ error: 'Course name required' });
  db.run(
    `INSERT INTO courses
     (student_id, academic_year, semester, code, name, credits, grade, grade_points)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.student.studentId,
      academic_year || '',
      semester || '',
      code || '',
      name,
      credits || 3,
      grade || '',
      grade_points || 0
    ],
    function (e) {
      if (e) return res.status(500).json({ error: e.message });
      res.json({ id: this.lastID });
    }
  );
});

// ---------- DELETE a course ----------
router.delete('/:id', authenticate, (req, res) => {
  db.run(
    `DELETE FROM courses WHERE id = ? AND student_id = ?`,
    [req.params.id, req.student.studentId],
    function (e) {
      if (e) return res.status(500).json({ error: e.message });
      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;