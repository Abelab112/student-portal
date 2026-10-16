const db = require('./db');

const STUDENT_ID = '12345678';

// ============================================================
//  ALL COURSES FROM THE 5 TRANSCRIPTS
//  Format: [ academic_year, semester, code, title, credits, grade, grade_points ]
// ============================================================
const allCourses = [
  // ---------- 2023/2024 · Second Semester ----------
  ['2023/2024', 'Second Semester', 'BACT202', 'PRINCIPLES OF ACCOUNTING II', 3, 'A', 12],
  ['2023/2024', 'Second Semester', 'BCPC202', 'GLOBAL DIMENSION OF BUSINESS', 3, 'A', 12],
  ['2023/2024', 'Second Semester', 'BCPC206', 'INTRODUCTION TO TOTAL QUALITY MANAGEMENT', 3, 'B+', 10.5],
  ['2023/2024', 'Second Semester', 'BCPC208', 'QUANTITATIVE METHODS', 3, 'B-', 7.5],
  ['2023/2024', 'Second Semester', 'BCPC212', 'BUSINESS ETHICS', 3, 'B', 9],

  // ---------- 2024/2025 · First Semester ----------
  ['2024/2025', 'First Semester', 'BACT303', 'FINANCIAL REPORTING I', 3, 'B', 9],
  ['2024/2025', 'First Semester', 'BACT305', 'TAXATION', 3, 'A', 12],
  ['2024/2025', 'First Semester', 'BACT309', 'COST AND MANAGEMENT ACCOUNTING I', 3, 'B-', 7.5],
  ['2024/2025', 'First Semester', 'BBAF307', 'MANAGERIAL ECONOMICS', 3, 'C+', 6],
  ['2024/2025', 'First Semester', 'BCPC301', 'RESEARCH METHODS', 3, 'B', 9],
  ['2024/2025', 'First Semester', 'BCPC303', 'ENTREPRENEURSHIP DEVELOPMENT', 3, 'A', 12],
  ['2024/2025', 'First Semester', 'QUANTITATIVE METHODS', 'QUANTITATIVE METHODS', 3, 'C', 4.5],
  ['2024/2025', 'First Semester', 'BUSINESS ETHICS', 'BUSINESS ETHICS', 3, 'B-', 7.5],

  // ---------- 2024/2025 · Second Semester ----------
  ['2024/2025', 'Second Semester', 'BACT304', 'FINANCIAL REPORTING II', 3, 'B-', 7.5],
  ['2024/2025', 'Second Semester', 'BACT306', 'COMPUTERIZED ACCOUNTING INFORMATION SYSTEMS', 3, 'B-', 7.5],
  ['2024/2025', 'Second Semester', 'BACT308', 'AUDIT AND INTERNAL REVIEW', 3, 'C-', 3],
  ['2024/2025', 'Second Semester', 'BACT314', 'COST AND MANAGEMENT ACCOUNTING II', 3, 'B', 9],
  ['2024/2025', 'Second Semester', 'BBBA306', 'COMPANY AND PARTNERSHIP LAW', 3, 'B+', 10.5],

  // ---------- 2025/2026 · First Semester ----------
  ['2025/2026', 'First Semester', 'BCPC403', 'BUSINESS POLICY AND STRATEGY', 3, 'B', 9],
  ['2025/2026', 'First Semester', 'BACT405', 'ADVANCED AUDIT AND ASSURANCE', 3, 'B-', 7.5],
  ['2025/2026', 'First Semester', 'BACT403', 'TAXATION AND FISCAL POLICY', 3, 'C-', 3],
  ['2025/2026', 'First Semester', 'BACT401', 'CORPORATE REPORTING I', 3, 'D', 3],
  ['2025/2026', 'First Semester', 'BBAF413', 'FINANCIAL MANAGEMENT', 3, 'C', 6],
  ['2025/2026', 'First Semester', 'BACT410', 'INTERNSHIP', 3, 'B+', 10.5],

  // ---------- 2025/2026 · Second Semester ----------
  ['2025/2026', 'Second Semester', 'BACT402', 'CORPORATE REPORTING II', 3, 'C-', 3],
  ['2025/2026', 'Second Semester', 'BACT406', 'PUBLIC SECTOR ACCOUNTING AND FINANCE', 3, 'C+', 6],
  ['2025/2026', 'Second Semester', 'BBAF402', 'INTERNATIONAL TRADE FINANCE', 3, 'B-', 7.5],
  ['2025/2026', 'Second Semester', 'BACT408', 'PERFORMANCE MANAGEMENT', 3, 'E', 0],
  ['2025/2026', 'Second Semester', 'BACT400', 'PROJECT WORK', 6, 'B', 18]
];

// ---------- INSERT ----------
db.serialize(() => {
  // Wipe existing courses for this student
  db.run(`DELETE FROM courses WHERE student_id = ?`, [STUDENT_ID], (err) => {
    if (err) return console.error('❌ Delete error:', err.message);

    const stmt = db.prepare(
      `INSERT INTO courses
       (student_id, academic_year, semester, code, name, credits, grade, grade_points)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    let inserted = 0;
    allCourses.forEach(c => {
      stmt.run([STUDENT_ID, c[0], c[1], c[2], c[3], c[4], c[5], c[6]]);
      inserted++;
    });

    stmt.finalize((err) => {
      if (err) return console.error('❌ Insert error:', err.message);
      console.log(`✅ Seeded ${inserted} courses for student ${STUDENT_ID}`);

      // ---------- SUMMARY ----------
      db.all(
        `SELECT academic_year, semester,
                SUM(credits) AS total_credits,
                SUM(grade_points) AS total_gp
         FROM courses WHERE student_id = ?
         GROUP BY academic_year, semester
         ORDER BY academic_year, semester`,
        [STUDENT_ID],
        (err, rows) => {
          if (err) return console.error(err);
          console.log('\n📊 Semester Summary:');
          let totalCR = 0, totalGP = 0;
          rows.forEach(r => {
            const gpa = (r.total_gp / r.total_credits).toFixed(2);
            console.log(
              `   ${r.academic_year} · ${r.semester.padEnd(16)} ` +
              `CR: ${r.total_credits.toString().padStart(2)}  ` +
              `GP: ${r.total_gp.toString().padStart(5)}  ` +
              `GPA: ${gpa}`
            );
            totalCR += r.total_credits;
            totalGP += r.total_gp;
          });
          const cgpa = (totalGP / totalCR).toFixed(2);
          console.log;
        }
      );
    });
  });
});