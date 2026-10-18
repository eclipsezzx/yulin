'use strict';
// Only the cover, shared presentation, prologue transitions and chapter one are revised.
YL.heritage={
 version:'20261015-heritage1',active:false,
 chapter:{id:1,no:'第一章',name:'剪出陕北',gain:'长城·高台·白城·宝塔·窑洞',motif:'tower'},
 places:[
  {key:'wall',name:'陕北长城',place:'陕北 · 跨县分布',box:{x:32,y:367,w:311,h:103},card:'h-wall',tag:'随山势起伏的城墙',before:'山梁连着山梁，城墙沿着高处走。在陕北，长城跨过不同县域。剪刀也随山势转折，把墙线的起落留在纸上。',after:'墙线一段高，一段低，顺着山脊向远处伸去。长城的轮廓里，藏着这片土地的起伏。',hint:'从红点起剪，沿垛口与墙线绕回起点'},
  {key:'tower',name:'镇北台',place:'榆林市 · 榆阳区',box:{x:70,y:329,w:235,h:193},card:'h-tower',tag:'高台与边地往来',before:'榆阳区的红山上，镇北台层层收拢，望向远处的长城。沿着台身转折落剪，宽厚的基座托起上面的高台。',after:'四层台身越往上越小，高台曾用于瞭望与防守。附近的款贡城、易马城，还留下了边地接待、商洽与互市的往事。',hint:'沿四层台体剪出收分，转角处慢一点'},
  {key:'tongwan',name:'统万城遗址',place:'榆林市 · 靖边县',box:{x:35,y:364,w:305,h:138},card:'h-tongwan',tag:'靖边的白城子',before:'靖边县，白城子。统万城曾是大夏都城，如今城垣与墩台仍留在无定河北岸。剪刀绕过高低不齐的残墙，留住它今天的模样。',after:'墙的边缘已经残损，偏白的夯土却仍醒目。这次不把缺口补齐：遗址留下的痕迹，正是认识它的线索。',hint:'跟随残墙起伏剪，保留不规则的墙影'},
  {key:'pagoda',name:'延安宝塔',place:'延安市 · 宝塔区',box:{x:129,y:311,w:117,h:224},card:'h-pagoda',tag:'古塔与延安的记忆',before:'宝塔区的宝塔山上，九层砖塔向天空收拢。沿着一层层檐线往上剪，塔身渐渐挺立，和刚才宽厚的镇北台有了不同的身影。',after:'延安宝塔是八角九层的砖塔。古塔历经修葺，也成为革命圣地延安的标志；同一个轮廓，承载着不同时代的记忆。',hint:'沿九层檐线起落剪，留出渐收的塔身'},
  {key:'cave',name:'陕北窑洞',place:'陕北 · 多县沿用的传统民居',box:{x:36,y:350,w:303,h:166},card:'h-cave',tag:'黄土里的人家',before:'从古城高台走回山坡，人家就在黄土之间。陕北多地的窑洞依势而建，有的靠崖开挖，有的以砖石箍起拱顶。先剪出院前这一片山形。',after:'拱口留住门窗，厚土围合居室。窑洞冬暖夏凉，是人们顺着地形、就着材料安顿生活的办法。黄土高原的故事，也在这些日常里。',hint:'沿黄土坡与院落轮廓剪出窑洞'}
 ],
 links(items){return '<p class="source-links">'+items.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join('')+'</p>';},
 shell(){
  YL.prologue.shell();YL.prologue.active=false;YL.$('#frame').classList.add('heritage-revision');
  const screen=YL.$('#game-screen');screen.classList.remove('v4-prologue');screen.classList.add('heritage-screen');
  const scene=YL.$('#fold-scene');scene.src='assets/v5/heritage-paper.webp?v=20261018-web3';scene.alt='留白的黄土山梁纸艺背景';
  YL.$('.chapter-label').textContent='第一章';YL.$('.game-heading h1').textContent=this.chapter.name;YL.$('.fold-subtitle').textContent='循着轮廓，读懂山河与人家';YL.$('#fold-footer').textContent='纸上陕北 · 第一章';
  YL.$('#fold-step').id='heritage-place';YL.$('#interactive').setAttribute('aria-label','剪出陕北地标与传统民居');
  const defs=YL.art.svg('defs',{},YL.game.svg);defs.innerHTML='<pattern id="redPaper" patternUnits="objectBoundingBox" patternContentUnits="objectBoundingBox" width="1" height="1"><rect width="1" height="1" fill="#D83A25"/><image href="assets/v4/redpaper.webp?v=20261018-web3" width="1" height="1" opacity=".65" preserveAspectRatio="none"/></pattern><filter id="paperLift" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="1" stdDeviation=".65" flood-color="#24221E" flood-opacity=".13"/></filter>';
  YL.motion.enter(screen);
 },
 async text(text,scope){await YL.prologue.text(text,scope);},
 async clear(scope){const svg=YL.game.svg,nodes=[...svg.querySelectorAll('[data-object],[data-task],[data-heritage]')];if(nodes.length){await scope.animate(YL.motion.ms(170),k=>{nodes.forEach(n=>{n.setAttribute('opacity',1-k);n.style.translate=`${-14*k}px ${6*k}px`;});});nodes.forEach(n=>n.remove());}YL.game.showTags([]);YL.$('#instruction').textContent='';},
 label(place,index){YL.$('#heritage-place').textContent=place.place;YL.$('#fold-footer').textContent=`纸上陕北 · ${index+1} / ${this.places.length} · ${place.name}`;},
 async start(){
  if(!YL.store.data.done.includes(0)){YL.ui.toast('先剪好序章的窗花，再走进陕北');return;}
  YL.game.leave();this.active=true;YL.v3.active=false;const run=YL.game.runId;YL.game.chapter=this.chapter;YL.game.cuts={};YL.game.visual={};YL.store.data.chapter=1;YL.store.save();this.shell();
  try{const scope=YL.game.scope=new YL.Scope();YL.game.step=0;YL.$('#heritage-place').textContent='陕北 · 黄土高原';
   await this.text('在陕北，沟壑分开山梁，城墙攀上高处，窑洞把人家安在坡前。接下来的几刀，从远处的墙，到身边的门，看看土地怎样留下自己的轮廓。',scope);YL.game.showTags([['黄土与窑洞','h-cave']],scope);await YL.v3.continue(scope,'从长城起剪 ›');
   for(let i=0;i<this.places.length;i++){if(run!==YL.game.runId)return;const p=this.places[i];YL.game.step=i+1;YL.game.skipper=null;YL.$('#stage-next').hidden=true;await this.clear(scope);this.label(p,i);await this.text(p.before,scope);
    await YL.interact.cut({object:p.key,cutBox:p.box,resultBox:p.box,sheetBox:{x:22,y:308,w:331,h:233},hint:p.hint,reducedMotion:YL.motion.reduced()},scope);
    if(p.key==='cave'){await this.arch(p,scope);}
    await this.text(p.after,scope);YL.game.showTags([[p.tag,p.card]],scope);YL.game.setHint(p.key==='cave'?'窑门已剪透；山坡的厚重，也有了生活的尺度':'这段剪口，留下了建筑最容易辨认的形');await YL.v3.continue(scope,i===4?'展开这一章 ›':'剪下一处 ›');
   }
   await this.clear(scope);YL.game.step=6;YL.$('#heritage-place').textContent='陕北 · 五处轮廓';YL.$('#fold-footer').textContent='纸上陕北 · 山河与人家';
   this.ensemble();await this.text('长城随着山势走，镇北台层层收拢；白城留下残墙，宝塔留下九层塔影，窑门留下一个拱口。几种轮廓放在一起，陕北的远近，便清楚了一些。',scope);YL.game.setHint('纸上为艺术化组合，各处实地位置已在前页标明');await YL.v3.continue(scope,'完成第一章 ›');
   if(run!==YL.game.runId)return;scope.dispose();YL.game.scope=null;YL.game.skipper=null;YL.store.finish(this.chapter);YL.store.data.heritageRevision=this.version;YL.store.save();this.end();
  }catch(e){if(e.name==='AbortError'||run!==YL.game.runId)return;console.error(e);YL.ui.modal({title:'再展开这一章',body:'<p>这一章还没有完成，剪好的进度仍保存在本机。</p>',buttons:[{label:'重玩第一章',action:()=>YL.game.start(1)},{label:'返回目录',secondary:true,action:()=>YL.game.map()}]});}
 },
 // The doorway is genuinely removed from the cut image. The accepted hand trace is the mask edge.
 async arch(p,scope){
  await this.text('再剪开中间的窑门。直边向上，弧线合拢；一道拱口，把山坡里的居室显了出来。',scope);
  const A=YL.art,svg=YL.game.svg,g=YL.$('[data-object="cave"]'),b=p.box,cut=YL.game.cuts.cave;
  const box={x:b.x+b.w*.50,y:b.y+b.h*.43,w:b.w*.095,h:b.h*.405},d=`M${box.x} ${box.y+box.h}V${box.y+box.w/2}a${box.w/2} ${box.w/2} 0 0 1 ${box.w} 0V${box.y+box.h}Z`;
  const gate=A.svg('g',{'data-heritage':'arch'},svg),cover=A.svg('path',{d,fill:'url(#redPaper)'},gate),guide=A.svg('path',{d,class:'cut-guide',fill:'none'},gate),l=guide.getTotalLength(),refs=Array.from({length:161},(_,i)=>guide.getPointAtLength(l*i/160));const start=refs[0],dot=A.svg('circle',{cx:start.x,cy:start.y,r:5,class:'start-dot'},gate),seam=A.svg('path',{fill:'none',stroke:'#F4EBDD','stroke-width':1.6},gate),scissors=YL.prologue.cursor(gate,start.x,start.y);let idx=0,trace=[],tip=start,down=false,id=null,finished=false,bad=0;
  YL.$('#progress-track').hidden=false;YL.$('#progress-bar').style.width='0%';YL.game.setHint('从红点起剪，沿拱口走一圈；松手可以续剪');
  await scope.promise(done=>{
   const finish=async assisted=>{if(finished||YL.game.paused)return;finished=true;down=false;YL.game.skipper=null;if(assisted)trace=refs.map(q=>({x:q.x,y:q.y}));const hole=trace.map(q=>[(q.x-b.x)/b.w,(q.y-b.y)/b.h]);cut.holes=[hole];YL.store.data.handCuts.cave.holes=[hole];YL.store.data.cuts++;YL.store.save();
    const defs=A.svg('defs',{},g),mask=A.svg('mask',{id:'heritage-arch-mask',maskUnits:'userSpaceOnUse',x:0,y:0,width:375,height:667},defs);A.svg('rect',{width:375,height:667,fill:'white'},mask);A.svg('path',{d:YL.v3.path(trace),fill:'black'},mask);g.setAttribute('mask','url(#heritage-arch-mask)');gate.remove();const waste=A.svg('path',{d:YL.v3.path(trace),fill:'url(#redPaper)','data-heritage':'arch-waste'},svg);try{await scope.animate(YL.motion.ms(540),k=>{waste.setAttribute('transform',`translate(${18*k*k},${60*k*k}) rotate(${10*k},187,450)`);waste.setAttribute('opacity',1-k);});waste.remove();YL.$('#progress-track').hidden=true;done();}catch{}};
   scope.event(svg,'pointerdown',e=>{if(finished||down||YL.game.paused)return;const q=YL.interact.point(svg,e);if(Math.hypot(q.x-tip.x,q.y-tip.y)>24)return;down=true;id=e.pointerId;bad=0;if(!trace.length)trace.push({x:start.x,y:start.y});svg.setPointerCapture?.(id);e.preventDefault();});
   scope.event(svg,'pointermove',e=>{if(!down||finished||YL.game.paused||e.pointerId!==id)return;const q=YL.interact.point(svg,e);let best=idx,dist=Infinity;for(let j=Math.max(0,idx-2);j<=Math.min(160,idx+28);j++){const t=Math.hypot(q.x-refs[j].x,q.y-refs[j].y);if(t<dist){dist=t;best=j;}}if(dist<12){idx=Math.max(idx,best);if(Math.hypot(q.x-tip.x,q.y-tip.y)>.7){trace.push(q);tip=q;}bad=0;seam.setAttribute('d',YL.v3.path(trace,false));scissors.setAttribute('transform',`translate(${q.x},${q.y})`);YL.$('#progress-bar').style.width=idx/160*100+'%';if(idx>=158&&Math.hypot(q.x-start.x,q.y-start.y)<15)finish(false);}else if(dist>32&&++bad>3){down=false;YL.game.setHint('这一刀偏远了，回到剪口接着剪');}e.preventDefault();});
   for(const type of ['pointerup','pointercancel'])scope.event(svg,type,e=>{if(e.pointerId===id)down=false;});YL.game.skipper=()=>finish(true);
  });
 },
 ensemble(){const A=YL.art,g=A.svg('g',{'data-heritage':'ensemble'},YL.game.svg),layout=[['wall',{x:29,y:333,w:260,h:87}],['tower',{x:227,y:356,w:105,h:86}],['tongwan',{x:24,y:444,w:169,h:94}],['pagoda',{x:178,y:384,w:58,h:116}],['cave',{x:232,y:469,w:114,h:71}]];for(const[key,box]of layout){const group=A.result(g,key,box,YL.game.cuts[key]);if(key==='cave'&&YL.game.cuts.cave.holes){const defs=A.svg('defs',{},group),mask=A.svg('mask',{id:'ensemble-cave-hole',x:0,y:0,width:1,height:1,maskUnits:'userSpaceOnUse'},defs);A.svg('rect',{width:1,height:1,fill:'white'},mask);A.svg('path',{d:YL.v3.path(YL.game.cuts.cave.holes[0].map(([x,y])=>({x,y}))),fill:'black'},mask);group.querySelector('image').setAttribute('mask','url(#ensemble-cave-hole)');}group.classList.add('heritage-piece');}g.classList.add('paper-object-enter');},
 end(){YL.ui.modal({kicker:'第一章完成',title:'剪出陕北的轮廓',body:'<p>长城、镇北台、统万城遗址、延安宝塔和窑洞，已经留在这一章里。</p><p>同样是一张纸，沿着不同的线落剪，便读出了不同的山河与生活。</p>',close:false,className:'heritage-end',buttons:[{label:'返回章节目录',action:()=>YL.game.map()},{label:'重剪第一章',secondary:true,action:()=>YL.game.start(1)}]});}
};

