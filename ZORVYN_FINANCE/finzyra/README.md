# Finzyra — Smart Finance Dashboard

A fully client-side personal finance tracker built with vanilla HTML, CSS, and JS.
**Light blue theme** — no build tools, no dependencies, no server required.

## Quick Start

1. Open `finzyra/` in VSCode
2. Install the **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Sign in: `demo@finzyra.com` / `Demo@1234`

## Folder Structure

```
finzyra/
├── index.html       # Full app — auth, shell, all pages, all modals
├── css/
│   └── style.css    # Light blue theme, dark mode, all component styles
├── js/
│   ├── data.js      # Seed data, constants, localStorage helpers
│   ├── auth.js      # Sign in / Sign up / Forgot / Google picker / Sign out
│   └── app.js       # Navigation, charts, all render functions, modals
└── README.md
```

## Features

### Auth
- Sign in / Sign up with live password strength meter (6 requirements)
- Google account picker (3 demo accounts)
- Forgot password (demo flow)
- Auto-login via `localStorage` session
- Sign out

### Dashboard
- 5 animated stat cards (Balance, Income, Expenses, Savings Rate, This Month)
- Balance Trend chart (3M / 6M toggle) — bar + line combo
- Spending Breakdown donut with inline bar chart
- Recent Activity list with status indicators

### Transactions
- Full table with pagination (10 per page)
- Search by description or category
- Filter by type, category, status
- Sort by date or amount (asc/desc)
- Add / Edit / Delete (admin only)
- Export to CSV or JSON

### Insights
- 4 smart stat cards
- Category breakdown donut
- 5 auto-generated insight cards
- Monthly comparison table (6 months)

### Budget
- Per-category budget progress bars
- Color-coded status (On Track / Near Limit / Over Budget)
- Edit budget limits (admin only)
- Overall budget summary cards

### Goals
- Ring progress indicators (SVG)
- Add / Contribute / Delete goals
- Deadline countdown with urgency highlight

### Settings
- Dark / Light theme toggle
- Admin / Viewer role switch
- INR / USD currency toggle
- DD/MM/YYYY or MM/DD/YYYY date format

## Credentials & Roles

| Role   | Access |
|--------|--------|
| Admin  | Full CRUD — add, edit, delete transactions, edit budgets, manage goals |
| Viewer | Read-only — no add/edit/delete buttons |

## Data Persistence

All data is stored in `localStorage`:

| Key             | Contents                        |
|-----------------|---------------------------------|
| `fz3_tx`        | Transactions array              |
| `fz3_budgets`   | Budget limits per category      |
| `fz3_goals`     | Savings goals                   |
| `fz3_users`     | Registered users                |
| `fz3_session`   | Current logged-in user          |
| `fz3_settings`  | Theme, currency, date format    |
| `fz3_role`      | Current role (admin/viewer)     |

## Deployment

Push to GitHub → Settings → Pages → Deploy from `main` root.
The app is 100% static — no backend needed.
