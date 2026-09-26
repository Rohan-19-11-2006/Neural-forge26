const fs = require('fs');

const files = ['index.html', 'tracks.html', 'schedule.html', 'about.html', 'register.html', 'rulebook.html', 'hero-background.html'];
let allPassed = true;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasCanvas = content.includes('id="cosmic-fx-canvas"');
  const hasBloom = content.includes('class="thunderstorm-bloom-layer"');
  const hasSheet = content.includes('class="sheet-lightning-overlay"');
  const pass = hasCanvas && hasBloom && hasSheet;
  console.log(`${f}: ${pass ? '✅ PASS' : '❌ FAIL'} (canvas=${hasCanvas}, bloom=${hasBloom}, sheet=${hasSheet})`);
  if (!pass) allPassed = false;
});

const css = fs.readFileSync('css/style.css', 'utf8');
const cssDrift = css.includes('bgCosmicLivingDrift');
const cssBloom = css.includes('--thunder-bloom-opacity');
const cssCanvas = css.includes('.cosmic-fx-canvas');
console.log(`css/style.css: ${cssDrift && cssBloom && cssCanvas ? '✅ PASS' : '❌ FAIL'}`);
if (!(cssDrift && cssBloom && cssCanvas)) allPassed = false;

const js = fs.readFileSync('js/main.js', 'utf8');
const jsRock = js.includes('class AsteroidRock');
const jsLightning = js.includes('triggerLightningStrike');
const jsThunderTrigger = js.includes('triggerThunderstormStrike');
console.log(`js/main.js: ${jsRock && jsLightning && jsThunderTrigger ? '✅ PASS' : '❌ FAIL'}`);
if (!(jsRock && jsLightning && jsThunderTrigger)) allPassed = false;

if (allPassed) {
  console.log('\n🎉 ALL MOVING ROCKS & THUNDERSTORM BACKGROUND CHECKS PASSED!');
  process.exit(0);
} else {
  console.error('\n❌ Verification failed.');
  process.exit(1);
}
