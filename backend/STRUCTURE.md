# 📁 MoneyTalks Backend - File Structure Guide

This document explains the file structure and who owns what.

---

## 🗂️ Complete File Structure

```
/backend
│
├── 📄 server.js                    # Express server entry point
├── 📄 package.json                 # Dependencies & scripts
├── 📄 README.md                    # API documentation
├── 📄 STRUCTURE.md                 # This file!
│
├── 📁 routes/                      # API Routes (Express.js)
│   ├── dashboard.js                ✅ Backend A - Dashboard API
│   ├── budgets.js                  ✅ Backend A - Budgets API
│   ├── accounts.js                 ✅ Backend A - Accounts API
│   ├── confirm-transaction.js      ⏳ Backend A - TODO
│   ├── precheck.js                 ⏳ Backend B - Pre-check API
│   └── settings.js                 ⏳ Backend B - Settings API
│
├── 📁 convex/                      # Convex Database
│   ├── schema.ts                   ✅ Backend A - Database schema
│   ├── functions/
│   │   ├── transactions.ts         ✅ Backend A - Transaction CRUD
│   │   ├── budgets.ts              ✅ Backend A - Budget CRUD
│   │   ├── accounts.ts             ✅ Backend A - Account CRUD
│   │   └── analytics.ts            ⏳ Backend B - Analytics (optional)
│   └── _generated/                  # Auto-generated (don't edit)
│
├── 📁 lib/                         # Utility Libraries
│   ├── budgetEngine.ts             ⏳ Backend B - Budget analysis
│   ├── riskEngine.ts               ⏳ Backend B - Risk detection
│   ├── claude.ts                   ⏳ Backend B - Claude AI integration
│   ├── elevenlabs.ts               ⏳ Backend B - Text-to-speech
│   └── utils.ts                    ⏳ Backend B - Shared utilities
│
├── 📁 types/                       # TypeScript Interfaces
│   ├── Transaction.ts              📋 Shared - Transaction type
│   ├── Budget.ts                   📋 Shared - Budget type
│   ├── Account.ts                  📋 Shared - Account type
│   ├── User.ts                     📋 Shared - User type
│   ├── AdviceResponse.ts           📋 Shared - AI response type
│   └── Risk.ts                     📋 Shared - Risk type
│
└── 📁 scripts/                     # Utility Scripts
    ├── seed-data.mjs                🛠️ Seed database with sample data
    └── test-functions.mjs           🛠️ Test Convex functions
```

---

## 👥 Ownership Guide

### ✅ Backend A (You)
**Responsibility:** Database, CRUD operations, API endpoints

| Location | Files | Purpose |
|----------|-------|---------|
| `/convex/schema.ts` | Database schema | Define tables & indexes |
| `/convex/functions/transactions.ts` | Transaction CRUD | Save/get transactions |
| `/convex/functions/budgets.ts` | Budget CRUD | Manage budgets |
| `/convex/functions/accounts.ts` | Account CRUD | Manage bank accounts |
| `/routes/dashboard.js` | Dashboard API | Get spending summary |
| `/routes/budgets.js` | Budgets API | Budget management endpoints |
| `/routes/accounts.js` | Accounts API | Account management endpoints |
| `/routes/confirm-transaction.js` | Confirm API | ⏳ TODO: Save confirmed payment |
| `server.js` | Express server | Start server, mount routes |

---

### ⏳ Backend B (AI Teammate)
**Responsibility:** AI logic, risk detection, pre-check

| Location | Files | Purpose |
|----------|-------|---------|
| `/lib/budgetEngine.ts` | Budget analysis | Calculate budget status |
| `/lib/riskEngine.ts` | Risk detection | Detect scams/fraud |
| `/lib/claude.ts` | Claude AI | Generate AI advice |
| `/lib/elevenlabs.ts` | Text-to-speech | Voice responses |
| `/routes/precheck.ts` | Pre-check API | Analyze payment before confirm |
| `/routes/settings.js` | Settings API | User profile management |

---

### 📋 Shared (Both Teams)
**Anyone can read, coordinate before modifying**

| Location | Files | Purpose |
|----------|-------|---------|
| `/types/` | All `.ts` files | TypeScript interfaces |
| `README.md` | API docs | Documentation |
| `package.json` | Dependencies | Shared dependencies |

