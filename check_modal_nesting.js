const fs = require('fs');

const pages = ['index.html', 'about.html', 'tracks.html', 'schedule.html', 'register.html'];

for (const page of pages) {
  const content = fs.readFileSync(page, 'utf8');
  
  // Check if poster modal is top-level (not inside rulebook-modal)
  const rulebookIdx = content.indexOf('id="rulebook-modal"');
  const posterIdx = content.indexOf('id="poster-lightbox-modal"');
  
  if (rulebookIdx !== -1 && posterIdx !== -1) {
    // Check if rulebook-modal is closed before poster-lightbox-modal starts
    const between = content.substring(rulebookIdx, posterIdx);
    // Count open and close divs between rulebookIdx and posterIdx
    const openDivs = (between.match(/<div[\s>]/g) || []).length;
    const closeDivs = (between.match(/<\/div>/g) || []).length;
    
    console.log(`${page}: openDivs=${openDivs}, closeDivs=${closeDivs}`);
    if (openDivs !== closeDivs) {
      console.error(`ERROR in ${page}: rulebook-modal is NOT properly closed before poster-lightbox-modal! Diff: ${openDivs - closeDivs}`);
    } else {
      console.log(`OK in ${page}: rulebook-modal is fully closed before poster-lightbox-modal starts.`);
    }
  } else {
    console.log(`${page}: No rulebook-modal or no conflict.`);
  }
}
