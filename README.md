# Conversation context review

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/re-connect0/v0-conversation-context-review)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/NDhrFgd7Sh3)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/re-connect0/v0-conversation-context-review](https://vercel.com/re-connect0/v0-conversation-context-review)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/NDhrFgd7Sh3](https://v0.app/chat/NDhrFgd7Sh3)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Architecture & Integration

This project uses a **unified SPA architecture** with proper URL routing. See:

- **[V0_INTEGRATION_GUIDE.md](./V0_INTEGRATION_GUIDE.md)** - Complete guide for integrating fixes with V0
- **[.v0-preserve-patterns.md](./.v0-preserve-patterns.md)** - Quick reference for preserving critical patterns

### Key Architectural Features

- ✅ Unified SPA structure (single source of truth)
- ✅ Bookmarkable URLs with proper routing
- ✅ SSR-safe localStorage operations
- ✅ Proper AI SDK provider configuration
- ✅ Browser navigation support (back/forward buttons)

### Quick V0 Prompts

When working with V0, use these prompts to maintain compatibility:

```
"Maintain unified SPA architecture - route pages should re-export app/page.tsx"
"Always check typeof window before accessing localStorage"
"Import AI providers explicitly: import { anthropic } from '@ai-sdk/anthropic'"
```