Object.assign(YL.cards,{
 'h-wall':{title:'随山势起伏的陕北长城',body:'陕北长城跨越多个县域。墙体、垛口与城台共同组成防御设施；具体地段的材料与形制并不完全相同。这里取曲折墙线作纸艺表现，沿山脊的起伏落剪，说明地形与建筑轮廓的关系。',more:YL.heritage.links([['陕西省文物局 · 长城保护总体规划','https://wwj.shaanxi.gov.cn/zfxxgk/fdzdgknr/ghxx/202209/P020220929419646405882.pdf']])},
 'h-tower':{title:'榆阳区 · 镇北台',body:'镇北台位于榆林市榆阳区红山，是四层逐级收分的方形高台，与周边长城共同构成边防景观。附近的款贡城、易马城与接待、商洽及互市有关：高台的防守用途和附近城址的交往用途，应当分开理解。',more:YL.heritage.links([['镇北台景区 · 地点与介绍','https://www.zhenbeitai.com.cn/?lang=zh-cn'],['政府网站 · 台与周边遗存',YL.v3.sources.wall2]])},
 'h-tongwan':{title:'靖边县 · 统万城遗址',body:'统万城位于靖边县红墩界镇白城则村，是十六国时期大夏国的都城遗址。偏白的城墙，让它有了“白城子”的俗称。城垣、墩台、马面与瓮城等遗存，仍能帮助人们读懂昔日城池的布局与防御。画面表现现存遗址的残损形态，不作完整宫城复原。',more:YL.heritage.links([['文旅部 · 统万城遗址','https://zhuanti.mct.gov.cn/xcss2024_xcygj/shanxi1/detail/7191.html'],['遗址公园 · 走进统万城','https://www.tongwanchengyizhi.com/portal/about/index.html']])},
 'h-pagoda':{title:'宝塔区 · 延安宝塔',body:'延安宝塔又称岭山寺塔，是八角九层的楼阁式砖塔，高约44米。古塔经历过多次修葺。中共中央进驻延安后，宝塔山成为革命圣地的标志；塔的轮廓，也走进了图像与人们对延安的记忆。剪纸用檐线的重复和塔身的渐收来概括它，不是建筑测绘图。',more:YL.heritage.links([['陕西省档案馆 · 宝塔山','https://daj.shaanxi.gov.cn/Article/View?id=4757'],['国家体育总局 · 延安宝塔','https://www.sport.gov.cn/pqzx/n5317/c671492/content.html']])},
 'h-cave':{title:'黄土里的人家 · 陕北窑洞',body:'深厚的黄土与丰富的砂石，为陕北窑洞营造提供了条件。靠崖窑在崖面开挖，砖石箍建的窑洞则以拱顶围合居室。窑洞冬暖夏凉、节省材料，是人们适应当地环境的居住智慧，分布在陕北多个县区。纸艺画面采用普通三孔窑洞的概括形态。',more:YL.heritage.links([['中国非遗网 · 陕北窑洞营造技艺','https://www.ihchina.cn/project_details/14688/'],['文旅部 · 陕北村落与窑洞','https://zhuanti.mct.gov.cn/xcss2024_xcygj/shanxi1/detail/7191.html']])}
});

