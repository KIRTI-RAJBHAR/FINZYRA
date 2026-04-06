// ============================================================
// data.js  —  Finzyra  |  All data, constants & storage
// ============================================================

// ---- Category config ----
const CATEGORIES = {
  income:  ['Salary','Freelance','Investment','Dividend','Other Income'],
  expense: ['Rent','Shopping','Food & Dining','Utilities','Entertainment','Transport','Healthcare','Investment','Saving','Other']
};

const CAT_COLORS = {
  'Rent':'#ef4444','Salary':'#22c55e','Shopping':'#f59e0b','Food & Dining':'#f97316',
  'Utilities':'#3b82f6','Transport':'#14b8a6','Entertainment':'#8b5cf6',
  'Healthcare':'#ec4899','Investment':'#6366f1','Saving':'#0ea5e9',
  'Freelance':'#10b981','Dividend':'#22c55e','Other':'#6b7280','Other Income':'#22c55e'
};

const CAT_ICONS = {
  'Rent':'🏠','Salary':'💼','Shopping':'🛍️','Food & Dining':'🍽️','Utilities':'⚡',
  'Transport':'🚗','Entertainment':'🎬','Healthcare':'💊','Investment':'📈',
  'Saving':'💰','Freelance':'💻','Dividend':'📊','Other':'📦','Other Income':'💹'
};

