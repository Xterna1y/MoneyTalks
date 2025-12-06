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
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

See `ENV_SETUP.md` for detailed instructions.

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

### Backend API (`/api/voice`)

Complete voice processing pipeline:

1. **Speech-to-Text (STT)** - Uses OpenAI Whisper to transcribe audio
2. **AI Processing** - Uses GPT-4o-mini to generate responses
3. **Text-to-Speech (TTS)** - Uses OpenAI TTS to convert responses to audio

### How It Works

1. User clicks the microphone button to start recording
2. Audio is captured from the browser's microphone
3. Audio is sent to `/api/voice` endpoint
4. API transcribes audio using Whisper
5. Transcription is processed by GPT to generate a response
6. Response is converted to speech using OpenAI TTS
7. Audio response is played back to the user

### Tech Stack

- **STT**: OpenAI Whisper API
- **AI**: OpenAI GPT-4o-mini
- **TTS**: OpenAI Text-to-Speech API
- **Frontend**: React, Next.js, Tailwind CSS, Framer Motion
- **UI Components**: Shadcn UI
