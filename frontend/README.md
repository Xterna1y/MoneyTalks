# Voice Interface App

React + Vite single-page app with Tailwind CSS, shadcn/ui components, and a voice-first experience powered by the Web Speech API.

## Features

- Vite + React Router for fast SPA routing
- TypeScript, Tailwind CSS, shadcn/ui utilities
- Framer Motion animations and Lucide icons
- Mobile-first bottom navigation and voice mic interaction

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Create `.env` (or `.env.local`) in `frontend/`:

```env
VITE_API_URL=http://localhost:3001
```

This points the UI to the backend finance/voice API. See `env.example` for a ready-to-copy default.

### 3) Run the app

```bash
npm run dev    # http://localhost:5173
```

### 4) Build & preview

```bash
npm run build
npm run preview
```

## Project Structure

- `src/main.tsx` - Vite entry; mounts React Router
- `src/App.tsx` - routes + shared chrome (bottom nav)
- `src/pages` - page-level screens (Home, Dashboard, Budget, etc.)
- `src/components` - shared UI (shadcn/ui primitives, bottom nav)
- `src/lib/api.ts` - API client using `VITE_API_URL`
- `src/index.css` - Tailwind base + design tokens
- `tailwind.config.ts` - Tailwind configuration for Vite
- `app/`, `components/`, `lib/` - legacy Next.js sources retained for reference only (not used by Vite build)

## Voice Interface Flow (`/api/voice-flow`)

1. Browser Web Speech API transcribes locally.
2. Transcript is sent to the backend (`VITE_API_URL`).
3. Backend (Claude + ElevenLabs) returns text + base64 audio.
4. The app plays the response audio and shows the generated text.
