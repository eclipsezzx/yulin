'use strict';
// Keep the existing corridor and saved personal edge; only choose traversal order.
YL.cutDirection={
 choose(points,p,lookAhead){
  const start=points[0];if(Math.hypot(p.x-start.x,p.y-start.y)<3)return 0;
  const last=points.length-1;let forward=Infinity,reverse=Infinity;
  for(let i=1;i<=Math.min(lookAhead,last);i++){
   forward=Math.min(forward,Math.hypot(p.x-points[i].x,p.y-points[i].y));
   reverse=Math.min(reverse,Math.hypot(p.x-points[last-i].x,p.y-points[last-i].y));
  }
  return reverse<forward?-1:1;
 }
};