YL.motion={
 locked:false,reduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches;},ms(n){return this.reduced()?1:n;},
 enter(screen=YL.$('#page>.screen')){if(!screen)return;screen.classList.remove('page-exit');screen.classList.add('page-enter');},
 async navigate(action){if(this.locked)return;this.locked=true;YL.game.navigationPaused=true;const old=YL.$('#page>.screen');YL.$('#frame').classList.add('navigating');if(old){old.classList.remove('page-enter');old.classList.add('page-exit');}await new Promise(r=>setTimeout(r,this.ms(180)));let result;try{result=action();this.enter();}finally{this.locked=false;YL.game.navigationPaused=false;YL.$('#frame').classList.remove('navigating');}return result;},
 cover(){const screen=YL.$('.v3-cover');if(!screen)return;const overlay=YL.art.svg('svg',{class:'cover-living',viewBox:'0 0 375 667','aria-hidden':'true'},screen);
  overlay.innerHTML='<defs><filter id="riverColor" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -6 1 6 0 -1.6"/></filter><mask id="riverMask" maskUnits="userSpaceOnUse" x="0" y="300" width="375" height="255"><image href="assets/cover-shanbei-v3.webp?v=20261018-web3" x="0" y="0" width="375" height="667" filter="url(#riverColor)"/></mask><pattern id="cloudFiber" patternUnits="userSpaceOnUse" width="160" height="160"><image href="assets/v4/paper.webp?v=20261018-web3" width="160" height="160"/></pattern></defs><g mask="url(#riverMask)"><image class="river-texture" href="assets/cover-shanbei-v3.webp?v=20261018-web3" width="375" height="667" opacity=".52"/><g class="river-flow" fill="none" stroke="#F4EBDD" stroke-width=".8" stroke-linecap="round" stroke-dasharray="7 34 3 21" opacity=".48"><path d="M180 337C226 357 337 353 352 380S276 405 175 432S178 466 281 478S331 502 267 527"/><path d="M174 342C220 363 329 358 345 382S270 411 164 438S181 474 286 484S322 506 257 530"/></g></g><g class="cover-cloud cloud-back" fill="url(#cloudFiber)" opacity=".78"><path d="M199 198L211 191 220 194 231 189 247 197 265 196 279 202 296 199 309 204 326 201 340 209 331 214 312 211 297 216 281 212 258 215 247 209 228 211 213 205Z"/></g><g class="cover-cloud cloud-front" fill="url(#cloudFiber)" opacity=".72"><path d="M86 225L103 218 116 221 133 214 148 220 167 217 184 223 201 220 222 228 212 234 195 231 179 236 158 231 142 234 127 228 109 231Z"/></g>';
  this.enter(screen);
 }
};
Object.defineProperty(YL.game,'paused',{get(){return this.modalPaused||this.navigationPaused||document.hidden;}});
const heritageImage=YL.art.image.bind(YL.art);YL.art.image=function(parent,key,box,attrs={}){if(['tongwan','pagoda','cave'].includes(key))return this.svg('image',{href:`assets/v5/${key}.webp?v=20261018-web3`,x:box.x,y:box.y,width:box.w,height:box.h,preserveAspectRatio:'none',...attrs},parent);return heritageImage(parent,key,box,attrs);};
const heritageScissors=YL.art.scissors.bind(YL.art);YL.art.scissors=function(svg,x,y,angle=0){return YL.heritage.active?YL.prologue.cursor(svg,x,y):heritageScissors(svg,x,y,angle);};
const heritageLeave=YL.game.leave.bind(YL.game);YL.game.leave=function(){heritageLeave();YL.heritage.active=false;YL.$('#frame').classList.remove('heritage-revision');};
const heritageHome=YL.v3.home.bind(YL.v3);YL.v3.home=function(){heritageHome();YL.motion.cover();};YL.game.home=()=>YL.motion.navigate(()=>YL.v3.home());
const heritageMap=YL.game.map.bind(YL.game);YL.game.map=function(){return YL.motion.navigate(()=>{heritageMap();const row=YL.$('[data-chapter="1"]');if(row){row.querySelector('strong').textContent='剪出陕北';row.querySelector('small').textContent='第一章 · 遗迹、地标与窑洞';if(YL.store.data.done.includes(1)&&YL.store.data.heritageRevision!==YL.heritage.version)row.querySelector('em').textContent='可重剪';}const place=YL.$('.map-heading>p:last-child');if(place&&YL.store.data.chapter===1)place.textContent='剪出陕北';});};
const heritagePrologueStart=YL.prologue.start.bind(YL.prologue);YL.prologue.start=()=>YL.motion.navigate(()=>heritagePrologueStart());YL.v3.start=function(index){return index===0?YL.prologue.start():index===1?YL.motion.navigate(()=>YL.heritage.start()):undefined;};
const heritagePrologueShell=YL.prologue.shell.bind(YL.prologue);YL.prologue.shell=function(){heritagePrologueShell();YL.motion.enter();};
const heritageText=YL.prologue.text.bind(YL.prologue);YL.prologue.text=async function(text,scope){const n=YL.$('#narration');if(n&&YL.$('#narr-text').textContent){n.classList.add('text-exit');await scope.wait(YL.motion.ms(100));n.classList.remove('text-exit');}await heritageText(text,scope);n?.classList.remove('text-enter');void n?.offsetWidth;n?.classList.add('text-enter');};
const heritageModal=YL.ui.modal.bind(YL.ui),heritageClose=YL.ui.closeModal.bind(YL.ui);YL.ui.modal=function(options){const p=heritageModal(options);YL.$('#frame').classList.add('motion-paused');YL.$('.modal-sheet')?.classList.add('dialog-enter');return p;};YL.ui.closeModal=function(value){heritageClose(value);YL.$('#frame').classList.remove('motion-paused');};document.addEventListener('visibilitychange',()=>YL.$('#frame').classList.toggle('motion-hidden',document.hidden));
YL.v3.help=function(){YL.ui.modal({kicker:'纸上陕北',title:'循着剪口，认识陕北',body:'<p>序章：三次折纸、五道剪口、逐层展开一朵团花。</p><p>第一章：剪出长城、榆阳区镇北台、靖边县统万城遗址、宝塔区延安宝塔与陕北窑洞，在轮廓中认识建筑与地方故事。</p><p>文化知识与来源可选阅读。松手后可续剪，明显剪偏可重试；右上角可辅助完成。剪口和章节进度保存在本机。</p><p>本次更新到第一章结束。第二章起保留此前版本。美术为艺术化表现，不作实景地图或建筑测绘。</p>',buttons:[{label:'继续体验'},{label:'重置进度',secondary:true,action:()=>YL.game.resetConfirm()}]});};
const closeWithMotion=YL.ui.closeModal.bind(YL.ui);YL.ui.closeModal=function(value){const modal=YL.$('#modal');if(!modal.hidden&&modal.firstElementChild&&!YL.motion.reduced()){const ghost=document.createElement('div');ghost.className='dialog-exit-shell';ghost.setAttribute('aria-hidden','true');ghost.inert=true;const sheet=modal.firstElementChild.cloneNode(true);sheet.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));sheet.removeAttribute('aria-labelledby');sheet.removeAttribute('role');sheet.classList.remove('dialog-enter');ghost.append(sheet);YL.$('#frame').append(ghost);setTimeout(()=>ghost.remove(),190);}closeWithMotion(value);};
YL.motion.cover();
