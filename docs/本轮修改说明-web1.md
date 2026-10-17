# 20261017-web1：图片压缩与GitHub发布

用户已明确授权将当前flow1版压缩后上传eclipsezzx/yulin，覆盖此前仅本机预览的范围限制。公开体验入口：https://eclipsezzx.github.io/yulin/?v=20261017-web1 。

发布包图片67张，压缩前9,777,248字节，压缩后7,660,064字节，减少21.7%。整个本机素材库100张WebP由16,111,136降为12,908,434字节；发布包进一步不携带旧版长音频、未使用的生成原图和研究视频，保留兼容底图与当前四个完整带盘素材。不要混用全库数据与发布图片数据。

图片按用途处理：750×1334常规竖屏背景；透明物件通常800像素以内，盛盘720像素以内；终章山河背景保留2000×1125便于局部缩放；纸纹512以内。先按用途缩放，WebP精细编码，质量不足时保留较高质量或原文件；透明度逐像素核对。压缩前文件完整备份在outputs/纸上陕北-flow1-压缩前素材.zip，原生成PNG仍在docs各美术资料目录。比较图work/release16-image-comparison.jpg，详细质量/尺寸/字节报告work/release16-image-report.json。

首页两份本地字体合计38,232字节，原完整两字库769,700字节。书法标题仍是Ma Shan Zheng四字子集。首页宋体使用Google Fonts官方Noto Serif SC精确子集，补齐原Source Han Serif裁字库没有的“乡”；进入章节时恢复原Source Han Serif，以免章节文字排版改变。首页无完整字体、音乐、终章资源的预加载，实测首屏8个资源共约736,687字节（本机服务器未启用传输gzip；线上可按服务器实际压缩计量）。字体来源docs/首页字体子集来源.md及assets/v16/OFL许可。新loading-v16.js仅切换首页字体范围。

js/独立源码、game.bundle.js与build.py均随发布包提供。新版本缓存号20261017-web1，保留既有进度/剪口/自由窗花/画卷存档。构建仍从flow-v15.js取版本；本机主预览4199，发布包验证4198。包位于work/yulin-web1-release，ZIP为outputs/纸上陕北-20261017-web1-GitHub.zip。当前公开包只包含第三/第四章正在使用的各15秒音乐，完整音视频研究材料不发布；两段音乐均保留真实来源；发布前项目所有者已明确确认取得公开使用许可，确认记录见音乐发布授权确认.md，不把署名或本仓库发布当作向他人转授录音版权。

发布包验收：release16-load-qa验证封面本地字体、首页延后加载、67张图全部解码；release16-flow15-food-qa真实剪四菜并归位/保存；release16-layout2-waist-qa验证真实剪鼓/归位/15秒节拍；release16-layout2-prologue-qa验证三折五剪三次展开；release16-layout2-ch1-regression验证五次建筑裁剪归位、洞口与热点；release16-suona13-qa验证15秒《大摆队》与暂停/来源；release16-flow15-scroll-qa验证空画卷、双指/滚轮、草稿与高清PNG；release16-shared-ui14-qa和release16-flow15-motion-qa验证公共文字和入场。均无脚本错误或资源缺失。
