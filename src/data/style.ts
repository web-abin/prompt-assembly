/**
 * 100+ 游戏 UI 设计风格全集 (重新编号版)
 * 1-30 优先排列适合小游戏的风格
 */

export interface GameCategory {
  id: number;
  name: string;
}

export const categoryDict: Record<string, GameCategory> = {
  MINI: { id: 1, name: "小游戏" },
  SINGLE: { id: 2, name: "单机游戏" },
  AAA: { id: 3, name: "3A大作" },
  WEB: { id: 4, name: "网络游戏" },
  ONLINE: { id: 5, name: "联机游戏" }
};

export interface GameStyle {
  id: number;
  name: string;
  example: string;
  features: string;
  img: string;
  type: number[];
}

export const styleList: GameStyle[] = [
  // --- 适合小游戏的风格优先 (ID 1-30) ---
  { "id": 1, "name": "粘土风格", "example": "《粘土世界（Clay Jam）》", "features": "模拟手工捏制，软萌充气感，指纹肌理，亲和力极佳。", "img": "ntfg.png", "type": [1, 2] },
  { "id": 2, "name": "Q版果冻风", "example": "《Cut the Rope》", "features": "高光极亮，半透明Q弹，甜美饱和，极易吸引点击。", "img": "qbgdf.png", "type": [1, 4] },
  { "id": 4, "name": "极简主义", "example": "《纪念碑谷》", "features": "极高留白，几何抽象，低饱和色块，无描边，等轴测构图。", "img": "jjzy.png", "type": [1, 2] },
  { "id": 5, "name": "扁平化 2.0", "example": "《Two Dots》", "features": "明亮纯色，微弱柔和投影，矢量插画感，圆角矩形，活泼易读。", "img": "bph2.0.png", "type": [1, 4] },
  { "id": 6, "name": "酸性设计", "example": "《斯普拉遁 3》", "features": "镭射质感，高对比金属色，液态流体，失真字体，前卫叛逆。", "img": "sxsj.png", "type": [1, 5] },
  { "id": 7, "name": "卡纸拼贴", "example": "《纸片马里奥：折纸国王》", "features": "多层纸张剪裁叠加，边缘投影物理深度，手工制作感，温馨童趣。", "img": "kzpt.png", "type": [1, 2] },
  { "id": 8, "name": "涂鸦风", "example": "《Jet Set Radio》", "features": "手绘草稿感，不规则边缘，随意线条，亲和力极强。", "img": "tyf.png", "type": [1] },
  { "id": 9, "name": "粉蜡笔色系", "example": "《集合啦！动物森友会》", "features": "治愈系，低饱和马卡龙色，柔和漫反射光，温馨无压力感。", "img": "flbsx.png", "type": [1, 2, 5] },
  { "id": 10, "name": "8-Bit 像素", "example": "《超级马里奥兄弟》", "features": "极低分辨率，硬边轮廓，16色调色盘，经典FC时代感。", "img": "8-Bitxs.png", "type": [1, 2] },
  { "id": 11, "name": "赛博朋克", "example": "《赛博朋克 2077》", "features": "霓虹蓝紫，故障艺术，电子元件细节，暗黑背景强对比。", "img": "sbpk.png", "type": [1, 2, 3] },
  { "id": 12, "name": "故障艺术", "example": "《地铁：离去》", "features": "画面撕裂，色偏，数字信号中断感，前卫且不安。", "img": "gzys.png", "type": [1, 2] },
  { "id": 13, "name": "怀旧牛皮纸", "example": "《饥荒》", "features": "羊皮纸纹理，手绘线条，泛黄做旧，生存解谜感。", "img": "hjnpz.png", "type": [1, 2, 5] },
  { "id": 14, "name": "水墨画风", "example": "《绘真·妙笔千山》", "features": "墨迹渲染，留白艺术，飞白笔触，中式意境。", "img": "smhf.png", "type": [1, 2, 4] },
  { "id": 15, "name": "剪纸风格", "example": "《永夜降临：复苏》", "features": "典型红白对比，民俗图案，平面层级感，独特文化感。", "img": "jzfg.png", "type": [1, 2] },
  { "id": 16, "name": "科幻全息", "example": "《光环：无限》", "features": "蓝光半透明叠加，扫描线，流光轨迹，未来信息屏。", "img": "khqx.png", "type": [1, 3, 5] },
  { "id": 17, "name": "软糖风格", "example": "《糖豆人》", "features": "半透明软糯感，鲜艳配色，弹性十足的视觉效果。", "img": "rtfg.png", "type": [1, 5] },
  { "id": 18, "name": "低多边形", "example": "《风之旅人》", "features": "明显三角面构成，硬朗切割感，现代艺术感。", "img": "ddbx.png", "type": [1, 2, 4] },
  { "id": 19, "name": "折纸风格", "example": "《纸片小邮差》", "features": "折痕明暗对比，三角折面逻辑，轻盈纸感。", "img": "zzfg.png", "type": [1, 2] },
  { "id": 20, "name": "二次元平涂", "example": "《原神》", "features": "干净勾线，块状阴影，日漫标准配色，高易读性。", "img": "ecypt.png", "type": [1, 4, 5] },
  { "id": 21, "name": "北欧风", "example": "《Alto's Odyssey》", "features": "冰冷干净，功能主义，冷色调，极简自然美。", "img": "bef.png", "type": [1, 2] },
  { "id": 22, "name": "美式卡通", "example": "《茶杯头》", "features": "夸张比例，流线型设计，明艳快节奏视觉。", "img": "mskt.png", "type": [1, 4, 5] },
  { "id": 23, "name": "荒诞搞怪", "example": "《Untitled Goose Game》", "features": "扭曲形状，滑稽表情，不规则色彩，幽默感。", "img": "hdgg.png", "type": [1, 2, 5] },
  { "id": 24, "name": "魔法书风格", "example": "《哈利波特：魔法觉醒》", "features": "符文封印，羊皮纸卷轴，神秘金边，古老咒语感。", "img": "mfsfg.png", "type": [1, 4, 5] },
  { "id": 25, "name": "农场牧场", "example": "《星露谷物语》", "features": "栅栏奶牛纹，草地绿，温暖阳光，田园牧歌感。", "img": "ncmc.png", "type": [1, 4] },
  { "id": 26, "name": "电子竞技", "example": "《英雄联盟》", "features": "侵略性斜线，金属拉丝，荧光强调色，极速竞技感。", "img": "dzjj.png", "type": [1, 5] },
  { "id": 27, "name": "治愈系插画", "example": "《光·遇》", "features": "温暖手绘，模糊边缘，柔光滤镜，情感共鸣感。", "img": "zyxch.png", "type": [1, 2, 5] },
  { "id": 28, "name": "微缩景观风", "example": "《Tiny Room Stories》", "features": "移轴摄影视效，模型质感 UI，强烈的景深效果。", "img": "wxjgf.png", "type": [1, 2] },
  { "id": 29, "name": "黑金奢华感", "example": "《FIFA 系列》", "features": "深哑光黑底，哑金线条，大理石纹路。商务且高级。", "img": "hjshg.png", "type": [1, 4] },
  { "id": 30, "name": "动态贴纸风", "example": "《My Little Universe》", "features": "白边贴纸感，动态摇晃动效，拼贴画构图。", "img": "dttzf.png", "type": [1, 2] },

  // --- 其他风格 (ID 31-104) ---
  { id: 31, name: "Material Design", example: "《1010!》", features: "物理堆叠感，卡片式布局，规则阴影，简洁规范。", img: "md.png", type: [1, 4] },
  { id: 32, name: "孟菲斯风格", example: "《Sayonara Wild Hearts》", features: "撞色设计，黑色波点，不规则几何堆叠，高对比度。", img: "mfsfg.png", type: [1, 2] },
  { id: 33, name: "瑞士设计风", example: "《7 Days TD》", features: "严谨网格系统，无衬线字体，极简功能主义。", img: "rssjf.png", type: [1, 2] },
  { id: 34, name: "包豪斯风", example: "《KAMI 2》", features: "红黄蓝三原色，基础几何体，工业美学。", img: "bhsf.png", type: [1, 2] },
  { id: 35, name: "波普艺术", example: "《Persona 5》", features: "强烈的轮廓线，高饱和度色彩，视觉冲击力极强。", img: "bpys.png", type: [2, 3] },
  { id: 36, name: "粗野主义", example: "《Hypnospace Outlaw》", features: "未经修饰的原始感，反设计美学，硬核且前卫。", img: "cyzy.png", type: [2] },
  { id: 37, name: "新态拟物", example: "《Shadowmatic》", features: "通过软阴影模拟物体凸起或凹陷，极简优雅。", img: "xtnw.png", type: [1, 2] },
  { id: 38, name: "玻璃拟态", example: "《LOL客户端》", features: "毛玻璃半透明，高斯虚化，悬浮层级，现代感。", img: "blnt.png", type: [4, 5] },
  { id: 39, name: "极光渐变", example: "《Alto's Odyssey》", features: "柔和流动多色渐变，弥散光感，梦幻治愈视觉。", img: "jgjb.png", type: [1, 2] },
  { id: 40, name: "线框艺术", example: "《Superhot》", features: "纯线条勾勒，极简科技感，几何透视，精密严谨。", img: "xkys.png", type: [2] },
  { id: 41, name: "波普圆点", example: "《Pac-Man 256》", features: "经典波点装饰，复古甜美风。", img: "bpyd.png", type: [1] },
  { id: 42, name: "剪贴报风", example: "《极乐迪斯科》", "features": "照片与报纸纹理拼贴，撕裂边缘，文艺且深沉。", "img": "jtbf.png", "type": [2] },
  { id: 43, name: "单色设计", example: "《Limbo》", features: "单一色相明度变化，极简叙事，氛围感极强。", img: "dssj.png", type: [2] },
  { id: 44, name: "全文本 UI", example: "《A Dark Room》", features: "几乎无图形，依靠文字传达，文学感，专注内容。", img: "qwbui.png", type: [1, 2] },
  { id: 45, name: "几何抽象", example: "《Super Hexagon》", features: "完全几何化，动态缩放，强节奏感，纯粹形式美。", img: "jhcx.png", type: [1] },
  { id: 46, name: "复古海报风", example: "《生化奇兵》", features: "50-60年代质感，做旧纸张，复古印刷色。", img: "fghbf.png", type: [2, 3] },
  { id: 47, name: "未来主义", example: "《Wipeout》", features: "大量斜线，动感布局，非对称平衡，极速流动感。", img: "wlzyn.png", type: [2, 3] },
  { id: 48, name: "柔和渐变", example: "《Sky光·遇》", features: "邻近色平滑过渡，视觉流畅，现代舒适。", img: "rhjb.png", type: [1, 5] },
  { id: 49, name: "暗黑模式", example: "《暗黑破坏神4》", features: "深色基调，高对比色彩强调，沉浸感。", img: "ahms.png", type: [5] },
  { id: 50, name: "16-Bit 像素", example: "《星露谷物语》", features: "丰富色彩层次，细腻像素笔触，精致怀旧。", img: "16-Bitxs.png", type: [2, 5] },
  { id: 51, name: "等距像素", example: "《Factorio》", features: "45度斜角透视，块状堆叠，整齐有序。", img: "djxs.png", type: [1, 4] },
  { id: 52, name: "GameBoy 绿质感", example: "《宝可梦初代》", features: "限定四种绿色色阶，复古单色屏幕感。", img: "gbjzg.png", type: [1, 2] },
  { id: 53, name: "街机风格", example: "《街头霸王2》", features: "霓虹闪烁，黑底高亮，快节奏视觉符号。", img: "jjfg.png", type: [1] },
  { id: 54, name: "CRT 模拟风", example: "《Blazing Chrome》", features: "扫描线，屏幕畸变，噪点滤镜，老式显像管视觉。", img: "crtmnf.png", type: [2] },
  { id: 55, name: "蒸汽波", example: "《VA-11 Hall-A》", features: "粉紫夕阳，石膏像，梦幻忧郁，90年代电子感。", img: "zqw.png", type: [1, 2] },
  { id: 56, name: "黑胶唱片风", example: "《Sayonara Wild Hearts》", features: "模拟胶片机、唱片封套质感，复古印刷质感。", img: "hjcpf.png", type: [1, 2] },
  { id: 57, name: "维多利亚风", example: "《羞辱》", features: "华丽花边，衬线体，古典贵族气息。", img: "wdlyf.png", type: [2, 3] },
  { id: 58, name: "哥特风格", example: "《恶魔城》", features: "黑暗，尖锐，神秘，冷峻庄严。", img: "gtfg.png", type: [2] },
  { id: 59, name: "洛可可风", example: "《三位一体2》", features: "极尽繁琐，金边卷草纹，曲线优美，极度华丽。", img: "lkkf.png", type: [2, 3] },
  { id: 60, name: "古典油画风", example: "《贪婪之秋》", features: "模拟布面油画，可见笔触，厚重深沉。", img: "gdyhf.png", type: [2, 4] },
  { id: 61, name: "蓝图设计", example: "《传送门2》", features: "蓝底白线，工程制图感，精密逻辑。", img: "ltsj.png", type: [1, 2] },
  { id: 62, name: "老式电脑 UI", example: "《Replica》", features: "模拟 Win95 灰阶质感，经典窗口，怀旧办公风。", img: "lsdnui.png", type: [1, 2] },
 { "id": 63, "name": "磁带未来主义", "example": "《异形：隔离》", "features": "70年代设想的未来，笨重按键，模拟信号感。", "img": "cdwlzyn.png", "type": [2, 3] },
{ "id": 64, "name": "美式漫画", "example": "《无主之地3》", "features": "粗黑描边，网点阴影，动态感十足。", "img": "msmh.png", "type": [2, 3] },
{ "id": 65, "name": "胶片摄影风", "example": "《奇异人生》", "features": "颗粒感，漏光效果，电影叙事感。", "img": "jpsyf.png", "type": [2] },
{ "id": 66, "name": "浮世绘风", "example": "《大神》", "features": "传统日本木版画色调，独特造型，装饰性极强。", "img": "fshf.png", "type": [2] },
{ "id": 67, "name": "敦煌壁画风", "example": "《遇见飞天UI》", "features": "土红石绿配色，线条圆润，庄重历史感。", "img": "dhbhf.png", "type": [1, 4] },
{ "id": 68, "name": "皮影戏风格", "example": "《炎黄战纪》", "features": "半透明质感，关节拼接感，逆光侧影视觉。", "img": "pyxfg.png", "type": [1, 2] },
{ "id": 69, "name": "写实拟物", "example": "《割绳子》", "features": "完美还原皮革、金属、玻璃物理属性，极尽真实。", "img": "xsnw.png", "type": [1] },
{ "id": 70, "name": "磨砂金属", "example": "《坦克世界》", "features": "拉丝纹理，工业感，硬核冷峻。", "img": "msjs.png", "type": [3, 4, 5] },
{ "id": 71, "name": "木质纹理", "example": "《欢乐斗地主》", "features": "温馨自然，棋牌桌游经典配置。", "img": "mzwl.png", "type": [1, 4, 5] },
{ "id": 72, "name": "石刻风格", "example": "《暗黑破坏神3》", "features": "沉重沧桑，裂纹细节，中世纪幻想风。", "img": "skfg.png", "type": [2, 3, 5] },
{ "id": 73, "name": "布艺风格", "example": "《小小大星球》", "features": "毛毡或棉布缝纫，针脚细节，温暖手工质感。", "img": "byfg.png", "type": [2, 3] },
{ "id": 74, "name": "冰雪质感", "example": "《冰汽时代》", "features": "透明冰裂纹，霜冻效果，极致寒冷氛围。", "img": "bxzg.png", "type": [2, 3] },
{ "id": 75, "name": "岩浆流体", "example": "《熔火之心副本》", "features": "高温发光，流体动效，火红暗金，压迫感十足。", "img": "yjlt.png", "type": [4, 5] },
{ "id": 76, "name": "蒸汽动力", "example": "《机械迷城》", "features": "黄铜齿轮，铜管压力表，复古科幻。", "img": "zqdl.png", "type": [2] },
{ "id": 77, "name": "生物质感", "example": "《蔑视》", "features": "模拟肌肉组织，细胞结构，粘稠有机感。", "img": "swzg.png", "type": [2, 3] },
{ "id": 78, "name": "宝石结晶", "example": "《宝石迷阵》", "features": "多棱角折射，通透发光，华丽感。", "img": "bsjj.png", "type": [1] },
{ "id": 79, "name": "霓虹灯管", "example": "《Stray》", "features": "发光管造型，夜晚氛围，都市气息。", "img": "nhdg.png", "type": [2, 3] },
{ "id": 80, "name": "黑板粉笔", "example": "《Baldis Basics》", "features": "黑板肌理，粉笔飞白笔触，校园怀旧风。", "img": "hbfb.png", "type": [1, 2] },
{ "id": 81, "name": "陶瓷质感", "example": "《绘真·妙笔千山》", "features": "光滑细腻釉面，青花纹样，东方温润感。", "img": "tczg.png", "type": [1, 2] },
{ "id": 82, "name": "青铜器风格", "example": "《轩辕剑柒》", "features": "斑驳绿锈，古拙厚重，神话感。", "img": "qtqfg.png", "type": [2, 3] },
{ "id": 83, "name": "乐高/积木", "example": "《LEGO Star Wars》", "features": "明显拼装颗粒感，塑料高光。", "img": "lgjm.png", "type": [2, 3, 5] },
{ "id": 84, "name": "气球风格", "example": "《任天堂气球大战》", "features": "充气膨胀感，高反射塑料质感。", "img": "qqfg.png", "type": [1, 2] },
{ "id": 85, "name": "液体金属", "example": "《星际战甲》", "features": "汞质流体感，极高反射，动态变幻感。", "img": "ytjs.png", "type": [3, 5] },
{ "id": 86, "name": "编织风格", "example": "《Unravel》", "features": "草编或绳结肌理，交叉重叠感。", "img": "bzfg.png", "type": [2, 3] },
  { id: 87, name: "毛绒风格", example: "《耀西的毛绒世界》", features: "模拟动物皮毛，视觉柔软舒适。", img: "mrfg.png", type: [2, 3] },
  { id: 88, name: "日系小清新", example: "《旅行青蛙》", features: "明亮高调，空气感，低对比色，简洁治愈。", img: "rjxqx.png", type: [1, 2] },
  { id: 89, name: "厚涂重彩", example: "《战神4》", features: "油画笔触，史诗感，画面庄重。", img: "htzc.png", type: [4, 5] },
  { id: 90, name: "赛璐璐风", example: "《龙珠战士Z》", features: "明确二分阴影边界，还原手绘动画感。", img: "sllf.png", type: [2, 3, 5] },
  { id: 91, name: "和风 (Wafuu)", example: "《阴阳师》", features: "樱花折扇，传统纹样，典雅华丽。", img: "hfwf.png", type: [4, 5] },
  { id: 92, name: "克苏鲁风格", example: "《暗黑地牢》", features: "触手墨绿，粘稠质感，诡谲神秘。", img: "kslfg.png", type: [2] },
  { id: 93, name: "废土风格", example: "《疯狂的麦克斯》", features: "铁锈破损，资源匮乏的工业废料感。", img: "ftfg.png", type: [1, 2, 4] },
  { id: 94, name: "太空歌剧", example: "《质量效应2》", features: "宏大星系背景，流线飞船UI。", img: "tkgy.png", type: [3, 4, 5] },
  { id: 95, name: "丛林探险", example: "《神秘海域2》", features: "藤蔓树叶，木牌指示，自然原始质感。", img: "zltx.png", type: [1] },
  { id: 96, name: "海洋水族", example: "《深海迷航》", features: "气泡波光，清透深蓝，流动感。", img: "hyxz.png", type: [2, 3, 5] },
  { id: 97, name: "糖果屋风格", example: "《Cookie Run: Kingdom》", features: "甜甜圈棒棒糖元素，童话气息。", img: "tgwfg.png", type: [1] },
  { id: 98, name: "玩具工厂", example: "《双人成行》", features: "螺丝传送带，亮色工业塑料。", img: "wjgc.png", type: [2, 5] },
  { id: 99, name: "侦探解谜", example: "《黑色洛城》", features: "百叶窗阴影，黑白对比，悬疑氛围。", img: "ztjm.png", type: [2, 3] },
  { id: 100, name: "恐怖惊悚", example: "《寂静岭2》", features: "血迹斑驳，忽明忽暗，压迫不安感。", img: "kbjs.png", type: [2, 3] },
 { "id": 101, "name": "圣诞主题", "example": "《守望先锋冬季UI》", "features": "红绿金配色，铃铛，温馨节日视觉。", "img": "sdzt.png", "type": [5] },
  { id: 102, name: "波西米亚", example: "《Tchia》", features: "流苏几何图腾，自由浪漫不羁感。", img: "bxmy.png", type: [2] },
  { id: 103, name: "硬核军事", example: "《逃离塔科夫》", features: "迷彩数值，夜视仪色调，精密网格。", img: "hljs.png", type: [3, 5] },
  { id: 104, name: "AI 幻觉风", example: "《Control》", features: "多重质感融合，流动变形，不可名状之美。", img: "aihjf.png", type: [2, 3] }
];