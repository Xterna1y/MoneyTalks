# Voice Interface App

A Next.js 14 application with Tailwind CSS, Shadcn UI, and a voice interface featuring a pulsing microphone button.

## Features

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn UI setup (utilities configured)
- Dark mode by default
- Mobile-responsive design
- Pulsing microphone button using Lucide-react icons

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

This points the frontend to the backend voice/finance API.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `lib/` - Utility functions (including Shadcn UI utils)
- `components/` - Reusable React components (ready for Shadcn UI components)

## Voice Interface

The main page features a complete voice interface with:

### Frontend Features
- Large, centered, pulsing microphone button
- Smooth animations using Framer Motion
- Responsive sizing for mobile, tablet, and desktop
- Visual feedback with pulse and ping effects
- Dark mode styling
- Real-time status indicators (listening, processing, playing)

### Backend API (`/api/voice-flow`)

Complete voice processing pipeline:

1. **Speech-to-Text (STT)** - Browser Web Speech API transcribes audio locally
2. **AI Processing** - Claude Haiku generates responses with Convex context
3. **Text-to-Speech (TTS)** - ElevenLabs converts responses to audio

### How It Works

1. User clicks the microphone button to start recording
2. Audio is captured from the browser's microphone
3. Transcribed text is sent to `/api/voice-flow` on the backend
4. Backend uses Claude + Convex data for the reply
5. Backend generates speech via ElevenLabs and returns base64 audio
6. Audio response is played back to the user

### Tech Stack

- **STT**: Browser Web Speech API (client-side)
- **AI**: Claude (haiku)
- **TTS**: ElevenLabs
- **Frontend**: React, Next.js, Tailwind CSS, Framer Motion
- **UI Components**: Shadcn UI
