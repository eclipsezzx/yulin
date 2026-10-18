'use strict';
// A geographic reading route: one coordinate system, north up, no road geometry.
YL.route={
 version:'20261015-detail1',
 stops:[
  {name:'榆阳 · 红山',full:'榆林市 · 榆阳区 · 红山',lat:38.33629,lon:109.72666,osm:'457713690'},
  {name:'靖边 · 统万城',full:'榆林市 · 靖边县 · 白城子',lat:38.00047,lon:108.85151,osm:'470729772'},
  {name:'宝塔区 · 宝塔山',full:'延安市 · 宝塔区 · 宝塔山',lat:36.59335,lon:109.48894,osm:'1415823100'},
  {name:'延川 · 梁家河',full:'延安市 · 延川县 · 梁家河村',lat:36.81537,lon:110.06143,osm:'739694823'}
 ],
 // The same scale is used for both axes after longitude is corrected at 37.5°N.
 project(p){return{x:187.5+(p.lon-109.45)*Math.cos(37.5*Math.PI/180)*116,y:320+(38.33629-p.lat)*116};},
 materials:{wall:{scene:'frontier-scene',station:0,target:{x:19,y:360,w:295,h:91},home:{x:26,y:463,w:240,h:74}},tower:{scene:'frontier-scene',station:0,target:{x:241,y:315,w:110,h:91},home:{x:34,y:443,w:108,h:89}},tongwan:{scene:'tongwan-scene',station:1,target:{x:43,y:329,w:288,h:130},home:{x:33,y:455,w:180,h:81}},pagoda:{scene:'pagoda-scene',station:2,target:{x:146,y:284,w:82,h:156},home:{x:37,y:419,w:59,h:113}},cave:{scene:'cave-scene',station:3,target:{x:59,y:317,w:263,h:144},home:{x:29,y:451,w:157,h:86}}},
 mode(mode){YL.$('#game-screen').dataset.mode=mode;},
 background(key){const image=YL.$('#fold-scene');image.classList.remove('window-arrive');image.className='scene-art scene-'+key;image.src='assets/v6/'+key+'.webp?v=20261018-web3';image.alt=key==='route-paper'?'陕北地域路线的纸艺底图':'为建筑剪纸留出位置的陕北纸艺风景';},
 async clear(){YL.game.svg.querySelectorAll('[data-object],[data-task],[data-heritage],[data-route],[data-landmark-set],[data-site-details]').forEach(n=>n.remove());YL.game.showTags([]);YL.game.setHint('');YL.$('#progress-track').hidden=true;YL.$('#stage-next').hidden=true;YL.game.skipper=null;},
 drawMap(current=0){
  const A=YL.art,g=A.svg('g',{'data-route':'map','aria-label':'北向上的陕北四站位置示意'},YL.game.svg),pts=this.stops.map(p=>this.project(p));
  const d=YL.v3.path(pts,false);A.svg('path',{d,fill:'none',stroke:'#F4EBDD','stroke-width':6},g);A.svg('path',{d,fill:'none',stroke:'#82715C','stroke-width':1.2,'stroke-dasharray':'3 5'},g);
  const done=A.svg('path',{d:YL.v3.path(pts.slice(0,current+1),false),fill:'none',stroke:'#D83A25','stroke-width':2.2,'data-route-travelled':'true'},g);
  const labels=[{dx:12,dy:-8,w:92},{dx:-101,dy:-4,w:96},{dx:-111,dy:12,w:107},{dx:13,dy:-4,w:103}];
  pts.forEach((p,i)=>{A.svg('circle',{cx:p.x,cy:p.y,r:5,fill:'#F4EBDD',stroke:i<=current?'#D83A25':'#82715C','stroke-width':1.4,'data-route-stop':i},g);const l=labels[i],x=p.x+l.dx,y=p.y+l.dy;A.svg('rect',{x:x-3,y:y-12,width:l.w,height:21,rx:1,fill:'#F4EBDD'},g);const t=A.svg('text',{x,y:y+2,'font-size':11,fill:'#24221E'},g);t.textContent=this.stops[i].name;});
  const north=A.svg('g',{transform:'translate(329,326)','aria-label':'北向上'},g);A.svg('path',{d:'M0 20V-6M-4 1L0-7 4 1',fill:'none',stroke:'#24221E','stroke-width':1.2},north);const n=A.svg('text',{x:0,y:-14,'text-anchor':'middle','font-size':11,fill:'#24221E'},north);n.textContent='北';
  const marker=A.svg('g',{'data-route-traveller':'true',transform:`translate(${pts[current].x},${pts[current].y})`},g);A.svg('path',{d:'M0 -8L6 0 0 8-6 0Z',fill:'#D83A25',stroke:'#F4EBDD','stroke-width':1.2},marker);
  return{g,pts,marker,done};
 },
 async overview(scope){await this.clear();this.mode('route');this.background('route-paper');YL.$('#heritage-place').textContent='榆阳 → 靖边 → 宝塔区 → 延川';YL.$('#fold-footer').textContent='四站 · 五幅建筑剪纸';await YL.heritage.text('从榆阳的长城与高台出发，去靖边看一座古城的遗迹，再到延安与延川，看塔影和窑洞。地点散在山河之间，我们沿着纸上的连线，一处处走近。',scope);this.drawMap(0);YL.game.setHint('北向上 · 依真实地点位置排列');YL.game.showTags([],scope);await YL.v3.continue(scope,'到红山起剪 ›');},
 async travel(from,to,scope){
  await this.clear();this.mode('route');this.background('route-paper');YL.$('#heritage-place').textContent=this.stops[from].name+' → '+this.stops[to].name;YL.$('#fold-footer').textContent=`沿图前往 · 第 ${to+1} / 4 站`;
  const lines=['','离开榆阳红山，向西南去靖边。白城子的残墙，还立在无定河北岸。下一张红纸，剪出统万城今天留下的轮廓。','从靖边转向东南，来到延安。宝塔山上的古塔，收起宽厚的台身，换成一层层向上的砖塔檐线。','从宝塔山再向东北，去延川县梁家河村。塔影退到身后，窑门与院落渐渐近了。接下来，让剪口走进山里的人家。'];
  await YL.heritage.text(lines[to],scope);const {pts,marker,done}=this.drawMap(from),a=pts[from],b=pts[to];YL.game.setHint(['','向西南 · 靖边县','向东南 · 宝塔区','向东北 · 延川县'][to]);
  await scope.promise(resolve=>{let elapsed=0,finished=false;const duration=YL.motion.ms(1900),paint=k=>{marker.setAttribute('transform',`translate(${a.x+(b.x-a.x)*k},${a.y+(b.y-a.y)*k})`);done.setAttribute('d',YL.v3.path([...pts.slice(0,from+1),{x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k}],false));};const finish=()=>{if(finished||YL.game.paused)return;finished=true;scope.pending.delete(tick);paint(1);YL.game.skipper=null;resolve();};const tick=dt=>{elapsed+=dt;const k=Math.min(1,elapsed/duration);paint(k);if(k===1)finish();};scope.pending.add(tick);scope.cleanup(()=>scope.pending.delete(tick));YL.game.skipper=finish;});
  YL.$(`[data-route-stop="${to}"]`)?.setAttribute('stroke','#D83A25');await scope.wait(YL.motion.ms(650));
 },
 maskHole(result,key){const cut=YL.game.cuts[key];if(!cut?.holes?.length)return;const A=YL.art,id='placed-hole-'+(++this.maskSerial|| (this.maskSerial=1)),defs=A.svg('defs',{},result),mask=A.svg('mask',{id,maskUnits:'userSpaceOnUse',x:0,y:0,width:1,height:1},defs);A.svg('rect',{width:1,height:1,fill:'white'},mask);cut.holes.forEach(points=>A.svg('path',{d:YL.v3.path(points.map(([x,y])=>({x,y}))),fill:'black'},mask));result.querySelector('image').setAttribute('mask',`url(#${id})`);},
 placed(parent,key,box){const r=YL.art.result(parent,key,box,YL.game.cuts[key]);this.maskHole(r,key);return r;},
 async place(p,scope){
  const A=YL.art,svg=YL.game.svg,m=this.materials[p.key],home=m.home,target=m.target;this.mode('place');this.background(m.scene);svg.querySelectorAll('[data-object],[data-task],[data-heritage],[data-landmark-set]').forEach(n=>n.remove());
  await YL.heritage.text(p.key==='wall'?'把这段长城放回山梁。墙线随着山势起伏，剪出的轮廓，也在这里找到了远近。':p.key==='tower'?'把镇北台放回红山上的空位。高台与长城相接，刚才剪过的四层台身，便有了它站立的地方。':p.key==='tongwan'?'把白城子的残墙放回沙地边。保留断口，让这座古城以遗址的模样，留在眼前的山河里。':p.key==='pagoda'?'把延安宝塔放回山顶。层层收拢的塔身立起来，山梁间便有了一眼能认出的身影。':'把剪好的窑洞放回院落。我们在梁家河这一站，看陕北人怎样依着山坡安家。',scope);
  const g=A.svg('g',{'data-task':'place','data-place-key':p.key},svg),land=A.svg('g',{'data-landmark-set':'true'},g);if(p.key==='tower'&&YL.game.cuts.wall)this.placed(land,'wall',this.materials.wall.target);
  const slot=A.svg('g',{'data-placement':p.key,'pointer-events':'none'},g);A.svg('path',{d:A.path(p.key,target),fill:'#F4EBDD',opacity:.72,stroke:'#24221E','stroke-width':1.2,'stroke-dasharray':'4 4'},slot);
  const tray=A.svg('g',{'pointer-events':'none'},g);A.svg('path',{d:'M19 462L118 460 214 462 355 461V543L243 541 123 544 19 542Z',fill:'#F4EBDD',stroke:'#BC8D4D','stroke-width':.5},tray);
  const item=A.svg('g',{'data-place-item':p.key,role:'button',tabindex:0,'aria-label':`拖动${p.name}到背景轮廓，或按回车放置`},g);this.placed(item,p.key,{x:0,y:0,w:home.w,h:home.h});const hit=A.svg('rect',{x:-7,y:-7,width:home.w+14,height:home.h+14,fill:'transparent'},item);
  let pos={x:home.x,y:home.y},drag=null,finished=false;const apply=()=>item.setAttribute('transform',`translate(${pos.x},${pos.y})`);apply();YL.game.setHint('拖动纸片，放进山河中对应的轮廓');YL.game.showTags([],scope);
  await scope.promise(done=>{
   const finish=()=>{if(finished||YL.game.paused)return;finished=true;drag=null;YL.game.skipper=null;slot.remove();tray.remove();item.setAttribute('transform',`translate(${target.x},${target.y}) scale(${target.w/home.w},${target.h/home.h})`);item.setAttribute('aria-disabled','true');hit.remove();YL.game.visual[p.key+'Placed']=true;YL.store.data.heritagePlaced={...(YL.store.data.heritagePlaced||{}),[p.key]:{...target,version:this.version}};YL.store.save();g.setAttribute('data-object',p.key);g.removeAttribute('data-task');YL.audio.snap();done();};
   scope.event(item,'pointerdown',e=>{if(finished||YL.game.paused||drag)return;const q=YL.interact.point(svg,e);drag={id:e.pointerId,dx:q.x-pos.x,dy:q.y-pos.y};svg.setPointerCapture?.(e.pointerId);e.preventDefault();});
   scope.event(svg,'pointermove',e=>{if(!drag||finished||YL.game.paused||drag.id!==e.pointerId)return;const q=YL.interact.point(svg,e);pos.x=Math.max(-home.w/2,Math.min(375-home.w/2,q.x-drag.dx));pos.y=Math.max(250,Math.min(548-home.h/2,q.y-drag.dy));apply();slot.classList.toggle('near',Math.hypot(pos.x+home.w/2-target.x-target.w/2,pos.y+home.h/2-target.y-target.h/2)<38);e.preventDefault();});
   scope.event(svg,'pointerup',e=>{if(!drag||drag.id!==e.pointerId||YL.game.paused)return;drag=null;const d=Math.hypot(pos.x+home.w/2-target.x-target.w/2,pos.y+home.h/2-target.y-target.h/2);if(d<38)finish();else{pos={x:home.x,y:home.y};apply();slot.classList.remove('near');YL.game.setHint('还没放进轮廓，可以再拖一次');}});
   scope.event(svg,'pointercancel',()=>{drag=null;if(!finished){pos={x:home.x,y:home.y};apply();}});scope.event(item,'keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();finish();}});YL.game.skipper=finish;
  });
 },
 summary(){this.mode('route');this.background('route-paper');const {marker}=this.drawMap(3);marker.remove();}
};
const routeShell=YL.heritage.shell.bind(YL.heritage);YL.heritage.shell=function(){routeShell();const img=YL.$('#fold-scene'),wrap=document.createElement('div');wrap.className='site-world-background';img.before(wrap);wrap.append(img);YL.$('#game-screen').classList.add('route-revision');};
YL.heritage.version=YL.route.version;YL.heritage.clear=YL.route.clear.bind(YL.route);
YL.heritage.places[0].name='长城 · 榆阳段';YL.heritage.places[0].place='榆林市 · 榆阳区 · 红山一带';YL.heritage.places[0].before='这一站，从榆阳区红山一带的长城看起。城墙顺着山梁起伏，向远处延伸。沿垛口转折落剪，留住墙线与山势相接的轮廓。';
YL.heritage.places[4].name='梁家河 · 窑洞';YL.heritage.places[4].place='延安市 · 延川县 · 梁家河村';YL.heritage.places[4].before='延川县文安驿镇，梁家河村。窑洞沿山坡安下院落，既留着知青生活的记忆，也继续容纳今天的日常。先剪出院前这一片山形。';
YL.cards['h-cave'].body='这里以延川县文安驿镇梁家河村为例，认识陕北多地的窑洞文化。村里的窑洞院落保留着知青生活的记忆，也有继续使用的居住、生产空间。深厚黄土与当地砂石，孕育了靠崖开挖、砖石箍建等不同营造方式；冬暖夏凉的窑洞，是适应地形与材料的居住智慧。插画取普通窑洞形态，不作某孔旧居复原。';YL.cards['h-cave'].more=YL.heritage.links([['陕西省政府 · 梁家河村','https://www.shaanxi.gov.cn/xw/sxyw/202404/t20240410_2325627.html'],['文旅部 · 延川县梁家河','https://zhuanti.mct.gov.cn/dhxlsfn2022shanxi2/detail/2499.html'],['中国非遗网 · 窑洞营造','https://www.ihchina.cn/project_details/14688/']]);
YL.cards['h-route']={title:'陕北四站 · 路线示意',body:'图中北向上，四站使用同一套地点坐标与统一比例排布。榆阳红山到靖边统万城，向西南；统万城到延安宝塔，转向东南；宝塔山到延川县梁家河村，再向东北。连线表示本作的文化阅读顺序。',more:YL.heritage.links([['地点数据 © OpenStreetMap','https://www.openstreetmap.org/copyright'],...YL.route.stops.map(p=>[p.name+' · 地点核查','https://www.openstreetmap.org/way/'+p.osm])])};
YL.heritage.start=async function(){
 if(!YL.store.data.done.includes(0)){YL.ui.toast('先完成序章，再走进陕北');return;}
 YL.game.leave();this.active=true;const run=YL.game.runId;YL.game.chapter=this.chapter;YL.game.cuts={};YL.game.visual={};YL.store.data.chapter=1;YL.store.save();this.shell();
 try{const scope=YL.game.scope=new YL.Scope();YL.game.step=0;await YL.route.overview(scope);let station=0;
  for(let i=0;i<this.places.length;i++){if(run!==YL.game.runId)return;const p=this.places[i],m=YL.route.materials[p.key];if(m.station!==station){await YL.route.travel(station,m.station,scope);station=m.station;}
   await this.clear();YL.game.step=i+1;YL.route.mode('cut');YL.route.background(m.scene);this.label(p,i);await this.text(p.before,scope);
   await YL.interact.cut({object:p.key,cutBox:p.box,resultBox:p.box,sheetBox:{x:22,y:308,w:331,h:233},hint:p.hint,reducedMotion:YL.motion.reduced()},scope);
   if(p.key==='cave')await this.arch(p,scope);await YL.route.place(p,scope);YL.route.mode('story');await this.text(p.after,scope);YL.game.showTags([[p.tag,p.card]],scope);YL.details.attach(p.key,scope);YL.game.setHint('轻触画面中的标记，看看建筑与生活的细节');await YL.v3.continue(scope,i===4?'完成第一章 ›':i===0?'同一站 · 再剪镇北台 ›':'沿地图去下一站 ›');
  }
  if(run!==YL.game.runId)return;scope.dispose();YL.game.scope=null;YL.game.skipper=null;YL.store.finish(this.chapter);YL.store.data.heritageRevision=this.version;YL.store.save();this.end();
 }catch(e){if(e.name==='AbortError'||run!==YL.game.runId)return;console.error(e);YL.ui.modal({title:'重新展开这一章',body:'<p>这一段还没有完成，可以从第一站重新开始。</p>',buttons:[{label:'重玩第一章',action:()=>YL.game.start(1)},{label:'返回目录',secondary:true,action:()=>YL.game.map()}]});}
};
// Cover typography returns to the released fold2 layout; moving river/cloud art remains behind it.
YL.v3.help=function(){YL.ui.modal({kicker:'纸上陕北',title:'剪出建筑，放回山河',body:'<p>序章折剪窗花。第一章从榆阳红山的长城与镇北台出发，经靖边统万城、延安宝塔山，到延川县梁家河村。</p><p>每处先剪出轮廓，再把纸片放进对应背景。地点间连线按真实相对位置绘制，北向上。知识阅读可选，正文下方保留来源链接。</p><p>本次修改到第一章结束。右上角可辅助完成当前操作；暂停和进度保存在本机。</p>',buttons:[{label:'继续体验'}]});};
