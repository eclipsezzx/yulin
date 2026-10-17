'use strict';
// Free cuts are polygons subtracted by a union mask, then reflected across the actual folds.
// Overlapping cuts never restore paper (unlike an even-odd compound path).
YL.freeWindow={
 serial:0,active:false,level:0,cuts:[],busy:false,draft:[],
 compose(a,b){return[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3]];},
 reflect([x,y]){return[1-2*x*x,-2*x*y,-2*x*y,1-2*y*y];},
 normals:[[0,1],[Math.SQRT1_2,Math.SQRT1_2],[-Math.SQRT1_2,Math.SQRT1_2]],
 matrices(level=this.level){let ms=[[1,0,0,1]];for(let i=0;i<level;i++){const R=this.reflect(this.normals[i]);ms=ms.concat(ms.map(m=>this.compose(R,m)));}return ms;},
 layout(level=this.level){return level===0?{x:61,y:291,s:250}:level===1?{x:123,y:413,s:125}:{x:187.5,y:413,s:125};},
 poly(points){return YL.prologue.poly(points);},
 shape(parent,matrix=[1,0,0,1]){
  const A=YL.art,id='free-mask-'+(++this.serial),g=A.svg('g',{transform:`matrix(${matrix.join(',')} 0 0)`},parent),defs=A.svg('defs',{},g),mask=A.svg('mask',{id,maskUnits:'userSpaceOnUse',x:-.02,y:-.02,width:1.04,height:1.04},defs);
  A.svg('path',{d:'M0 0H1V1Z',fill:'white'},mask);for(const p of this.cuts)A.svg('path',{d:this.poly(p),fill:'black'},mask);
  A.svg('path',{d:'M0 0H1V1Z',fill:'url(#foldRed)',mask:`url(#${id})`,'data-free-sector':'true'},g);return g;
 },
 render(){
  this.g.replaceChildren();const b=this.layout();this.paper=YL.art.svg('g',{transform:`translate(${b.x},${b.y}) scale(${b.s})`,'data-free-paper':this.level},this.g);for(const m of this.matrices())this.shape(this.paper,m);
  this.seam=YL.art.svg('path',{fill:'none',stroke:'#F4EBDD','stroke-width':1.6,'stroke-linejoin':'round','stroke-linecap':'round','pointer-events':'none'},this.g);
  YL.$('#fold-step').textContent=this.level===0?'八层折纸 · 自由剪刻':`展开 ${this.level} / 3 · ${this.matrices().length} 面花样`;
  YL.$('#free-unfold').disabled=this.level===3||this.busy;YL.$('#free-refold').disabled=this.level===0||this.busy;YL.$('#free-undo').disabled=!this.cuts.length||this.busy;YL.$('#free-clear').disabled=!this.cuts.length||this.busy;
  YL.$('#stage-next').textContent=this.level===3?'收好这朵窗花 ›':'展开并收好 ›';
  YL.game.setHint(this.level===0?'在红纸上自由落剪；从纸边剪回纸边，或剪出闭合花纹':'可逐层对折，回到八层纸继续修改');
 },
 async turn(delta){
  if(this.busy||YL.game.paused||this.scope.signal.aborted)return;const next=this.level+delta;if(next<0||next>3)return;const scope=this.scope;this.cancelStroke();this.busy=true;this.render();const source=Math.min(this.level,next),ms=this.matrices(source),n=this.normals[source],old=this.layout(),target=this.layout(next);this.g.replaceChildren();const paper=YL.art.svg('g',{},this.g);for(const m of ms)this.shape(paper,m);const moving=ms.map(m=>({m,g:this.shape(paper,m)}));
  try{await scope.animate(YL.motion.ms(620),k=>{const t=delta>0?k:1-k,v=1-Math.cos(t*Math.PI),F=[1-v*n[0]*n[0],-v*n[0]*n[1],-v*n[0]*n[1],1-v*n[1]*n[1]];paper.setAttribute('transform',`translate(${old.x+(target.x-old.x)*k},${old.y+(target.y-old.y)*k}) scale(${old.s+(target.s-old.s)*k})`);for(const item of moving)item.g.setAttribute('transform',`matrix(${this.compose(F,item.m).join(',')} 0 0)`);});this.level=next;YL.audio.page();}finally{if(this.scope===scope){this.busy=false;if(!scope.signal.aborted)this.render();}}
 },
 edge(p){const options=[{p:[Math.min(1,Math.max(0,p[0])),0],t:Math.min(1,Math.max(0,p[0]))},{p:[1,Math.min(1,Math.max(0,p[1]))],t:1+Math.min(1,Math.max(0,p[1]))}];const u=Math.min(1,Math.max(0,(p[0]+p[1])/2));options.push({p:[u,u],t:2+(1-u)*Math.SQRT2});return options.map(e=>({...e,d:Math.hypot(e.p[0]-p[0],e.p[1]-p[1])})).sort((a,b)=>a.d-b.d)[0];},
 boundary(from,to){const total=2+Math.SQRT2;let end=to.t;if(end<from.t)end+=total;const points=[from.p];for(const [t,p] of [[1,[1,0]],[2,[1,1]],[total,[0,0]],[total+1,[1,0]],[total+2,[1,1]]])if(t>from.t+1e-6&&t<end-1e-6)points.push(p);points.push(to.p);return{points,length:end-from.t};},
 closeCut(points){
  if(points.length<4)return null;const first=points[0],last=points.at(-1),a=this.edge(first),b=this.edge(last);let closed;
  if(a.d<.045&&b.d<.045){const forward=this.boundary(b,a),back=this.boundary(a,b);closed=[a.p,...points.slice(1,-1),b.p,...(forward.length<=back.length?forward.points:back.points.slice().reverse()).slice(1)];}
  else if(Math.hypot(first[0]-last[0],first[1]-last[1])<.055)closed=points.slice();else return null;
  const area=Math.abs(closed.reduce((sum,p,i)=>{const q=closed[(i+1)%closed.length];return sum+p[0]*q[1]-p[1]*q[0];},0)/2);return area>.00035?closed:null;
 },
 cancelStroke(){this.pointer=null;this.draft=[];this.seam?.setAttribute('d','');},
 drawEvents(scope){
  const svg=YL.game.svg,point=e=>{const q=YL.interact.point(svg,e),b=this.layout();return[(q.x-b.x)/b.s,(q.y-b.y)/b.s];},inside=p=>p[0]>=-.005&&p[0]<=1.005&&p[1]>=-.005&&p[1]<=p[0]+.005;
  scope.event(svg,'pointerdown',e=>{if(this.busy||this.level!==0||YL.game.paused||this.pointer!=null)return;const q=point(e);if(!inside(q))return;if(this.cuts.length>=40){YL.game.setHint('已经剪了40刀，可以撤回一刀再调整');return;}this.pointer=e.pointerId;this.draft=[q];svg.setPointerCapture?.(e.pointerId);e.preventDefault();});
  scope.event(svg,'pointermove',e=>{if(this.pointer!==e.pointerId||this.busy||YL.game.paused)return;const q=point(e);if(!inside(q))return;const prev=this.draft.at(-1);if(Math.hypot(q[0]-prev[0],q[1]-prev[1])<.004)return;if(this.draft.length<600)this.draft.push(q);const b=this.layout();this.seam.setAttribute('d',YL.prologue.poly(this.draft.map(p=>[b.x+p[0]*b.s,b.y+p[1]*b.s]),false));e.preventDefault();});
  scope.event(svg,'pointerup',e=>{if(this.pointer!==e.pointerId)return;if(YL.game.paused){this.cancelStroke();return;}const q=point(e);if(inside(q))this.draft.push(q);const cut=this.closeCut(this.draft);this.cancelStroke();if(cut){this.cuts.push(cut);this.render();YL.audio.cut();YL.game.setHint('这一刀已剪下，可以继续设计，或展开看看');}else YL.game.setHint('这一刀还没有围出纸片：从纸边剪回纸边，或把花纹首尾合上');});
  scope.event(svg,'pointercancel',()=>this.cancelStroke());scope.event(document,'visibilitychange',()=>{if(document.hidden)this.cancelStroke();});
 },
 async save(){
  if(this.busy||YL.game.paused)return;if(!this.cuts.length){YL.game.setHint('先在红纸上剪下自己的花纹');return;}while(this.level<3){await this.turn(1);if(this.scope.signal.aborted)return;}
  const record={version:YL.route.version,cuts:this.cuts.map(p=>p.map(q=>q.map(n=>+n.toFixed(5)))),folds:3,complete:true};YL.store.data.freeFlower=record;YL.store.save();this.scope.dispose();YL.game.scope=null;YL.game.skipper=null;
  YL.ui.modal({kicker:'自由创作',title:'收好自己的花样',body:'<div id="free-finished" class="finished-flower"></div><p>这朵窗花由你刚才的剪口展开而来，已保存在本机。自由创作不计入主线时长。</p>',close:false,buttons:[{label:'进入第一章',action:()=>YL.game.start(1)},{label:'继续修改',secondary:true,action:()=>this.start(true)},{label:'返回章节目录',secondary:true,action:()=>YL.game.map()}]});const out=YL.art.svg('svg',{viewBox:'-1.08 -1.08 2.16 2.16','aria-label':'玩家自由设计的对称窗花'},YL.$('#free-finished'));YL.prologue.material(out);for(const m of this.matrices(3))this.shape(out,m);
 },
 async start(restore=false){
  if(!YL.store.data.done.includes(0))return;YL.game.leave();this.active=true;this.busy=false;this.level=0;this.pointer=null;this.draft=[];this.cuts=restore&&YL.store.data.freeFlower?YL.store.data.freeFlower.cuts.map(p=>p.map(q=>q.slice())):[];YL.game.chapter=YL.prologue.chapter;YL.prologue.shell();YL.$('#game-screen').classList.add('free-window');YL.$('.game-heading h1').textContent='剪自己的花样';YL.$('.fold-subtitle').textContent='自由折剪 · 可选创作';YL.$('#fold-footer').textContent='纸上陕北 · 自由创作';YL.$('#skip').hidden=true;
  const controls=document.createElement('div');controls.className='free-controls';controls.innerHTML='<button id="free-undo" aria-label="撤回上一刀">撤回</button><button id="free-clear">清空</button><button id="free-refold">对折一层</button><button id="free-unfold">展开一层</button>';YL.$('#game-screen').append(controls);
  const scope=this.scope=YL.game.scope=new YL.Scope();this.g=YL.art.svg('g',{'data-fold-task':'free','aria-label':'自由折剪纸面'},YL.game.svg);YL.$('#narr-text').textContent='不必沿着示范的线。这次由你安排花瓣、月牙与锯齿：在八层红纸上剪出自己的花纹，再沿折痕逐层展开。';YL.game.lastNarration=YL.$('#narr-text').textContent;YL.$('#stage-next').hidden=false;
  const safe=fn=>()=>{if(!this.busy&&!YL.game.paused)fn();};scope.event(YL.$('#free-undo'),'click',safe(()=>{this.cancelStroke();this.cuts.pop();this.render();}));scope.event(YL.$('#free-clear'),'click',safe(()=>{this.cancelStroke();this.cuts=[];this.render();}));scope.event(YL.$('#free-refold'),'click',()=>this.turn(-1).catch(e=>{if(e.name!=='AbortError')console.error(e);}));scope.event(YL.$('#free-unfold'),'click',()=>this.turn(1).catch(e=>{if(e.name!=='AbortError')console.error(e);}));scope.event(YL.$('#stage-next'),'click',()=>this.save().catch(e=>{if(e.name!=='AbortError')console.error(e);}));this.drawEvents(scope);this.render();
 }
};
YL.prologue.end=function(){YL.ui.modal({kicker:'序章完成',title:'剪出一朵窗花',body:'<div id="finished-flower" class="finished-flower"></div><p>折痕安排了对称，剪口留下了花样。也可以留在纸前，自由设计自己的窗花。</p>',close:false,buttons:[{label:'进入第一章',action:()=>YL.game.start(1)},{label:'自由设计窗花',secondary:true,action:()=>YL.freeWindow.start(true)},{label:'返回章节目录',secondary:true,action:()=>YL.game.map()}]});const svg=YL.art.svg('svg',{viewBox:'-1.08 -1.08 2.16 2.16','aria-label':'本次亲手剪出的对称窗花'},YL.$('#finished-flower'));this.material(svg);this.flower(svg);};
const freeLeave=YL.game.leave.bind(YL.game);YL.game.leave=function(){freeLeave();YL.freeWindow.active=false;YL.freeWindow.pointer=null;};
