# AI Collaborator Setup

## Quick check when AI is "not working"

1. **Enable AI first** – Open a reading → click the AI Collaborator button → Enable AI → choose a model → save.
2. **Test connection** – In the AI settings modal, click "Test Connection". If it fails, see below.
3. **Request body fix** – The app now sends `modelId` and `readingContext` on every request (fixes stale body).

## Environment (Groq – free-friendly)

### Local development

Add to `.env.local`:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Create a free account at [groq.com](https://groq.com), generate an API key, and paste it here.

### Vercel (production / preview)

In your Vercel project:

1. Go to **Settings → Environment Variables**.
2. Add:

   - **Name:** `GROQ_API_KEY`  
   - **Value:** your Groq API key  
   - **Environments:** Preview + Production

3. Redeploy the project.

## Models supported

The app now talks **directly to Groq** (no Vercel Gateway required).

Supported ID:

- `groq/llama-3.3-70b-versatile` (default)