---

## 🔄 How Data Flows

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND                                                    │
│  Calls: GET /api/dashboard?userId=xxx                       │
└────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  /routes/dashboard.js  (Backend A)                          │
│  • Validates userId                                         │
│  • Calls Convex function                                    │
└────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  /convex/functions/transactions.ts  (Backend A)            │
│  • Queries database                                          │
│  • Calculates totals                                        │
└────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Convex Cloud Database                                       │
│  • Stores all data                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 File Descriptions

### 🚀 Entry Point
- **`server.js`** - Express server that starts on port 3001. Mounts all routes and handles errors.

### 🛣️ API Routes (`/routes/`)
All Express.js route handlers. Each file exports a router.

- **`dashboard.js`** - `GET /api/dashboard` - Returns spending summary
- **`budgets.js`** - `GET/POST/DELETE /api/budgets` - Budget CRUD
- **`accounts.js`** - `GET/POST/DELETE /api/accounts` - Account CRUD
- **`confirm-transaction.js`** - `POST /api/confirm-transaction` - Save confirmed payment (TODO)
- **`precheck.js`** - `POST /api/precheck` - Analyze payment before confirm (Backend B)
- **`settings.js`** - `GET/PUT /api/settings` - User settings (Backend B)

### 🗄️ Database (`/convex/`)
Convex cloud database functions.

- **`schema.ts`** - Defines 4 tables: `users`, `accounts`, `transactions`, `budgets`
- **`functions/transactions.ts`** - `createTransaction`, `getTransactionsForDashboard`
- **`functions/budgets.ts`** - `getBudgets`, `createOrUpdateBudget`, `deleteBudget`
- **`functions/accounts.ts`** - `getAccounts`, `addAccount`, `deleteAccount`
- **`_generated/`** - Auto-generated by Convex (don't edit!)

### 🤖 AI Libraries (`/lib/`)
Backend B's AI and analysis logic.

- **`budgetEngine.ts`** - Analyzes budget status (ok/near_limit/over_budget)
- **`riskEngine.ts`** - Detects payment risks (low/medium/high)
- **`claude.ts`** - Calls Claude API for AI advice
- **`elevenlabs.ts`** - Text-to-speech for voice responses
- **`utils.ts`** - Shared helper functions

### 📋 Types (`/types/`)
TypeScript interfaces used across the codebase.

- **`Transaction.ts`** - Transaction data structure
- **`Budget.ts`** - Budget data structure
- **`Account.ts`** - Bank account data structure
- **`User.ts`** - User data structure
- **`AdviceResponse.ts`** - AI advice response structure
- **`Risk.ts`** - Risk level types

### 🛠️ Scripts (`/scripts/`)
Utility scripts for development.

- **`seed-data.mjs`** - Populates database with sample data (`npm run seed`)
- **`test-functions.mjs`** - Tests all Convex functions (`npm test`)

---

## 🚦 Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete & Working |
| ⏳ | TODO / Not Implemented |
| 📋 | Shared / Documentation |
| 🛠️ | Utility / Tool |

---

## 🎯 Quick Navigation

**Need to...**

- **Add a new API endpoint?** → Create file in `/routes/`
- **Add a new database table?** → Edit `/convex/schema.ts`
- **Add a new CRUD function?** → Create file in `/convex/functions/`
- **Add AI logic?** → Create file in `/lib/`
- **Change a data type?** → Edit `/types/`
- **Test the database?** → Run `npm test`
- **Add sample data?** → Run `npm run seed`

---

## ⚠️ Important Notes

1. **Don't edit `/convex/_generated/`** - Auto-generated by Convex
2. **Coordinate on `/types/`** - Changes affect both teams
3. **Backend B owns `/lib/`** - Don't modify unless asked
4. **Backend A owns `/convex/functions/`** - Backend B can read but not modify
5. **Both teams can read `/routes/`** - But only owner should modify

---

## 📞 Questions?

- **Backend A questions?** → Ask the Backend A developer
- **Backend B questions?** → Ask the Backend B developer
- **Shared questions?** → Discuss in team chat

---

**Last Updated:** December 2025

