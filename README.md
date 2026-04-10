# ADINKRAROTA

An immersive Next.js experience blending Tarot archetypes with West African Adinkra symbols: gallery, readings, guidebook, custom spreads, optional Supabase auth, Stripe membership, and AI-assisted readings.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Local dev server         |
| `npm run build`| Production build         |
| `npm run start`| Serve production build   |
| `npm run lint` | ESLint (`eslint-config-next`) |

## Environment

Configure as needed for full functionality:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-side keys where used
- **Stripe**: publishable/secret keys and webhook secret for checkout and webhooks
- **AI**: provider keys (e.g. `GROQ_API_KEY`) per your chosen models

## Architecture notes

The main UI is a client SPA in `app/page.tsx` with path aliases (`/gallery`, `/reading`, etc.) re-exporting the same shell for bookmarkable URLs. See `V0_INTEGRATION_GUIDE.md` and `CURRENT_STATUS.md` for integration history with v0.

## Deployment

Deploy on [Vercel](https://vercel.com) or any Node host that supports Next.js App Router. Set the same environment variables in the hosting dashboard.
