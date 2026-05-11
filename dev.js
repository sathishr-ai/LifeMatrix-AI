import { spawn } from 'child_process';

console.log('\x1b[36m%s\x1b[0m', '------------------------------------------------------------');
console.log('\x1b[36m%s\x1b[0m', '  Starting LifeMatrix AI Synchronized Dev Environment...  ');
console.log('\x1b[36m%s\x1b[0m', '------------------------------------------------------------');

// Start backend synchronization server on port 5175
const backend = spawn('node', ['server.js'], { stdio: 'inherit', shell: true });

// Start frontend Vite dev server on port 5173
const frontend = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

// Forward exit signals
const cleanup = () => {
  console.log('\x1b[33m%s\x1b[0m', '\nShutting down dev environment...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', () => {
  backend.kill();
  frontend.kill();
});
