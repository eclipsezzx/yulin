'use strict';
// Optional, non-gating reading attached to depicted architectural details.
YL.details={
 sites:{
  wall:[['敌楼',66,379,31,325,'d-enemy'],['垛口',160,396,116,472,'d-crenel'],['夯土墙',201,421,265,479,'d-earth']],
  tower:[['层台',296,337,262,305,'d-tiers'],['砖包土',293,373,268,438,'d-tower-earth'],['长城',139,398,60,473,'h-wall']],
  tongwan:[['残墙',246,421,244,481,'d-ruins'],['墩台',122,350,76,305,'d-bastion']],
  pagoda:[['塔檐',186,355,239,337,'d-eaves'],['塔身',184,422,88,451,'d-pagoda']],
  cave:[['门窗',270,421,267,492,'d-door'],['辣椒',179,405,112,485,'d-harvest'],['玉米',233,407,203,520,'d-corn'],['崖上树',86,397,29,317,'d-tree']]
 },
 attach(key,scope){
  const A=YL.art,g=A.svg('g',{'data-site-details':key},YL.game.svg);
  for(const [label,x,y,lx,ly,card] of this.sites[key]||[]){
   const w=label.length*12+22,h=25,b=A.svg('g',{'data-detail':card,role:'button',tabindex:0,'aria-label':'了解'+label,class:'site-detail'},g);
   A.svg('path',{d:`M${x} ${y}L${lx+w/2} ${ly+h/2}`,stroke:'#24221E','stroke-width':.75,fill:'none','pointer-events':'none'},b);
   A.svg('circle',{cx:x,cy:y,r:5,fill:'#F4EBDD',stroke:'#24221E','stroke-width':1.2},b);A.svg('circle',{cx:x,cy:y,r:1.6,fill:'#D83A25'},b);
   A.svg('rect',{x:lx,y:ly,width:w,height:h,rx:1,fill:'#F4EBDD',stroke:'#24221E','stroke-width':.8},b);
   const text=A.svg('text',{x:lx+w/2,y:ly+17,'text-anchor':'middle','font-size':12},b);text.textContent=label;
   // Separate 44 px touch targets at label and depicted feature, without covering neighbors.
   A.svg('circle',{cx:x,cy:y,r:20,fill:'transparent'},b);A.svg('rect',{x:lx-3,y:ly-9,width:w+6,height:43,fill:'transparent'},b);
   const open=()=>{if(YL.game.paused||!g.isConnected)return;YL.ui.card(card);};scope.event(b,'click',open);scope.event(b,'keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();open();}});
  }
  scope.cleanup(()=>g.remove());
 }
};
const detailLinks=YL.heritage.links.bind(YL.heritage),wallSource=['陕西省文物局 · 长城保护总体规划','https://wwj.shaanxi.gov.cn/zfxxgk/fdzdgknr/ghxx/202209/P020220929419646405882.pdf'],caveSource=['榆林市委党史研究室 · 陕北窑洞','https://www.yldsyjs.com/article/1210127230149'],towerSource=['辽宁省文旅厅 · 镇北台','https://whly.ln.gov.cn/whly/wlzt/zcgjwhgy/zcjj/2024081912060745138/index.shtml'];
Object.assign(YL.cards,{
 'h-wall':{title:'陕北长城 · 山梁上的边墙',body:'陕北的长城并非一次修成：战国秦、隋、明等不同时期的遗存，分布在府谷、神木、榆阳、横山、靖边、定边、吴起等地。它们穿过黄土丘陵，也经过风沙地带，材料与形制各有差异。许多墙段就地取土、分层夯筑，另有石砌、土石混筑或外包砖石的做法。城墙与敌台、烽火台、关堡相互配合，构成沿线防御体系；关口和邻近城堡，也曾见证边地人群的往来。',more:detailLinks([wallSource,['陕西省政府 · 长城保护名单','https://www.shaanxi.gov.cn/zfxxgk/fdzdgknr/ghxx/gtzygh/202406/P020240622343901996974.pdf']])},
 'h-tongwan':{...YL.cards['h-tongwan'],body:'统万城位于靖边县红墩界镇白城则村，是十六国时期大夏国的都城遗址。偏白的墙体，让它有了“白城子”的俗称。城垣、墩台、马面与瓮城等遗存，仍能帮助人们认识昔日城池的布局与防御。今天所见的残墙经历了漫长岁月的侵蚀，遗址保存着古代城市营建与历史变迁的线索。'},
 'h-pagoda':{...YL.cards['h-pagoda'],body:'延安宝塔又称岭山寺塔，是八角九层的楼阁式砖塔，高约44米，坐落在宝塔区宝塔山上。古塔历经修葺，层层塔檐随塔身向上收拢。中共中央进驻延安后，宝塔山逐渐成为革命圣地延安的标志，古老建筑由此承载了新的时代记忆。'},
 'h-cave':{...YL.cards['h-cave'],body:'延川县文安驿镇梁家河村，窑洞院落保存着知青生活的记忆，也延续着村庄今天的日常。窑洞广泛分布于陕北多地：靠崖窑依着土崖开挖，砖石箍窑则以拱券围合居室。深厚黄土、当地砂石与山坡地形，共同影响着民居的建造。厚实的围护有助于调节室内温度；门窗、院落和晾晒的庄稼，则把生产与起居连在一起。',more:detailLinks([['陕西省政府 · 梁家河村','https://www.shaanxi.gov.cn/xw/sxyw/202404/t20240410_2325627.html'],['中国非遗网 · 窑洞营造技艺','https://www.ihchina.cn/project_details/14688/'],caveSource])},
 'd-enemy':{title:'敌楼 · 守望与防御',body:'敌楼是长城沿线供守军观察、驻守和防御的设施，与墙体共同发挥作用。不要把它与专门传递警报的烽火台混为一谈：长城沿线的楼、台、堡各有用途，形制也随年代与地段而变化。',more:detailLinks([wallSource])},
 'd-crenel':{title:'垛口 · 墙顶的高低',body:'墙顶高低相间的矮墙叫垛墙，间隔的缺口是垛口。守军可借墙垛遮蔽身体，通过缺口观察和防御。陕北现存长城有的包砖较完整，有的只余夯土残墙，不能用一种整齐的墙顶概括所有地段。',more:detailLinks([wallSource])},
 'd-earth':{title:'夯土 · 一层层筑起的墙',body:'夯土不是把泥土堆成一堵墙，而是将土分层铺填、反复夯实。陕北长城许多地段利用当地土料营建，部分墙段外包砖石。岁月使表层剥落后，墙芯与层层夯筑的痕迹也成为认识建造方法的线索。',more:detailLinks([wallSource])},
 'd-tiers':{title:'镇北台 · 四层高台',body:'镇北台立在榆阳区红山上，台体呈方形，共四层，逐层向上收小，总高30余米。高处开阔的视野有利于瞭望；宽厚的基座和层层收分，共同形成它沉稳的体量。',more:detailLinks([towerSource])},
 'd-tower-earth':{title:'台身 · 内夯土，外包砖石',body:'镇北台台体内部夯筑黄土，外部砌筑砖石。看上去整齐的砖面，与内部厚实的土体共同组成高台。它附近还留有款贡城、易马城遗存，记录着边地接待、商洽与互市的历史。',more:detailLinks([towerSource,['榆林市政府 · 镇北台','https://yl.gov.cn/mlyl/zjyl/fjms/202009/t20200928_18048.html']])},
 'd-ruins':{title:'统万城 · 白色残墙',body:'统万城是大夏国都城遗址，当地俗称“白城子”。偏白的夯土墙体与周围沙地相映，是它醒目的特征。今天高低不齐的断面，保存着古城经历风雨侵蚀后的形态。',more:YL.cards['h-tongwan'].more},
 'd-bastion':{title:'城垣与墩台',body:'统万城的城垣并不只是一条直墙。城墙、突出的马面、墩台和城门周围的防御设施，共同组织了古城的防御。遗存的位置与形态，帮助人们辨认城池原有的布局。',more:YL.cards['h-tongwan'].more},
 'd-eaves':{title:'塔檐 · 层层出挑',body:'延安宝塔是一座楼阁式砖塔。每层檐口向外挑出，层与层之间形成清楚的分界；塔身越往上越收小，檐线随之缩短。这样的层次，使古塔在山顶呈现出向上挺立的身姿。',more:YL.cards['h-pagoda'].more},
 'd-pagoda':{title:'八角砖塔 · 延安的标志',body:'延安宝塔平面呈八角，共九层，高约44米。它既是古代砖塔建筑，也成为革命圣地延安广为人知的标志。山与塔相伴的形象，连接着古城历史和近现代记忆。',more:YL.cards['h-pagoda'].more},
 'd-door':{title:'窑门与窗棂',body:'窑洞的拱口内安装木门、木窗，窗棂分出细密的格子。门供出入，窗引入光线，也可通风。陕北传统民居常在窗格糊纸，年节时再贴上红窗花；朴素的门窗，也有细致的花样。',more:detailLinks([caveSource])},
 'd-harvest':{title:'墙上的红辣椒',body:'辣椒串挂在院墙上，既方便晾晒，也便于取用。鲜红的颜色给黄土院落添了喜气，但它首先是家里的食材，是农家把收成收拾、保存起来的日常。',more:detailLinks([caveSource])},
 'd-corn':{title:'院里的黄玉米',body:'收获后的玉米需要晾晒、储存。院里悬挂或堆放的玉米，与墙上的辣椒一道，让居住空间也成为料理农事的地方。这些生活景象见于陕北农家，并非某一个村庄独有。',more:detailLinks([caveSource])},
 'd-tree':{title:'崖上的树 · 林草与水土',body:'窑顶的垴畔和院旁常可见树木，土崖、草木与院落共同组成陕北民居的环境。黄土高原的植被恢复要因地制宜，搭配乔木、灌木与草本；保护水土，也需要照顾当地的水分条件。',more:detailLinks([caveSource,['中科院水保所 · 黄土高原生态水文','https://iswc.cas.cn/xwdt/zhxw_171951/202505/t20250509_7649407.html']])}
});
// Revised siblings keep the original art files available for comparison.
const detailImage=YL.art.image.bind(YL.art);YL.art.image=function(parent,key,box,attrs={}){if(['wall','cave'].includes(key))return this.svg('image',{href:`assets/v7/${key}.webp?v=${YL.route.version}`,x:box.x,y:box.y,width:box.w,height:box.h,preserveAspectRatio:'none',...attrs},parent);return detailImage(parent,key,box,attrs);};
YL.heritage.places[2].after='偏白的残墙仍立在沙地边。城墙的断口与突出的墩台，留下了统万城曾经的尺度。';
YL.heritage.places[3].hint='沿层层檐线起落剪，留出渐收的塔身';
// Keep the directory title on the page paper; remove the extra current-chapter line.
const detailMap=YL.game.map.bind(YL.game);YL.game.map=async function(){await detailMap();const p=YL.$('.map-heading>p:last-child');if(p&&!p.classList.contains('chapter-label'))p.remove();const title=YL.$('[data-chapter="1"] strong');if(title)title.textContent='山河往事';};
YL.heritage.chapter.name='山河往事';
YL.route.background=function(key){const image=YL.$('#fold-scene');image.classList.remove('window-arrive');image.className='scene-art scene-'+key;image.src=`assets/${key==='route-paper'?'v6':'v7'}/${key}.webp?v=${this.version}`;image.alt=key==='route-paper'?'北向上的陕北文化旅程示意':'依据当地实景环境重绘的陕北纸艺插画';};
YL.route.materials.pagoda.target.y=312;
