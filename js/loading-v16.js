'use strict';
// Cover uses a complete small local subset; story pages keep their original font.
const syncCoverFont=()=>document.body.classList.toggle('font-home',!!YL.$('.v3-cover'));
syncCoverFont();new MutationObserver(syncCoverFont).observe(YL.$('#page'),{childList:true});
