// ============================================================
// app.js  —  Finzyra  |  Main Application Logic
// ============================================================

let currentPageId = 'dashboard';
let txCurrentPage = 1;
const TX_PER_PAGE = 10;
let txFiltered    = [];
let txEditId      = null;
let balanceChart  = null;
let donutChart    = null;
let goalEditId    = null;

// ============================================================
// INIT
// ============================================================
function initApp() {
  applyRole(currentRole);
  updateClock();
  setInterval(updateClock, 1000);
  renderNotifs();
  navigateTo('dashboard');
  document.addEventListener('click', handleOutsideClick);
}

function handleOutsideClick(e) {
  const ud = document.getElementById('userDropdown');
  const uc = document.getElementById('userChip');
  const nd = document.getElementById('notifDropdown');
  const nb = document.getElementById('notifBtn');
  if (ud && uc && !ud.contains(e.target) && !uc.contains(e.target)) ud.classList.remove('open');
  if (nd && nb && !nd.contains(e.target) && !nb.contains(e.target)) nd.classList.remove('open');
}

// ============================================================
// CLOCK
// ============================================================
function updateClock() {
  const el = document.getElementById('liveClock');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
}

// ============================================================
// THEME
// ============================================================
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  appSettings.theme = next;
  saveSettings();
  updateThemeKnob();
  destroyCharts();
  renderActivePage();
}

function updateThemeKnob() {
  const knob = document.getElementById('themeKnob');
  if (knob) knob.textContent = appSettings.theme === 'dark' ? '☀️' : '🌙';
}

function destroyCharts() {
  if (balanceChart) { balanceChart.destroy(); balanceChart = null; }
  if (donutChart)   { donutChart.destroy();   donutChart = null;   }
}

// ============================================================
// ROLE
// ============================================================
function applyRole(role) {
  currentRole = role;
  saveRole(role);
  const dot   = document.getElementById('roleDot');
  const label = document.getElementById('roleLabel');
  if (dot)   dot.className = 'role-dot ' + role;
  if (label) label.textContent = role === 'admin' ? 'ADMIN' : 'VIEWER';
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = role === 'admin' ? '' : 'none';
  });
  showToast(role === 'admin' ? 'Admin mode — full access enabled' : 'Viewer mode — read only');
}

