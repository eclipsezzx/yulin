# 本轮修改说明：20261021-audio1

## 第四章音乐

按用户最新选择，替换《大摆队》录音为明确标注 CC BY 4.0 的唢呐音色示例。

- 原文件：beijing-opera-7.wav；录音发布者：xserra；平台：Freesound。
- [原始文件页](https://freesound.org/people/xserra/sounds/162035/)；[许可 CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。
- 作者说明中包含唢呐和打击乐，原始录音地点为北京；不把它标为陕北实录、绥米唢呐曲牌或《大摆队》。此选择依据用户放宽地域与曲牌要求的明确指示。
- 取公开高质量 MP3 试听文件的前15秒，做响度调整、0.025秒淡入/0.18秒淡出，转32kHz单声道48kb/s AAC。原始页面留存于本机研究目录；下载地址 https://cdn.freesound.org/previews/162/162035_43-hq.mp3 。
- 播放页只呈现“音色示例 · xserra / Freesound · CC BY 4.0”，点击后为简短文件名、署名、15秒节选与剪辑说明，下方两条直接链接；删去旧曲牌的录音介绍。聆听后的旁白不再把刚播放的示例说成陕北录音。
- 移除新运行包和完整源文件包里的旧 assets/v13/suona-dabaidui-25-40.m4a；本机研究备份与历史制作说明保留，不改写制作历史。
- 来源页许可指向 CC BY 4.0，无需为该开放许可用途另行向发布者逐次申请。具体许可范围以原文件页和许可条款为准；不声称录音进入公共领域。

## 点击鼓声

安塞腰鼓随乐击鼓增加左右两种略有音高区别的短鼓声，由程序生成鼓膜共振和鼓槌瞬态，不下载第三方鼓声。手动点按或键盘均触发，未合拍也有声音反馈；原21起音判定与15秒录音保持。自动观看不添加鼓声，避免与实录重复。跟随音效开关；暂停、隐藏、退出与结束清理声音，连点限流避免叠响。

## 工程

修改 ansai-rhythm-v8.js、serving-v13.js、collection-v21.js、flow-v15.js，重建 game.bundle.js。素材、字体和存档 revision 沿用 collection2，不重剪、不清档。新增文件 assets/v24/suona-example-15s.m4a 和 ATTRIBUTION.txt。

当前链接：https://eclipsezzx.github.io/yulin/?v=20261021-audio1
