const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'portal.db');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    program TEXT,
    year_of_study TEXT,
    password_hash TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    academic_year TEXT,
    semester TEXT,
    code TEXT,
    name TEXT NOT NULL,
    credits INTEGER DEFAULT 3,
    grade TEXT,
    grade_points REAL DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS offered_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    units INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    course_code TEXT NOT NULL,
    UNIQUE(student_id, course_code)
  )`);

  db.get(`SELECT COUNT(*) AS c FROM offered_courses`, (e, row) => {
    if (row.c === 0) {
      const offered = [
        ['ITC 301','Advanced Algorithms',3],
        ['ITC 305','Database Management Systems',3],
        ['ITC 311','Web Application Development',2],
        ['ITC 315','Operating Systems',3],
        ['BUS 201','Principles of Management',2],
        ['BUS 210','Business Communication',2],
        ['MTH 220','Discrete Mathematics',3],
        ['ITC 320','Computer Networks',3]
      ];
      const stmt = db.prepare(`INSERT INTO offered_courses (code,title,units) VALUES (?,?,?)`);
      offered.forEach(c => stmt.run(c));
      stmt.finalize();
    }
  });

  db.get(`SELECT COUNT(*) AS c FROM students`, (e, row) => {
    if (row.c === 0) {
      const hash = bcrypt.hashSync('15082004', 10);
      db.run(`INSERT INTO students (student_id,name,program,year_of_study,password_hash) VALUES (?,?,?,?,?)`,
        ['12345678','Jordan Lee','BSc Accounting','4th year',hash]);
    }
  });
});

module.exports = db;
