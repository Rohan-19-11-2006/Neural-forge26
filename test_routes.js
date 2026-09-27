const http = require('http');

const endpoints = [
  '/',
  '/index.html',
  '/tracks.html',
  '/schedule.html',
  '/about.html',
  '/register.html',
  '/css/style.css',
  '/js/main.js',
  '/assets/srm_trp_logo.png',
  '/assets/code_crafters_logo.png',
  '/assets/dr_sudhakaran.jpg',
  '/assets/mrs_sampavi.jpg',
  '/assets/mr_tamilkudimagan.jpg',
  '/assets/mrs_devi.jpg',
  '/hero-background.html',
  '/rulebook.html',
  '/assets/neural_hero_bg.jpg',
  '/assets/poster.jpg',
  '/assets/neural_forge_title.png',
  '/assets/clean_cosmic_widescreen.jpg',
  '/assets/clean_cosmic_portrait.jpg',
  '/assets/doomsday_bg.png',
  '/assets/doomsday_full.png',
  '/assets/doomsday_exact.png',
  '/assets/doomsday_widescreen.png',
  '/assets/AI_Hackathon_2026_Rulebook.docx',
  '/assets/Neural_Forge_26_Rulebook.docx',
  '/assets/evil_eye_amulet.jpg',
  '/assets/official_poster_v2.jpg',
  '/assets/icon_venue.jpg',
  '/assets/icon_date.jpg',
  '/assets/icon_teamsize.jpg',
  '/assets/icon_regfee.jpg',
  '/assets/avengers_title_transparent.png'
];

async function checkEndpoint(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, contentType: res.headers['content-type'], size });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function runTests() {
  console.log('Testing all endpoints on http://localhost:3000:');
  let allOk = true;
  for (const ep of endpoints) {
    const result = await checkEndpoint(ep);
    if (result.status === 200 && result.size > 0) {
      console.log(`PASS: ${result.path} (Status 200, Content-Type: ${result.contentType}, Size: ${result.size} bytes)`);
    } else {
      console.error(`FAIL: ${result.path}`, result);
      allOk = false;
    }
  }
  if (allOk) {
    console.log('\nAll 17 endpoints and assets verified successfully!');
  } else {
    process.exit(1);
  }
}

runTests();
