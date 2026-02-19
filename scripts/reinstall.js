const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// Remove .next build cache
const nextDir = path.join(projectRoot, '.next');
if (fs.existsSync(nextDir)) {
  console.log('Removing .next build cache...');
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('Removed .next');
}

// Remove next from node_modules to force reinstall
const nextModuleDir = path.join(projectRoot, 'node_modules', 'next');
if (fs.existsSync(nextModuleDir)) {
  console.log('Removing node_modules/next...');
  fs.rmSync(nextModuleDir, { recursive: true, force: true });
  console.log('Removed node_modules/next');
}

// Reinstall
console.log('Reinstalling dependencies...');
try {
  execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });
  console.log('Dependencies reinstalled successfully');
} catch (e) {
  console.error('npm install failed, trying pnpm...');
  try {
    execSync('pnpm install', { cwd: projectRoot, stdio: 'inherit' });
    console.log('Dependencies reinstalled with pnpm');
  } catch (e2) {
    console.error('Both npm and pnpm failed:', e2.message);
  }
}

// Verify installed version
try {
  const nextPkg = require(path.join(projectRoot, 'node_modules', 'next', 'package.json'));
  console.log('Installed Next.js version:', nextPkg.version);
} catch (e) {
  console.error('Could not verify Next.js version');
}
