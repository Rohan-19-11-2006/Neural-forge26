

const fs = require('fs');

const files = ['tracks.html', 'schedule.html', 'about.html', 'register.html', 'hero-background.html', 'css/style.css'];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let text = fs.readFileSync(f, 'utf8');

  // Replace text-[#38bdf8] -> text-[#4ade80]
  text = text.replaceAll('text-[#38bdf8]', 'text-[#4ade80]');
  text = text.replaceAll('text-[#565e74]', 'text-[#94a3b8]');
  text = text.replaceAll('#38bdf8', '#4ade80');
  text = text.replaceAll('#7dd3fc', '#86efac');
  text = text.replaceAll('#c084fc', '#a3e635');
  text = text.replaceAll('#f472b6', '#fbbf24');
  text = text.replaceAll('#a78bfa', '#fbbf24');
  text = text.replaceAll('56, 189, 248', '74, 222, 128');
  text = text.replaceAll('56,189,248', '74, 222, 128');

  fs.writeFileSync(f, text);
  console.log('Updated ' + f);
});
