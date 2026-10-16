document.addEventListener('DOMContentLoaded', () => {
  const loginScreen    = document.getElementById('loginScreen');
  const registerScreen = document.getElementById('registerScreen');

  // ---------- LOGIN ----------
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id  = document.getElementById('loginId').value.trim();
    const pin = document.getElementById('loginPin').value.trim();
    const err = document.getElementById('loginError');
    err.textContent = '';
    try {
      await Auth.login(id, pin);
      await Auth.enterPortal();
    } catch (ex) {
      err.textContent = ex.message;
    }
  });

  // ---------- REGISTER ----------
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      studentId:   document.getElementById('regId').value.trim(),
      name:        document.getElementById('regName').value.trim(),
      program:     document.getElementById('regProgram').value.trim(),
      yearOfStudy: document.getElementById('regYear').value.trim(),
      password:    document.getElementById('regPassword').value
    };
    const err = document.getElementById('registerError');
    err.textContent = '';

    if (!payload.studentId || !payload.name || !payload.password) {
      err.textContent = 'Student ID, name, and password are required.';
      return;
    }
    if (!/^\d{6,12}$/.test(payload.studentId)) {
      err.textContent = 'Student ID must be 6–12 digits.';
      return;
    }
    if (payload.password.length < 6) {
      err.textContent = 'Password must be at least 6 characters.';
      return;
    }

    try {
      await Auth.register(payload);
      showToast('Account created! Welcome, ' + payload.name);
      await Auth.enterPortal();
    } catch (ex) {
      err.textContent = ex.message;
    }
  });

  // ---------- TOGGLE ----------
  document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'flex';
    document.getElementById('registerError').textContent = '';
    document.getElementById('registerForm').reset();
    document.getElementById('regId').focus();
  });

  document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    registerScreen.style.display = 'none';
    loginScreen.style.display = 'flex';
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginForm').reset();
    document.getElementById('loginId').focus();
  });

  // ---------- LOGOUT ----------
  document.getElementById('logoutBtn').addEventListener('click', () => Auth.logout());
});