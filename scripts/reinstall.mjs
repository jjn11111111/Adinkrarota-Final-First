import { execSync } from 'child_process';

console.log('Removing node_modules/.cache and .next...');
try { execSync('rm -rf /vercel/share/v0-project/node_modules/.cache', { stdio: 'inherit' }); } catch(e) {}
try { execSync('rm -rf /vercel/share/v0-project/.next', { stdio: 'inherit' }); } catch(e) {}

console.log('Reinstalling dependencies...');
execSync('cd /vercel/share/v0-project && npm install next@15.3.3 --save', { stdio: 'inherit' });

console.log('Verifying next version...');
const result = execSync('cd /vercel/share/v0-project && npx next --version', { encoding: 'utf-8' });
console.log('Next.js version:', result);
