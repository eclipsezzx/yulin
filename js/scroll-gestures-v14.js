'use strict';
// Camera gestures never scale the individual paper pieces or alter the export.
YL.collage.bindView=function(scope,board,{editable=true}={}){
 const C=this,S=YL.scroll,pointers=new Map();let drag=null,pinch=null,blocked=false;
 const point=(x,y)=>new DOMPoint(x,y).matrixTransform(board.getScreenCTM().inverse());
 const paused=()=>YL.game.paused||document.hidden;
 const capture=id=>{try{board.setPointerCapture(id);}catch{}};
 const release=id=>{try{if(board.hasPointerCapture(id))board.releasePointerCapture(id);}catch{}};
 const pair=()=>[...pointers.values()].slice(0,2);
 const geometry=()=>{const[a,b]=pair();return{x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.hypot(a.x-b.x,a.y-b.y)};};
 const beginPinch=()=>{const q=geometry();pinch={distance:Math.max(1,q.d),zoom:S.zoom,anchor:point(q.x,q.y)};drag=null;blocked=true;};
 scope.event(board,'pointerdown',e=>{
  if(paused()||(e.pointerType==='mouse'&&e.button!==0))return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});capture(e.pointerId);
  if(pointers.size===2){beginPinch();e.preventDefault();return;}
  if(pointers.size>2||blocked){e.preventDefault();return;}
  const q=point(e.clientX,e.clientY),g=editable?e.target.closest('[data-piece]'):null;
  if(g){const p=C.items.find(p=>p.id===+g.dataset.piece);C.selected=p.id;drag={id:e.pointerId,piece:p.id,dx:q.x-p.x,dy:q.y-p.y,sx:e.clientX,sy:e.clientY,changed:false};C.render();}
  else{if(editable){C.selected=null;C.render();}drag={id:e.pointerId,pan:true,sx:e.clientX,sy:e.clientY,view:{...S.view},inverse:board.getScreenCTM().inverse()};}
  e.preventDefault();
 });
 scope.event(board,'pointermove',e=>{
  if(!pointers.has(e.pointerId))return;
  if(paused()){drag=null;pinch=null;blocked=true;return;}
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&pointers.size>=2){const q=geometry();C.zoomAt(board,pinch.zoom*q.d/pinch.distance,q.x,q.y,pinch.anchor);e.preventDefault();return;}
  if(blocked||!drag||drag.id!==e.pointerId)return;
  if(drag.pan){const a=new DOMPoint(drag.sx,drag.sy).matrixTransform(drag.inverse),b=new DOMPoint(e.clientX,e.clientY).matrixTransform(drag.inverse);C.setView({...drag.view,x:drag.view.x+a.x-b.x,y:drag.view.y+a.y-b.y},board);}
  else{if(!drag.changed&&Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)<4)return;const p=C.items.find(p=>p.id===drag.piece),q=point(e.clientX,e.clientY);if(!drag.changed){C.snapshot();drag.changed=true;}p.x=q.x-drag.dx;p.y=q.y-drag.dy;C.clamp(p);C.render();}
  e.preventDefault();
 });
 const end=e=>{if(!pointers.has(e.pointerId))return;if(drag?.changed)C.save();pointers.delete(e.pointerId);release(e.pointerId);drag=null;if(pointers.size<2)pinch=null;if(!pointers.size)blocked=false;};
 scope.event(board,'pointerup',end);scope.event(board,'pointercancel',end);scope.event(board,'lostpointercapture',end);
 scope.event(board,'wheel',e=>{if(paused())return;e.preventDefault();if(pointers.size)return;const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?board.clientHeight:1);C.zoomAt(board,S.zoom*Math.exp(-Math.max(-500,Math.min(500,delta))*.002),e.clientX,e.clientY);},{passive:false});
 scope.cleanup(()=>{pointers.clear();drag=pinch=null;if(editable)C.save();});
};
YL.collage.setView=function(v,board){const S=YL.scroll;S.view={...v,x:Math.max(0,Math.min(this.W-v.w,v.x)),y:Math.max(0,Math.min(this.H-v.h,v.y))};S.zoom=this.W/v.w;this.applyView(board);};
YL.collage.zoomAt=function(board,zoom,clientX,clientY,anchor){
 const v=YL.scroll.view,q=new DOMPoint(clientX,clientY).matrixTransform(board.getScreenCTM().inverse()),fx=(q.x-v.x)/v.w,fy=(q.y-v.y)/v.h;
 const a=anchor||q,z=Math.max(1,Math.min(5,zoom)),w=this.W/z,h=this.H/z;
 this.setView({x:a.x-fx*w,y:a.y-fy*h,w,h},board);
};