// ---- Sample transactions (combined from both versions) ----
const INITIAL_TX = [
  // 2026
  {id:1001,date:'2026-04-02',desc:'Salary - Accenture',         category:'Salary',       type:'income', amount:115000,status:'completed'},
  {id:1002,date:'2026-04-03',desc:'Rent - April',               category:'Rent',         type:'expense',amount:23000, status:'completed'},
  {id:1003,date:'2026-04-05',desc:'Rapido',                     category:'Transport',    type:'expense',amount:158,   status:'completed'},
  {id:1004,date:'2026-04-06',desc:'Spotify Premium',            category:'Entertainment',type:'expense',amount:149,   status:'completed'},
  {id:1005,date:'2026-04-01',desc:'Practo Consultation',        category:'Healthcare',   type:'expense',amount:650,   status:'pending'},
  // Mar 2026
  {id:1006,date:'2026-03-01',desc:'Salary - Accenture',         category:'Salary',       type:'income', amount:142750,status:'completed'},
  {id:1007,date:'2026-03-01',desc:'Rent - March',               category:'Rent',         type:'expense',amount:23000, status:'completed'},
  {id:1008,date:'2026-03-05',desc:'SIP - Mirae Asset',          category:'Investment',   type:'expense',amount:5000,  status:'completed'},
  {id:1009,date:'2026-03-08',desc:'Croma',                      category:'Shopping',     type:'expense',amount:7200,  status:'completed'},
  {id:1010,date:'2026-03-10',desc:'Swiggy',                     category:'Food & Dining',type:'expense',amount:820,   status:'completed'},
  {id:1011,date:'2026-03-12',desc:'BWSSB Water Bill',           category:'Utilities',    type:'expense',amount:650,   status:'completed'},
  {id:1012,date:'2026-03-15',desc:'Freelance - Logo Design',    category:'Freelance',    type:'income', amount:19500, status:'completed'},
  {id:1013,date:'2026-03-17',desc:'Amazon',                     category:'Shopping',     type:'expense',amount:3100,  status:'completed'},
  {id:1014,date:'2026-03-22',desc:'Dividend - SBI Bluechip',    category:'Dividend',     type:'income', amount:6500,  status:'completed'},
  // Feb 2026
  {id:1015,date:'2026-02-01',desc:'Salary - Accenture',         category:'Salary',       type:'income', amount:120000,status:'completed'},
  {id:1016,date:'2026-02-01',desc:'Rent - February',            category:'Rent',         type:'expense',amount:23000, status:'completed'},
  {id:1017,date:'2026-02-05',desc:'Zomato',                     category:'Food & Dining',type:'expense',amount:340,   status:'completed'},
  {id:1018,date:'2026-02-10',desc:'Metro Card Recharge',        category:'Transport',    type:'expense',amount:500,   status:'completed'},
  {id:1019,date:'2026-02-14',desc:'Valentine Dinner',           category:'Food & Dining',type:'expense',amount:2800,  status:'completed'},
  {id:1020,date:'2026-02-20',desc:'Netflix',                    category:'Entertainment',type:'expense',amount:649,   status:'completed'},
  {id:1021,date:'2026-02-25',desc:'Electricity Bill',           category:'Utilities',    type:'expense',amount:1150,  status:'completed'},
  // Jan 2026
  {id:1022,date:'2026-01-01',desc:'Salary - Accenture',         category:'Salary',       type:'income', amount:120000,status:'completed'},
  {id:1023,date:'2026-01-01',desc:'Rent - January',             category:'Rent',         type:'expense',amount:23000, status:'completed'},
  {id:1024,date:'2026-01-06',desc:'Myntra',                     category:'Shopping',     type:'expense',amount:1800,  status:'completed'},
  {id:1025,date:'2026-01-12',desc:'Chai Point',                 category:'Food & Dining',type:'expense',amount:260,   status:'completed'},
  {id:1026,date:'2026-01-18',desc:'Online Order - MedPlus',     category:'Healthcare',   type:'expense',amount:890,   status:'failed'},
  // Dec 2025
  {id:1027,date:'2025-12-30',desc:'Salary - Accenture',         category:'Salary',       type:'income', amount:120000,status:'completed'},
  {id:1028,date:'2025-12-29',desc:'Rent - December',            category:'Rent',         type:'expense',amount:23000, status:'completed'},
  {id:1029,date:'2025-12-27',desc:'BWSSB Water Bill',           category:'Utilities',    type:'expense',amount:650,   status:'completed'},
  {id:1030,date:'2025-12-22',desc:'Freelance - Logo Design',    category:'Freelance',    type:'income', amount:19500, status:'completed'},
  {id:1031,date:'2025-12-17',desc:'Croma Shopping',             category:'Shopping',     type:'expense',amount:7200,  status:'completed'},
  {id:1032,date:'2025-12-12',desc:'Chai Point',                 category:'Food & Dining',type:'expense',amount:260,   status:'completed'},
  {id:1033,date:'2025-12-07',desc:'Dividend - SBI Bluechip',    category:'Dividend',     type:'income', amount:5361,  status:'completed'},
  // Nov 2025
  {id:1034,date:'2025-11-30',desc:'Salary - Accenture',         category:'Salary',       type:'income', amount:120000,status:'completed'},
  {id:1035,date:'2025-11-29',desc:'Rent - November',            category:'Rent',         type:'expense',amount:23000, status:'completed'},
  {id:1036,date:'2025-11-11',desc:'Rapido Rides',               category:'Transport',    type:'expense',amount:129,   status:'completed'},
  {id:1037,date:'2025-11-06',desc:'Spotify Premium',            category:'Entertainment',type:'expense',amount:128,   status:'completed'},
  {id:1038,date:'2025-11-01',desc:'Practo Consultation',        category:'Healthcare',   type:'expense',amount:536,   status:'pending'},
  // Oct 2025
  {id:1039,date:'2025-10-01',desc:'Salary - Accenture',         category:'Salary',       type:'income', amount:120000,status:'completed'},
  {id:1040,date:'2025-10-02',desc:'Rent - October',             category:'Rent',         type:'expense',amount:23000, status:'completed'},
  {id:1041,date:'2025-10-15',desc:'Diwali Shopping',            category:'Shopping',     type:'expense',amount:8500,  status:'completed'},
  {id:1042,date:'2025-10-20',desc:'FD Interest - HDFC',         category:'Dividend',     type:'income', amount:4200,  status:'completed'},
  // Sep 2025
  {id:1043,date:'2025-09-01',desc:'Salary - Accenture',         category:'Salary',       type:'income', amount:120000,status:'completed'},
  {id:1044,date:'2025-09-03',desc:'Rent - September',           category:'Rent',         type:'expense',amount:23000, status:'completed'},
  {id:1045,date:'2025-09-10',desc:'BigBasket Grocery',          category:'Food & Dining',type:'expense',amount:3200,  status:'completed'},
  {id:1046,date:'2025-09-20',desc:'SIP - HDFC Mid Cap',         category:'Investment',   type:'expense',amount:5000,  status:'completed'},
];

const DEFAULT_BUDGETS = {
  'Rent':30000,'Shopping':8000,'Food & Dining':10000,'Utilities':3000,
  'Entertainment':2000,'Transport':3000,'Healthcare':5000,
  'Investment':15000,'Saving':20000,'Other':5000
};

const DEFAULT_GOALS = [
  {id:1,name:"Emergency Fund",  icon:"🛡️",target:300000,saved:120000,date:"2026-12-31"},
  {id:2,name:"Europe Trip",     icon:"✈️",target:150000,saved:45000, date:"2027-06-01"},
  {id:3,name:"New MacBook",     icon:"💻",target:180000,saved:90000, date:"2026-09-01"},
  {id:4,name:"Car Down Payment",icon:"🚗",target:500000,saved:75000, date:"2027-12-31"},
];

