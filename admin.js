/* ═══════════════════════════════════════════
   DABHOLKAR RESORT — Admin JavaScript
   Connected to Supabase for live bookings
═══════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────
   SUPABASE CONFIG
───────────────────────────────────────────*/
const SUPABASE_URL = 'https://keytnnyuqahejpvnnskw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ES-q90fufUBmRpXtCVcMWA_DoA8gqwN';

// REST API helpers
const api = {
  headers() {
    return {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=representation'
    };
  },
  async select(table, params = '') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=received.desc${params ? '&' + params : ''}`, {
      headers: this.headers()
    });
    if (!res.ok) return [];
    return res.json();
  },
  async update(table, id, patch) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: this.headers(),
      body: JSON.stringify(patch)
    });
    return res.ok;
  },
  async insert(table, row) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(row)
    });
    return res.ok;
  },
  async delete(table, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.headers()
    });
    return res.ok;
  }
};

/* ─────────────────────────────────────────
   CONFIG
───────────────────────────────────────────*/
const CREDENTIALS = { username: 'admin', password: 'dabholkar2026' };

const HOMES_CONFIG = {
  ekaant:  { name:'Ekaant',  type:'Private Home',  guests:2, bed:'King Bed',          size:'480 sq ft', img:'roominterior.jpeg',  price:12000 },
  sushant: { name:'Sushant', type:'VIP Home',       guests:2, bed:'King Bed + Daybed', size:'680 sq ft', img:'roominterior1.jpeg', price:18000 },
  nishant: { name:'Nishant', type:'Couple Home',    guests:5, bed:'2 Queen Beds',      size:'760 sq ft', img:'roominterior2.jpeg', price:22000 },
  niwaant: { name:'Niwaant', type:'Serenity Home',  guests:2, bed:'King Bed',          size:'520 sq ft', img:'property1.jpeg',     price:12000 },
  savali:  { name:'Savali',  type:'Nature Home',    guests:2, bed:'Queen Bed',         size:'440 sq ft', img:'property2.jpeg',     price:12000 }
};

const GALLERY_IMAGES = [
  { src:'property1.jpeg',    label:'Property View 1' },
  { src:'property2.jpeg',    label:'Property View 2' },
  { src:'property3.jpeg',    label:'Property Aerial' },
  { src:'propertynight.jpeg',label:'Resort at Night' },
  { src:'roominterior.jpeg', label:'Room Interior — Ekaant' },
  { src:'roominterior1.jpeg',label:'Room Interior — Sushant' },
  { src:'roominterior2.jpeg',label:'Room Interior — Nishant' },
  { src:'rooms.jpeg',        label:'Dining Area' }
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ─────────────────────────────────────────
   LOCAL STATE
───────────────────────────────────────────*/
function loadState(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function saveState(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let reservations = [];   // always loaded fresh from Supabase
let roomAvailability = loadState('dbk_availability', { ekaant:true, sushant:true, nishant:true, niwaant:true, savali:true });
let galleryImages    = loadState('dbk_gallery', GALLERY_IMAGES);
let currentPassword  = loadState('dbk_pw', CREDENTIALS.password);

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────────*/
function uid() { return 'BK' + String(Date.now()).slice(-8); }
function formatDate(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}
function initials(f, l) { return ((f||' ')[0] + (l||' ')[0]).toUpperCase(); }
function todayStr()      { return new Date().toISOString().split('T')[0]; }
function normaliseRow(r) {
  // Supabase returns snake_case; ensure our code always has consistent fields
  return {
    id:         r.id         || uid(),
    fname:      r.fname      || '',
    lname:      r.lname      || '',
    email:      r.email      || '',
    phone:      r.phone      || '',
    home:       r.home       || '',
    guests:     String(r.guests || ''),
    checkin:    r.checkin    || '',
    checkout:   r.checkout   || '',
    requests:   r.requests   || '',
    status:     r.status     || 'pending',
    notes:      r.notes      || '',
    payment_id: r.payment_id || '',
    amount_paid:r.amount_paid|| 0,
    received:   r.received   ? r.received.split('T')[0] : todayStr()
  };
}

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────────*/
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg, isError = false) {
  toastEl.textContent = msg;
  toastEl.className   = 'toast' + (isError ? ' toast-error' : '');
  toastEl.hidden      = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3500);
}

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────────*/
const loginScreen = document.getElementById('loginScreen');
const dashboard   = document.getElementById('dashboard');
const loginForm   = document.getElementById('loginForm');
const loginError  = document.getElementById('loginError');
const togglePw    = document.getElementById('togglePw');
const pwInput     = document.getElementById('lf-password');

if (sessionStorage.getItem('dbk_auth') === '1') boot();

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('lf-username').value.trim();
  const p = pwInput.value;
  if (u === CREDENTIALS.username && p === currentPassword) {
    sessionStorage.setItem('dbk_auth', '1');
    loginError.hidden = true;
    boot();
  } else {
    loginError.hidden = false;
    pwInput.value = '';
    pwInput.focus();
  }
});

togglePw.addEventListener('click', () => {
  const show = pwInput.type === 'password';
  pwInput.type = show ? 'text' : 'password';
  togglePw.innerHTML = show
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('dbk_auth');
  loginScreen.style.display = '';
  dashboard.hidden = true;
  document.getElementById('lf-username').value = '';
  pwInput.value = '';
  stopRealtime();
});

async function boot() {
  loginScreen.style.display = 'none';
  dashboard.hidden = false;
  setTopbarDate();
  await loadBookings();
  renderOverview();
  renderReservationsTable();
  renderRooms();
  renderGallery();
  updatePendingBadge();
  startRealtime();
}

/* ─────────────────────────────────────────
   LOAD BOOKINGS FROM SUPABASE
───────────────────────────────────────────*/
async function loadBookings() {
  showLoadingState(true);
  try {
    const rows = await api.select('bookings');
    reservations = rows.map(normaliseRow);
  } catch (err) {
    console.error('Failed to load bookings:', err);
    showToast('Could not connect to database.', true);
    reservations = [];
  }
  showLoadingState(false);
}

function showLoadingState(loading) {
  const tbody = document.getElementById('reservationsTbody');
  if (!tbody) return;
  if (loading) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-light)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;display:inline-block;vertical-align:middle;margin-right:.5rem"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
      Loading bookings…</td></tr>`;
    const style = document.getElementById('spinStyle') || document.createElement('style');
    style.id = 'spinStyle';
    style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }
}

