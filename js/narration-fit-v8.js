'use strict';
YL.narrationFit={
 pending:0,
 fit(){const n=YL.$('#narration'),p=YL.$('#narr-text');if(!n||!p?.firstChild||!YL.$('#game-screen'))return;
  // Include the real first-line indent when measuring the content-aware paper width.
  n.style.width='321px';n.style.removeProperty('--narration-height');const range=document.createRange();range.selectNodeContents(p);const scale=YL.$('#frame').getBoundingClientRect().width/375||1;
  const lines=()=>[...range.getClientRects()].filter(r=>r.width>0&&r.height>0);const rects=lines();if(!rects.length)return;const originalLines=rects.length,style=getComputedStyle(n),padding=['paddingLeft','paddingRight','borderLeftWidth','borderRightWidth'].reduce((s,k)=>s+parseFloat(style[k]||0),0),left=p.getBoundingClientRect().left,longest=Math.max(...rects.map(r=>(r.right-left)/scale)),candidate=Math.max(116,Math.ceil(longest+padding+2));
  if(candidate<321){n.style.width=candidate+'px';if(lines().length>originalLines)n.style.width='321px';}
  // Height comes only from the actual paragraph, optional continue cue and paper padding.
  n.style.height='auto';n.style.minHeight='0';n.dataset.fitted='true';n.dataset.narrationLines=String(lines().length);range.detach();
 },
 schedule(){if(this.pending)return;this.pending=requestAnimationFrame(()=>{this.pending=0;this.fit();});}
};
new MutationObserver(records=>{if(records.some(r=>r.target.id==='page'||r.target.id==='narr-text'||r.target.parentElement?.closest?.('#narr-text')))YL.narrationFit.schedule();}).observe(YL.$('#page'),{childList:true,subtree:true,characterData:true});
window.addEventListener('resize',()=>YL.narrationFit.schedule());document.fonts?.ready.then(()=>YL.narrationFit.schedule());
