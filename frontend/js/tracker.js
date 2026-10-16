const Tracker = {
  courses: [],

  async load() {
    this.courses = await api.get('/courses');
    this.render();
  },

  // Group courses by academic year + semester
  groupCourses() {
    const groups = {};
    this.courses.forEach(c => {
      const key = (c.academic_year || 'N/A') + '||' + (c.semester || 'N/A');
      if (!groups[key]) {
        groups[key] = {
          academic_year: c.academic_year || 'N/A',
          semester: c.semester || 'N/A',
          courses: []
        };
      }
      groups[key].courses.push(c);
    });
    // Sort groups by year then semester (Second after First, if strings)
    return Object.values(groups).sort((a, b) => {
      const y = a.academic_year.localeCompare(b.academic_year);
      if (y !== 0) return y;
      return a.semester.localeCompare(b.semester);
    });
  },

  render() {
    const container = document.getElementById('transcriptContainer');
    container.innerHTML = '';

    if (this.courses.length === 0) {
      container.innerHTML = `
        <div class="transcript-empty">
          No courses on record yet.
        </div>`;
      document.getElementById('cgpaValue').textContent = '—';
      document.getElementById('cgpaSub').textContent   = '';
      return;
    }

    const groups = this.groupCourses();
    let cumulativeCredits = 0;
    let cumulativeGP = 0;

    groups.forEach(group => {
      // Sort courses alphabetically by code
      group.courses.sort((a, b) => (a.code || '').localeCompare(b.code || ''));

      let totalCR = 0;
      let totalGP = 0;
      group.courses.forEach(c => {
        totalCR += c.credits || 0;
        totalGP += c.grade_points || 0;
      });
      const semGPA = totalCR > 0 ? (totalGP / totalCR).toFixed(2) : '—';

      cumulativeCredits += totalCR;
      cumulativeGP += totalGP;

      const section = document.createElement('div');
      section.className = 'semester-section';

      // Header
      section.innerHTML = `
        <div class="semester-header">
          <span class="sem-year">${group.academic_year}</span>
          <span class="sem-label">ACADEMIC YEAR &middot; ${group.semester.toUpperCase()}</span>
        </div>
        <table class="transcript-table">
          <thead>
            <tr>
              <th class="col-code">CODE</th>
              <th class="col-title">TITLE</th>
              <th class="col-cr">CREDITS</th>
              <th class="col-grade">GRADE</th>
              <th class="col-gp">GP</th>
            </tr>
          </thead>
          <tbody>
            ${group.courses.map(c => `
              <tr>
                <td class="col-code">${c.code || '—'}</td>
                <td class="col-title">${c.name}</td>
                <td class="col-cr">${c.credits || 0}</td>
                <td class="col-grade">${c.grade || '—'}</td>
                <td class="col-gp">${c.grade_points || 0}</td>
              </tr>
            `).join('')}
            <tr class="totals-row">
              <td colspan="2" class="totals-label">Totals</td>
              <td class="col-cr totals-value">${totalCR}</td>
              <td></td>
              <td class="col-gp totals-value">${totalGP}</td>
            </tr>
          </tbody>
        </table>
        <div class="semester-gpa-row">
          <span class="semester-gpa-label">Semester GPA</span>
          <span class="semester-gpa-value">${semGPA}</span>
        </div>
      `;
      container.appendChild(section);
    });

    // Cumulative
    const cgpa = cumulativeCredits > 0
      ? (cumulativeGP / cumulativeCredits).toFixed(2)
      : '—';
    document.getElementById('cgpaValue').textContent = cgpa;
    document.getElementById('cgpaSub').textContent =
      `Total Credits: ${cumulativeCredits}  ·  Total Grade Points: ${cumulativeGP}`;
  }
};