'use strict';
// A collection of the player's saved cuts. The former collage draft stays untouched.
YL.collection={
 W:1000,entries:[],labels:[],pieces:[],H:1000,
 catalog:[
  {key:'fold-flower',name:'折剪窗花',theme:'窗上花样',ratio:1},
  {key:'free-flower',name:'自由窗花',theme:'窗上花样',ratio:1},
  {key:'wall',name:'陕北长城',theme:'山河往事',ratio:350/108,wide:true},
  {key:'tower',name:'镇北台',theme:'山河往事',ratio:104/86},
  {key:'pagoda',name:'延安宝塔',theme:'山河往事',ratio:51/98},
  {key:'cave',name:'窑洞',theme:'山河往事',ratio:208/114},
  {key:'tongwan',name:'统万城遗址',theme:'山河往事',ratio:176/80},
  ...Object.entries({'yangyu':'洋芋擦擦','jianbing':'子长煎饼','sanxian':'榆林拼三鲜','guoxian':'子洲馃馅'}).map(([key,name])=>({key:'food-'+key,name,theme:'陕北人家',ratio:YL.tableArt['food-'+key].width/YL.tableArt['food-'+key].height})),
  {key:'waist-drum',name:'安塞腰鼓',theme:'纸上鼓乐',ratio:YL.waistArt['waist-drum'].width/YL.waistArt['waist-drum'].height},
  {key:'suona',name:'陕北唢呐',theme:'纸上鼓乐',ratio:175/112},
  ...[['cloud','云纹',210/126],['flower','窗花',1],['dancer','舞者',120/184],['fan','扇子',135/101],['ribbon','红绸',176/117]].map(([key,name,ratio])=>({key,name,ratio,theme:'早先剪作'}))
 ],
 valid(points){return Array.isArray(points)&&points.length>=3&&points.length<=10000&&points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&n>=-2&&n<=3));},
 cut(key){
  const d=YL.store.data,meals=[...(d.foodTable?.items||[]),...(d.foodTable?.archivedItems||[])];
  const record=[d.handCuts?.[key],key==='waist-drum'?d.waistDrum?.cut:null,meals.find(p=>p.key===key)?.cut].find(c=>this.valid(c?.points));
  if(!record)return null;
  const c=JSON.parse(JSON.stringify(record));c.path=YL.prologue.poly(c.points);c.holes=(c.holes||[]).filter(p=>this.valid(p));return c;
 },
 load(){
  const d=YL.store.data;this.entries=[];
  for(const item of this.catalog){
   if(item.key==='fold-flower'){
    const cuts=d.foldFlower?.cuts;if(d.foldFlower?.complete&&Array.isArray(cuts)&&cuts.length&&cuts.every(c=>YL.prologue.tasks.some(t=>t.key===c.key)&&this.valid(c.points)))this.entries.push({...item,cuts:JSON.parse(JSON.stringify(cuts))});
   }else if(item.key==='free-flower'){
    const cuts=d.freeFlower?.cuts;if(Array.isArray(cuts)&&cuts.length&&cuts.every(p=>this.valid(p)))this.entries.push({...item,cuts:JSON.parse(JSON.stringify(cuts))});
   }else{const cut=this.cut(item.key);if(cut)this.entries.push({...item,cut});}
  }
  this.arrange();YL.collage.blob=null;YL.collage.revoke();
 },
 arrange(){
  this.labels=[{text:'纸上陕北',x:500,y:88,size:62,brush:true},{text:'亲手剪出的作品',x:500,y:144,size:28}];this.pieces=[];this.rules=[];let y=205;
  for(const theme of ['窗上花样','山河往事','陕北人家','纸上鼓乐','早先剪作']){
   const entries=this.entries.filter(a=>a.theme===theme);if(!entries.length)continue;
   this.labels.push({text:theme,x:65,y:y+28,size:30,align:'start',red:true});this.rules.push({x1:218,y1:y+17,x2:935,y2:y+17});y+=54;let column=0;
   for(const a of entries){
    if(a.wide&&column){y+=246;column=0;}
    const cell={x:a.wide?65:65+column*450,y,w:a.wide?870:420,h:a.wide?300:246},maxW=cell.w-36,maxH=cell.h-70,w=Math.min(maxW,maxH*a.ratio),h=w/a.ratio;
    this.pieces.push({entry:a,box:{x:cell.x+(cell.w-w)/2,y:cell.y+12+(maxH-h)/2,w,h},cell});
    this.labels.push({text:a.name,x:cell.x+cell.w/2,y:cell.y+cell.h-24,size:27});
    if(a.wide){y+=cell.h;}else if(column){y+=cell.h;column=0;}else column=1;
   }
   if(column)y+=246;y+=26;
  }
  if(!this.entries.length){this.labels.push({text:'还没有保存的剪纸作品',x:500,y:330,size:30});y=420;}
  this.H=y+90;this.labels.push({text:'每一道剪口，都是自己的模样。',x:500,y:this.H-48,size:24});
 },
 paint(parent,a,b){
  const A=YL.art;
  if(a.key==='fold-flower'){const g=A.svg('g',{transform:`translate(${b.x+b.w/2},${b.y+b.h/2}) scale(${b.w/2})`,'data-origin':'foldFlower'},parent);YL.prologue.flower(g,a.cuts);return g;}
  if(a.key==='free-flower'){const g=A.svg('g',{transform:`translate(${b.x+b.w/2},${b.y+b.h/2}) scale(${b.w/2})`,'data-origin':'freeFlower'},parent),previous=YL.freeWindow.cuts;try{YL.freeWindow.cuts=a.cuts;for(const matrix of YL.freeWindow.matrices(3))YL.freeWindow.shape(g,matrix);}finally{YL.freeWindow.cuts=previous;}return g;}
  // Use the food itself, not its replacement served-dish image, so its cut is visible.
  const g=A.result(parent,a.key,b,a.cut);
  if(a.key==='cave'&&a.cut.holes.length){const id='collection-cave-'+(++YL.folk.serial),defs=A.svg('defs',{},g),mask=A.svg('mask',{id,maskUnits:'userSpaceOnUse',x:-.1,y:-.1,width:1.2,height:1.2},defs);A.svg('rect',{x:-.1,y:-.1,width:1.2,height:1.2,fill:'white'},mask);for(const hole of a.cut.holes)A.svg('path',{d:YL.prologue.poly(hole),fill:'black'},mask);g.querySelector('image')?.setAttribute('mask',`url(#${id})`);}
  return g;
 },
 draw(board,{labels=true,interactive=false}={}){
  const A=YL.art;board.replaceChildren();board.setAttribute('viewBox',`0 0 ${this.W} ${this.H}`);YL.prologue.material(board);A.svg('rect',{width:this.W,height:this.H,fill:'#F4EBDD'},board);
  for(const line of this.rules)A.svg('line',{...line,stroke:'#BC8D4D','stroke-width':1,opacity:.55},board);
  for(const {entry,box,cell}of this.pieces){const g=A.svg('g',{'data-collection-key':entry.key},board);this.paint(g,entry,box);if(interactive){g.setAttribute('role','button');g.setAttribute('tabindex',0);g.setAttribute('aria-label','放大查看'+entry.name);A.svg('rect',{x:cell.x,y:cell.y,width:cell.w,height:cell.h,fill:'transparent','data-collection-open':entry.key},g);}}
  if(labels)for(const t of this.labels){const text=A.svg('text',{x:t.x,y:t.y,fill:t.red?'#D83A25':'#24221E','font-size':t.size,'font-family':t.brush?'MaShanZheng':'SourceHanSerif','font-weight':400,'text-anchor':t.align||'middle','pointer-events':'none'},board);text.textContent=t.text;}
 },
 preview(key){
  if(YL.game.paused)return;const a=this.entries.find(a=>a.key===key);if(!a)return;
  YL.ui.modal({kicker:'亲手剪出的作品',title:a.name,body:'<div id="collection-detail" class="collection-detail"></div>',className:'collection-preview',buttons:[{label:'继续欣赏'}]});
  const board=YL.art.svg('svg',{viewBox:'0 0 900 680',role:'img','aria-label':a.name+'，保留自己的剪口'},YL.$('#collection-detail'));YL.prologue.material(board);const w=Math.min(820,580*a.ratio),h=w/a.ratio;this.paint(board,a,{x:(900-w)/2,y:(680-h)/2,w,h});
 },
 show(){
  this.load();const C=YL.collage;C.busy=false;C.title='我的陕北剪纸';YL.game.skipper=null;
  YL.$('#page').innerHTML=`<section class="screen roll-result collection-result"><div class="toolbar">${YL.game.tool('back','返回章节目录','back')}<p class="chapter-label">终章</p>${YL.game.tool('audio','音效开关','audio')}</div><header class="collage-heading"><h1>展开陕北</h1></header><p class="collection-count">${this.entries.length?'已收好 '+this.entries.length+' 件剪纸作品':'先去前面的章节，剪出自己的作品'}</p><div class="collection-viewer" tabindex="0" role="region" aria-label="全部剪纸作品，向下滚动浏览"><svg id="collection-board" role="group" aria-label="我的陕北剪纸作品册"></svg></div><p class="collection-cue">向下滑动浏览 · 点作品看大图</p><div class="result-actions"><button id="save-roll" class="primary">保存全部剪纸</button><button id="share-roll" class="secondary">分享我的剪纸</button><button id="return-cover" class="secondary return-cover">完成体验，回到封面</button></div><p id="export-status" class="export-status" role="status" aria-live="polite">保存为完整长图，保留自己的剪口与花纹。</p></section>`;
  this.draw(YL.$('#collection-board'),{interactive:true});const scope=YL.game.scope=new YL.Scope();
  scope.event(YL.$('#collection-board'),'click',e=>{const g=e.target.closest('[data-collection-key]');if(g)this.preview(g.dataset.collectionKey);});
  scope.event(YL.$('#collection-board'),'keydown',e=>{if(['Enter',' '].includes(e.key)){const g=e.target.closest('[data-collection-key]');if(g){e.preventDefault();this.preview(g.dataset.collectionKey);}}});
  YL.$('#back').onclick=()=>YL.game.map();YL.game.bindAudio();YL.$('#save-roll').onclick=()=>C.saveImage();YL.$('#share-roll').onclick=()=>C.shareImage();YL.$('#return-cover').onclick=()=>{if(YL.game.paused||C.busy)return;YL.store.finish(YL.chapters[5]);YL.game.home();};
 },
 async exportBlob(){
  const C=YL.collage;if(C.blob)return C.blob;const board=YL.art.svg('svg',{xmlns:YL.art.ns,width:this.W,height:this.H});this.draw(board,{labels:false});const encoded=new Map();
  await Promise.all([...board.querySelectorAll('image')].map(async node=>{const src=node.getAttribute('href');if(!encoded.has(src))encoded.set(src,fetch(src).then(r=>{if(!r.ok)throw Error('图片素材暂未加载，请重试');return r.blob();}).then(blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);})));node.setAttribute('href',await encoded.get(src));}));
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(board)],{type:'image/svg+xml'}));
  try{
   const image=await C.image(url);await Promise.all(this.labels.map(t=>document.fonts.load(`${t.size}px ${t.brush?'MaShanZheng':'SourceHanSerif'}`,t.text)));await document.fonts.ready;
   const canvas=document.createElement('canvas');canvas.width=2400;canvas.height=Math.round(this.H*2.4);const ctx=canvas.getContext('2d');ctx.scale(2.4,2.4);ctx.drawImage(image,0,0,this.W,this.H);
   for(const t of this.labels){ctx.fillStyle=t.red?'#D83A25':'#24221E';ctx.textAlign=t.align==='start'?'left':'center';ctx.font=`${t.size}px ${t.brush?'MaShanZheng':'SourceHanSerif'}`;ctx.fillText(t.text,t.x,t.y);}
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('图片生成失败，请重试')),'image/png'));C.blob=blob;return blob;
  }finally{URL.revokeObjectURL(url);}
 }
};
// The app's last interaction now resolves to the collection; no editor or placement task.
YL.interact.collection=async()=>{YL.collection.load();};
YL.collage.showResult=()=>YL.collection.show();
YL.collage.exportBlob=()=>YL.collection.exportBlob();
YL.collage.saveImage=async function(){
 if(this.busy)return;this.busy=true;const run=YL.game.runId,status=YL.$('#export-status');status.textContent='正在收好全部剪纸…';
 try{const blob=await this.exportBlob();if(run!==YL.game.runId)return;this.revoke();this.url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=this.url;a.download='纸上陕北-我的剪纸作品.png';document.body.append(a);a.click();a.remove();status.textContent='已生成完整长图，可保存后分享给朋友。';YL.ui.modal({kicker:'我的陕北剪纸',title:'收好自己的剪纸',body:`<img class="export-preview" src="${this.url}" alt="包含全部个人剪纸的完整长图"><p>手机可长按图片保存，再与朋友分享。</p>`,buttons:[{label:'继续欣赏'},{label:'打开大图',secondary:true,keep:true,action:()=>window.open(this.url,'_blank','noopener')}]});}catch(e){if(status.isConnected)status.textContent=e.message;}finally{this.busy=false;}
};
YL.collage.shareImage=async function(){
 if(this.busy)return;this.busy=true;const run=YL.game.runId,status=YL.$('#export-status');status.textContent='正在准备分享图片…';
 try{const blob=await this.exportBlob();if(run!==YL.game.runId)return;const file=new File([blob],'纸上陕北-我的剪纸作品.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({files:[file],title:'我的陕北剪纸',text:'这些是我在《纸上陕北》中亲手剪出的作品。'});status.textContent='剪纸作品已准备好分享。';}else{this.busy=false;await this.saveImage();}}catch(e){if(status.isConnected)status.textContent=e.name==='AbortError'?'剪纸作品还在这里，可随时再次分享。':'暂时无法直接分享，请保存图片后分享。';}finally{this.busy=false;}
};
Object.assign(YL.chapters[5],{name:'展开陕北',desc:'我的陕北剪纸',gain:'陕北剪纸',end:'每一道剪口，都是自己的模样。',steps:[{type:'say',text:'窗上的花，山间的城，桌上的饭食，院中的鼓乐。一张张纸，留下了这一程的见闻。'},{type:'say',text:'把亲手剪出的作品一一展开。那些转弯、留白和镂空，都是你落下的剪口。收好它们，也把陕北的故事分享出去。'},{type:'collection'}]});
const collectionMap=YL.game.map.bind(YL.game);YL.game.map=async function(){await collectionMap();const row=YL.$('[data-chapter="5"]');if(row){row.querySelector('small').textContent='终章 · 我的陕北剪纸';row.querySelector('img').src='assets/v4/redpaper.webp?v=20261018-web3';row.querySelector('img').alt='陕北剪纸作品册';}};
YL.v3.help=function(){YL.ui.modal({kicker:'纸上陕北',title:'从剪口走进地方生活',body:'<p>序章折剪窗花；第一章走近长城、镇北台、延安宝塔与窑洞；第二章剪出洋芋擦擦和子长煎饼，盛上餐桌；再去体验安塞腰鼓，听陕北唢呐。</p><p>沿线可从两个方向起剪，松手可以续剪，右上角可辅助完成。文化知识和热点可选阅读，出处在卡片下方。终章自动收好全部剪纸，保留自己的剪口，可以保存完整长图并分享。进度保存在当前浏览器。</p>',buttons:[{label:'继续体验'}]});};
