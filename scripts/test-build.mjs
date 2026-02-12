import { execSync } from 'child_process';

try {
  const output = execSync('cd /vercel/share/v0-project && npx next build 2>&1', {
    encoding: 'utf-8',
    timeout: 120000,
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
    }
  });
  console.log(output);
} catch (err) {
  console.log('BUILD OUTPUT:');
  console.log(err.stdout || '');
  console.log('BUILD ERRORS:');
  console.log(err.stderr || '');
  console.log('EXIT CODE:', err.status);
}
