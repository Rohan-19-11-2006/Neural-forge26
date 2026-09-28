const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('Building production bundle for Firebase Hosting...');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const filesToCopy = [
  'index.html',
  'about.html',
  'tracks.html',
  'schedule.html',
  'register.html',
  'rulebook.html',
  'hero-background.html'
];

filesToCopy.forEach(file => {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`Copied ${file}`);
  }
});

const dirsToCopy = ['css', 'js', 'assets'];

dirsToCopy.forEach(dir => {
  const src = path.join(rootDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(distDir, dir), { recursive: true });
    console.log(`Copied directory: ${dir}`);
  }
});

console.log('Production build successfully generated in ./dist');

