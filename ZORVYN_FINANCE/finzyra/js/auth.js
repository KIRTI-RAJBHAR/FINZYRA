// ============================================================
// auth.js  —  Finzyra  |  Complete Authentication System
// ============================================================

function showAuthPage(id) {
  ['authSignIn','authSignUp','authForgot'].forEach(p => {
    const el = document.getElementById(p);
    if (el) el.style.display = p === id ? 'flex' : 'none';
  });
  ['signinErr','signupErr'].forEach(eid => {
    const el = document.getElementById(eid);
    if (el) el.classList.remove('show');
  });
}

function togglePass(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  if (inp.type === 'password') { inp.type = 'text';     btn.textContent = '🙈'; }
  else                         { inp.type = 'password'; btn.textContent = '👁'; }
}

function checkStrength(pass) {
  const confirmVal = (document.getElementById('signupConfirm') || {}).value || '';
  const rules = {
    length: pass.length >= 8,
    upper:  /[A-Z]/.test(pass),
    lower:  /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    symbol: /[^A-Za-z0-9]/.test(pass),
    match:  pass.length > 0 && pass === confirmVal,
  };
  Object.entries(rules).forEach(([key, met]) => {
    const el = document.getElementById('req-' + key);
    if (el) el.classList.toggle('met', met);
  });
  const score    = Object.values(rules).filter(Boolean).length;
  const barScore = Math.min(Math.floor(score / 1.5), 4);
  const segs     = document.querySelectorAll('#strengthBar .pw-seg');
  const lbl      = document.getElementById('strengthLbl');
  const labels   = ['','Weak','Fair','Good','Strong'];
  const classes  = ['','weak','fair','good','strong'];
  const colors   = ['','#ef4444','#f59e0b','#22c55e','#0ea5e9'];
  segs.forEach((s, i) => {
    s.className = 'pw-seg';
    if (i < barScore) s.classList.add(classes[barScore]);
  });
  if (lbl) {
    lbl.textContent = pass.length ? (labels[barScore] || 'Strong') : '';
    lbl.style.color = colors[barScore] || 'var(--text3)';
  }
}

// ---- SIGN IN ----
function doSignIn() {
  const email = (document.getElementById('signinEmail') || {}).value?.trim();
  const pass  = (document.getElementById('signinPass')  || {}).value;
  const err   = document.getElementById('signinErr');
  if (!email || !pass) { showErr(err, 'Please fill in all fields.'); return; }
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);
  if (!user) { showErr(err, 'Incorrect email or password. Try demo@finzyra.com / Demo@1234'); return; }
  err.classList.remove('show');
  _loginUser(user);
}

// ---- SIGN UP ----
function doSignUp() {
  const first   = (document.getElementById('signupFirst')   || {}).value?.trim();
  const last    = (document.getElementById('signupLast')    || {}).value?.trim();
  const email   = (document.getElementById('signupEmail')   || {}).value?.trim();
  const pass    = (document.getElementById('signupPass')    || {}).value;
  const confirm = (document.getElementById('signupConfirm') || {}).value;
  const err     = document.getElementById('signupErr');

  if (!first||!last||!email||!pass)        { showErr(err,'Please fill in all fields.'); return; }
  if (pass.length < 8)                     { showErr(err,'Password must be at least 8 characters.'); return; }
  if (!/[A-Z]/.test(pass))                 { showErr(err,'Password must include an uppercase letter.'); return; }
  if (!/[a-z]/.test(pass))                 { showErr(err,'Password must include a lowercase letter.'); return; }
  if (!/[0-9]/.test(pass))                 { showErr(err,'Password must include a number.'); return; }
  if (!/[^A-Za-z0-9]/.test(pass))         { showErr(err,'Password must include a symbol (!@#$%^&*).'); return; }
  if (pass !== confirm)                    { showErr(err,'Passwords do not match.'); return; }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
                                           { showErr(err,'Email already registered. Sign in instead.'); return; }
  err.classList.remove('show');
  const newUser = { email, pass, first, last };
  users.push(newUser);
  saveUsers();
  _loginUser(newUser);
}

// ---- FORGOT ----
function doForgot() {
  const email = (document.getElementById('forgotEmail') || {}).value?.trim();
  if (!email) { showToast('Enter your email address','#ef4444'); return; }
  showToast('Reset link sent to ' + email + ' (demo mode)');
  setTimeout(() => showAuthPage('authSignIn'), 1600);
}

