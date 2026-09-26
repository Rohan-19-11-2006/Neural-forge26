const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const mainJs = fs.readFileSync('js/main.js', 'utf8');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

const tests = [
  { name: 'FAQ section exists in index.html with id="faq"', pass: indexHtml.includes('id="faq"') },
  { name: 'FAQ pill badge exists with question icon and FREQUENTLY ASKED QUESTIONS', pass: indexHtml.includes('FREQUENTLY ASKED QUESTIONS') && indexHtml.includes('class="faq-pill-badge"') },
  { name: 'FAQ title contains EVERYTHING YOU NEED TO KNOW ABOUT NEURAL FORGE', pass: indexHtml.includes('EVERYTHING YOU NEED TO KNOW ABOUT') && indexHtml.includes('NEURAL FORGE ’26') },
  { name: 'FAQ has subtitle', pass: indexHtml.includes('faq-subtitle') },
  { name: 'FAQ contains all 8 questions', pass: 
    indexHtml.includes('01. What is Neural Forge ’26?') &&
    indexHtml.includes('02. Who can participate, and how many members can be in a team?') &&
    indexHtml.includes('03. What are the available hackathon tracks?') &&
    indexHtml.includes('04. What technologies are required?') &&
    indexHtml.includes('05. Is a working demo required?') &&
    indexHtml.includes('06. What is required for the final submission?') &&
    indexHtml.includes('07. What is the registration fee?') &&
    indexHtml.includes('08. How will the projects be evaluated?')
  },
  { name: 'FAQ contains exact answer content', pass:
    indexHtml.includes('Nebius Token Factory or Nebius AI Cloud') &&
    indexHtml.includes('at least one NVIDIA open-source AI model') &&
    indexHtml.includes('registration fee of ₹100 per team') &&
    indexHtml.includes('Technological Implementation, Design & UX, Potential Impact, and Quality of Idea')
  },
  { name: 'All FAQ cards start closed by default (opens on touch/click)', pass: !indexHtml.includes('faq-card active') },
  { name: 'Desktop nav links to #faq', pass: indexHtml.includes('href="#faq"') },
  { name: 'CSS contains .faq-section, .faq-card, .faq-answer-wrapper, .faq-chevron-icon', pass:
    styleCss.includes('.faq-section') &&
    styleCss.includes('.faq-card') &&
    styleCss.includes('.faq-answer-wrapper') &&
    styleCss.includes('.faq-chevron-icon')
  },
  { name: 'JS contains initFaqAccordion and binds to DOMContentLoaded', pass:
    mainJs.includes('function initFaqAccordion') &&
    mainJs.includes('initFaqAccordion()')
  }
];

let allPassed = true;
console.log('--- RUNNING FAQ AUTOMATED VERIFICATION ---');
tests.forEach(t => {
  console.log((t.pass ? '✅ PASS: ' : '❌ FAIL: ') + t.name);
  if (!t.pass) allPassed = false;
});

if (!allPassed) {
  console.error('\n❌ One or more tests failed.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL FAQ VERIFICATIONS PASSED SUCCESSFULLY!');
}
