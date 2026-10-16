const Auth = {
  student: null,
  async login(studentId, password) {
    const data = await api.post('/login', { studentId, password });
    api.setToken(data.token);
    this.student = data.student;
    return data.student;
  },
  logout() {
    api.clearToken();
    this.student = null;
    document.getElementById('portalScreen').classList.remove('visible');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('loginId').value = '';
    document.getElementById('loginPin').value = '';
    document.getElementById('loginError').textContent = '';
  },
  async enterPortal() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('portalScreen').classList.add('visible');
    document.getElementById('topbarName').textContent = this.student.name;
    document.getElementById('topbarId').textContent   = this.student.studentId;
    document.getElementById('studentName').value = this.student.name;
    document.getElementById('program').value     = this.student.program || '';
    document.getElementById('currentYear').value = this.student.yearOfStudy || '';
    await Tracker.load();
    await Registration.load();
  }
};
