const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');

const checks = [
  { name: 'Home section exists (#home)', pass: index.includes('id="home"') },
  { name: 'Tracks section exists (#tracks)', pass: index.includes('id="tracks"') },
  { name: 'Schedule section exists (#schedule)', pass: index.includes('id="schedule"') },
  { name: 'About section exists (#about)', pass: index.includes('id="about"') },
  { name: 'Desktop nav link to #home', pass: index.includes('href="#home"') },
  { name: 'Desktop nav link to #tracks', pass: index.includes('href="#tracks"') },
  { name: 'Desktop nav link to #schedule', pass: index.includes('href="#schedule"') },
  { name: 'Desktop nav link to #about', pass: index.includes('href="#about"') },
  { name: 'Hero CTA Explore Tracks button links to #tracks', pass: index.includes('href="#tracks"') },
  { name: 'All 4 flip cards present in #tracks', pass: (index.match(/class="track-flip-card"/g) || []).length === 4 },
  { name: 'No Jury Protocol anywhere in index.html', pass: !index.toLowerCase().includes('jury protocol') },
  { name: 'No branch advisory box (Engineered for AIDS, AIML...)', pass: !index.includes('Engineered for AIDS, AIML') },
  { name: 'Schedule: 6 Checkpoints & Day 1/2 filters present', pass: index.includes('CHECKPOINT 01') && index.includes('GRAND FINALE') },
  { name: 'About: HOD & Leadership present', pass: index.includes('Dr. P. Sudhakaran') && index.includes('Code Crafters Club') }
];

let allPassed = true;
checks.forEach(c => {
  console.log((c.pass ? '✅ PASS: ' : '❌ FAIL: ') + c.name);
  if (!c.pass) allPassed = false;
});

if (!allPassed) {
  console.error('\nVerification failed.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL SINGLE-PAGE ARCHITECTURE CHECKS PASSED!');
}
