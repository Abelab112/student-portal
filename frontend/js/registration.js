const Registration = {
  offered: [],
  registered: new Set(),
  async load() {
    const res = await Promise.all([api.get('/offered-courses'), api.get('/registrations')]);
    this.offered = res[0];
    this.registered = new Set(res[1]);
    this.render();
  },
  render() {
    const grid = document.getElementById('offeredGrid');
    grid.innerHTML = '';
    let units = 0;
    this.offered.forEach(c => {
      const isReg = this.registered.has(c.code);
      if (isReg) units += c.units;
      const div = document.createElement('div');
      div.className = 'offered-course';
      div.innerHTML = '<div class="offered-info"><span class="offered-code">' + c.code + '</span><span class="offered-title">' + c.title + '</span><span class="offered-units">' + c.units + ' units</span></div>';
      const btn = document.createElement('button');
      btn.className = 'reg-action-btn ' + (isReg ? 'drop' : '');
      btn.textContent = isReg ? 'Drop' : 'Register';
      btn.addEventListener('click', () => isReg ? this.drop(c.code) : this.register(c.code));
      div.appendChild(btn);
      grid.appendChild(div);
    });
    document.getElementById('regCount').textContent = this.registered.size;
    document.getElementById('regUnits').textContent = units;
  },
  async register(code) {
    await api.post('/registrations', { courseCode: code });
    this.registered.add(code);
    this.render();
    showToast('Registered: ' + code);
  },
  async drop(code) {
    await api.delete('/registrations/' + encodeURIComponent(code));
    this.registered.delete(code);
    this.render();
    showToast('Dropped: ' + code);
  }
};
