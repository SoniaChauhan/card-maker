/**
 * Clean-start script for dev — kills zombie Node processes on port 3000,
 * removes stale .next cache, and starts the dev server fresh.
 *
 * Usage:  npm run dev:clean
 */
import { execSync, spawn } from 'child_process';
import { rmSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// 1. Kill anything on port 3000 (Windows)
try {
  const out = execSync('netstat -ano | findstr :3000 | findstr LISTENING', { encoding: 'utf8' });
  const pids = [...new Set(out.split('\n').map(l => l.trim().split(/\s+/).pop()).filter(Boolean))];
  for (const pid of pids) {
    try { execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' }); } catch {}
  }
  console.log(`Killed processes on port 3000: ${pids.join(', ')}`);
} catch {
  console.log('Port 3000 is free.');
}

// 2. Remove stale .next cache
const nextDir = resolve(root, '.next');
if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log('Removed .next cache.');
}

// 3. Start dev server
console.log('Starting next dev...\n');
const child = spawn('npx', ['next', 'dev'], { cwd: root, stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
