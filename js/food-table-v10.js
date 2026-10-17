'use strict';
// One persistent dining-table scene: cut, hear about the food, place it, then explore.
YL.table={version:'20261017-table1'};
Object.assign(YL.food,{
 version:YL.table.version,
 chapter:{id:2,no:'第二章',name:'陕北人家',subtitle:'剪出四味，摆成一桌',gain:'洋芋擦擦·子长煎饼·拼三鲜·子洲馃馅',motif:'flower'},
 mode:'intro',placed:[],
 asset(key){return `assets/v10/${YL.tableArt[key].asset}.webp?v=${this.version}`;},
 box(key){const a=YL.tableArt[key],w=Math.min(295,179*a.width/a.height),h=w*a.height/a.width;return{x:(375-w)/2,y:342+(190-h)/2,w,h};},
 target(key,index){const a=YL.tableArt[key],cell={x:index%2?201:30,y:index<2?356:445,w:144,h:72},w=Math.min(cell.w,cell.h*a.width/a.height),h=w*a.height/a.width;return{x:cell.x+(cell.w-w)/2,y:cell.y+(cell.h-h)/2,w,h};},
 background(){const img=YL.$('#fold-scene');img.className='scene-art scene-dining-table';img.src=`assets/v10/table-scene.webp?v=${this.version}`;img.alt='窑洞人家中居中的空木餐桌，纸艺窗棂与玉米辣椒收在两侧';},
 setMode(mode){this.mode=mode;YL.$('#game-screen').dataset.foodMode=mode;for(const n of YL.game.svg.querySelectorAll('[data-food-hotspot]')){const enabled=['table','intro','read','final'].includes(mode);n.setAttribute('aria-disabled',String(!enabled));n.setAttribute('tabindex',enabled?'0':'-1');}},
 clear(){YL.folk.clear();YL.$('#food-topics')?.remove();YL.$('#food-sources')?.remove();},
 open(d){if(YL.game.paused||!['table','read','final'].includes(this.mode))return;YL.ui.modal({kicker:d.place,title:d.name,className:'knowledge food-knowledge',body:d.pages.map((text,i)=>`<h3>${this.topics[i]}</h3><p>${text}</p>`).join('')+this.links(d.sources),buttons:[{label:'回到餐桌'}]});},
 links(sources){return YL.heritage.links(sources);},
 add(d,index,cut,scope){
  const A=YL.art,b=this.target(d.key,index),g=A.svg('g',{'data-food-hotspot':d.key,role:'button',tabindex:0,'aria-label':'了解'+d.name,class:'table-food'},this.tableGroup);A.result(g,d.key,b,cut);
  const hit=A.svg('rect',{x:b.x-6,y:b.y-9,width:b.w+12,height:b.h+18,fill:'transparent'},g);hit.setAttribute('data-food-hit',d.key);
  A.svg('circle',{cx:b.x+b.w*.78,cy:b.y+b.h*.55,r:14,fill:'none',stroke:'#D83A25','stroke-width':1.3,'pointer-events':'none',class:'food-hotspot-halo'},g);A.svg('circle',{cx:b.x+b.w*.78,cy:b.y+b.h*.55,r:4,fill:'#D83A25',stroke:'#F4EBDD','stroke-width':1.5,'pointer-events':'none'},g);
  const label=A.svg('text',{x:b.x+b.w/2,y:index<2?321:510,'text-anchor':'middle',class:'table-food-name','pointer-events':'none'},g);label.textContent=d.name;
  scope.event(g,'click',()=>this.open(d));scope.event(g,'keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();this.open(d);}});
  const item={d,index,cut,b,g};this.placed.push(item);if(d.hot)this.steam(item,scope);this.setMode('table');this.save(false);return item;
 },
 steam(item,scope){
  const A=YL.art,g=A.svg('g',{'data-food-steam':item.d.key,'pointer-events':'none','aria-hidden':'true'},this.tableGroup),paths=Array.from({length:3},()=>A.svg('path',{fill:'none',stroke:'#F4EBDD','stroke-width':1.6,'stroke-linecap':'round'},g)),base={x:item.b.x+item.b.w*.52,y:item.b.y+item.b.h*.15};
  const draw=()=>{const reduced=YL.motion.reduced();paths.forEach((p,i)=>{const t=reduced?.45:((scope.time/3200+i*.31)%1),x=base.x+(i-1)*13,y=base.y-t*20,s=Math.sin(t*Math.PI*2+i)*3;p.setAttribute('d',`M${x} ${y}C${x-7+s} ${y-8} ${x+7+s} ${y-15} ${x+s} ${y-25}`);p.setAttribute('opacity',String(reduced?.35:Math.sin(t*Math.PI)*.7));});};draw();scope.pending.add(draw);scope.cleanup(()=>{scope.pending.delete(draw);g.remove();});
 },
 save(complete){YL.store.data.foodTable={version:this.version,complete,items:this.placed.map(({d,index,cut})=>({key:d.key,index,cut:{points:cut.points,assisted:cut.assisted},placed:true}))};YL.store.save();},
 async place(d,index,scope){
  this.setMode('placing');const A=YL.art,svg=YL.game.svg,cut=YL.game.cuts[d.key],home=this.box(d.key),target=this.target(d.key,index);svg.querySelector(`[data-object="${d.key}"]`)?.remove();
  const task=A.svg('g',{'data-task':'food-place'},svg),slot=A.svg('path',{d:A.path(d.key,target),class:'food-table-target',fill:'#F4EBDD','fill-opacity':.14,stroke:'#218A98','stroke-width':1.5,'stroke-dasharray':'4 4','pointer-events':'none'},task),piece=A.svg('g',{'data-food-piece':d.key,role:'button',tabindex:0,'aria-label':'将'+d.name+'拖到对应碗盘，或按回车放置'},task);A.result(piece,d.key,{x:0,y:0,w:home.w,h:home.h},cut);A.svg('rect',{x:-4,y:-4,width:home.w+8,height:home.h+8,fill:'transparent'},piece);
  let position={x:home.x,y:home.y},drag=null,finished=false;const paint=()=>piece.setAttribute('transform',`translate(${position.x},${position.y})`),distance=()=>Math.hypot(position.x+home.w/2-target.x-target.w/2,position.y+home.h/2-target.y-target.h/2);paint();YL.game.setHint('把剪好的美食拖到对应的空碗盘里，靠近后松手');
  await scope.promise(resolve=>{
   const finish=async assisted=>{if(finished||YL.game.paused)return;finished=true;drag=null;YL.game.skipper=null;const from={...position};try{await scope.animate(YL.motion.ms(330),k=>{const e=1-(1-k)**3;piece.setAttribute('transform',`translate(${from.x+(target.x-from.x)*e},${from.y+(target.y-from.y)*e}) scale(${1+(target.w/home.w-1)*e},${1+(target.h/home.h-1)*e})`);});task.remove();this.add(d,index,cut,scope);YL.game.visual[d.key+'Placed']=true;YL.store.data.foodPlacements={...(YL.store.data.foodPlacements||{}),[d.key]:{assisted:!!assisted,version:this.version}};YL.store.save();YL.audio.snap();resolve();}catch{}};
   scope.event(piece,'pointerdown',e=>{if(finished||YL.game.paused)return;const q=YL.interact.point(svg,e);drag={id:e.pointerId,x:q.x-position.x,y:q.y-position.y};svg.setPointerCapture?.(e.pointerId);e.preventDefault();});
   scope.event(svg,'pointermove',e=>{if(!drag||finished||YL.game.paused||e.pointerId!==drag.id)return;const q=YL.interact.point(svg,e);position={x:q.x-drag.x,y:q.y-drag.y};paint();slot.classList.toggle('near',distance()<57);e.preventDefault();});
   scope.event(svg,'pointerup',e=>{if(!drag||drag.id!==e.pointerId||finished||YL.game.paused)return;if(svg.hasPointerCapture?.(e.pointerId))svg.releasePointerCapture(e.pointerId);drag=null;if(distance()<57)finish(false);else{position={x:home.x,y:home.y};paint();slot.classList.remove('near');}});scope.event(svg,'pointercancel',()=>drag=null);scope.event(piece,'keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();finish(false);}});YL.game.skipper=()=>finish(true);
  });
 },
 async run(scope){
  this.placed=[];this.background();this.tableGroup=YL.art.svg('g',{'data-food-table':'true'},YL.game.svg);this.setMode('intro');await YL.editorial.intro(['窑门一开，热气便迎了出来，木桌上已摆好碗盘。','洋芋、荞麦、肉汤和枣馅，做成家常与待客的滋味，也盛着陕北人的人情。'],scope);this.label('一桌饭食，几样人情','陕北多地 · 子长 · 榆阳 · 子洲');YL.folk.stage(0,'陕北人家');await YL.folk.text('桌上的碗盘已经备好。剪出四样食物，听过它们的故事，再盛到对应的碗盘里。',scope);await YL.v3.continue(scope,'剪第一道美食 ›');
  for(const [i,d]of this.dishes.entries()){
   this.clear();this.setMode('cut');this.label(d.name,d.place);YL.game.step=i*4+1;YL.$('#fold-footer').textContent='纸上陕北 · 第二章';await YL.folk.text(d.before,scope);const b=this.box(d.key);
   await YL.interact.cut({object:d.key,cutBox:b,resultBox:b,sheetBox:{x:79,y:331,w:217,h:151},hint:'从红点沿外缘慢慢剪，松手后可以接着剪',reducedMotion:YL.motion.reduced(),easy:true},scope);
   this.setMode('read');YL.game.step=i*4+2;YL.game.setHint('');await YL.folk.text(d.summary,scope);await YL.v3.continue(scope,'盛入碗盘 ›');
   YL.game.step=i*4+3;await this.place(d,i,scope);this.setMode(i===3?'final':'table');YL.game.setHint('轻触桌上的美食，可反复查看知识卡');YL.game.step=i*4+4;await YL.folk.text(d.after,scope);await YL.v3.continue(scope,i===3?'完成第二章 ›':'剪下一道美食 ›');
  }
  this.save(true);
 },
 end(){YL.ui.modal({kicker:'第二章完成',title:'陕北人家',body:'<p>四种美食已经上桌。家常饭、街巷小吃、宴席大菜与礼俗糕点，留下了陕北生活的不同滋味。</p><p>桌上的热气还没散，院外的腰鼓已经响起来。</p>',close:false,buttons:[{label:'进入第三章',action:()=>YL.game.start(3)},{label:'返回章节目录',secondary:true,action:()=>YL.game.map()}]});}
});
const tableStories=[
 {before:'先剪洋芋擦擦。粗细不一的洋芋条在外缘探出短短的尖角。沿着起伏走一圈，把这份家常饭从纸上剪下来。',summary:'洋芋就是土豆。擦成条，拌上面粉蒸熟，便成了陕北多地熟悉的洋芋擦擦。浇汁吃，绵软中有酸辣；下锅炒，又添油香。普通食材，也能撑起一餐。',after:'洋芋擦擦上桌了，热气从菜堆里升起来。家常饭先摆一份，再添一道子长街巷里的滋味。',hot:true},
 {before:'接下来是子长煎饼。两卷薄饼斜斜相叠，卷口露出豆腐干。顺着长边和交叠处的缺口剪，留下卷饼舒展的形状。',summary:'子长煎饼以荞麦制浆，在铁鏊上摊烙，薄而柔韧。卷入豆腐干，配醋、蒜汁、韭花和辣油，一口有豆香，也有酸辣。它是街巷小吃，也是招待来客的地方滋味。',after:'薄饼卷着豆腐干，落在了桌上。两样小食齐了，接下来端出老榆林席面上的一道大菜。'},
 {before:'这一道剪榆林拼三鲜的食材。肉片、丸子与卷起的粉皮叠在一起，外缘有高有低。剪好后，把这份丰盛盛进汤碗。',summary:'老榆林待客，拼三鲜是一道郑重的大菜。猪、羊、鸡配上丸子、酥肉、粉皮和蔬菜，几道烹调工夫合进鲜汤。肉香醇厚，粉皮柔滑，一碗里各有滋味。',after:'拼三鲜端稳了，鲜汤的热气慢慢散开。最后，添一份子洲馃馅，把饭桌上的滋味接到人情往来里。',hot:true},
 {before:'最后剪子洲馃馅。整饼与半块相叠，一边圆润，一边露出平整的馅心。沿交叠处转一下剪刀，让两种形状留在一起。',summary:'子洲馃馅有枣泥、豆沙、五仁等馅料。这一份露出的是枣泥：酥皮松脆，馅心甜润。在当地，它也走进订亲与馈赠的习俗，一枚糕点，传递的是亲友间的情意。',after:'子洲馃馅也摆好了。家常、待客与礼俗，聚在同一张桌上。可以轻触每一道美食，细看它的来历、做法与风味。'}
];
YL.food.dishes.forEach((d,i)=>Object.assign(d,tableStories[i]));YL.folk.chapters[2]=YL.food.chapter;Object.assign(YL.chapters[2],YL.food.chapter,{desc:YL.food.chapter.subtitle});
const tableImage=YL.art.image.bind(YL.art);YL.art.image=function(parent,key,box,attrs={}){if(!YL.tableArt[key])return tableImage(parent,key,box,attrs);const id='table-art-'+(++YL.folk.serial),defs=this.svg('defs',{},parent),clip=this.svg('clipPath',{id,clipPathUnits:'userSpaceOnUse'},defs);this.svg('path',{d:this.path(key,box)},clip);return this.svg('image',{href:YL.food.asset(key),x:box.x,y:box.y,width:box.w,height:box.h,preserveAspectRatio:'none','clip-path':`url(#${id})`,...attrs},parent);};
YL.v3.help=function(){YL.ui.modal({kicker:'纸上陕北',title:'从剪口走进地方生活',body:'<p>序章折剪团花，也可自由设计。第一章沿地图走近陕北遗迹与民居。第二章“陕北人家”依次剪出四种美食，听旁白介绍，再拖放到餐桌。桌上的美食可重复点击，知识卡介绍地方背景、食材手艺与风味，来源链接在卡片下方。</p><p>第三章跟随真实安塞腰鼓演出录音体验节拍。可以松手续剪，也可使用辅助。进度保存在本机。本次制作到第三章结束，仅供本机预览。</p>',buttons:[{label:'继续体验'}]});};
