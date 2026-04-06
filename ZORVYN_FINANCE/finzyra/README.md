# Finzyra — Smart Finance Dashboard

A fully client-side personal finance tracker built with vanilla HTML, CSS, and JS.
**Light blue theme** — no build tools, no dependencies, no server required.



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
🌟 What is Finzyra?
Finzyra is a personal finance dashboard that helps you take control of your money. It lets you track every rupee coming in and going out, visualize your spending habits, set savings goals, and manage budgets — all from a clean, modern interface that works entirely in your browser.
No server required. No cloud account needed. Your data stays on your device.

✨ Key Highlights

🔐 Secure Auth — Sign in / Sign up with password strength validation
📊 Live Dashboard — Real-time stats with animated charts
💳 Transaction Tracker — Full history with search, filter, sort and export
🎯 Savings Goals — Set targets and track progress visually
📅 Budget Manager — Per-category limits with color-coded alerts
🧠 Smart Insights — Auto-generated tips based on your spending
🌙 Dark Mode — Full dark / light theme toggle
📱 Responsive — Works on desktop, tablet, and mobile
💾 Offline First — All data saved in your browser's localStorage


🖥️ Live Demo
Demo credentials:
FieldValueEmaildemo@finzyra.comPasswordDemo@1234

📁 Folder Structure
finzyra/
├── index.html          ← Entire app — auth, dashboard, all pages & modals
├── README.md           ← You are here
├── css/
│   ├── style.css       ← Main theme — light blue palette, dark mode, all components
│   └── sidebar.css     ← Dashboard left sidebar + Balance Trend chart styles
└── js/
    ├── data.js         ← Seed data, constants, localStorage helpers
    ├── auth.js         ← Sign in / Sign up / Forgot password / Google picker
    └── app.js          ← Navigation, charts, render functions, modals




📱 Pages & Features
🏠 Dashboard
The main overview screen showing your complete financial picture at a glance.

Left Sidebar — Net worth, this month's income/expenses, savings rate bar, top spending categories, and quick navigation links
5 Stat Cards — Balance, Income, Expenses, Savings Rate, This Month Net
Balance Trend Chart — Bar + line combo chart for 3M or 6M view. Income shown in purple, expenses in orange, balance as a glowing teal line with gradient fill
Spending Breakdown — Donut chart with per-category percentage breakdown
Recent Activity — Latest 5 transactions with status indicators

💳 Transactions
Full transaction history with powerful filtering tools.

Search by description or category name
Filter by type (income/expense), category, and status
Sort by date or amount (ascending or descending)
Paginated table — 10 rows per page
Add, edit, delete transactions (Admin role only)
Export all data to CSV or JSON

🧠 Insights
Automated analysis of your spending patterns.

4 summary stat cards (top category, avg daily spend, biggest expense, savings vs last month)
Category breakdown donut chart
5 auto-generated insight cards (e.g. "You spent 32% more on Food this month")
6-month comparison table showing income, expenses, net balance, and savings rate

💰 Budget
Monthly budget management by category.

Progress bars for each expense category
Color-coded status — 🟢 On Track / 🟡 Near Limit / 🔴 Over Budget
Edit budget limits per category (Admin only)
Overall budget summary cards at the top

🎯 Goals
Visual savings goal tracker.

Ring-style SVG progress indicators
Add new goals with name, icon, target amount, and deadline
Contribute amounts toward any goal
Deadline countdown — urgent goals highlighted in red
Delete completed or cancelled goals (Admin only)

⚙️ Settings
Personalize your experience.

Theme — Light or Dark mode
Role — Switch between Admin (full access) and Viewer (read-only)
Currency — INR (₹) or USD ($) — amounts convert automatically
Date Format — DD/MM/YYYY or MM/DD/YYYY


🔐 Authentication
FeatureDetailsSign InEmail + password with error messagesSign UpLive password strength meter with 6 requirementsGoogle PickerDemo Google account selector (3 accounts)Forgot PasswordDemo reset flow with toast notificationAuto LoginSession saved to localStorage — stays logged in on refreshSign OutClears session and returns to login screen
Password requirements for Sign Up:

Minimum 8 characters
At least one uppercase letter (A–Z)
At least one lowercase letter (a–z)
At least one number (0–9)
At least one symbol (!@#$%^&*)
Both passwords must match


👤 Roles
RoleAccessAdminFull access — can add, edit, delete transactions, edit budgets, manage goalsViewerRead-only — all add/edit/delete buttons are hidden
Switch roles any time from Settings or the user dropdown menu.

💾 Data Storage
All data is stored locally in your browser using localStorage. Nothing is sent to any server.
KeyWhat it storesfz3_txAll transactionsfz3_budgetsBudget limits per categoryfz3_goalsSavings goalsfz3_usersRegistered user accountsfz3_sessionCurrently logged-in userfz3_settingsTheme, currency, date format preferencesfz3_roleCurrent role (admin or viewer)

🎨 Design System

Font: Sora (display) + JetBrains Mono (numbers)
Primary color: Sky blue #0ea5e9
Accent: Teal #06d6b0
Background: Soft blue-white #eef4fb
Dark mode: Deep navy #0b0f1a
Charts: Chart.js 4.4.1 — bar, line, doughnut
Icons: Inline SVG throughout
Animations: CSS transitions + canvas chart animations


📊 Sample Data Included
Finzyra comes preloaded with realistic Indian finance data covering October 2025 to April 2026, including:

Monthly salary credits from Accenture
Rent payments, SIP investments, utility bills
Freelance income, dividend receipts
Shopping, dining, transport, healthcare expenses
Pending and failed transaction examples

This lets you explore all features immediately without entering any data manually.

🌐 Deploy to GitHub Pages (Free Hosting)

Push the finzyra folder to a GitHub repository
Go to your repo → Settings → Pages
Set Source to Deploy from branch → main → / (root)
Click Save — your app will be live in ~1 minute at:

https://YOUR-USERNAME.github.io/finzyra

🛠️ Tech Stack
TechnologyUsageHTML5App structure, all pages and modals in one fileCSS3Custom theme system, animations, dark modeVanilla JavaScriptAll logic — no frameworks, no dependenciesChart.js 4.4.1Balance trend, donut, and insights chartslocalStorageClient-side data persistenceGoogle FontsSora + JetBrains Mono typography

📌 Notes

All data resets if you clear your browser's localStorage
The Google sign-in is a demo picker only — not real OAuth
Currency conversion uses a fixed rate of ₹83 = $1
The app is 100% static — safe to host anywhere


📄 License
MIT License — free to use, modify, and distribute.

Built with ❤️ — Finzyra helps you spend smarter and save better.