// ---- SIGN OUT ----
function doSignOut() {
  localStorage.removeItem('fz3_session');
  currentUser = null;
  document.getElementById('appRoot').style.display  = 'none';
  document.getElementById('authRoot').style.display = 'block';
  showAuthPage('authSignIn');
  ['signinEmail','signinPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  closeUserDropdown();
  showToast('Signed out successfully');
}

// ---- Internal: complete login ----
function _loginUser(user) {
  currentUser = user;
  saveSession();
  document.getElementById('authRoot').style.display = 'none';
  document.getElementById('appRoot').style.display  = 'block';
  _hydrateUserUI(user);
  initApp();
}

function _hydrateUserUI(user) {
  const initials = ((user.first||'?')[0] + ((user.last||'')[0]||'')).toUpperCase();
  const fullName = (user.first||'') + (user.last ? ' '+user.last : '');
  const av   = document.getElementById('userChipAv');
  const name = document.getElementById('userChipName');
  if (av)   av.textContent   = initials;
  if (name) name.textContent = fullName;
  const ddName  = document.getElementById('ddUserName');
  const ddEmail = document.getElementById('ddUserEmail');
  if (ddName)  ddName.textContent  = fullName;
  if (ddEmail) ddEmail.textContent = user.email;
  applyRole(currentRole);
}

function showErr(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
}

// ---- Google Picker ----
let _selectedGoogleId = null;
let _googleMode       = 'signin';

function openGooglePicker(mode) {
  _googleMode       = mode || 'signin';
  _selectedGoogleId = null;
  const title = document.getElementById('gpickerTitle');
  if (title) title.textContent = mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google';
  _renderGpicker();
  const btn = document.getElementById('gpickerContinue');
  if (btn) btn.disabled = true;
  document.getElementById('gpickerOverlay').classList.add('open');
}

function _renderGpicker() {
  const list = document.getElementById('gpickerList');
  if (!list) return;
  list.innerHTML = GOOGLE_ACCOUNTS.map(a => `
    <button class="gpicker-item${_selectedGoogleId === a.id ? ' selected':''}"
            onclick="selectGAccount('${a.id}')">
      <div class="g-av ${a.avClass}">${a.av}</div>
      <div class="g-info">
        <div class="g-name">${a.name}</div>
        <div class="g-email">${a.email}</div>
      </div>
      <div class="g-tick">✓</div>
    </button>`).join('');
}

function selectGAccount(id) {
  if (!id) {
    document.getElementById('gpickerOverlay').classList.remove('open');
    showToast('Redirecting to Google… (demo)','#4285f4');
    setTimeout(() => { _selectedGoogleId = GOOGLE_ACCOUNTS[0].id; confirmGAccount(); }, 1200);
    return;
  }
  _selectedGoogleId = id;
  _renderGpicker();
  const btn = document.getElementById('gpickerContinue');
  if (btn) btn.disabled = false;
}

function confirmGAccount() {
  const acct      = GOOGLE_ACCOUNTS.find(a => a.id === _selectedGoogleId) || GOOGLE_ACCOUNTS[0];
  const nameParts = acct.name.split(' ');
  const user = { email:acct.email, pass:'__google__', first:nameParts[0], last:nameParts.slice(1).join(' ')||'', googleId:acct.id };
  document.getElementById('gpickerOverlay').classList.remove('open');
  if (!users.find(u => u.email === user.email)) { users.push(user); saveUsers(); }
  showToast('Signed in as ' + acct.name + ' ✓');
  _loginUser(user);
}

function closeGPicker() {
  document.getElementById('gpickerOverlay').classList.remove('open');
}

// ---- Auto-login on load ----
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', appSettings.theme || 'light');
  updateThemeKnob();

  const gpOverlay = document.getElementById('gpickerOverlay');
  if (gpOverlay) gpOverlay.addEventListener('click', e => { if (e.target === gpOverlay) closeGPicker(); });

  const session = JSON.parse(localStorage.getItem('fz3_session') || 'null');
  if (session && users.find(u => u.email === session.email)) {
    currentUser = session;
    document.getElementById('authRoot').style.display = 'none';
    document.getElementById('appRoot').style.display  = 'block';
    _hydrateUserUI(session);
    initApp();
  } else {
    document.getElementById('authRoot').style.display = 'block';
    document.getElementById('appRoot').style.display  = 'none';
    showAuthPage('authSignIn');
  }
});