function toggleRole() {
  applyRole(currentRole === 'admin' ? 'viewer' : 'admin');
  closeUserDropdown();
  const lbl = document.getElementById('switchRoleLbl');
  if (lbl) lbl.textContent = currentRole === 'admin' ? 'Switch to Viewer' : 'Switch to Admin';
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(pageId) {
  currentPageId = pageId;
  document.querySelectorAll('.topbar-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
  document.querySelectorAll('.page').forEach(p => {
    p.classList.toggle('active', p.id === 'page-' + pageId);
  });
  destroyCharts();
  renderActivePage();
}

function renderActivePage() {
  if (currentPageId === 'dashboard')    renderDashboard();
  if (currentPageId === 'transactions') { txCurrentPage = 1; renderTransactions(); }
  if (currentPageId === 'insights')     renderInsights();
  if (currentPageId === 'budget')       renderBudget();
  if (currentPageId === 'goals')        renderGoals();
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg, color) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const t = document.createElement('div');
  t.className = 'toast';
  if (color) { t.style.borderLeftColor = color; t.style.color = color; }
  t.textContent = msg;
  stack.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

// ============================================================
// USER DROPDOWN
// ============================================================
function toggleUserDropdown() {
  document.getElementById('userDropdown').classList.toggle('open');
}
function closeUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.remove('open');
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function toggleNotif() {
  document.getElementById('notifDropdown').classList.toggle('open');
}
function markAllNotifRead() {
  NOTIFICATIONS_DATA.forEach(n => n.read = true);
  renderNotifs();
  document.getElementById('notifDropdown').classList.remove('open');
}
function renderNotifs() {
  const unread = NOTIFICATIONS_DATA.filter(n => !n.read).length;
  const dot    = document.getElementById('notifBadge');
  if (dot) {
    dot.style.display = unread ? 'flex' : 'none';
    dot.textContent   = unread > 9 ? '9+' : unread;
  }
  const list = document.getElementById('notifList');
  if (!list) return;
  list.innerHTML = NOTIFICATIONS_DATA.map((n,i) => `
    <div class="notif-item-row${n.read ? ' read':''}" onclick="NOTIFICATIONS_DATA[${i}].read=true;renderNotifs();">
      <div class="notif-dot-sm" style="opacity:${n.read?.3:1};"></div>
      <div>
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-sub">${n.sub}</div>
      </div>
    </div>`).join('');
}

// ============================================================
// SETTINGS MODAL
// ============================================================
function openSettings() {
  closeUserDropdown();
  document.getElementById('settingsModal').classList.add('open');
  document.querySelectorAll('.settings-seg-btn[data-theme]').forEach(b    => b.classList.toggle('active', b.dataset.theme    === appSettings.theme));
  document.querySelectorAll('.settings-seg-btn[data-role]').forEach(b     => b.classList.toggle('active', b.dataset.role     === currentRole));
  document.querySelectorAll('.settings-seg-btn[data-currency]').forEach(b => b.classList.toggle('active', b.dataset.currency === appSettings.currency));
  document.querySelectorAll('.settings-seg-btn[data-datefmt]').forEach(b  => b.classList.toggle('active', b.dataset.datefmt  === appSettings.dateFormat));
}
function closeSettings() { document.getElementById('settingsModal').classList.remove('open'); }

function settingTheme(t) {
  document.querySelectorAll('.settings-seg-btn[data-theme]').forEach(b => b.classList.toggle('active', b.dataset.theme === t));
  appSettings.theme = t;
  document.documentElement.setAttribute('data-theme', t);
  updateThemeKnob();
  saveSettings();
  destroyCharts();
  renderActivePage();
}
function settingRole(r) {
  document.querySelectorAll('.settings-seg-btn[data-role]').forEach(b => b.classList.toggle('active', b.dataset.role === r));
  applyRole(r);
}
function settingCurrency(c) {
  document.querySelectorAll('.settings-seg-btn[data-currency]').forEach(b => b.classList.toggle('active', b.dataset.currency === c));
  appSettings.currency = c;
  saveSettings();
  destroyCharts();
  renderActivePage();
}
function settingDateFmt(f) {
  document.querySelectorAll('.settings-seg-btn[data-datefmt]').forEach(b => b.classList.toggle('active', b.dataset.datefmt === f));
  appSettings.dateFormat = f;
  saveSettings();
  renderActivePage();
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const all  = transactions.filter(t => t.status !== 'failed');
  const inc  = all.filter(t => t.type === 'income').reduce((a,t)  => a + t.amount, 0);
  const exp  = all.filter(t => t.type === 'expense').reduce((a,t) => a + t.amount, 0);
  const bal  = inc - exp;
  const savR = inc > 0 ? ((bal/inc)*100).toFixed(1) : 0;
  const months6 = [...Array(6)].map((_,i) => getMonthly(i));
  const avgExp  = months6.reduce((a,m) => a + m.expense, 0) / 6;
  const thisM   = getMonthly(0);
  const lastM   = getMonthly(1);
  const mDelta  = lastM.expense > 0 ? (((thisM.expense - lastM.expense) / lastM.expense) * 100).toFixed(1) : 0;

  const sc = document.getElementById('statCards');
  if (sc) sc.innerHTML = [
    {icon:'💳', label:'TOTAL BALANCE',   val:fmt(bal),       cls:'blue',  sub:'All-time net'},
    {icon:'📈', label:'TOTAL INCOME',    val:fmt(inc),       cls:'green', sub:'All transactions'},
    {icon:'📉', label:'TOTAL EXPENSES',  val:fmt(exp),       cls:'red',   sub:'All transactions'},
    {icon:'💰', label:'SAVINGS RATE',    val:savR+'%',       cls:'teal',  sub:'Income saved'},
    {icon:'📅', label:'THIS MONTH',      val:fmt(thisM.income - thisM.expense), cls: thisM.net >= 0 ? 'green':'red', sub:`${mDelta >= 0 ? '+':''}${mDelta}% vs last month`},
  ].map(c => `
    <div class="stat-card">
      <div class="stat-icon">${c.icon}</div>
      <div class="stat-label">${c.label}</div>
      <div class="stat-val ${c.cls}">${c.val}</div>
      <div class="stat-change">${c.sub}</div>
    </div>`).join('');

  renderBalanceTrendChart('6M');
  renderSpendingBreakdown();
  renderRecentActivity();
  renderSidebar();
}


// ─── SIDEBAR ───
function renderSidebar() {
  const all = transactions.filter(t => t.status !== 'failed');
  const inc = all.filter(t => t.type === 'income').reduce((a,t) => a + t.amount, 0);
  const exp = all.filter(t => t.type === 'expense').reduce((a,t) => a + t.amount, 0);
  const net = inc - exp;

  const thisM = getMonthly(0);
  const lastM = getMonthly(1);
  const delta = net - (lastM.income - lastM.expense);

  const nw = document.getElementById('sbNetWorth');
  const nd = document.getElementById('sbNetDelta');
  const si = document.getElementById('sbIncome');
  const se = document.getElementById('sbExpense');
  const ss = document.getElementById('sbSaved');
  const rb = document.getElementById('sbRateBar');
  const rp = document.getElementById('sbRatePct');
  const tc = document.getElementById('sbTopCats');

  if (nw) nw.textContent = fmtShort(net);
  if (nd) {
    const sign = delta >= 0 ? '+' : '';
    nd.textContent = sign + fmtShort(delta) + ' vs last month';
    nd.className = 'dsb-net-delta ' + (delta >= 0 ? 'pos' : 'neg');
  }
  if (si) si.textContent = fmtShort(thisM.income);
  if (se) se.textContent = fmtShort(thisM.expense);
  if (ss) ss.textContent = fmtShort(thisM.net);

  const rate = thisM.income > 0 ? Math.max(0, Math.min(100, (thisM.net / thisM.income) * 100)) : 0;
  if (rb) rb.style.width = rate.toFixed(1) + '%';
  if (rp) rp.textContent = rate.toFixed(0) + '%';

  if (tc) {
    const bycat = {};
    all.filter(t => t.type === 'expense').forEach(t => bycat[t.category] = (bycat[t.category]||0) + t.amount);
    const sorted = Object.entries(bycat).sort((a,b) => b[1]-a[1]).slice(0, 4);
    const maxAmt = sorted[0] ? sorted[0][1] : 1;
    tc.innerHTML = sorted.map(([cat, amt]) => {
      const color = CAT_COLORS[cat] || '#6b7280';
      const pct   = (amt / maxAmt * 100).toFixed(1);
      return `<div style="margin-bottom:8px;">
        <div class="dsb-cat-row" style="margin-bottom:3px;">
          <div class="dsb-cat-dot" style="background:${color};"></div>
          <div class="dsb-cat-name">${cat}</div>
          <div class="dsb-cat-amt">${fmtShort(amt)}</div>
        </div>
        <div class="dsb-cat-bar-track">
          <div class="dsb-cat-bar-fill" style="width:${pct}%;background:${color};opacity:.75;"></div>
        </div>
      </div>`;
    }).join('');
  }
}

function renderBalanceTrendChart(period) {
  const count  = period === '3M' ? 3 : 6;
  const months = [...Array(count)].map((_,i) => getMonthly(count-1-i)).reverse();
  const labels       = months.map(m => m.label);
  const incomeData   = months.map(m => m.income);
  const expenseData  = months.map(m => m.expense);
  let running = 0;
  const balData = months.map(m => { running += m.net; return running; });

  const avgInc = incomeData.reduce((a,b) => a+b, 0) / count;
  const avgExp = expenseData.reduce((a,b) => a+b, 0) / count;
  const netSav = incomeData.reduce((a,b) => a+b, 0) - expenseData.reduce((a,b) => a+b, 0);

  const ss = document.getElementById('chartStatsRow');
  if (ss) ss.innerHTML = `
    <div class="chart-stat"><div class="chart-stat-label">AVG INCOME</div><div class="chart-stat-val green">${fmt(avgInc)}</div></div>
    <div class="chart-stat"><div class="chart-stat-label">AVG EXPENSE</div><div class="chart-stat-val red">${fmt(avgExp)}</div></div>
    <div class="chart-stat"><div class="chart-stat-label">NET SAVED</div><div class="chart-stat-val teal">${fmt(netSav)}</div></div>`;

  document.querySelectorAll('.cperiod-btn').forEach(b => b.classList.toggle('active', b.dataset.p === period));

  const ctx = document.getElementById('balanceChart');
  if (!ctx) return;
  if (balanceChart) balanceChart.destroy();

  const isDark = appSettings.theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)';
  const tickColor = isDark ? '#4a5568' : '#94a3b8';
  const tooltipBg = isDark ? '#1a2235' : '#ffffff';

  balanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {label:'Income',   data:incomeData,  backgroundColor: isDark ? 'rgba(124,58,237,.55)' : 'rgba(124,58,237,.7)',  borderRadius:8, borderSkipped:false},
        {label:'Expenses', data:expenseData, backgroundColor: isDark ? 'rgba(249,115,22,.5)' : 'rgba(249,115,22,.75)', borderRadius:8, borderSkipped:false},
        {label:'Balance',  data:balData, type:'line', borderColor:'#06d6b0', borderWidth:2.5,
          pointRadius:5, pointBackgroundColor:'#06d6b0', pointBorderColor:isDark?'#0b0f1a':'#fff', pointBorderWidth:2.5,
          tension:0.45, fill:true,
          backgroundColor:(ctx)=>{
            const gradient = ctx.chart.ctx.createLinearGradient(0,0,0,ctx.chart.height);
            gradient.addColorStop(0, 'rgba(6,214,176,.22)');
            gradient.addColorStop(1, 'rgba(6,214,176,0)');
            return gradient;
          },
          yAxisID:'y2'}
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:tooltipBg, titleColor:isDark?'#e2e8f0':'#1e293b',
          bodyColor:isDark?'#8892a4':'#64748b', borderColor:isDark?'rgba(255,255,255,.1)':'rgba(0,0,0,.08)',
          borderWidth:1, padding:12,
          callbacks:{label: c => `  ${c.dataset.label}: ${fmt(c.raw)}`}
        }
      },
      scales:{
        x:{grid:{color:gridColor}, ticks:{color:tickColor, font:{size:11}}},
        y:{grid:{color:gridColor}, ticks:{color:tickColor, font:{size:10}, callback:v=>fmtShort(v)}, beginAtZero:true},
        y2:{display:false, beginAtZero:false}
      }
    }
  });
}

