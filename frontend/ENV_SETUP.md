# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Getting Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it into your `.env.local` file

**Important:** Never commit your `.env.local` file to git. It's already in `.gitignore`.