/* ─────────────────────────────────────────
   REALTIME — Supabase Realtime WebSocket
───────────────────────────────────────────*/
let realtimeWs = null;

function startRealtime() {
  if (realtimeWs) return;
  const wsUrl = `wss://keytnnyuqahejpvnnskw.supabase.co/realtime/v1/websocket?apikey=${SUPABASE_KEY}&vsn=1.0.0`;

  try {
    realtimeWs = new WebSocket(wsUrl);

    realtimeWs.onopen = () => {
      // Join the bookings table changes channel
      realtimeWs.send(JSON.stringify({
        topic: 'realtime:public:bookings',
        event: 'phx_join',
        payload: { config: { broadcast: { ack: false }, presence: { key: '' }, postgres_changes: [{ event: '*', schema: 'public', table: 'bookings' }] } },
        ref: '1'
      }));
    };

    realtimeWs.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        // A change happened on the bookings table
        if (msg.topic === 'realtime:public:bookings' && msg.event === 'postgres_changes') {
          await loadBookings();
          renderOverview();
          renderReservationsTable();
          renderRooms();
          updatePendingBadge();
          showToast('📬 New booking received!');
        }
      } catch { /* ignore parse errors */ }
    };

    realtimeWs.onerror = () => {
      realtimeWs = null;
    };

    realtimeWs.onclose = () => {
      realtimeWs = null;
      // Reconnect after 5s if still logged in
      if (sessionStorage.getItem('dbk_auth') === '1') {
        setTimeout(startRealtime, 5000);
      }
    };
  } catch (err) {
    console.warn('Realtime WebSocket failed:', err);
  }
}

