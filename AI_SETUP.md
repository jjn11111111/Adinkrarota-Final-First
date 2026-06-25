# AI Collaborator Setup

## Quick check when AI is "not working"

1. **Enable AI first** – Open a reading → click the AI Collaborator button → Enable AI → choose a model → save.
2. **Test connection** – In the AI settings modal, click "Test Connection". If it fails, see below.
3. **Request body fix** – The app now sends `modelId` and `readingContext` on every request (fixes stale body).

## Environment

### Local development

Add to `.env.local`:

```
AI_GATEWAY_API_KEY=your_key_here
```

Get a key from [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) or your AI provider.

### Vercel (production)

- **Option A:** Add `AI_GATEWAY_API_KEY` in Vercel → Project → Settings → Environment Variables.
- **Option B:** Use [Vercel AI SDK integration](https://vercel.com/docs/ai-sdk) (OIDC) – no key needed when the integration is enabled.

## Models supported

All models go through the Vercel AI Gateway. Supported IDs:

- `anthropic/claude-sonnet-4-5` (default)
- `openai/gpt-4o`, `openai/gpt-4o-mini`
- `groq/llama-3.3-70b-versatile`
- `xai/grok-2-1212`
