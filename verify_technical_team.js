const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const aboutHtml = fs.readFileSync('about.html', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');
const mainJs = fs.readFileSync('js/main.js', 'utf8');

const techUrls = [
  'rohan-kumar-a8514032a',
  'jayasuriyan-j-s-31b13932a',
  'pravinrajg2906',
  'adithya-senthil',
  'praveen-sagar-21320b3b2'
];

const techNames = [
  'Rohan Kumar',
  'Jayasuriyan J S',
  'Pravin Raj G',
  'Adithya Senthil',
  'Praveen Sagar'
];

const checks = [
  { name: 'Technical team image asset exists', pass: fs.existsSync('assets/technical_team.jpg') },
  { name: 'Technical team showcase exists in index.html', pass: indexHtml.includes('technical-team-showcase') },
  { name: 'Technical team showcase exists in about.html', pass: aboutHtml.includes('technical-team-showcase') },
  {
    name: 'Technical team showcase is placed above Head of Department in index.html',
    pass: indexHtml.indexOf('technical-team-showcase') < indexHtml.indexOf('Dr. P. Sudhakaran')
  },
  {
    name: 'Technical team showcase is placed above Head of Department in about.html',
    pass: aboutHtml.indexOf('technical-team-showcase') < aboutHtml.indexOf('Dr. P. Sudhakaran')
  },
  {
    name: 'All technical LinkedIn URLs present in index.html',
    pass: techUrls.every(url => indexHtml.includes(url))
  },
  {
    name: 'All technical LinkedIn URLs present in about.html',
    pass: techUrls.every(url => aboutHtml.includes(url))
  },
  {
    name: 'All 5 technical member names present in index.html',
    pass: techNames.every(n => indexHtml.includes(n))
  },
  {
    name: 'All 5 technical member names present in about.html',
    pass: techNames.every(n => aboutHtml.includes(n))
  },
  {
    name: 'Event coordinators showcase still exists and is above Head of Department',
    pass: indexHtml.indexOf('event-coordinators-showcase') < indexHtml.indexOf('Dr. P. Sudhakaran')
  }
];

let allPassed = true;
console.log('--- VERIFYING TECHNICAL TEAM SHOWCASE ---');
checks.forEach(c => {
  console.log((c.pass ? '✅ PASS: ' : '❌ FAIL: ') + c.name);
  if (!c.pass) allPassed = false;
});

if (!allPassed) {
  console.error('\n❌ One or more technical team checks failed.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL TECHNICAL TEAM SHOWCASE CHECKS PASSED!');
}