function renderSpendingBreakdown() {
  const expTx  = transactions.filter(t => t.type==='expense' && t.status!=='failed');
  const bycat  = {};
  expTx.forEach(t => bycat[t.category] = (bycat[t.category]||0) + t.amount);
  const total  = Object.values(bycat).reduce((a,b) => a+b, 0);
  const sorted = Object.entries(bycat).sort((a,b) => b[1]-a[1]);

  const isDark = appSettings.theme === 'dark';
  const tooltipBg = isDark ? '#1a2235' : '#ffffff';

  const dctx = document.getElementById('donutChart');
  if (dctx) {
    if (donutChart) donutChart.destroy();
    const labels = sorted.map(([c]) => c);
    const data   = sorted.map(([,v]) => v);
    const colors = labels.map(l => CAT_COLORS[l] || '#6b7280');
    donutChart = new Chart(dctx, {
      type:'doughnut',
      data:{labels, datasets:[{data, backgroundColor:colors, borderColor:'transparent', borderWidth:0, hoverOffset:6}]},
      options:{
        responsive:true, maintainAspectRatio:false, cutout:'72%',
        plugins:{
          legend:{display:false},
          tooltip:{
            backgroundColor:tooltipBg, titleColor:isDark?'#e2e8f0':'#1e293b',
            bodyColor:isDark?'#8892a4':'#64748b', padding:12,
            callbacks:{label:c=>`  ${c.label}: ${fmt(c.raw)} (${((c.raw/total)*100).toFixed(1)}%)`}
          }
        }
      }
    });
  }

  const center = document.getElementById('donutCenter');
  if (center) {
    const topCat = sorted[0];
    center.innerHTML = `
      <div class="breakdown-donut-center-val">${topCat ? fmtShort(topCat[1]):'—'}</div>
      <div class="breakdown-donut-center-lbl">${topCat ? topCat[0].toUpperCase():'TOTAL'}</div>`;
  }

  const list = document.getElementById('breakdownList');
  if (list) {
    list.innerHTML = sorted.slice(0,8).map(([cat,amt]) => `
      <div class="breakdown-row">
        <span class="breakdown-dot" style="background:${CAT_COLORS[cat]||'#6b7280'};"></span>
        <span class="breakdown-name">${cat}</span>
        <div class="breakdown-bar-wrap"><div class="breakdown-bar" style="width:${((amt/total)*100).toFixed(1)}%;background:${CAT_COLORS[cat]||'#6b7280'};"></div></div>
        <span class="breakdown-pct">${((amt/total)*100).toFixed(1)}%</span>
        <span class="breakdown-amt">${fmtShort(amt)}</span>
      </div>`).join('');
  }
}

