const bcrypt = require('bcryptjs');
const db = require('./db');

// ====== CHANGE THESE VALUES FOR THE NEW USER ======
const NEW_USER = {
  studentId: '87654321',
  name:      'Sarah Mensah',
  program:   'BSc Accounting',
  year:      '2nd year',
  password:  '01012005'       // Their DOB in DDMMYYYY
};
// ==================================================

const hash = bcrypt.hashSync(NEW_USER.password, 10);

db.run(
  `INSERT OR REPLACE INTO students (student_id, name, program, year_of_study, password_hash)
   VALUES (?, ?, ?, ?, ?)`,
  [NEW_USER.studentId, NEW_USER.name, NEW_USER.program, NEW_USER.year, hash],
  function (err) {
    if (err) {
      console.error('? Error:', err.message);
    } else {
      console.log('? User created successfully!');
      console.log('   Student ID:', NEW_USER.studentId);
      console.log('   Password:  ', NEW_USER.password);
    }
    process.exit(0);
  }
);
