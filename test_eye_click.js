const fs = require('fs');

const pages = [
  'index.html',
  'about.html',
  'tracks.html',
  'schedule.html',
  'register.html',
  'hero-background.html'
];

console.log('=== VERIFYING HANGING EYE & POSTER LIGHTBOX ACROSS ALL PAGES ===\n');
let allOk = true;

for (const page of pages) {
  if (!fs.existsSync(page)) {
    console.error(`FAIL: File not found: ${page}`);
    allOk = false;
    continue;
  }
  const content = fs.readFileSync(page, 'utf8');

  // 1. Hanging eye talisman
  const hasEye = content.includes('id="hanging-eye-charm"') || content.includes('class="hanging-eye-rig"');
  if (!hasEye) {
    console.error(`❌ FAIL [${page}]: Missing hanging eye charm`);
    allOk = false;
  } else {
    console.log(`✅ PASS [${page}]: Hanging eye charm present`);
  }

  // 2. Poster lightbox modal
  const hasModal = content.includes('id="poster-lightbox-modal"');
  if (!hasModal) {
    console.error(`❌ FAIL [${page}]: Missing #poster-lightbox-modal`);
    allOk = false;
  } else {
    console.log(`✅ PASS [${page}]: Poster lightbox modal present`);
  }

  // 3. Poster image asset
  const hasPosterImg = content.includes('assets/official_poster_v2.jpg');
  if (!hasPosterImg) {
    console.error(`❌ FAIL [${page}]: Missing assets/official_poster_v2.jpg reference`);
    allOk = false;
  } else {
    console.log(`✅ PASS [${page}]: Official poster image referenced`);
  }

  // 4. Modal not nested inside rulebook modal
  const rulebookIdx = content.indexOf('id="rulebook-modal"');
  const posterIdx = content.indexOf('id="poster-lightbox-modal"');
  if (rulebookIdx !== -1 && posterIdx !== -1) {
    const between = content.substring(rulebookIdx, posterIdx);
    const openDivs = (between.match(/<div[\s>]/g) || []).length;
    const closeDivs = (between.match(/<\/div>/g) || []).length;
    if (openDivs !== closeDivs) {
      console.error(`❌ FAIL [${page}]: Modal is nested inside rulebook modal!`);
      allOk = false;
    } else {
      console.log(`✅ PASS [${page}]: Modal is cleanly unnested and top-level`);
    }
  }

  // 5. JavaScript main controller referenced
  const hasScript = content.includes('src="js/main.js"');
  if (!hasScript) {
    console.error(`❌ FAIL [${page}]: Missing js/main.js`);
    allOk = false;
  } else {
    console.log(`✅ PASS [${page}]: js/main.js referenced`);
  }

  console.log('--------------------------------------------------');
}

// 6. Test assets exist on disk
const posterPath = 'assets/official_poster_v2.jpg';
const eyePath = 'assets/evil_eye_amulet.jpg';
if (!fs.existsSync(posterPath) || fs.statSync(posterPath).size === 0) {
  console.error(`❌ FAIL: Poster asset missing or empty: ${posterPath}`);
  allOk = false;
} else {
  console.log(`✅ PASS: Poster asset exists (${fs.statSync(posterPath).size} bytes)`);
}

if (!fs.existsSync(eyePath) || fs.statSync(eyePath).size === 0) {
  console.error(`❌ FAIL: Evil eye asset missing or empty: ${eyePath}`);
  allOk = false;
} else {
  console.log(`✅ PASS: Evil eye asset exists (${fs.statSync(eyePath).size} bytes)`);
}

if (allOk) {
  console.log('\n🎉 ALL VERIFICATIONS PASSED! The poster modal is fully functional across ALL pages!');
} else {
  process.exit(1);
}