function renderRecentActivity() {
  const recent = [...transactions].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,8);
  const list   = document.getElementById('recentActivity');
  if (!list) return;
  list.innerHTML = recent.map(t => `
    <div class="activity-item">
      <div class="activity-icon ${t.type}">${CAT_ICONS[t.category]||'💳'}</div>
      <div class="activity-info">
        <div class="activity-name">${t.desc}</div>
        <div class="activity-date">${fmtDateLong(t.date)}</div>
      </div>
      <div class="activity-right">
        <div class="activity-amt ${t.type==='income'?'pos':'neg'}">${t.type==='income'?'+':'-'}${fmt(t.amount)}</div>
        <span class="status-dot status-${t.status}" title="${t.status}"></span>
      </div>
    </div>`).join('');
}

// ============================================================
// TRANSACTIONS
// ============================================================
function renderTransactions() {
  const search = (document.getElementById('txSearchInput')||{}).value?.toLowerCase() || '';
  const type   = (document.getElementById('txTypeFilter') ||{}).value || '';
  const cat    = (document.getElementById('txCatFilter')  ||{}).value || '';
  const status = (document.getElementById('txStatFilter') ||{}).value || '';
  const sort   = (document.getElementById('txSort')       ||{}).value || 'date-desc';

  txFiltered = transactions.filter(t => {
    if (type   && t.type     !== type)   return false;
    if (cat    && t.category !== cat)    return false;
    if (status && t.status   !== status) return false;
    if (search && !t.desc.toLowerCase().includes(search) && !t.category.toLowerCase().includes(search)) return false;
    return true;
  });

  txFiltered.sort((a,b) => {
    if (sort==='date-desc')   return new Date(b.date)-new Date(a.date);
    if (sort==='date-asc')    return new Date(a.date)-new Date(b.date);
    if (sort==='amount-desc') return b.amount-a.amount;
    return a.amount-b.amount;
  });

  // populate category dropdown
  const catSel = document.getElementById('txCatFilter');
  if (catSel && catSel.options.length <= 1) {
    const allCats = [...new Set(transactions.map(t=>t.category))].sort();
    allCats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      catSel.appendChild(opt);
    });
  }

  const total = txFiltered.length;
  const pages = Math.ceil(total / TX_PER_PAGE) || 1;
  const start = (txCurrentPage-1)*TX_PER_PAGE;
  const paged = txFiltered.slice(start, start+TX_PER_PAGE);

  const cl = document.getElementById('txCountLabel');
  if (cl) cl.textContent = total
    ? `Showing ${start+1}–${Math.min(start+TX_PER_PAGE,total)} of ${total} transactions`
    : 'No transactions found';

  const tbody = document.getElementById('txTableBody');
  if (!tbody) return;

  if (!paged.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-state-icon">📭</div><div>No transactions match your filters</div></div></td></tr>`;
  } else {
    tbody.innerHTML = paged.map(t => `
      <tr>
        <td style="color:var(--text2);font-size:12px;">${fmtDate(t.date)}</td>
        <td>
          <div class="tx-icon-cell">
            <div class="tx-icon ${t.type}">${CAT_ICONS[t.category]||'💳'}</div>
            <div>
              <div class="tx-desc-main">${t.desc}</div>
              <div class="tx-desc-sub">#${String(t.id).padStart(4,'0')}</div>
            </div>
          </div>
        </td>
        <td>${catPill(t.category)}</td>
        <td><span class="type-pill ${t.type}">${t.type==='income'?'↑ Income':'↓ Expense'}</span></td>
        <td class="${t.type==='income'?'amt-pos':'amt-neg'}">${t.type==='income'?'+':'-'}${fmt(t.amount)}</td>
        <td><span class="status-pill status-${t.status}"><span class="dot"></span>${t.status}</span></td>
        <td class="admin-only" style="text-align:center;">
          <button class="tx-action-btn edit"   onclick="editTx(${t.id})"   title="Edit">✏️</button>
          <button class="tx-action-btn delete" onclick="deleteTx(${t.id})" title="Delete">🗑️</button>
        </td>
      </tr>`).join('');
  }

  renderTxPagination(total, pages);
}

