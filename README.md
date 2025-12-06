# 💰 MoneyTalks - Financial Assistant App

A full-stack financial assistant application with voice interface, budget tracking, and AI-powered payment advice.

---

## 📁 Project Structure

```
MoneyTalks/
├── 📁 backend/          # Express.js + Convex backend
│   ├── routes/         # API endpoints
│   ├── convex/         # Convex database & functions
│   ├── lib/            # Backend B utilities (AI, risk engine)
│   ├── types/          # TypeScript interfaces
│   └── scripts/        # Utility scripts
│
├── 📁 frontend/        # React + Vite SPA (legacy Next.js sources kept for reference)
│   ├── src/            # Vite entry, routes, pages, components
│   └── app/components/lib/ # Legacy Next.js code (not used by Vite build)
│
└── 📁 ai/              # Separate AI testing project
```

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env.local  # Add your CONVEX_URL
npm start                   # Runs on http://localhost:3001
```

### Frontend Setup (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env        # Set VITE_API_URL
npm run dev                 # Runs on http://localhost:5173
```

---

## 📚 Documentation

- **Backend API**: See `backend/README.md`
- **Backend Structure**: See `backend/STRUCTURE.md`
- **Frontend Setup**: See `frontend/README.md`

## 🧪 Testing

- **API Testing Tool**: Open `backend/test-api.html` in your browser to test all API endpoints with a visual interface. Shows HTTP status codes and JSON responses.

---

## 👥 Team Responsibilities

- **Backend A**: Database, CRUD operations, API endpoints
- **Backend B**: AI logic, risk detection, pre-check analysis
- **Frontend**: UI/UX, user interactions

---

## 🛠️ Tech Stack

- **Backend**: Express.js, Convex (serverless database)
- **Frontend**: React + Vite, TypeScript, Tailwind CSS
- **Database**: Convex (real-time database)
- **AI**: Claude (Anthropic), ElevenLabs (TTS)

---

## 📝 License

MIT

