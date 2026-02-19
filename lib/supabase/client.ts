// Re-export from browser.ts to bust Turbopack cache
// The old client.ts was cached with a throw Error - this new file delegates to browser.ts
export { createClient, isSupabaseConfigured } from './browser'
