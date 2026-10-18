'use strict';
// The dishes use the same elevated table camera; back row is smaller than front.
YL.serving.version='20261017-perspective1';
YL.serving.asset=function(key){return `assets/v14/${key}.webp?v=20261018-web3`;};
YL.serving.plans=[{x:111,base:412,w:112},{x:264,base:412,w:112},{x:102,base:500,w:136},{x:274,base:500,w:136}];
YL.food.version=YL.serving.version;YL.table.version=YL.food.version;