const GOOGLE_ACCOUNTS = [
  {id:'g1', name:'Alex Kumar',      email:'alex.kumar@gmail.com',        av:'AK', avClass:'g-av-1'},
  {id:'g2', name:'Alex K. Work',    email:'alexkumar@workspace.google.com', av:'AW', avClass:'g-av-2'},
  {id:'g3', name:'alex.personal99', email:'alex.personal99@gmail.com',   av:'AP', avClass:'g-av-3'},
];

const NOTIFICATIONS_DATA = [
  {title:'Budget Alert',      sub:'Food & Dining at 82% of budget this month', read:false},
  {title:'Goal Milestone',    sub:'Emergency Fund: 40% complete!',              read:false},
  {title:'New Transaction',   sub:'Salary ₹1,15,000 received from Accenture',  read:true},
  {title:'Investment Update', sub:'SIP auto-debited ₹5,000 successfully',       read:true},
  {title:'Pending Payment',   sub:'Practo consultation payment pending',         read:false},
];

// ---- State ----
let transactions  = JSON.parse(localStorage.getItem('fz3_tx')       || 'null') || INITIAL_TX;
let budgets       = JSON.parse(localStorage.getItem('fz3_budgets')   || 'null') || DEFAULT_BUDGETS;
let goals         = JSON.parse(localStorage.getItem('fz3_goals')     || 'null') || DEFAULT_GOALS;
let users         = JSON.parse(localStorage.getItem('fz3_users')     || 'null') || [
  {email:'demo@finzyra.com', pass:'Demo@1234', first:'Alex', last:'Kumar'}
];
let currentUser   = JSON.parse(localStorage.getItem('fz3_session')  || 'null');
let currentRole   = localStorage.getItem('fz3_role')    || 'admin';
let appSettings   = JSON.parse(localStorage.getItem('fz3_settings') || 'null') || {
  theme: 'light', currency: 'INR', dateFormat: 'DD/MM/YYYY'
};

// ---- Persist helpers ----
const saveTx       = () => localStorage.setItem('fz3_tx',       JSON.stringify(transactions));
const saveUsers    = () => localStorage.setItem('fz3_users',    JSON.stringify(users));
const saveSession  = () => localStorage.setItem('fz3_session',  JSON.stringify(currentUser));
const saveRole     = r  => localStorage.setItem('fz3_role',     r);
const saveSettings = () => localStorage.setItem('fz3_settings', JSON.stringify(appSettings));
const saveBudgets  = () => localStorage.setItem('fz3_budgets',  JSON.stringify(budgets));
const saveGoals    = () => localStorage.setItem('fz3_goals',    JSON.stringify(goals));

// ---- Format helpers ----
const fmt = n => {
  if (appSettings.currency === 'USD') {
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n/83);
  }
  return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
};
const fmtShort = n => {
  const v   = appSettings.currency === 'USD' ? n/83 : n;
  const sym = appSettings.currency === 'USD' ? '$' : '₹';
  if (Math.abs(v) >= 10000000) return sym+(v/10000000).toFixed(1)+'Cr';
  if (Math.abs(v) >= 100000)   return sym+(v/100000).toFixed(1)+'L';
  if (Math.abs(v) >= 1000)     return sym+(v/1000).toFixed(1)+'K';
  return sym+Math.round(v);
};
const fmtDate = d => {
  const dt = new Date(d);
  if (appSettings.dateFormat === 'MM/DD/YYYY')
    return dt.toLocaleDateString('en-US',{day:'2-digit',month:'2-digit',year:'numeric'});
  return dt.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'});
};
const fmtDateLong = d => new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});

// ---- Category pill helper ----
function catPill(cat) {
  const color = CAT_COLORS[cat] || '#6b7280';
  const dot   = `<span style="width:7px;height:7px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block;margin-right:4px;"></span>`;
  return `<span class="cat-pill" style="background:${color}18;border:1px solid ${color}33;color:${color};">${dot}${cat}</span>`;
}

// ---- Compute monthly summary ----
function getMonthly(monthOffset = 0) {
  const now = new Date();
  const d   = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
  const m   = d.getMonth(), y = d.getFullYear();
  const txs = transactions.filter(t => {
    const td = new Date(t.date);
    return td.getMonth() === m && td.getFullYear() === y && t.status !== 'failed';
  });
  const income  = txs.filter(t => t.type === 'income').reduce((a,t)  => a + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((a,t) => a + t.amount, 0);
  return {
    income, expense, net: income - expense,
    savings: income > 0 ? ((income - expense) / income * 100) : 0,
    label: d.toLocaleString('en',{month:'short', year:'2-digit'})
  };
}
