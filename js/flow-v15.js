'use strict';
YL.flow={version:'20261021-credit1'};
YL.scroll.version=YL.flow.version;
// Chapters four and five share the same paper-page entrance as the earlier chapters.
const flowStart=YL.game.start.bind(YL.game);
YL.game.start=function(index,edit=false){
 if(![4,5].includes(index)||!YL.store.data.done.includes(index-1))return flowStart(index,edit);
 return YL.motion.navigate(()=>{const run=flowStart(index,edit);YL.$('#page>.screen')?.classList.remove('fade-in');return run;});
};
const flowNarrate=YL.narrate;
YL.narrate=async function(step,scope){
 if(![4,5].includes(YL.game.chapter?.id))return flowNarrate(step,scope);
 const n=YL.$('#narration'),next=YL.$('#narr-next');next.hidden=true;n.onclick=next.onclick=null;YL.game.skipper=null;YL.game.showTags([]);YL.game.setHint('');
 // Fit the entire sentence before entrance, avoiding a typewriter-driven growing box.
 await YL.prologue.text(step.text,scope);
 next.className='next-cue';next.textContent='轻触继续 ›';next.hidden=false;YL.game.showTags(step.tags||[],scope);YL.narrationFit?.fit();
 await scope.promise(done=>{let finished=false;const finish=()=>{if(finished||YL.game.paused)return;finished=true;n.onclick=next.onclick=null;YL.game.skipper=null;done();};n.onclick=finish;next.onclick=e=>{e.stopPropagation();finish();};YL.game.skipper=finish;scope.cleanup(()=>{n.onclick=next.onclick=null;});});
};
const flowEdit=YL.collage.edit.bind(YL.collage);
YL.collage.edit=function(scope){const run=flowEdit(scope);YL.motion.enter();return run;};
const flowResult=YL.collage.showResult.bind(YL.collage);
YL.collage.showResult=function(){flowResult();YL.motion.enter();};