function renderTxPagination(total, pages) {
  const prev = document.getElementById('txPrevBtn');
  const next = document.getElementById('txNextBtn');
  const nums = document.getElementById('txPageNums');
  if (prev) prev.disabled = txCurrentPage <= 1;
  if (next) next.disabled = txCurrentPage >= pages;
  if (nums) {
    nums.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
      if (pages > 7 && i > 2 && i < pages-1 && Math.abs(i-txCurrentPage) > 1) {
        if (i === 3 || i === pages-2) nums.innerHTML += `<span style="padding:0 4px;color:var(--text3)">…</span>`;
        continue;
      }
      const b = document.createElement('button');
      b.className = 'tx-page-btn' + (i===txCurrentPage?' active':'');
      b.textContent = i;
      b.onclick = () => { txCurrentPage = i; renderTransactions(); };
      nums.appendChild(b);
    }
  }
}

function txPrev() { if (txCurrentPage > 1) { txCurrentPage--; renderTransactions(); } }
function txNext() { txCurrentPage++; renderTransactions(); }
function txFilter() { txCurrentPage = 1; renderTransactions(); }
function txSearch() { txCurrentPage = 1; renderTransactions(); }

function exportCSV() {
  const rows = txFiltered.length ? txFiltered : transactions;
  const csv  = [['Date','Description','Category','Type','Amount','Status'],
    ...rows.map(t => [t.date, `"${t.desc}"`, t.category, t.type, t.amount, t.status])
  ].map(r => r.join(',')).join('\n');
  _download(new Blob([csv],{type:'text/csv'}), 'finzyra_transactions.csv');
  showToast('CSV exported ✓');
}
function exportJSON() {
  const rows = txFiltered.length ? txFiltered : transactions;
  _download(new Blob([JSON.stringify(rows,null,2)],{type:'application/json'}), 'finzyra_transactions.json');
  showToast('JSON exported ✓');
}
function _download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

// ---- ADD / EDIT MODAL ----
function openAddTx() {
  if (currentRole !== 'admin') { showToast('Admin access required','#ef4444'); return; }
  txEditId = null;
  document.getElementById('txModalTitle').textContent = 'Add Transaction';
  document.getElementById('txForm').reset();
  document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
  _syncTxCategoryOptions('expense');
  document.getElementById('txModal').classList.add('open');
}

function editTx(id) {
  if (currentRole !== 'admin') return;
  const t = transactions.find(x => x.id === id);
  if (!t) return;
  txEditId = id;
  document.getElementById('txModalTitle').textContent = 'Edit Transaction';
  document.getElementById('txDate').value   = t.date;
  document.getElementById('txDesc').value   = t.desc;
  document.getElementById('txAmount').value = t.amount;
  document.getElementById('txType').value   = t.type;
  document.getElementById('txStatus').value = t.status;
  _syncTxCategoryOptions(t.type);
  document.getElementById('txCategory').value = t.category;
  document.getElementById('txModal').classList.add('open');
}

function closeTxModal() { document.getElementById('txModal').classList.remove('open'); }
function onTxTypeChange(val) { _syncTxCategoryOptions(val); }

function _syncTxCategoryOptions(type) {
  const sel  = document.getElementById('txCategory');
  const cats = CATEGORIES[type] || CATEGORIES['expense'];
  sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  const hint = document.getElementById('txCatHint');
  if (hint) hint.textContent = type === 'income' ? '(income categories)' : '(expense categories)';
}

function saveTxModal() {
  const date   = document.getElementById('txDate').value;
  const desc   = document.getElementById('txDesc').value.trim();
  const amount = parseFloat(document.getElementById('txAmount').value);
  const type   = document.getElementById('txType').value;
  const status = document.getElementById('txStatus').value;
  const cat    = document.getElementById('txCategory').value;

  if (!date||!desc||!amount) { showToast('Please fill all required fields','#ef4444'); return; }

  if (txEditId) {
    const idx = transactions.findIndex(t => t.id === txEditId);
    if (idx >= 0) transactions[idx] = {...transactions[idx], date, desc, amount, type, status, category:cat};
    showToast('Transaction updated ✓');
  } else {
    transactions.unshift({id:Date.now(), date, desc, amount, type, status, category:cat});
    showToast('Transaction added ✓');
  }
  saveTx();
  closeTxModal();
  renderTransactions();
}

