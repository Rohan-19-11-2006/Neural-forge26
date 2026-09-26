const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const aboutHtml = fs.readFileSync('about.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');
const mainJs = fs.readFileSync('js/main.js', 'utf8');

const linkedInUrls = [
  'yogasri-velayutham-a0335a32a',
  'varshini-b-p-79b901338',
  'sedhu-n-01014532a',
  'sindhu-sri-d-31a61132a',
  'puvisha-s-a0336132a'
];

const names = [
  'Yogasri Velayutham',
  'Varshini B P',
  'Sedhu N',
  'Sindhu Sri D',
  'Puvisha S'
];

const checks = [
  { name: 'Image asset exists', pass: fs.existsSync('assets/event_coordinators_team.jpg') },
  { name: 'Showcase exists in index.html', pass: indexHtml.includes('event-coordinators-showcase') },
  { name: 'Showcase exists in about.html', pass: aboutHtml.includes('event-coordinators-showcase') },
  {
    name: 'Showcase is placed above Head of Department in index.html',
    pass: indexHtml.indexOf('event-coordinators-showcase') < indexHtml.indexOf('Dr. P. Sudhakaran')
  },
  {
    name: 'Showcase is placed above Head of Department in about.html',
    pass: aboutHtml.indexOf('event-coordinators-showcase') < aboutHtml.indexOf('Dr. P. Sudhakaran')
  },
  {
    name: 'All 5 LinkedIn URLs present in index.html',
    pass: linkedInUrls.every(url => indexHtml.includes(url))
  },
  {
    name: 'All 5 LinkedIn URLs present in about.html',
    pass: linkedInUrls.every(url => aboutHtml.includes(url))
  },
  {
    name: 'All 5 coordinator names present in index.html',
    pass: names.every(n => indexHtml.includes(n))
  },
  {
    name: 'All 5 coordinator names present in about.html',
    pass: names.every(n => aboutHtml.includes(n))
  },
  {
    name: 'Hotspots layer and 5 hotspot zones present in index.html',
    pass: indexHtml.includes('coord-hotspot-1') &&
          indexHtml.includes('coord-hotspot-2') &&
          indexHtml.includes('coord-hotspot-3') &&
          indexHtml.includes('coord-hotspot-4') &&
          indexHtml.includes('coord-hotspot-5')
  },
  {
    name: 'CSS styles for showcase, hotspots, HUD pills, and cards present',
    pass: styleCss.includes('.event-coordinators-showcase') &&
          styleCss.includes('.coordinators-stage') &&
          styleCss.includes('.coord-hotspot') &&
          styleCss.includes('.coord-hud-pill') &&
          styleCss.includes('.coord-card')
  },
  {
    name: 'JS controller initCoordinatorsShowcase hooked in main.js',
    pass: mainJs.includes('initCoordinatorsShowcase')
  }
];

let allPassed = true;
console.log('--- VERIFYING EVENT COORDINATORS SHOWCASE ---');
checks.forEach(c => {
  console.log((c.pass ? '✅ PASS: ' : '❌ FAIL: ') + c.name);
  if (!c.pass) allPassed = false;
});

if (!allPassed) {
  console.error('\n❌ One or more coordinator showcase checks failed.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL EVENT COORDINATORS SHOWCASE CHECKS PASSED!');
}