function stopRealtime() {
  if (realtimeWs) {
    realtimeWs.close();
    realtimeWs = null;
  }
}

/* ─────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────*/
function setTopbarDate() {
  document.getElementById('topbarDate').textContent =
    new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' });
}

// Sidebar toggle
const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', e => {
  if (window.innerWidth < 900 && sidebar.classList.contains('open')
    && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
    sidebar.classList.remove('open');
  }
});

/* ─────────────────────────────────────────
   TAB SWITCHING
───────────────────────────────────────────*/
const tabTitles = {
  overview:'Overview', reservations:'Reservations',
  rooms:'Rooms & Homes', gallery:'Gallery', settings:'Settings'
};

document.querySelectorAll('.sb-item').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
    if (window.innerWidth < 900) sidebar.classList.remove('open');
  });
});
document.querySelectorAll('.card-link[data-tab]').forEach(l => {
  l.addEventListener('click', () => switchTab(l.dataset.tab));
});

function switchTab(name) {
  document.querySelectorAll('.sb-item').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
  document.getElementById('topbarTitle').textContent = tabTitles[name] || name;
}

/* ─────────────────────────────────────────
   OVERVIEW
───────────────────────────────────────────*/
function renderOverview() {
  document.getElementById('sc-total').textContent     = reservations.length;
  document.getElementById('sc-pending').textContent   = reservations.filter(r => r.status === 'pending').length;
  document.getElementById('sc-confirmed').textContent = reservations.filter(r => r.status === 'confirmed').length;
  document.getElementById('sc-cancelled').textContent = reservations.filter(r => r.status === 'cancelled').length;
  renderOccupancyChart();
  renderRecentList();
  renderMonthlyChart();
}

function renderOccupancyChart() {
  const counts = {};
  Object.values(HOMES_CONFIG).forEach(h => { counts[h.name] = 0; });
  reservations.forEach(r => { if (counts[r.home] !== undefined) counts[r.home]++; });
  const max = Math.max(...Object.values(counts), 1);
  document.getElementById('occupancyChart').innerHTML = Object.entries(counts).map(([name, n]) => `
    <div class="chart-bar-row">
      <span class="chart-bar-label">${name}</span>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round((n/max)*100)}%"></div></div>
      <span class="chart-bar-val">${n}</span>
    </div>`).join('');
}

function renderRecentList() {
  const recent = [...reservations].slice(0, 5);
  document.getElementById('recentList').innerHTML = recent.length
    ? recent.map(r => `
      <div class="recent-item" style="cursor:pointer" onclick="openResModal('${r.id}')">
        <div class="ri-avatar">${initials(r.fname, r.lname)}</div>
        <div>
          <div class="ri-name">${r.fname} ${r.lname}</div>
          <div class="ri-home">${r.home} · ${r.guests || '?'} guest${r.guests !== '1' ? 's' : ''}
            ${r.payment_id ? '<span style="color:#059669;font-size:.65rem;margin-left:.4rem">● Paid</span>' : ''}
          </div>
        </div>
        <div class="ri-meta"><span class="status-badge ${r.status}">${r.status}</span></div>
      </div>`).join('')
    : '<p style="padding:1.5rem;text-align:center;color:var(--text-light);font-size:.82rem">No bookings yet.</p>';
}

function renderMonthlyChart() {
  const counts = {};
  MONTHS.forEach(m => { counts[m] = 0; });
  reservations.forEach(r => {
    if (!r.received) return;
    const m = MONTHS[parseInt(r.received.split('-')[1], 10) - 1];
    if (m) counts[m]++;
  });
  const max = Math.max(...Object.values(counts), 1);
  document.getElementById('monthlyChart').innerHTML = MONTHS.map(m => `
    <div class="mc-col">
      <div class="mc-bar" style="height:${Math.max(8, Math.round((counts[m]/max)*110))}px" title="${m}: ${counts[m]}">
        ${counts[m] > 0 ? `<span class="mc-bar-val">${counts[m]}</span>` : ''}
      </div>
      <span class="mc-label">${m}</span>
    </div>`).join('');
}