function deleteTx(id) {
  if (currentRole !== 'admin') return;
  if (!confirm('Delete this transaction?')) return;
  transactions = transactions.filter(t => t.id !== id);
  saveTx();
  showToast('Transaction deleted','#f59e0b');
  renderTransactions();
}

// ============================================================
// INSIGHTS
// ============================================================
function renderInsights() {
  const all  = transactions.filter(t => t.status !== 'failed');
  const inc  = all.filter(t => t.type==='income').reduce((a,t)  => a+t.amount, 0);
  const exp  = all.filter(t => t.type==='expense').reduce((a,t) => a+t.amount, 0);
  const savR = inc > 0 ? ((inc-exp)/inc*100).toFixed(1) : 0;

  const bycat  = {};
  all.filter(t => t.type==='expense').forEach(t => bycat[t.category]=(bycat[t.category]||0)+t.amount);
  const sorted = Object.entries(bycat).sort((a,b) => b[1]-a[1]);
  const topCat = sorted[0] || ['—',0];

  const months6 = [...Array(6)].map((_,i) => getMonthly(i));
  const avgExp  = months6.reduce((a,m) => a+m.expense, 0) / 6;
  const thisM   = getMonthly(0);
  const lastM   = getMonthly(1);
  const monthDelta = lastM.expense > 0 ? (((thisM.expense-lastM.expense)/lastM.expense)*100).toFixed(1) : 0;

  const sg = document.getElementById('insightStatGrid');
  if (sg) sg.innerHTML = [
    {label:'SAVINGS RATE',    val:savR+'%',        sub:'Above 20% target ✓',                 cls:'teal'},
    {label:'TOP EXPENSE',     val:topCat[0],        sub:fmt(topCat[1]),                        cls:'red'},
    {label:'TOTAL INCOME',    val:fmt(inc),          sub:`${months6.filter(m=>m.income>0).length} months tracked`, cls:'green'},
    {label:'AVG MONTHLY EXP', val:fmtShort(avgExp),  sub:'6-month average',                     cls:'blue'},
  ].map(s => `
    <div class="insight-stat">
      <div class="insight-stat-label">${s.label}</div>
      <div class="insight-stat-val ${s.cls}">${s.val}</div>
      <div class="insight-stat-sub">${s.sub}</div>
    </div>`).join('');

  const rentPct = inc > 0 ? ((bycat['Rent']||0)/inc*100).toFixed(0) : 0;
  const largest = [...transactions].filter(t=>t.type==='expense'&&t.status!=='failed').sort((a,b)=>b.amount-a.amount)[0];

  const ic = document.getElementById('insightCardsList');
  if (ic) ic.innerHTML = [
    {icon:'⚠️',  cls:'warn',   title:`High ${topCat[0]} Spending`,       desc:`${topCat[0]} leads your expense categories`,           badge:fmt(topCat[1]),     bColor:'#f59e0b'},
    {icon: parseFloat(monthDelta)<=0?'📉':'📈', cls:parseFloat(monthDelta)<=0?'good':'danger',
      title:'Monthly Comparison', desc:`Spent ${Math.abs(monthDelta)}% ${parseFloat(monthDelta)<=0?'less':'more'} than last month`,    badge:monthDelta+'%',     bColor:parseFloat(monthDelta)<=0?'#22c55e':'#ef4444'},
    {icon:'✅',  cls:'good',   title:'Savings on Track',                  desc:`Your ${savR}% savings rate beats the 20% target`,      badge:savR+'%',           bColor:'#22c55e'},
    {icon:'🏠',  cls:'info',   title:`Rent is ${rentPct}% of Income`,     desc:'Housing within the recommended 30% threshold',          badge:rentPct+'%',        bColor:'#3b82f6'},
    {icon:'💰',  cls:'warn',   title:'Largest Transaction',               desc:`Biggest expense: ${largest?.desc||'—'}`,               badge:largest?fmt(largest.amount):'—', bColor:'#f59e0b'},
  ].map(c => `
    <div class="insight-card-item">
      <div class="insight-card-icon ${c.cls}">${c.icon}</div>
      <div class="insight-card-body">
        <div class="insight-card-title">${c.title}</div>
        <div class="insight-card-desc">${c.desc}</div>
      </div>
      <span class="insight-card-badge" style="background:${c.bColor}18;color:${c.bColor};">${c.badge}</span>
    </div>`).join('');

  // Donut for insights
  const isDark = appSettings.theme === 'dark';
  const total  = Object.values(bycat).reduce((a,b) => a+b, 0);
  const insDonutCtx = document.getElementById('insightsDonut');
  if (insDonutCtx) {
    if (donutChart) { donutChart.destroy(); donutChart = null; }
    const labels = sorted.map(([c]) => c);
    const data   = sorted.map(([,v]) => v);
    const colors = labels.map(l => CAT_COLORS[l]||'#6b7280');
    donutChart = new Chart(insDonutCtx, {
      type:'doughnut',
      data:{labels, datasets:[{data, backgroundColor:colors, borderColor:'transparent', borderWidth:0, hoverOffset:6}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'68%',
        plugins:{legend:{display:false},tooltip:{
          backgroundColor:isDark?'#1a2235':'#ffffff', titleColor:isDark?'#e2e8f0':'#1e293b',
          bodyColor:isDark?'#8892a4':'#64748b', padding:12,
          callbacks:{label:c=>`  ${c.label}: ${fmt(c.raw)} (${((c.raw/total)*100).toFixed(1)}%)`}
        }}
      }
    });
    const dc = document.getElementById('insightsDonutCenter');
    if (dc) dc.innerHTML = `<div style="font-weight:700;font-size:16px;">${fmtShort(total)}</div><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;">Total Exp.</div>`;
  }

  const insBreak = document.getElementById('insightsBreakdownList');
  if (insBreak) {
    insBreak.innerHTML = sorted.slice(0,8).map(([cat,amt]) => `
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);">
        <span style="width:10px;height:10px;border-radius:50%;background:${CAT_COLORS[cat]||'#6b7280'};flex-shrink:0;"></span>
        <span style="flex:1;font-size:13px;">${cat}</span>
        <span style="font-size:11px;color:var(--text3);min-width:36px;text-align:right;">${((amt/total)*100).toFixed(1)}%</span>
        <span style="font-weight:600;font-size:13px;min-width:80px;text-align:right;">${fmt(amt)}</span>
      </div>`).join('');
  }

  // Monthly comparison table
  const mtable = document.getElementById('monthlyCompTable');
  if (mtable) {
    const rows = [...Array(6)].map((_,i) => getMonthly(5-i));
    mtable.innerHTML = rows.map(m => `
      <tr>
        <td class="month-name">${m.label.replace(' ','&nbsp;')}</td>
        <td style="color:var(--green);font-weight:600;">${fmt(m.income)}</td>
        <td style="color:var(--red);font-weight:600;">${fmt(m.expense)}</td>
        <td style="color:var(--accent);font-weight:600;">${m.net>=0?'+':''}${fmt(m.net)}</td>
        <td><span class="savings-rate">${m.savings.toFixed(1)}%</span></td>
      </tr>`).join('');
  }
}

// ============================================================
// BUDGET
// ============================================================
function renderBudget() {
  const expTx = transactions.filter(t => t.type==='expense' && t.status!=='failed');
  const spent = {};
  expTx.forEach(t => spent[t.category]=(spent[t.category]||0)+t.amount);

  const totalBudget = Object.values(budgets).reduce((a,b) => a+b, 0);
  const totalSpent  = Object.keys(budgets).reduce((a,k) => a+(spent[k]||0), 0);
  const remaining   = totalBudget - totalSpent;
  const pct         = totalBudget > 0 ? (totalSpent/totalBudget*100).toFixed(1) : 0;

  const bh = document.getElementById('budgetHeader');
  if (bh) bh.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-label">TOTAL BUDGET</div>
      <div class="stat-val blue">${fmt(totalBudget)}</div>
      <div class="stat-change">Monthly allocation</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">💸</div>
      <div class="stat-label">TOTAL SPENT</div>
      <div class="stat-val ${pct > 80 ? 'red':'green'}">${fmt(totalSpent)}</div>
      <div class="stat-change">${pct}% of budget used</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">💚</div>
      <div class="stat-label">REMAINING</div>
      <div class="stat-val ${remaining < 0 ? 'red':'teal'}">${fmt(remaining)}</div>
      <div class="stat-change">${remaining < 0 ? 'Over budget!':'Left to spend'}</div>
    </div>`;

  const bl = document.getElementById('budgetList');
  if (!bl) return;

  const cats = Object.entries(budgets).sort((a,b) => {
    const pa = spent[a[0]]||0, pb = spent[b[0]]||0;
    return (pb/b[1]) - (pa/a[1]);
  });

  bl.innerHTML = cats.map(([cat, limit]) => {
    const s   = spent[cat] || 0;
    const p   = limit > 0 ? Math.min((s/limit)*100, 100).toFixed(1) : 0;
    const cls = p >= 100 ? 'danger' : p >= 80 ? 'warning' : 'good';
    const color = p >= 100 ? '#ef4444' : p >= 80 ? '#f59e0b' : '#22c55e';
    return `
      <div class="budget-item">
        <div class="budget-item-head">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:18px;">${CAT_ICONS[cat]||'📦'}</span>
            <div>
              <div style="font-weight:600;font-size:14px;">${cat}</div>
              <div style="font-size:12px;color:var(--text3);">Spent ${fmt(s)} of ${fmt(limit)}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700;color:${color};">${p}%</div>
            <div style="font-size:11px;color:var(--text3);">Remaining: ${fmt(limit-s)}</div>
          </div>
        </div>
        <div class="budget-bar-track">
          <div class="budget-bar-fill ${cls}" style="width:${p}%;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <span class="budget-status-badge ${cls}">${p >= 100 ? '🔴 Over Budget' : p >= 80 ? '🟡 Near Limit' : '🟢 On Track'}</span>
          <button class="budget-edit-btn admin-only" onclick="openBudgetEdit('${cat}',${limit})">Edit limit</button>
        </div>
      </div>`;
  }).join('');
}

function openBudgetEdit(cat, current) {
  if (currentRole !== 'admin') { showToast('Admin access required','#ef4444'); return; }
  const modal = document.getElementById('budgetModal');
  document.getElementById('budgetModalCat').textContent  = cat;
  document.getElementById('budgetModalInput').value      = current;
  document.getElementById('budgetModalInput').dataset.cat = cat;
  if (modal) modal.classList.add('open');
}
function closeBudgetModal() { document.getElementById('budgetModal').classList.remove('open'); }
function saveBudgetEdit() {
  const input = document.getElementById('budgetModalInput');
  const cat   = input.dataset.cat;
  const val   = parseFloat(input.value);
  if (!cat || isNaN(val) || val < 0) { showToast('Enter a valid amount','#ef4444'); return; }
  budgets[cat] = val;
  saveBudgets();
  closeBudgetModal();
  showToast(`Budget for ${cat} updated ✓`);
  renderBudget();
}

// ============================================================
// GOALS
// ============================================================
function renderGoals() {
  const gl = document.getElementById('goalsList');
  if (!gl) return;

  const totalTarget = goals.reduce((a,g) => a+g.target, 0);
  const totalSaved  = goals.reduce((a,g) => a+g.saved, 0);
  const gh = document.getElementById('goalsHeader');
  if (gh) gh.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">🎯</div>
      <div class="stat-label">TOTAL GOALS</div>
      <div class="stat-val blue">${goals.length}</div>
      <div class="stat-change">Active goals</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">💰</div>
      <div class="stat-label">TOTAL SAVED</div>
      <div class="stat-val green">${fmt(totalSaved)}</div>
      <div class="stat-change">Across all goals</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🏁</div>
      <div class="stat-label">TARGET</div>
      <div class="stat-val teal">${fmt(totalTarget)}</div>
      <div class="stat-change">${(totalSaved/totalTarget*100).toFixed(1)}% achieved</div>
    </div>`;

  gl.innerHTML = goals.map(g => {
    const pct  = Math.min((g.saved/g.target)*100, 100).toFixed(1);
    const days = Math.ceil((new Date(g.date)-new Date()) / (1000*60*60*24));
    const color = pct >= 100 ? '#22c55e' : pct >= 50 ? '#0ea5e9' : '#f59e0b';
    return `
      <div class="goal-card">
        <div class="goal-ring-wrap">
          <svg class="goal-ring" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border2)" stroke-width="7"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke="${color}" stroke-width="7"
              stroke-dasharray="${2*Math.PI*34}" stroke-dashoffset="${2*Math.PI*34*(1-pct/100)}"
              stroke-linecap="round" transform="rotate(-90 40 40)"/>
          </svg>
          <div class="goal-ring-inner">
            <div style="font-weight:700;font-size:16px;">${Math.round(pct)}%</div>
          </div>
        </div>
        <div class="goal-info">
          <div class="goal-header">
            <div>
              <div class="goal-name">${g.icon} ${g.name}</div>
              <div class="goal-meta">${fmtShort(g.saved)} of ${fmtShort(g.target)}</div>
            </div>
            <div class="goal-deadline ${days < 30 ? 'urgent' : ''}">${days > 0 ? days+' days left' : '🎉 Achieved!'}</div>
          </div>
          <div class="goal-bar-track">
            <div class="goal-bar-fill" style="width:${pct}%;background:${color};"></div>
          </div>
          <div class="goal-actions">
            <button class="btn-contribute admin-only" onclick="openContributeGoal(${g.id})">+ Contribute</button>
            <button class="btn-delete-goal admin-only" onclick="deleteGoal(${g.id})">Delete</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function openAddGoal() {
  if (currentRole !== 'admin') { showToast('Admin access required','#ef4444'); return; }
  goalEditId = null;
  document.getElementById('goalModalTitle').textContent = 'New Goal';
  document.getElementById('goalForm').reset();
  document.getElementById('goalDate').value = new Date(Date.now()+365*24*60*60*1000).toISOString().split('T')[0];
  document.getElementById('goalModal').classList.add('open');
}

function closeGoalModal() { document.getElementById('goalModal').classList.remove('open'); }

function saveGoalModal() {
  const name   = document.getElementById('goalName').value.trim();
  const icon   = document.getElementById('goalIcon').value.trim() || '🎯';
  const target = parseFloat(document.getElementById('goalTarget').value);
  const saved  = parseFloat(document.getElementById('goalSaved').value) || 0;
  const date   = document.getElementById('goalDate').value;
  if (!name || !target || !date) { showToast('Please fill all fields','#ef4444'); return; }
  goals.push({id:Date.now(), name, icon, target, saved, date});
  saveGoals();
  closeGoalModal();
  showToast('Goal added ✓');
  renderGoals();
}

function openContributeGoal(id) {
  const g = goals.find(x => x.id === id);
  if (!g) return;
  const amt = parseFloat(prompt(`Contribute to "${g.name}" (Current: ${fmt(g.saved)} / ${fmt(g.target)})\nEnter amount:`));
  if (isNaN(amt) || amt <= 0) return;
  g.saved = Math.min(g.saved + amt, g.target);
  saveGoals();
  showToast(`Contributed ${fmt(amt)} to ${g.name} ✓`);
  renderGoals();
}

function deleteGoal(id) {
  if (!confirm('Delete this goal?')) return;
  goals = goals.filter(g => g.id !== id);
  saveGoals();
  showToast('Goal deleted','#f59e0b');
  renderGoals();
}
