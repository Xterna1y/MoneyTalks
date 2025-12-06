# MoneyTalks Backend API

Backend API for the MoneyTalks financial assistant app.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation
```bash
cd backend
npm install
```

### Start the Server
```bash
# Terminal 1: Start Convex (keep running)
npx convex dev

# Terminal 2: Start Express server
npm start
```

Server runs on: **http://localhost:3001**

### Seed Sample Data
```bash
npm run seed
```

### Test API Endpoints
Open `test-api.html` in your browser to test all API endpoints with a visual interface:
- Shows HTTP status codes (200, 201, 400, 500, etc.)
- Interactive forms for all endpoints
- Real-time JSON response display

**Location:** `backend/test-api.html`

---

## 📁 Project Structure

```
/backend
├── server.js                 # Express server entry point
├── package.json
├── README.md
│
├── routes/                   # API Routes (Express)
│   ├── dashboard.js          ✅ Backend A - Working
│   ├── budgets.js            ✅ Backend A - Working
│   ├── accounts.js           ✅ Backend A - Working
│   ├── confirm-transaction.js   ⏳ Backend A - TODO
│   ├── precheck.js           ⏳ Backend B - TODO
│   └── settings.js           ⏳ Backend B - TODO
│
├── convex/                   # Convex Database
│   ├── schema.ts             # Database schema
│   ├── functions/
│   │   ├── transactions.ts   ✅ CRUD functions
│   │   ├── budgets.ts        ✅ CRUD functions
│   │   └── accounts.ts       ✅ CRUD functions
│   └── _generated/           # Auto-generated types
│
├── lib/                      # Utilities (Backend B)
│   ├── budgetEngine.ts       ⏳ TODO
│   ├── riskEngine.ts         ⏳ TODO
│   ├── claude.ts             ⏳ TODO
│   └── elevenlabs.ts         ⏳ TODO
│
├── types/                    # TypeScript interfaces
│   ├── Transaction.ts
│   ├── Budget.ts
│   ├── Account.ts
│   ├── User.ts
│   └── AdviceResponse.ts
│
└── scripts/                  # Utility scripts
    ├── seed-data.mjs         # Populate sample data
    └── test-functions.mjs    # Test Convex functions
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3001
```

### Test User ID
```
demo-user-001
```

---

## 🏥 Health Check

### `GET /health`
Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-06T06:30:47.763Z"
}
```

---

## 📊 Dashboard

### `GET /api/dashboard`
Get spending summary for a user.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | ✅ | The user's ID |

**Example:**
```
GET /api/dashboard?userId=demo-user-001
```

**Response:**
```json
{
  "totalThisMonth": 420.30,
  "byCategory": [
    { "name": "Food", "amount": 89.40 },
    { "name": "Shopping", "amount": 245.90 }
  ],
  "recentTransactions": [...]
}
```

---

## 💰 Budgets

### `GET /api/budgets`
Get all budgets for a user.

**Example:**
```
GET /api/budgets?userId=demo-user-001
```

**Response:**
```json
[
  {
    "id": "budget123",
    "userId": "demo-user-001",
    "category": "Food",
    "limit": 800,
    "spent": 0,
    "remaining": 800
  }
]
```

### `POST /api/budgets`
Create or update a budget.

**Body:**
```json
{
  "userId": "demo-user-001",
  "category": "Food",
  "limit": 500
}
```

**Response:** Returns the created/updated budget

### `DELETE /api/budgets/:budgetId`
Delete a budget.

**Response:**
```json
{ "success": true }
```

---

## 🏦 Accounts

### `GET /api/accounts`
Get all bank accounts for a user.

**Example:**
```
GET /api/accounts?userId=demo-user-001
```

**Response:**
```json
[
  {
    "id": "acc123",
    "userId": "demo-user-001",
    "bankName": "Maybank",
    "accountType": "Savings",
    "maskedNumber": "**** 1234"
  }
]
```

### `POST /api/accounts`
Add a new bank account.

**Body:**
```json
{
  "userId": "demo-user-001",
  "bankName": "Maybank",
  "accountType": "Savings",
  "maskedNumber": "**** 1234"
}
```

**Response:**
```json
{ "accountId": "acc789" }
```

### `DELETE /api/accounts/:accountId`
Remove a bank account.

**Response:**
```json
{ "success": true }
```

---

## 🔧 Frontend Integration

### JavaScript (fetch)
```javascript
// Get dashboard data
const res = await fetch('http://localhost:3001/api/dashboard?userId=demo-user-001');
const data = await res.json();

// Create a budget
const res = await fetch('http://localhost:3001/api/budgets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'demo-user-001',
    category: 'Food',
    limit: 500
  })
});
```

### React Example
```jsx
import { useState, useEffect } from 'react';

function Dashboard({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/dashboard?userId=${userId}`)
      .then(res => res.json())
      .then(setData);
  }, [userId]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Total: RM {data.totalThisMonth}</h1>
    </div>
  );
}
```

---

## ⚠️ Error Handling

All errors return:
```json
{ "error": "Error message" }
```

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## 🧪 Testing

```bash
# Test Convex functions
npm test

# Seed sample data
npm run seed
```

---

## 👥 Team Responsibilities

| Area | Owner | Status |
|------|-------|--------|
| Convex Schema | Backend A | ✅ Done |
| CRUD Functions | Backend A | ✅ Done |
| Dashboard API | Backend A | ✅ Done |
| Budgets API | Backend A | ✅ Done |
| Accounts API | Backend A | ✅ Done |
| Confirm Transaction | Backend A | ⏳ TODO |
| Precheck API | Backend B | ⏳ TODO |
| AI Integration | Backend B | ⏳ TODO |
| Risk Engine | Backend B | ⏳ TODO |
