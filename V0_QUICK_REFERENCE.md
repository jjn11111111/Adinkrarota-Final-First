# V0 Quick Reference Card

## 🚀 Quick Start

When V0 suggests changes, check this card first to ensure compatibility.

## ✅ Critical Patterns

### Route Pages Pattern
```typescript
// app/spread-builder/page.tsx
// app/guidebook/page.tsx
// app/reading/page.tsx
// app/gallery/page.tsx

export { default } from "../page";
```
**Keep this pattern** - Don't let V0 create duplicate implementations.

---

### localStorage Pattern
```typescript
useEffect(() => {
  if (typeof window === "undefined") return;
  // ... localStorage code
}, []);
```
**Always use this** - Prevents SSR errors.

---

### AI Provider Pattern
```typescript
import { anthropic } from "@ai-sdk/anthropic";
const model = anthropic("claude-sonnet-4-20250514");
```
**Required** - Don't use model strings directly.

---

## 📝 V0 Chat Prompts

Copy-paste these into V0 when needed:

### Preserve SPA Architecture
```
Maintain the unified SPA architecture where app/page.tsx handles all main views 
(home, gallery, reading, guidebook, spread-builder). Route pages at 
app/[view]/page.tsx should simply re-export the main app: 
export { default } from "../page";
```

### Preserve localStorage Safety
```
Always check typeof window === "undefined" before accessing localStorage or 
window object to prevent SSR hydration errors.
```

### Preserve AI Providers
```
Import AI model providers explicitly using: 
import { anthropic } from "@ai-sdk/anthropic"
Use provider functions like anthropic('model-name') instead of model strings.
```

### Preserve URL Sync
```
Maintain URL synchronization in app/page.tsx. The handleNavigate function 
should update both state and URL using router.push(). Add popstate listener 
for browser navigation.
```

## 🔍 Quick Checks

Before deploying, verify:

- [ ] Route pages re-export main app
- [ ] localStorage has window checks
- [ ] AI routes have provider imports
- [ ] URL updates on navigation
- [ ] Browser back/forward works

## 📚 Full Documentation

- **V0_INTEGRATION_GUIDE.md** - Complete integration guide
- **.v0-preserve-patterns.md** - Detailed pattern documentation

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Routes return 404 | Ensure route pages exist and re-export main app |
| localStorage errors | Add `typeof window === "undefined"` check |
| AI models not working | Verify provider imports in API routes |
| URL doesn't update | Check `handleNavigate` calls `router.push()` |

---

**Last Updated:** After Option A implementation