/* ─────────────────────────────────────────
   RESERVATIONS TABLE
───────────────────────────────────────────*/
let resSearchVal = '';
let resFilterVal = 'all';

document.getElementById('resSearch').addEventListener('input', function () {
  resSearchVal = this.value.toLowerCase();
  renderReservationsTable();
});
document.getElementById('resFilter').addEventListener('change', function () {
  resFilterVal = this.value;
  renderReservationsTable();
});
document.getElementById('addReservationBtn').addEventListener('click', () => openResModal(null));

function renderReservationsTable() {
  let list = [...reservations];
  if (resFilterVal !== 'all') list = list.filter(r => r.status === resFilterVal);
  if (resSearchVal) list = list.filter(r =>
    [r.fname, r.lname, r.email, r.home, r.phone].join(' ').toLowerCase().includes(resSearchVal));

  const tbody = document.getElementById('reservationsTbody');
  const empty = document.getElementById('resEmpty');

  if (!list.length) { tbody.innerHTML = ''; empty.hidden = false; return; }
  empty.hidden = true;

  tbody.innerHTML = list.map(r => `
    <tr>
      <td>
        <div class="td-guest-name">${r.fname} ${r.lname}</div>
        <div class="td-email">${r.email}</div>
      </td>
      <td>${r.home || '—'}</td>
      <td>${formatDate(r.checkin)}</td>
      <td>${formatDate(r.checkout)}</td>
      <td>${r.guests || '—'}</td>
      <td>
        <span class="status-badge ${r.status}">${r.status}</span>
        ${r.payment_id ? `<span style="display:block;font-size:.62rem;color:#059669;margin-top:.2rem">₹${(r.amount_paid||2000).toLocaleString('en-IN')} paid</span>` : ''}
      </td>
      <td>${formatDate(r.received)}</td>
      <td>
        <div class="td-actions">
          <button class="btn-icon" onclick="openResModal('${r.id}')" title="Edit">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon" onclick="quickStatus('${r.id}','confirmed')" title="Confirm" style="${r.status==='confirmed'?'color:var(--green)':''}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <button class="btn-icon danger" onclick="deleteReservation('${r.id}')" title="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

async function quickStatus(id, status) {
  const r = reservations.find(x => x.id === id);
  if (!r) return;
  const ok = await api.update('bookings', id, { status });
  if (!ok) { showToast('Update failed.', true); return; }
  r.status = status;
  renderReservationsTable();
  renderOverview();
  updatePendingBadge();
  showToast(`${r.fname} ${r.lname} marked as ${status}.`);
}

async function deleteReservation(id) {
  const r = reservations.find(x => x.id === id);
  if (!r) return;
  if (!confirm(`Delete reservation for ${r.fname} ${r.lname}?`)) return;
  const ok = await api.delete('bookings', id);
  if (!ok) { showToast('Delete failed.', true); return; }
  reservations = reservations.filter(x => x.id !== id);
  renderReservationsTable();
  renderOverview();
  updatePendingBadge();
  showToast('Reservation deleted.');
}

window.openResModal      = openResModal;
window.quickStatus       = quickStatus;
window.deleteReservation = deleteReservation;

function updatePendingBadge() {
  const n     = reservations.filter(r => r.status === 'pending').length;
  const badge = document.getElementById('pendingBadge');
  badge.textContent   = n;
  badge.dataset.count = n;
}

/* ─────────────────────────────────────────
   RESERVATION EDIT MODAL
───────────────────────────────────────────*/
const resModal       = document.getElementById('resModal');
const resModalForm   = document.getElementById('resModalForm');
const resModalTitle  = document.getElementById('resModalTitle');
const resDeleteBtn   = document.getElementById('resDeleteBtn');
const resModalCancel = document.getElementById('resModalCancel');
const resModalClose  = document.getElementById('resModalClose');

function openResModal(id) {
  const r = id ? reservations.find(x => x.id === id) : null;
  resModalTitle.textContent = r ? 'Edit Reservation' : 'New Reservation';

  document.getElementById('rm-id').value       = r ? r.id       : '';
  document.getElementById('rm-fname').value    = r ? r.fname    : '';
  document.getElementById('rm-lname').value    = r ? r.lname    : '';
  document.getElementById('rm-email').value    = r ? r.email    : '';
  document.getElementById('rm-phone').value    = r ? r.phone    : '';
  document.getElementById('rm-home').value     = r ? r.home     : 'Ekaant';
  document.getElementById('rm-guests').value   = r ? r.guests   : '2';
  document.getElementById('rm-checkin').value  = r ? r.checkin  : '';
  document.getElementById('rm-checkout').value = r ? r.checkout : '';
  document.getElementById('rm-requests').value = r ? r.requests : '';
  document.getElementById('rm-status').value   = r ? r.status   : 'pending';
  document.getElementById('rm-notes').value    = r ? r.notes    : '';

  resDeleteBtn.style.display = r ? '' : 'none';
  resModal.hidden = false;
  document.getElementById('rm-fname').focus();
}

function closeResModal() { resModal.hidden = true; }

resModalClose.addEventListener('click',  closeResModal);
resModalCancel.addEventListener('click', closeResModal);
resModal.addEventListener('click', e => { if (e.target === resModal) closeResModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !resModal.hidden) closeResModal(); });

resDeleteBtn.addEventListener('click', () => {
  closeResModal();
  deleteReservation(document.getElementById('rm-id').value);
});

resModalForm.addEventListener('submit', async e => {
  e.preventDefault();
  const id    = document.getElementById('rm-id').value;
  const fname = document.getElementById('rm-fname').value.trim();
  const lname = document.getElementById('rm-lname').value.trim();
  const email = document.getElementById('rm-email').value.trim();

  ['rm-fname','rm-lname','rm-email'].forEach(f => document.getElementById(f).classList.remove('error'));
  let valid = true;
  if (!fname) { document.getElementById('rm-fname').classList.add('error'); valid = false; }
  if (!lname) { document.getElementById('rm-lname').classList.add('error'); valid = false; }
  if (!email) { document.getElementById('rm-email').classList.add('error'); valid = false; }
  if (!valid) return;

  const row = {
    fname, lname, email,
    phone:    document.getElementById('rm-phone').value.trim(),
    home:     document.getElementById('rm-home').value,
    guests:   document.getElementById('rm-guests').value,
    checkin:  document.getElementById('rm-checkin').value  || null,
    checkout: document.getElementById('rm-checkout').value || null,
    requests: document.getElementById('rm-requests').value.trim(),
    status:   document.getElementById('rm-status').value,
    notes:    document.getElementById('rm-notes').value.trim()
  };

  const submitBtn = resModalForm.querySelector('button[type="submit"]');
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Saving…';

  let ok;
  if (id) {
    ok = await api.update('bookings', id, row);
    if (ok) {
      const idx = reservations.findIndex(x => x.id === id);
      if (idx > -1) reservations[idx] = normaliseRow({ ...reservations[idx], ...row });
    }
  } else {
    row.id       = uid();
    row.received = new Date().toISOString();
    ok = await api.insert('bookings', row);
    if (ok) reservations.unshift(normaliseRow(row));
  }

  submitBtn.disabled    = false;
  submitBtn.textContent = 'Save';

  if (!ok) { showToast('Save failed. Check connection.', true); return; }

  closeResModal();
  renderReservationsTable();
  renderOverview();
  updatePendingBadge();
  showToast(id ? 'Reservation updated.' : 'New reservation added.');
});

/* ─────────────────────────────────────────
   ROOMS
───────────────────────────────────────────*/
function renderRooms() {
  document.getElementById('roomsAdminGrid').innerHTML = Object.entries(HOMES_CONFIG).map(([key, h]) => {
    const avail    = roomAvailability[key] !== false;
    const bookings = reservations.filter(r => r.home === h.name && r.status !== 'cancelled').length;
    return `
    <div class="ra-card">
      <div class="ra-card-img">
        <img src="${h.img}" alt="${h.name}" />
        <button class="ra-avail-toggle ${avail ? '' : 'unavailable'}" data-key="${key}">
          <span class="ra-toggle-dot"></span>${avail ? 'Available' : 'Unavailable'}
        </button>
      </div>
      <div class="ra-card-body">
        <div class="ra-type">${h.type}</div>
        <div class="ra-name">${h.name}</div>
        <div class="ra-specs">
          <span class="ra-spec">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${h.guests} Guests
          </span>
          <span class="ra-spec">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 4v16M22 4v16M2 8h20M2 16h20M6 8v8M10 8v8M14 8v8M18 8v8"/></svg>
            ${h.bed}
          </span>
          <span class="ra-spec" style="color:var(--green);font-weight:500">₹${h.price.toLocaleString('en-IN')}/night</span>
        </div>
        <div class="ra-card-actions">
          <button class="btn-primary" onclick="filterResByHome('${h.name}')">View Bookings</button>
          <button class="btn-ghost-dark" onclick="openResModalForHome('${h.name}')">+ Add</button>
          <span class="ra-bookings-count">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            ${bookings} booking${bookings !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>`;
  }).join('');

  document.querySelectorAll('.ra-avail-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      roomAvailability[key] = !roomAvailability[key];
      saveState('dbk_availability', roomAvailability);
      renderRooms();
      showToast(`${HOMES_CONFIG[key].name} marked as ${roomAvailability[key] ? 'available' : 'unavailable'}.`);
    });
  });
}

window.filterResByHome = function (name) {
  switchTab('reservations');
  document.getElementById('resFilter').value = 'all';
  document.getElementById('resSearch').value = name;
  resSearchVal = name.toLowerCase(); resFilterVal = 'all';
  renderReservationsTable();
};
window.openResModalForHome = function (name) {
  openResModal(null);
  document.getElementById('rm-home').value = name;
};

/* ─────────────────────────────────────────
   GALLERY
───────────────────────────────────────────*/
function renderGallery() {
  document.getElementById('galleryAdminGrid').innerHTML = galleryImages.map((img, i) => `
    <div class="ga-item">
      <img src="${img.src}" alt="${img.label}" loading="lazy" />
      <div class="ga-item-overlay">
        <button class="ga-remove" onclick="removeGalleryImage(${i})" title="Remove">×</button>
      </div>
      <span class="ga-item-label">${img.label}</span>
    </div>`).join('');
}

window.removeGalleryImage = function (i) {
  galleryImages.splice(i, 1);
  saveState('dbk_gallery', galleryImages);
  renderGallery();
  showToast('Photo removed.');
};

document.getElementById('galleryUpload').addEventListener('change', function () {
  Array.from(this.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      galleryImages.push({ src: e.target.result, label: file.name.replace(/\.[^.]+$/, '') });
      saveState('dbk_gallery', galleryImages);
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
  this.value = '';
  showToast('Photos added.');
});

/* ─────────────────────────────────────────
   SETTINGS
───────────────────────────────────────────*/
document.getElementById('contactForm').addEventListener('submit', e => { e.preventDefault(); showToast('Contact info saved.'); });
document.getElementById('socialForm').addEventListener('submit', e => { e.preventDefault(); showToast('Social links saved.'); });
document.getElementById('heroForm').addEventListener('submit', e => { e.preventDefault(); showToast('Website content saved.'); });

document.getElementById('passwordForm').addEventListener('submit', e => {
  e.preventDefault();
  const err = document.getElementById('pwChangeError');
  const cur = e.target.current.value;
  const nw  = e.target.new.value;
  const cf  = e.target.confirm.value;
  err.hidden = true;
  if (cur !== currentPassword)  { err.textContent = 'Current password is incorrect.'; err.hidden = false; return; }
  if (nw.length < 6)            { err.textContent = 'Password must be at least 6 characters.'; err.hidden = false; return; }
  if (nw !== cf)                { err.textContent = 'Passwords do not match.'; err.hidden = false; return; }
  currentPassword = nw;
  saveState('dbk_pw', currentPassword);
  e.target.reset();
  showToast('Password updated.');
});
