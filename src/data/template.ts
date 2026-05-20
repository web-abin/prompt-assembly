export const data = [
  // ============ 出图框架（通用公式） ============
  {
    free: true,
    title: '万能出图公式（可填版）',
    content: `请根据以下占位符组合生成高质量图片提示词：

主体内容：人物[职业]、[年龄]、[外貌特征]；动物[物种]、[毛色]、[体型]；物品[类别]、[材质]、[风格]；情绪[情绪关键词]。

场景设定：空间[室内/室外/幻想]；时间[时间段]；天气[天气类型]；环境[周围氛围/元素]。

风格：艺术风格[艺术流派/绘画技法]；电影风格[影片/镜头语言]；其他风格[品牌/设计体系]。

色彩/色调：主色系[主色系]；光线效果[侧光/背光/轮廓光]；色彩关系[高饱和/低饱和/互补/和谐]。

构图视角：镜头角度[仰视/平视/俯视]；景别[特写/中景/远景]；构图要点[三分法/对称/引导线/黄金分割]；特效镜头[景深/广角/鱼眼]。

图片细节：画质参数[分辨率/清晰度]；材质质感[金属/冷光/皮肤质感]；画面尺寸[比例，例如 16:9/9:16/4:3]。

请将以上占位符替换为具体内容并组合为一段完整提示词。`,
    contentEn: `Build a high-quality image prompt by combining the placeholders below:

Subject: Person [Profession], [Age], [Appearance]; Animal [Species], [Coat color], [Build]; Object [Category], [Material], [Style]; Mood [Mood keyword].

Scene: Space [Indoor/Outdoor/Fantasy]; Time [Time of day]; Weather [Weather type]; Environment [Ambience / surrounding elements].

Style: Art style [Art movement / technique]; Cinematic style [Film / camera language]; Other style [Brand / design system].

Color / tone: Main palette [Main palette]; Lighting [Side / back / rim light]; Color relationship [High-sat / low-sat / complementary / harmonious].

Composition: Camera angle [Low / eye-level / high]; Shot size [Close-up / medium / long]; Composition rule [Rule of thirds / symmetry / leading lines / golden ratio]; Special lens [Depth of field / wide-angle / fisheye].

Image detail: Quality [Resolution / sharpness]; Material feel [Metal / cold-light / skin]; Frame size [Aspect ratio, e.g. 16:9 / 9:16 / 4:3].

Replace every placeholder with concrete content and merge into a single coherent prompt.`
  },
  {
    title: 'AI 直出设计图',
    content: `高保真游戏 UI 设计，页面：[页面]，一款[游戏类型/描述]的游戏。核心规范（严格遵守）：

纯净布局：这是一份纯视觉与布局模板。严禁生成任何真实的文字、标题或描述性标签。所有文本区域必须使用通用的占位横线、灰色条块或简约几何图标替代。

风格定义：[在此处填入风格介绍]。

参考元素：[如有参考图，请描述其核心视觉特征，例如：配色方案/构图方式]。

渲染参数：高分辨率、专业 UI 设计、Figma 渲染风格、Dribbble 趋势感、高精细度。高质量，UI设计，专业游戏界面，高分辨率，未加工，4k --ar [比例，例如 9:16]

负面约束：--no realistic text, captions, labels, words, characters, hallucinated functions, phone model, system status bar, battery icon, time icon. (无真实文字，无标签，无臆造功能，无手机模型，无系统状态栏，无电池图标，无时间图标)`,
    contentEn: `High-fidelity game UI design. Page: [Page]. A [Game Type/Description] game. Core rules (strictly follow):

Clean layout: This is a pure visual & layout template. Do NOT generate any real text, titles, or descriptive labels. All text areas must be replaced with generic placeholder lines, gray bars, or minimal geometric icons.

Style definition: [Describe the style here].

Reference elements: [If a reference image is provided, describe its key visual traits, e.g. color palette / composition].

Render parameters: high resolution, professional UI design, Figma render style, Dribbble trending, highly detailed. High quality, UI design, professional game interface, high resolution, unprocessed, 4k --ar [Aspect ratio, e.g. 9:16]

Negative constraints: --no realistic text, captions, labels, words, characters, hallucinated functions, phone model, system status bar, battery icon, time icon.`
  },
  {
    title: '指定风格，生成设计图',
    content: `一个高精度的游戏 UI [页面类型] 界面设计，主题为[游戏名字]的页面，界面风格必须严格保持与参考图（Image 0）一致。

核心视觉风格与 DNA 复刻（严格遵循 Image 0）：
必须完全复刻参考图中的[参考图内容]以及[风格描述]中提到的视觉特征，包括配色、纹理、图标风格、字体和整体氛围。

[页面类型]布局与内容（从上到下）：
[页面布局]（在此处描述页面的具体元素，如：顶部栏、主要内容区域、底部导航栏等，并说明每个区域包含的游戏内容）

高质量，UI设计，专业游戏界面，高分辨率，未加工，4k --ar [长宽比]`
  },
  {
    free: true,
    title: '根据参考图生成其他页面的设计图 v2.0',
    content: `一个高精度的游戏 UI [页面]（Main Menu）界面设计，主题为[填写游戏名字，例如：水豚连连看]的首页，界面风格必须严格保持与参考图（Image 0）一致。

1. 核心视觉风格与 DNA 复刻（严格遵循 Image 0）：
必须完全复刻参考图中的[参考图内容]

2. [页面]布局与内容（从上到下）：
[页面布局]

高质量，UI设计，专业游戏界面，高分辨率，未加工，4k --ar 9:16`,
    contentEn: `A high-fidelity game UI [Page] (Main Menu) design for [Game Name, e.g. Capybara Match-Match]. The visual style MUST strictly match the reference image (Image 0).

1. Core visual style & DNA replication (strictly follow Image 0):
Fully replicate from the reference: [Reference Content]

2. [Page] layout & content (top to bottom):
[Page Layout]

High quality, UI design, professional game interface, high resolution, unprocessed, 4k --ar 9:16`
  },
  {
    free: true,
    title: '根据参考图生成其他页面的设计图 v3.0',
    content: `# 角色
你是一名资深手游 UI 设计师 / 美术总监，擅长复刻参考图的视觉 DNA 并将它扩展到新页面，绝不让风格漂移。

# 任务
基于我提供的参考图（Image 0，必看），为 [游戏品类，例如 休闲消除 / 卡牌 / 放置 / 模拟经营] 游戏的「[页面名称，例如 商店 / 排行榜 / 每日挑战 / 角色养成 / 结算]」页面生成一张高保真 UI 设计图，整体风格必须与参考图 100% 同源——像同一位画师在同一张纸上画出来的。

# 一、视觉 DNA 复刻（严格遵循 Image 0，按维度逐项匹配）

- 画风定位：[风格关键词，例如 Q 版治愈休闲游戏 UI 轻手绘 / 像素复古 / 写实 3D 渲染 / 拟物玻璃质感]
- 主色：[主色，例如 高饱和暖色调：天空蓝 + 草地黄绿 + 暖橙]；点缀色：[点缀色]；强调色：[强调色]，与参考图饱和度一致
- 描边：[描边规格，例如 圆润粗黑描边 4-5px，带轻微手绘抖动；圆角帽；无锐角] / 或 [无描边扁平]
- 质感：[笔触关键词，例如 彩铅 + 水彩 + 纸面颗粒 / 矢量扁平 / 玻璃拟物 / 像素硬边]
- 字体：[字体关键词，例如 圆润粗体手写体，带深棕描边 + 柔和投影；标题厚实 Q 版，正文圆润可读]
- IP / 角色：[IP 描述，必须复刻参考图角色的比例、神态、配色与配饰]
- 整体氛围：[氛围关键词，例如 温暖治愈 / 紧张刺激 / 神秘高级 / 童趣绘本]

# 二、页面骨架（自上而下分区，按需删减/扩展，百分比对齐 9-slice）

【顶部状态栏 0–[X]%】
[内容描述，例如 左侧返回按钮 + 右侧金币 / 体力胶囊；或顶部 Tab 切换 + 关卡进度条]

【主标题 / 导航区 [X]–[Y]%】
[内容描述，例如 居中页面标题文字（与参考图同款字体），下方副标小字；或装饰飘带 + 标题文字］

【核心展示区 [Y]–[Z]%（最重要，描述要最详细）】
[内容描述，例如 N×M 网格 / 横向滑动卡片列；每张卡的：尺寸、形状、底色、描边、内含元素（图标 / 名称 / 价格 / 星级 / 倒计时）、信息层级、间距]

【操作区 / CTA [Z]–[W]%】
[内容描述，例如 主按钮文案 + 样式 + 摆放（橙色厚描边 + 高光 + 投影）；次按钮；价格标签；倒计时；徽章]

【底部导航 / 装饰 [W]–100%】
[内容描述，例如 全局 Tab Bar：商店 / 主题 / 主界面 / 排行榜；或底部装饰条；或 IP 角色站立位]

# 三、关键约束（必须严格遵守）

- 严格保持与参考图一致的：描边粗细、配色饱和度、角色比例、字体风格、装饰元素调性，绝不漂移
- 安全区：顶部预留 [像素或比例，例如 90px 或 7%] 给 [系统胶囊 / 状态栏 / 微信胶囊]；底部预留 [像素或比例，例如 80px 或 6%] 给手势安全区
- 文本规则（二选一）：
  - 中文文字必须清晰、笔画完整、可读，不出现错字 / 漏字 / 乱码（推荐豆包 / 即梦 / 文心一格）
  - 或：所有文本区域必须用通用占位横线、灰色条块或简约几何图标替代，严禁生成真实文字（推荐 MJ / DALL·E）
- 禁止清单：不要真实手机外框 / 系统状态栏 / 电量电池图标 / 时间 / 任何水印或 Logo / 其他 IP 形象；不要在指定的"干净区域"放任何具体物体
- 比例：竖版 [比例，例如 9:16 / 3:4] / 横版 [比例，例如 16:9 / 4:1]

# 四、输出规格

高质量，专业游戏 UI 设计，Figma 渲染风格，Dribbble 趋势感，高分辨率，未加工，4k --ar [比例]

[可选垫图工作流] 双图参考：图 0 = 参考图（锁风格 DNA）+ 图 1 = 内容草图 / 线稿（锁布局）。MJ 用户在末尾加 --iw 1.5 ~ 2.0 加重风格图权重；豆包 / 即梦用户在 prompt 开头加一句"请以提供的参考图为风格参考，保持描边粗细、配色饱和度与角色比例完全一致"。`,
    contentEn: `# Role
You are a senior mobile-game UI designer / art director. Your specialty is replicating a reference image's visual DNA and extending it to new pages without any style drift.

# Task
Based on the reference image I provide (Image 0, MANDATORY), design a high-fidelity UI for the "[Page Name, e.g. Shop / Leaderboard / Daily Challenge / Character / Result]" page of a [Game Category, e.g. casual match / card / idle / sim] game. The visual style MUST be 100% consistent with the reference — as if drawn by the same illustrator on the same sheet of paper.

# 1. Visual DNA Replication (strictly follow Image 0, match each dimension)

- Art style: [Style keywords, e.g. Q-version chibi cartoon casual-game UI / pixel retro / realistic 3D render / glass skeuomorphism]
- Palette: main [Main color], accent [Accent color], emphasis [Emphasis color] — saturation matched to the reference
- Outlines: [Outline spec, e.g. bold rounded black outlines 4-5px with slight hand-drawn wobble, round caps, no sharp angles] / or [No outline, flat]
- Texture: [Texture keywords, e.g. colored-pencil + watercolor + paper grain / flat vector / glass skeuomorphism / pixel hard-edge]
- Typography: [Type keywords, e.g. rounded bold hand-written font with dark-brown outline + soft shadow; chunky chibi title, rounded readable body]
- IP / Character: [IP description, must replicate the reference character's proportion, expression, palette and accessories]
- Mood: [Mood keywords, e.g. cozy healing / tense / mysterious premium / childlike storybook]

# 2. Page Skeleton (top to bottom, expand/trim as needed; percentages aligned with 9-slice)

[Top status bar 0–[X]%]
[Content, e.g. back button on the left + coin/stamina capsule on the right; or top Tab switch + level progress bar]

[Title / nav zone [X]–[Y]%]
[Content, e.g. centered page title in the same font as the reference, subtitle below; or decorative ribbon + title]

[Main showcase zone [Y]–[Z]% (MOST IMPORTANT — describe in the most detail)]
[Content, e.g. N×M grid / horizontally scrolling card row; per-card spec: size, shape, fill, outline, contained elements (icon / name / price / star rating / countdown), info hierarchy, gutter]

[Action / CTA zone [Z]–[W]%]
[Content, e.g. primary button text + style + placement (orange with thick outline, highlight, drop shadow); secondary button; price tag; countdown; badge]

[Bottom nav / decoration [W]–100%]
[Content, e.g. global Tab Bar: Shop / Theme / Home / Leaderboard; or bottom decorative strip; or IP character standing spot]

# 3. Key Constraints (must strictly follow)

- Match the reference exactly on: outline weight, palette saturation, character proportion, font style, decoration tone — zero drift
- Safe areas: reserve [Pixels or %, e.g. 90px or 7%] on top for [System capsule / status bar / WeChat capsule]; reserve [Pixels or %, e.g. 80px or 6%] on the bottom for gesture safe zone
- Text rule (choose one):
  - Chinese text must be crisp, complete strokes, readable, NO typos / missing characters / garbled glyphs (recommended: Doubao / Jimeng / Wenxin)
  - Or: all text regions must be replaced with generic placeholder lines, gray bars, or minimal geometric icons — NO realistic text (recommended: MJ / DALL·E)
- Banned list: no real phone frame / system status bar / battery icon / time / watermark / logo / other IPs; do NOT place any concrete object in declared "clean zones"
- Aspect ratio: portrait [Ratio, e.g. 9:16 / 3:4] / landscape [Ratio, e.g. 16:9 / 4:1]

# 4. Output Spec

High quality, professional game UI design, Figma render style, Dribbble trending, high resolution, unprocessed, 4k --ar [Ratio]

[Optional reference-image workflow] Dual reference: Image 0 = the reference image (locks style DNA) + Image 1 = your content sketch (locks layout). For MJ append "--iw 1.5 ~ 2.0" to weight the style image; for Doubao / Jimeng prepend "Please use the provided reference image as the style anchor — keep outline weight, palette saturation, and character proportions exactly consistent."`
  },
  {
    title: '根据参考图生成其他页面的设计图（详细范例）',
    content: `参考图为 [游戏品类，例如 连连看消除] 的游戏界面，游戏界面的内容简介：[简要描述参考图，包括画风、构图、主色调、IP 角色、UI 元素、棋盘/玩法区域、底部道具等]。

现在要求你根据参考图生成一下这个游戏对应的[界面]的设计图：高质量，UI 设计，专业游戏界面，高分辨率，未加工，4k --ar [图片比例，例如 16:9] [如果用 MJ，请加上 --iw 1.5 到 2.0，以增加对参考图的权重]，界面风格必须严格保持与参考图（Image 0）一致。

这里是游戏首页的布局介绍：

顶层系统信息区：左侧为系统设置入口；上方居中分布游戏资产/代币显示条（如金币、体力值），用于展示玩家实时资源状态。

品牌与活动入口区：核心位置展示游戏标题/Logo；Logo 两侧对称排列限时活动入口（如新礼包、分享有礼、每日奖励等），用于引导用户点击高频运营位。

角色展示中心区：画面中心为看板娘/核心 IP 角色展示位，作为视觉停留点，增强品牌辨识度并展示当前装扮。

核心玩法操作区：位于角色下方，包含两层结构。上层为支线玩法/周期性任务入口（如每日挑战、赛季任务）；下层为视觉权重最高的主关卡开始按钮，显示当前关卡进度，引导用户进入核心循环。

全局功能导航区：屏幕底部固定区域，包含商店、主题皮肤切换、主界面回归、排行榜等四大基础功能模块，方便用户在不同系统间快速跳转。`
  },

  // ============ 参考图分析（让 AI 输出 prompt） ============
  {
    free: true,
    title: '提取参考图 UI 布局',
    content: `请根据我提供的参考图，深入分析其UI界面布局与视觉构成，生成一段详细的文本提示词。分析需涵盖：1. 空间构图（采用何种对齐方式、元素堆叠逻辑及核心视觉锚点）；2. 关键UI元素（按钮形态、图标分布、进度条或资源栏的具体位置）；3. 功能区域划分（顶层状态栏、中部核心展示区、中下部交互操作区及底部全局导航栏的功能逻辑）；4. 背景要素（背景与前景UI的融合方式）。请将这些分析整合为一段流畅的文字，字数控制在300字以内，确保能够指导AI生图工具精准还原该界面的结构布局。`,
    contentEn: `Based on the reference image I provide, deeply analyze its UI layout and visual composition, and generate a detailed text prompt. The analysis must cover: 1. Spatial composition (alignment, element stacking logic, and key visual anchors); 2. Key UI elements (button shapes, icon distribution, exact positions of progress bars or resource panels); 3. Functional zoning (top status bar, central showcase area, mid-lower interactive area, bottom global navigation bar and their functional logic); 4. Background elements (how background blends with foreground UI). Merge the analysis into one fluent paragraph under 300 words, sufficient to guide an AI image tool to faithfully reproduce the layout.`
  },
  {
    title: '提取参考图内容&风格',
    content: `根据我提供的参考图，分析图片内容，生成一份详细的文本提示词，包括关键元素，场景，构图，色彩色调，画面风格，背景要素，能够指导AI生图工具创作类似作品，字数在300个字以内，组合成一段话`,
    contentEn: `Based on the reference image I provide, analyze its content and produce a detailed text prompt covering: key elements, scene, composition, color & tone, visual style, and background elements — enough to guide an AI image tool to create similar work. Keep it under 300 words, written as a single paragraph.`
  },
  {
    title: '分析参考图内容（Nana Banana Pro）',
    content: `# Role: Nana Banana Pro 专属绘图提示词专家

# Background:
用户拥有一张包含特定中文字体设计的图片。用户希望你通过深度视觉拆解，生成一段能够用于 "Nana Banana Pro" 绘图工具的提示词。

# Goal:
精准还原原图的视觉效果，**核心在于精准复刻图片中的文字内容、字体形态以及复杂的画面细节**，利用详细的中文描述来指导生成。

# Workflow (必须严格遵守的分析逻辑):

1.  **文字内容的绝对精准描述**:
* **这是最高优先级**。你必须明确指出图片中出现了哪些**具体的汉字**（例如："画面中央写着巨大的'未来'二字"）。
* 详细描述字体的**笔画特征**（如：毛笔飞白、霓虹灯管质感、金属倒角、立体挤压效果）。
* 描述文字的**排版结构**（如：文字作为视觉主体占据80%画面、文字穿插在云雾中）。

2.  **画面内容的精细脑补与填充**:
* 如果原图有模糊不清的地方，请根据画面逻辑进行高精度的细节补充。
* 描述画面中的纹理（如：丝绸的纹理、墙面的裂痕、光粒的尘埃感）。
* 描述主体与背景的互动（如：人物的手指轻轻触碰文字边缘）。

3.  **光影与渲染质感**:
* 指定光线来源（如：赛博朋克紫红顶光、清晨侧逆光）。
* 指定渲染风格（如：超写实8K渲染、OC渲染器材质、磨砂玻璃质感）。

# Constraints (限制条件):
-   **全中文输出**：输出的提示词必须完全使用中文，因为 Nana Banana Pro 在此场景下需要精准的中文语义控制。
-   **文字优先**：在描述中，将"文字内容"和"字体样式"放在最前面，确保生成的权重最高。
-   **细节过载**：不要使用简略的形容词，要用具体的画面描述。
-   **禁止解释**：不要输出分析过程，直接输出那段最终的提示词。

# User Input:
[请在此处上传你的图片]`,
    contentEn: `# Role: Nana Banana Pro Dedicated Prompt Expert

# Background:
The user has an image featuring a specific typographic design. The user wants you to perform a deep visual breakdown and produce a prompt that can be fed into the "Nana Banana Pro" image tool.

# Goal:
Faithfully reproduce the visual effect of the source image. **The priority is to precisely replicate the text content, font form, and intricate scene details**, using thorough English descriptions to drive generation.

# Workflow (must follow strictly):

1.  **Absolute precision on text content**:
* **This is the highest priority.** Explicitly call out the exact letters / words shown in the image (e.g. "the word 'FUTURE' in giant letters dominates the center").
* Describe stroke features of the font in detail (e.g. dry-brush flying-white, neon tube glow, metallic chamfer, 3D extrusion).
* Describe the typographic layout (e.g. the type fills 80% of the frame as the main subject, type weaves through clouds).

2.  **Detail filling and image inference**:
* Where the source is ambiguous, fill in plausible high-resolution detail consistent with the scene.
* Describe surface textures (silk weave, wall cracks, dust-in-light particles).
* Describe interaction between subject and background (e.g. a finger lightly grazing the edge of the letterforms).

3.  **Lighting and render quality**:
* Specify light source (cyberpunk magenta top light, cold morning rim light, etc.).
* Specify render style (hyperreal 8K render, Octane material, frosted glass feel).

# Constraints:
-   **English output**: the prompt must be written entirely in English, with the exact glyph spellings preserved verbatim.
-   **Text first**: lead the description with "text content" and "font style" so they carry the highest weight.
-   **Detail-overloaded**: avoid lazy adjectives — use concrete visual descriptions.
-   **No commentary**: do not output your analysis; output only the final prompt.

# User Input:
[Upload your image here]`
  },
  {
    title: '游戏美术资产提取分析 Prompt',
    content: `Role: 你现在是一名资深游戏美术技术美术（Technical Artist），专门负责游戏资源的解构与重组。

Task: 请深度分析上传的这张图片，提取并列举出图中包含的所有独立视觉元素。你的目标是为后续生成一张"游戏资源素材清单图（Sprite Sheet）"提供最详尽的清单。

分析维度：请按以下分类逻辑提取图中内容：

UI 组件 (User Interface Components):
提取所有边框、进度条底座、按钮形状、头像框、对话气泡、菜单底图、小地图框架等。

图标与符号 (Icons & Symbols):
提取所有功能性图标（如设置、背包、商店）、战斗图标（技能、状态 buff）、物品图标（武器、药水、金币）等。

场景细节与装饰物 (Environment & Props):
提取背景中所有可以独立存在的物件（如碎石、杂草、灯柱、箱子、地砖纹理碎片、远景中的树木剪影等）。

文字与数字元素 (Text & Typography):
提取图中出现的特定单词、数值、等级标记（如 "Level", "HP", "99/99"），并识别其字体风格特征（如：像素风、衬线体、发光特效）。

视觉风格定义 (Visual Style Definition):
总结整体的色彩规范（Color Palette）、描边厚度、光影方向（如：左上角光源）、以及材质感（如：金属、木质、扁平化、手绘）。

输出要求:

请使用结构化的**清单（Bullet Points）**形式输出。

描述要极其具体（例如：不要只写"按钮"，要写"带有金边装饰的红色圆形凸起按钮"）。

识别所有微小的细节，即使是角落里的一个小光点。`
  },

  // ============ 美术资源拆解 / 切图 ============
  {
    title: '提取 UI 美素资源拆解清单',
    content: `一张极其详细的游戏开发资源素材清单图(GAME ASSET SPRITE SHEET).核心要求：
基于参考图的艺术风格，将画面中的所有元素进行彻底拆解和分离。所有组件必须整齐地平铺排列(KNOLLING风格)在一个干净的纯白色背景上，元素之间互不重叠，边缘清晰锐利，方便后期抠取。需要包含的详细内容：
UI 控件组：分离出所有的界面框架，底板纹理，按钮(包括按下和未按下状态)，进度条(血条，蓝条的空槽和满槽状态)，滚动条，复选框，输入框背景，小地图圆形边框，聊天窗口背景板。
图标全集：每一个独立的技能图标，物品栏道具图标，装备图标，状态栏BUFF图标，系统菜单小图标(如设置，背包，人物按钮)，全部单独列出。
文字与标识：分离出游戏标题LOGO，伤害数字字体样本，关键UI文本标签(如"开始","确定").
场景层：在画面的一个单独区域，展示一张完整的，去除所有UI遮挡的纯净游戏环境背景原画(CLEAN PLATE BACKGROUND).
风格强调：2D游戏美术资源，矢量感，高分辨率，细节丰富，整理归纳`,
    contentEn: `An extremely detailed GAME ASSET SPRITE SHEET. Core requirements:
Based on the art style of the reference image, fully disassemble and separate every element. All components must be laid out neatly (KNOLLING style) on a clean pure white background, non-overlapping, with crisp edges for easy cutout. Required contents:
UI widgets: separate every interface frame, base-plate texture, button (pressed and unpressed states), progress bar (HP bar and MP bar, both empty and full states), scrollbar, checkbox, input field background, circular minimap frame, chat window background plate.
Icon set: every individual skill icon, inventory item icon, equipment icon, status BUFF icon, system menu icon (settings, backpack, character buttons), all listed separately.
Text & marks: separate the game title LOGO, damage number font samples, key UI text labels (e.g. "Start", "Confirm").
Scene layer: in a separate area of the image, show a complete CLEAN PLATE BACKGROUND of the game environment with all UI removed.
Style emphasis: 2D game art assets, vector feel, high resolution, rich details, well organized.`
  },
  {
    title: '提取 UI 美素资源拆解清单2️⃣',
    content: `请根据这张参考图的布局，生成一张专业的游戏美术资源拆解图（Sprite Sheet）。风格是高清的2D游戏美术，边缘锐利，背景为干净的白色或透明，便于抠图。`,
    contentEn: `Based on the layout of this reference image, generate a professional game art asset breakdown sheet (Sprite Sheet). Style: HD 2D game art, sharp edges, on a clean white or transparent background for easy cutout.`
  },
  {
    title: '提取 UI 元素（切图）',
    content: `一张极其详细的游戏开发资源素材清单图(GAME ASSET SPRITE SHEET).核心要求：
基于参考图的艺术风格，将画面中的所有元素进行彻底拆解和分离。所有组件必须整齐地平铺排列(KNOLLING风格)在一个干净的纯白色背景上，元素之间互不重叠，边缘清晰锐利，方便后期抠取。需要包含的详细内容：
UI控件组：分离出所有的界面框架，底板纹理，按钮(包括按下和未按下状态)，进度条(血条，蓝条的空槽和满槽状态)，滚动条，复选框，输入框背景，小地图圆形边框，聊天窗口背景板。
图标全集：每一个独立的技能图标，物品栏道具图标，装备图标，状态栏BUFF图标，系统菜单小图标(如设置，背包，人物按钮)，全部单独列出。
文字与标识：分离出游戏标题LOGO，伤害数字字体样本，关键UI文本标签(如"开始","确定").
场景层：在画面的一个单独区域，展示一张完整的，去除所有UI遮挡的纯净游戏环境背景原画(CLEAN PLATE BACKGROUND).
风格强调：2D游戏美术资源，矢量感，高分辨率，细节丰富，整理归纳`,
    contentEn: `An extremely detailed GAME ASSET SPRITE SHEET. Core requirements:
Based on the art style of the reference image, fully disassemble and separate every element. All components must be laid out neatly (KNOLLING style) on a clean pure white background, non-overlapping, with crisp edges for easy cutout. Required contents:
UI widgets, icon set, text & marks, scene layer (clean plate background).
Style emphasis: 2D game art assets, vector feel, high resolution, rich details, well organized.`
  },
  {
    title: '提取 UI 元素（切图）（绿幕版）',
    content: `一张极其详细的游戏开发资源素材清单图(GAME ASSET SPRITE SHEET).核心要求：
基于参考图的艺术风格，将画面中的所有元素进行彻底拆解和分离。所有组件必须整齐地平铺排列(KNOLLING风格)在一个干净的纯绿色（#00B050）背景上，元素之间互不重叠，边缘清晰锐利，方便后期抠取。需要包含的详细内容：
[要提取的内容]
风格强调：2D游戏美术资源，矢量感，高分辨率，细节丰富，整理归纳`
  },
  {
    title: '提取 UI 组件',
    content: `请严格依据我上传的整张 UI 设计原图，精准拆分提取所有独立 UI 组件，包含按钮、图标、边框、弹窗、标签、装饰元素、控件边角等所有界面元素；剔除多余背景、保留原有配色 / 光影 / 描边 / 比例质感，把所有提取好的 UI 元素整齐排布合并成一张透明底美术资源精灵图，元素之间留白分隔、不重叠、不裁切，保持原设计高清无损、像素对齐，输出标准游戏 UI 精灵图集格式`
  },
  {
    title: '提取背景图',
    content: `游戏背景资源提取，超高清，8K 分辨率。请移除图中所有 UI 界面元素、按钮、文字、图标和菜单，仅保留环境与场景。保持背景原有的美术风格、配色方案与光影效果。最终输出一张干净、沉浸式的游戏环境背景，适用于 [填写游戏类型，如：奇幻 RPG / 科幻 UI] 布局。不含角色，不含文字，仅保留纯净场景背景。`,
    contentEn: `Game background asset extraction, ultra-high definition, 8k resolution. Please remove all user interface elements, buttons, text, icons, and menus from this image. Focus only on the environment and scenery. Maintain the original art style, color palette, and lighting of the background. The final result should be a clean, immersive game environment background suitable for [Game Type, e.g. Fantasy RPG / Sci-fi UI] layout. No characters, no text, strictly scenic background.`
  },

  // ============ 抠图 / 透明背景 ============
  {
    title: '抠单一元素',
    content: `一个居中、边缘极锐利、高对比度的物体，孤立放置在纯柠檬绿色背景上，极简矢量风格，光照均衡，无阴影，物体与画布边缘保留 4px 留白，8K 分辨率，专业 UI 图标资源。--no 网格背景、棋盘格、模糊、渐变背景`,
    contentEn: `A clean centered object with ultra-sharp stroke edges, high contrast, isolated on a solid lime green background, minimalist vector style, balanced lighting, no shadows, 4px padding between the object and the canvas edges, 8k resolution, professional UI icon asset. --no grid background, checkerboard, blur, gradient background`
  },
  {
    title: '抠图（透明背景）',
    content: `全透明 Alpha 通道，确保真实透明背景，原生 Alpha 通道，背景必须完全不可见且透明。无纯色背景、无填充、无边框，完美边缘便于 UI 叠层使用，8K 分辨率。`,
    contentEn: `with full alpha transparency, guaranteed genuine transparent background, native alpha channel included, background must be completely invisible and transparent, No solid background color, No fill, No borders, perfect edges for UI layering, 8k resolution.`
  },
  {
    title: '抠图（透明背景 + 网格排列）',
    content: `一张专业的 UI 美术资源精灵图，[要抠取的元素列表]，从输入参考图中精准提取。所有提取出的元素必须以清晰、扁平、均匀间距的网格排列在画布上，元素之间不重叠。输出全透明 Alpha 通道，确保真实透明背景，原生 Alpha 通道，背景必须完全不可见且透明。无纯色背景、无填充、无边框，完美边缘便于 UI 叠层使用，8K 分辨率，虚幻引擎 5 渲染风格。`,
    contentEn: `A professional UI asset sprite sheet, [Elements to Extract], meticulously extracted from the input reference image. All extracted elements must be arranged in a clear, flat, evenly spaced grid pattern across the canvas, without any overlap. Generated with full alpha transparency, guaranteed genuine transparent background, native alpha channel included, background must be completely invisible and transparent, No solid background color, No fill, No borders, perfect edges for UI layering, 8k resolution, Unreal Engine 5 render style.`
  },
  {
    title: '抠图（绿幕版）',
    content: `一张专业的 UI 美术资源精灵图，[要抠取的元素列表]，从输入参考图中精准提取。所有提取出的元素必须以清晰、扁平、间距宽松的网格排列在画布上，元素之间不重叠。

背景规格：背景必须是纯色、均匀、鲜艳的纯绿色（Hex：#00FF00），即标准色键绿幕色。背景无渐变、无阴影、无纹理。

边缘与质量控制：每个元素都要有锐利干净的边缘。元素与绿色背景之间零色彩溢出。高对比度隔离：每个素材必须有清晰锐利的轮廓，便于完美抠像。无半透明边缘、无运动模糊、无与绿色融合的发光边缘特效。

技术风格：8K 分辨率，虚幻引擎 5 渲染风格，高保真材质，平光照明以避免绿色反射到素材上。`,
    contentEn: `A professional UI asset sprite sheet, [Elements to Extract], meticulously extracted from the input reference image. All extracted elements must be arranged in a clear, flat, generously spaced grid pattern across the canvas, without any overlap.

Background Specification: > The background must be a solid, uniform, vibrant pure green (Hex: #00FF00), standard chroma key green screen color. No gradients, no shadows, no textures in the background.

Edge & Quality Control: > Sharp and clean edges for every element. Zero color bleeding between elements and the green background. High contrast isolation: each asset must have a distinct, crisp outline to ensure perfect masking. No semi-transparent fringes, no motion blur, no glowing edge effects that blend with the green.

Technical Style: > 8k resolution, Unreal Engine 5 render style, high-fidelity textures, flat lighting to prevent green reflection on assets.`
  },
  {
    title: '最大色值对比度抠图',
    content: `正向提示词 (Positive Prompt)：

【结构保持】: 高保真，完全克隆输入图像的结构，保持原始输入图像的所有复杂细节和构图，禁止产生任何形变，高真实感。
【画质与边缘】: 极高分辨率，8K UHD，锐利聚焦，边缘极其平滑，抗锯齿处理（Anti-aliasing），消除锯齿状边缘，高保真轮廓线，无噪点。
【智能背景选择】: 纯色背景（Solid Color Background）。AI请分析主体图像的色调，并自动选择一种与主体颜色具有最大对比度、且在主体中绝对不存在的纯净色值作为背景（如纯蓝、纯绿、纯洋红或纯青）。
【背景要求】: 背景必须是完全均匀、平整、没有任何光影、纹理或渐变的单色幕布。主体边缘光干净，严禁出现背景色的溢色（No Color Spill），确保主体边缘与背景实现像素级分离。

反向提示词 (Negative Prompt)：

(worst quality:2), (low quality:2), 模糊，画质低劣，锯齿状边缘（jagged edges），像素化（pixelated），噪点，改变主体形状，形变，幻觉。背景出现渐变色、阴影、光晕或纹理。主体边缘模糊，背景色侵蚀主体边缘。背景颜色与主体颜色相近或冲突。`
  },

  // ============ 图片增强 / 动画 ============
  {
    title: '图片变清晰',
    content: `正向提示词：
高清修复，极高分辨率，8K超高清，锐利聚焦，边缘平滑，抗锯齿处理，纹理增强，清晰轮廓，高保真度，保持原图结构，细节优化，专业图像后期处理。

反向提示词 (Negative Prompt - 必须添加)：
模糊，画质低劣，锯齿状边缘，像素化，噪点，颗粒感，改变构图，形变，多余的物体，色彩偏移，过度曝光，伪影，重影。`
  },
  {
    title: '图片变清晰（绿幕版）',
    content: `正向提示词 (注重技术描述和背景)：

【结构保持】: 高保真，完全克隆输入图像的结构，保持原始输入图像的所有复杂细节和构图，高真实感，超高质量。
【画质与边缘】: 极高分辨率，8K UHD，锐利聚焦，边缘极其平滑，抗锯齿处理（Anti-aliasing），消除锯齿状边缘，清晰的轮廓线，无噪点。
【特定背景】: 纯色背景，背景必须是完全均匀、单一、纯净的绿色（Hex颜色码 #00B050），没有任何光影变化，完美的绿色幕布背景。
【抠图优化】: 主体与背景界限分明，边缘干净，主体边缘无绿色反光（no green spill on subject），方便后期精准抠图。

反向提示词 (Negative Prompt - 强制约束)：

(worst quality:2), (low quality:2), 模糊，画质低劣，锯齿状边缘（jagged edges），像素化（pixelated），噪点，改变主体形状，形变，幻觉，多余的物体，背景有渐变，背景有阴影，主体边缘有绿色残留。`
  },
  {
    title: '序列帧动画',
    content: `主体：一个包含 [帧数，例如 12] 个帧的动画序列条，展示了 [角色描述，例如 一只平静、毫无表情的水豚]。

动作（请按帧描述）：
第 [区间1] 帧：[关键动作1]
第 [区间2] 帧：[关键动作2]
第 [区间3] 帧：[关键动作3]
...
最后一帧：[结束状态]

外观：[角色外观描述，包括造型、配色、神态、细节]。整体风格应为 [画风，例如 手绘卡通风格，可见线条与简单色彩，逐帧动画素描感]。
背景：无背景（透明背景）。
构图：[帧数] 个 [形状，例如 正方形] 帧，水平排列成一个单条，就像电影胶片。每个帧展示动作的连续时刻。`
  },

  // ============ 手游 UI 风格生成（通用化的风格模板） ============
  {
    title: 'Q 版治愈风格手游 UI（LINE Friends 风）',
    content: `[平台，例如 微信] 手机游戏界面截图，竖屏 [比例，例如 9:16]，治愈系萌 Q 风格。

[页面内容]

全局风格（必须严格遵守）：
- 画风：LINE Friends / Kakao Friends 商业插画，Q 版萌系，极简矢量
- 背景：[底色，例如 浅米奶油色 (#FFF8EC) 平面色，带极淡点阵纸质纹理]
- 描边：所有元素统一 3-4px [描边色，例如 深棕色 (#3E2010)] 圆润描边，圆角帽，无任何锐角
- 配色：低饱和柔化色系，[主色与点缀色，例如 温暖橙 (#FF8C42)、奶油白、深木棕、嫩草绿、天空蓝、柔化红]，所有颜色加白淡化处理
- 按钮：果冻感 3D 效果，顶部弧形白色高光条，底部投影偏移 3px，圆角矩形 radius 24-32px
- IP 角色：[IP 角色描述，例如 极简几何圆润形体，大圆头小豆眼（闭眼=月牙形），主色 + 配件]
- 弹窗：圆角大矩形 (radius 32px，4px 描边)，IP 角色从顶边探出身体
- 字体：圆润粗体，浅色底用深色字，深色按钮用白字
- 整体氛围：温馨松弛、慢生活、如儿童绘本插画

输出要求：扁平矢量 UI 设计图，非写实，无摄影风格，无锐角，无暗色主题`,
    contentEn: `Cute healing mobile game UI screenshot, portrait [aspect ratio, e.g. 9:16], [platform, e.g. WeChat] mini-game style.

[Page Content]

Global style rules (strictly follow):
- Art style: LINE Friends / Kakao Friends commercial illustration, Q-version chibi
- Background: [Base color, e.g. flat cream parchment color #FFF8EC, subtle dot texture]
- Outlines: all elements have 3-4px thick rounded [outline color, e.g. dark brown #3E2010] outlines, round caps, no sharp angles
- Color palette: low saturation pastels — [main + accent palette, e.g. cream white, warm orange #FF8C42, soft brown, muted green, sky blue, gentle red]; all colors whitened/softened
- Buttons: jelly-style 3D effect — arc white highlight on top, drop shadow offset 3px below, rounded corners radius 24-32px
- IP character: [Character description, e.g. simple geometric chubby body, big round head, tiny crescent eyes, base color, accessories]
- Popups: cream rounded card (radius 32px, 4px outline), IP character peeking over the top edge
- Typography: rounded bold font, dark text on light, white text on colored buttons
- Mood: cozy, slow-life, healing, storybook illustration

Output: flat vector UI design, no photography, no realism, no sharp corners, no dark theme
--ar [aspect ratio] --v 6 --style raw`
  },
  {
    title: '休闲手游 UI 截图生成（详细约束版）',
    content: `为 [游戏平台，例如 微信小游戏 / App / H5] 生成移动端 UI 截图，面向 [目标人群，例如 休闲治愈系玩家]，采用 [视觉风格，例如 春日草地儿童绘本 / 像素复古 / 水墨国风] 风格，带 [质感关键词，例如 彩铅 + 水彩 / 油画 / 扁平]。展示 [页面内容]，竖屏移动端构图，垂直结构清晰、UI 层级分明。

设计宽度逻辑：使用 [设计宽度，例如 750] 设计宽度：全屏页面顶部与底部预留额外出血，便于长屏裁切；弹窗页面保持对话框居中，留出充足的周围呼吸空间。

画风：[画风关键词，例如 儿童绘本插画，可见彩铅笔触与水彩柔软感，手绘线条略带抖动感，非机械矢量风]。

环境：[环境与配色，例如 明亮春日草地嫩绿色调，柔和天空蓝，暖珊瑚橙按钮，云朵白卡片，散落的蒲公英、小花、蝴蝶]。

视觉细节：
- 描边：[描边规格，例如 不均匀手绘森林绿线条，圆角，无锐边]
- 按钮：[按钮规格，例如 厚重圆角矩形，蜡笔质感高光，深色阴影偏移]
- 卡片与弹窗：[卡片规格，例如 云朵白圆角面板，手绘描边]
- 字体：[字体规格，例如 圆润手写体标题，标签可读、带描边/阴影]
- UI 层级：核心 CTA 最强，状态信息次之，装饰元素最弱

布局约束（按需保留/删除）：
- 顶部信息置于安全区下方，避开 [系统胶囊，例如 微信胶囊按钮]
- 底部 CTA 置于手势安全区上方
- 中部为 [核心元素，例如 角色 / 棋盘] 保留大块呼吸空间
- 全屏背景支持纵向裁切扩展
- 弹窗必须居中，内部元素相对弹窗本身定位

氛围：[氛围关键词，例如 春日草地、治愈、温暖阳光、俏皮 IP 角色、舒适儿童自然绘本]。

避免：写实、暗色主题、锐角、HUD 杂乱、按钮拥挤、关键 UI 贴近屏幕边缘、过度竞技视觉。`,
    contentEn: `Create a mobile game UI screenshot for [Platform, e.g. WeChat mini-game / App / H5], targeting [Audience, e.g. casual healing-game players], in [Visual Style, e.g. spring meadow children's picture book / pixel retro / ink-wash] style with [Texture keywords, e.g. colored-pencil + watercolor]. Show [Page Content] in portrait composition with clean vertical structure and clear UI hierarchy.

Design width logic: use [design width, e.g. 750]; for full-screen pages keep extra top/bottom bleed for long-screen cropping, and for popups keep the dialog centered with generous breathing room.

Art style: [Art keywords, e.g. children's picture book illustration with visible colored-pencil brushstrokes and watercolor softness; slightly wobbly hand-drawn outlines, not mechanical vector lines].

Environment: [Environment & palette, e.g. bright spring meadow green palette, soft sky blue, warm coral orange buttons, cloud-white cards, dandelions, small flowers, butterflies].

Visual details:
- Outlines: [Outline spec, e.g. uneven hand-drawn forest-green strokes, rounded corners, no sharp edges]
- Buttons: [Button spec, e.g. chunky rounded rectangle, crayon highlight, dark shadow offset]
- Cards / popups: [Card spec, e.g. cloud-white rounded panels with hand-drawn borders]
- Typography: [Type spec, e.g. rounded handwritten title style, readable labels with outline/shadow]
- UI hierarchy: key CTA strongest, status info second, decorative elements weakest

Layout constraints (keep/remove as needed):
- Keep top info below the safe area, away from [system capsule]
- Keep bottom CTA above the gesture safe zone
- Preserve large central breathing room for [Core element, e.g. character / board]
- Full-screen backgrounds should allow vertical crop extension
- Popups must be centered, internal elements positioned relative to the popup

Mood: [Mood keywords].

Avoid: realism, dark theme, sharp corners, cluttered HUD, cramped buttons, important UI near screen edges, overly competitive visual tone.`
  },
  {
    title: '春日草地绘本风格手游 UI',
    content: `帮我生成图片：图片风格为「春日草地儿童绘本彩铅水彩插画」，[平台，例如 微信] 手机游戏界面截图，竖屏 [比例，例如 9:16]。

画面内容：[页面内容]

风格细节：
- 画风：儿童绘本彩铅 + 水彩插画，所有表面可见彩铅笔触纹理，线条略带手绘抖动感，非机械矢量风格
- 背景：明亮春日草地嫩草绿 #AADC3C，可见斜向彩铅涂抹笔触纹理，远处模糊树影
- 描边：3-5px 深森林绿 #2A5A14 手绘不规则描边，线条粗细略有变化，末端圆帽，无锐角
- 配色：嫩草绿、天空蓝、暖珊瑚橙、云朵白、深森绿、暖红、蒲公英黄，所有颜色叠加轻微彩铅纹理
- 按钮：厚重手绘圆角矩形，不规则粗边框，左上角浅色彩铅高光，右下角深森绿阴影偏移 4px
- IP 角色（[IP 描述，例如 卡皮巴拉/小熊/小鸡]）：户外草地探险家造型，超大圆头，月牙眼或星星眼，身边有蒲公英 / 小鸭子 / 蝴蝶
- 弹窗：云朵白圆角矩形，深森绿手绘描边，IP 角色从顶边探出半身
- 字体：粗圆手写体，浅色背景用深森绿字，彩色按钮用白字

氛围：春日草地、户外治愈、儿童自然绘本、充满生命力、温暖阳光，无任何锐角。

比例「[比例，例如 9:16]」，高清画质。

负向提示词：写实摄影、暗色调、奶油羊皮纸底色、机械均匀描边、锐角、渐变天空、模糊、多余肢体`,
    contentEn: `Create a mobile game UI screenshot in spring meadow children's picture book style with colored-pencil + watercolor texture, [platform, e.g. WeChat] mini-game, portrait [aspect ratio, e.g. 9:16].

Content: [Page Content]

Style details:
- Children's picture book illustration with visible colored-pencil brushstrokes and crayon texture, slightly wobbly hand-drawn outlines, NOT mechanical vector
- Background: bright spring meadow green (#AADC3C ~ #C8E850) with diagonal colored-pencil shading; soft blur at edges; distant blurry tree silhouettes
- Outlines: 3-5px uneven hand-drawn dark forest green (#2A5A14), round caps, wobbly edges, zero sharp corners
- Palette: grass green #AADC3C, sky blue #5BC8E8, warm coral orange #FF7A45, cloud white #FFFEF2, forest green #2A5A14, warm red #E8553A, dandelion yellow #F5D840
- Buttons: chunky hand-drawn rounded rectangle, thick irregular border, top-left crayon highlight, bottom-right dark green shadow offset 4px, radius 20-28px
- IP character ([IP description, e.g. capybara / bear / chick]): chubby round body, tiny crescent eyes or sparkle dot eyes; surrounded by dandelions, ducks, butterflies
- Popups: cloud white rounded card (radius 28px, 4px hand-drawn forest-green border), IP peeking from top edge
- Typography: chunky rounded hand-written font, forest green on light, white on colored buttons

Mood: spring meadow, outdoor healing, full of life energy, warm sunlight, cozy children's nature picture book.

Avoid: photography, realism, sharp corners, dark theme, cream parchment background, uniform mechanical outlines, gradient sky.`
  },

  // ============ 游戏素材模板（弹窗 / 海报 / 徽章） ============
  {
    title: '成就徽章精灵图（通用版）',
    content: `一张精灵图，[列数] 列 × [行数] 行，共 [总数] 枚卡通成就徽章 / 图标，用于 [游戏品类，例如 休闲消除 / 卡牌 / 放置]。

整体风格：
- [风格定位，例如 Q 版卡通休闲游戏 UI，轻手绘风]
- 主色：[配色方案，例如 高饱和亮色：向日葵黄、糖果粉、薄荷绿、天空蓝、珊瑚橙、皇家紫]
- 描边：[描边规格，例如 圆润粗黑描边 3-4px，线条略带手绘抖动]
- 质感：[质感关键词，例如 彩铅 / 淡水彩质感，柔和内阴影，顶部高光，徽章底部柔和投影]
- 每枚徽章基础形：[徽章造型，例如 圆形奖牌，外圈用飘带 / 星芒 / 月桂叶装饰]

排版要求：
- [列数] 列 × [行数] 行，单元格大小完全一致，徽章居中，间距均匀
- 透明背景，徽章之间留白，方便后期切图
- 除徽章本体外不要任何文字、装饰、网格线

徽章逐项内容（自上而下，从左到右；按需扩展/删减）：
1. "[徽章名称1]"——[达成条件1]。[视觉描述：核心元素 + 配色 + 装饰]
2. "[徽章名称2]"——[达成条件2]。[视觉描述]
3. "[徽章名称3]"——[达成条件3]。[视觉描述]
4. "[徽章名称4]"——[达成条件4]。[视觉描述]
5. "[徽章名称5]"——[达成条件5]。[视觉描述]
6. "[徽章名称6]"——[达成条件6]。[视觉描述]

输出：PNG，透明背景，[输出尺寸，例如 2048×1365（3:2）]，高清，徽章网格严格对齐。

> 多张同系列精灵图时，请在 prompt 开头追加一句"风格必须与'精灵图 A'完全一致（同一套视觉语言）"以锁视觉。`,
    contentEn: `A sprite sheet, [Cols] columns × [Rows] rows, [Total] cartoon achievement badges / icons for a [Game Category, e.g. casual match / card / idle] mobile game.

Style:
- [Style positioning, e.g. Q-version chibi cartoon casual-game UI, light hand-drawn feel]
- Palette: [Palette, e.g. high-saturation bright colors: sunflower yellow, candy pink, mint green, sky blue, coral orange, royal purple]
- Outlines: [Outline spec, e.g. bold rounded black outlines 3-4px with slight hand-drawn wobble]
- Texture: [Texture keywords, e.g. colored-pencil / soft watercolor shading, gentle inner shadow, glossy top highlight, soft drop shadow]
- Badge base shape: [Shape, e.g. circular medal framed by ribbons / star bursts / laurel leaves]

Layout:
- [Cols] × [Rows] grid, identical cell size, badge centered, equal gutters
- Transparent background, generous padding between badges (sprite-atlas friendly)
- No text, decoration, or grid lines outside the badges themselves

Per-badge content (top to bottom, left to right; extend or trim as needed):
1) "[Badge Name 1]" — [Condition 1]. [Visual desc: core element + palette + decoration]
2) "[Badge Name 2]" — [Condition 2]. [Visual desc]
3) "[Badge Name 3]" — [Condition 3]. [Visual desc]
4) "[Badge Name 4]" — [Condition 4]. [Visual desc]
5) "[Badge Name 5]" — [Condition 5]. [Visual desc]
6) "[Badge Name 6]" — [Condition 6]. [Visual desc]

Output: PNG, transparent background, [Size, e.g. 2048×1365 (3:2)], crisp, strictly aligned grid.

> For multi-sheet series, prepend "Visual language MUST exactly match 'sprite sheet A' so the two look like one consistent set" to lock visual identity.`
  },
  {
    title: '通用弹窗背景（九宫格三段拉伸）',
    content: `一张竖版手游通用弹窗背景图，风格必须与 [主场景描述，例如 首页：蓝天白云 + 绿草地 + IP 角色] 完全统一，像同一位画师在同一张纸上画出来的。

整体画风：
- [风格定位，例如 Q 版卡通休闲游戏 UI，轻手绘水彩 + 彩铅质感]
- 配色：[配色方案，例如 高饱和但柔和的明亮配色：天空蓝、奶油白、草地嫩绿、桃粉、柠黄、珊瑚橙]
- 描边：[描边规格，例如 圆润粗黑描边 4-5px，带轻微手绘抖动，绝不僵硬]
- 笔触：[笔触特点，例如 水彩晕染感、淡彩铅纹理和纸面颗粒]
- 整体氛围：[氛围关键词，例如 阳光、童趣、治愈，绘本插画感]

面板形状与配色（必须严格遵守"上 25% / 中 50% / 下 25%"的纵向三段结构，便于九宫格 stretch）：
- 整体是一块圆角矩形面板，四角大圆角（约 [圆角半径，例如 60px]）
- 面板内部主体是 [基底色，例如 干净的奶油米白色 #FFF7E6 附近]，带一点点纸面纹理
- 顶部 25%：[顶部色与装饰，例如 淡天空蓝渐变，呼应首页天空，漂浮两三朵蓬松白云]
- 底部 25%：[底部色与装饰，例如 淡草绿渐变，呼应首页草地，底边点缀几片嫩绿草叶、雏菊、小花、蒲公英]
- 中间 50% 必须是完全干净的基底色，不要任何云、草、花、星星、徽章、按钮、文字（这里要叠加内容）
- 左右两侧装饰可以稍微贴边一点点，但中央竖向通道必须留白

边角装饰（仅在面板四个角，不侵入中部）：
- 顶部两角：[顶角装饰，例如 各一小簇白云 / 小花点缀]
- 底部两角：[底角装饰，例如 各一小簇草叶 + 小花]
- 可加极少量飘落花瓣或小光点烘托氛围，但要稀疏

严格禁止：
- 不要任何文字、汉字、字母、数字
- 不要画任何角色（IP 角色、动物）、徽章、列表行、按钮、勾选框、图标
- 不要把中部装饰满，中部 50% 必须干净
- 不要扁平矢量风、不要像素风、不要写实风、不要赛博 / 科技 / 金属感
- 不要深色背景，不要高对比霓虹色

输出：PNG，面板外透明背景，分辨率 [尺寸，例如 750 × 1000（竖版 3:4）]，高清，描边干净不模糊，符合九宫格三段拉伸结构。`,
    contentEn: `A vertical popup panel background for a mobile casual game. Visual style MUST exactly match [Main scene, e.g. the home screen: blue sky + clouds + meadow + IP character] — as if drawn by the same illustrator.

Overall style:
- [Style positioning, e.g. Q-version chibi cartoon casual-game UI, light hand-drawn watercolor + colored-pencil feel]
- Palette: [Palette, e.g. soft high-saturation: sky blue, creamy ivory, meadow green, peach, lemon yellow, coral orange]
- Outlines: [Outline spec, e.g. bold rounded black outlines 4-5px with slight hand-drawn wobble, never stiff]
- Texture: [Texture, e.g. watercolor bleeding, faint colored-pencil hatching, subtle paper grain]
- Mood: [Mood keywords]

Panel shape and palette (MUST follow the "top 25% / middle 50% / bottom 25%" vertical 3-band structure for 9-slice stretching):
- Single rounded-rectangle panel, large corner radius (~[Radius, e.g. 60px])
- Interior base: [Base color, e.g. clean creamy off-white ~#FFF7E6] with a hint of paper texture
- Top 25%: [Top band color & decoration, e.g. soft sky-blue gradient with 2-3 fluffy white clouds near top edge]
- Bottom 25%: [Bottom band color & decoration, e.g. soft meadow-green gradient with tender grass blades, daisies, small flowers, dandelion puffs]
- Middle 50%: COMPLETELY clean creamy base — NO clouds, grass, flowers, sparkles, badges, buttons, or text (content will be composited on top)
- Side decorations may hug edges, but the central vertical strip must stay empty

Corner decorations only (must not intrude into the middle):
- Top corners: [e.g. tiny tufts of clouds / small flowers]
- Bottom corners: [e.g. tiny tufts of grass + small flowers]
- A few extremely sparse drifting petals / light specks are fine

Strict rules — DO NOT:
- No text, characters, letters, or digits
- No characters (IP, animals), badges, list rows, buttons, checkboxes, or icons
- Do NOT fill the middle — the central 50% must stay clean
- Not flat vector, not pixel, not realistic, not cyber / metallic, no neon
- No dark backgrounds, no high-contrast neon

Output: PNG, transparent outside the panel, [Size, e.g. 750 × 1000 (portrait 3:4)], crisp outlines, suitable for 9-slice 3-section vertical stretching.`
  },
  {
    title: '弹窗标题飘带',
    content: `一条横版卡通飘带 / 横幅，用作 [用途，例如 手游弹窗顶部标题底板]，风格必须与 [主场景描述] 完全统一。

整体风格：
- [风格定位，例如 Q 版卡通休闲游戏 UI，轻手绘水彩 + 彩铅质感]
- 描边：[描边规格，例如 圆润粗黑描边 4-5px，带手绘抖动]
- 主色：[主色，例如 珊瑚橙 / 蜜桃橙渐变，与首页主按钮配色一致]，中央略浅、两端略深
- 表面带柔和水彩晕染、顶部高光、底部内阴影，立体但不写实
- 飘带两端各有一个燕尾收口，飘带左右各拖出一小段折叠尾巴

布局：
- 横版，约 [尺寸，例如 900 × 260]，居中是飘带主体
- 中部留出大面积纯净色平面用于后期叠加标题文字（不要画任何东西）
- 两端燕尾处可点缀小星芒 / 小花 / 小叶子
- 飘带外为透明背景

严格禁止：
- 不要任何文字、汉字、字母、数字
- 不要画角色、徽章、图标
- 中部必须干净，方便代码贴标题
- 不要扁平矢量风，不要金属质感，不要霓虹

输出：PNG，透明背景，[尺寸]，高清。`,
    contentEn: `A horizontal cartoon ribbon banner used as [Purpose, e.g. a title plate on top of a mobile-game popup]. Style MUST match [Main scene description] exactly.

Style:
- [Style positioning, e.g. Q-version chibi cartoon casual-game UI, light hand-drawn watercolor + colored-pencil feel]
- Outlines: [Outline spec, e.g. bold rounded black outline 4-5px with slight hand-drawn wobble]
- Main color: [Main color, e.g. coral-orange / peach gradient matching the home-screen primary button], lighter middle, deeper ends
- Soft watercolor bleed, gentle top highlight, subtle bottom inner shadow — dimensional but not realistic
- Both ends finish in a swallowtail notch, with a small folded ribbon tail trailing out left and right

Layout:
- Horizontal, around [Size, e.g. 900 × 260], ribbon centered
- Large clean color surface in the middle for compositing title text later — DRAW NOTHING in the center
- Tiny star sparkles / small flowers / leaves may accent the swallowtail ends only
- Transparent background outside the ribbon shape

Strict rules — DO NOT:
- No text, characters, letters, or digits
- No characters, badges, or icons
- Middle must stay clean for code-overlaid titles
- Not flat vector, not metallic, not neon

Output: PNG, transparent background, [Size], high resolution.`
  },
  {
    title: '分享海报底图（三段式构图）',
    content: `一张竖版小游戏分享海报底图（仅"底"，不画任何文字 / 头像 / 玩家卡 / 二维码 / 按钮 / 角色，这些都由代码运行时合成），风格必须与 [主场景描述，例如 游戏首页：蓝天白云 + 绿草地 + IP 角色 + 主色木刻标题] 完全统一。

整体画风：
- [风格定位，例如 Q 版卡通休闲游戏 UI，轻手绘水彩 + 彩铅质感，纸面颗粒]
- 配色：[配色，例如 天空蓝、奶油白、嫩草绿、桃粉、柠黄、珊瑚橙]
- 笔触：[笔触，例如 水彩晕染感、淡彩铅交叉斜线塑形，整体带轻微毛茸边缘]
- 描边：[描边，例如 柔和的暖深棕 / 森绿色铅笔线，不是粗黑实线轮廓]
- 氛围：[氛围，例如 阳光、童趣、治愈，绘本插画感]

构图（极其重要，必须严格遵守"上 [顶比例]% + 中 [中间比例]% + 下 [底比例]%" 的纵向三段）：
- 尺寸：竖版 [尺寸，例如 750 × 1180，约 5:8 比例]
- 顶部 0%-[顶比例]%：[顶部画面，例如 淡天空蓝水彩渐变 #cbe7ff → #ffffff，漂浮两三朵蓬松圆胖白云，左上 / 右上各一只小金黄蝴蝶]
- 中间 [顶比例]%-[底比例反推]%（共 [中间比例]% 高度，最重要的干净区域）：必须是大面积干净、近乎无内容的 [基底色，例如 奶油米白色水彩底 #fff7e6] 附近，允许有极淡的纸面颗粒和一两道几乎看不见的水彩晕染，但绝不要画任何具体物体（不要花、不要草、不要角色、不要图标、不要光斑、不要装饰）——这里是给代码叠加 [叠加内容，例如 玩家头像卡 + VS + 战绩 + 游戏截图] 的舞台
- 底部 [底反推]%-100%：[底部画面，例如 淡嫩草绿水彩渐变，底边贴一排嫩绿草叶剪影 + 几朵雏菊 + 黄花 + 蒲公英绒球，左下角一只小金黄蝴蝶或一片飘落花瓣]

四角装饰（轻量、稀疏、贴边，不侵入中央）：
- 左上 / 右上：[轻装饰，例如 一两片落叶或柔和小光点]
- 左下 / 右下：[轻装饰，例如 几片草叶 + 小花]
- 整图可有极少量飘落花瓣 / 暖光小光斑做氛围，但要稀疏到几乎看不见

严格禁止：
- 不要任何文字、汉字、字母、数字、标题、Logo
- 不要画任何角色（IP / 动物 / 人）
- 不要画玩家头像、头像圆圈、玩家卡、VS 字样、按钮、对话框、二维码、小程序码
- 不要画游戏砖块 / 棋盘 / 物品图标 / 道具
- 不要在中央干净区域画任何具体物体
- 不要扁平矢量、不要像素、不要写实、不要赛博 / 金属 / 霓虹
- 不要深色背景，不要黑紫高对比

输出：JPG / PNG，竖版 [尺寸]，高清，纸面颗粒清晰，符合"上 [顶比例] + 中 [中比例] 干净舞台 + 下 [底比例]" 的三段构图。`,
    contentEn: `A vertical share-poster BACKGROUND PLATE (BASE ONLY — DO NOT draw text / avatars / player cards / QR codes / buttons / characters; these are composited at runtime). Visual style MUST exactly match [Main scene description] as if drawn by the same illustrator.

Overall style:
- [Style positioning, e.g. Q-version chibi cartoon casual-game UI, light hand-drawn watercolor + colored-pencil feel with paper grain]
- Palette: [Palette, e.g. sky blue, creamy ivory, fresh meadow green, peach, lemon yellow, coral orange]
- Strokes: [Stroke style, e.g. soft watercolor bleeding + faint colored-pencil cross-hatching, slightly fuzzy edges]
- Outlines: [Outline, e.g. delicate warm dark-brown / forest-green pencil strokes — NOT thick solid black]
- Mood: [Mood keywords]

Composition (CRITICAL — must follow the "top [X]% + middle [Y]% + bottom [Z]%" 3-band layout):
- Size: vertical [Size, e.g. 750 × 1180, roughly 5:8]
- Top 0–[X]%: [Top band, e.g. soft sky-blue watercolor gradient with 2-3 fluffy clouds + butterflies]
- Middle (the [Y]% clean zone): a CLEAN, nearly empty [Base color, e.g. creamy off-white #fff7e6] wash with at most faint paper grain — DRAW NO CONCRETE OBJECTS (no flowers, grass, characters, icons, light specks, decorations). This zone is reserved for compositing [Overlaid content, e.g. avatars + VS + verdict + screenshot]
- Bottom [Z]%: [Bottom band, e.g. soft meadow-green watercolor gradient with grass-blade silhouettes, daisies, yellow flowers, dandelion puffs]

Corner decorations (light, sparse, edge-hugging only — must NOT intrude into central area):
- Top corners: [Light decoration]
- Bottom corners: [Light decoration]
- A few extremely sparse drifting petals / light specks are fine but nearly invisible

Strict rules — DO NOT:
- No text, characters, letters, digits, titles, or logos
- No characters (IP, animals, people)
- No avatar circles, player cards, VS lettering, buttons, dialogs, QR codes, mini-program codes
- No game tiles, board, item icons, props
- Nothing concrete in the central clean zone
- Not flat vector, not pixel, not realistic, not cyber / metallic / neon
- No dark backgrounds, no high-contrast black/purple

Output: JPG or PNG, vertical [Size], high resolution, crisp paper grain, strict 3-band layout.`
  },

  // ============ 小游戏运营物料模板 ============
  {
    title: '小游戏 Icon（1024×1024 / 256×256）',
    content: `一只 / 一个 [IP 角色 / 主体描述，例如 可爱的卡皮巴拉头像特写] 作为游戏图标主视觉，[视角，例如 正面视角，圆圆的脸，呆萌微笑]，
[配饰，例如 小耳朵上别着一朵粉色小樱花和一颗小黄星]，
角色采用 [描边规格，例如 粗圆黑色描边 5px]，[色调，例如 高饱和暖色调]，
背景是 [背景描述，例如 高饱和天空蓝到草地黄绿的圆形渐变，中心带柔暖光晕，外圈飘落一片小绿叶]，
[风格定位，例如 治愈系 Q 版卡通插画风格，手绘儿童绘本质感，圆润可爱，明亮温暖]，
高质感，正方形构图，留出圆形安全区，
图标用，无文字，干净简洁，
[（可选）请以提供的"[游戏名]"游戏首页截图为风格参考，保持完全一致的角色比例、描边粗细与配色饱和度]。
--ar 1:1 --style cute`,
    contentEn: `An adorable [IP / Subject, e.g. chibi capybara avatar] as the main visual for a mini-game icon, [angle, e.g. front view, round chubby face, gentle smile],
[Accessories, e.g. tiny pink cherry blossom and yellow star on the ear],
thick rounded [Outline, e.g. black] outline (~5px), [Palette, e.g. high-saturation warm color palette],
[Background, e.g. circular gradient from sky blue to vivid grass green with a warm radial glow],
[Style positioning, e.g. kawaii healing cartoon illustration, picture-book hand-drawn texture],
high quality, square composition with circular safe area, no text,
[Optional: style-reference: the provided "[Game Name]" home-screen screenshot — match outline weight, character proportions and saturation exactly].
--ar 1:1 --style cute

> Export PNG transparent 1024×1024, then downscale to 256×256 for submission.`
  },
  {
    title: '横版游戏封面（16:9，含画进画面的标题与副标）',
    content: `横版游戏封面，左侧是 [左侧主体，例如 一只圆滚滚的 IP 角色慵懒地坐在草地上，伸出小爪子轻点前方的几个 [玩法元素] 图块]，眼神温柔微笑，脸上一抹粉嫩腮红，
身边漂浮着 [氛围装饰，例如 樱花花瓣和几只小蝴蝶]，

右侧直接画上中文大字主标"[主标，例如 游戏名]"（[主标样式，例如 红橙渐变 + 4-6px 深棕黑粗描边，字体厚实圆润 Q 版，旁边点缀 1-2 颗小黄星和小红心]），
主标下方稍小一行中文副标"[副标语]"（[副标样式，例如 深棕色 + 细描边]），

背景是 [背景描述，例如 高饱和的蓝天（带几朵粗描边白云）和黄绿色草地，远处有低饱和绿树点缀]，
角色和所有元素采用 [描边规格，例如 粗圆黑色描边 4-6px]，[风格定位，例如 治愈系 Q 版卡通插画]，
[配色基调，例如 明亮高饱和的暖色调，蓝天 + 草地黄绿 + 暖橙为主]，
所有中文文字必须清晰、笔画完整、可读，不出现错字漏字或乱码字符，
[（可选）请以提供的游戏首页截图为风格参考，保持一致的描边粗细、配色与角色比例]。
--ar 16:9

> 提示：让 AI 直接把主标 + 副标画进图里，不再 PS 后期加字。如出现错字 / 乱码，换豆包 / 即梦 / 文心一格再跑，或单独把文字层用 Figma 按相同字形手画一遍盖回原位置。`
  },
  {
    title: '微信通用素材封面（650×250 / 13:5）',
    content: `横版超扁条游戏推广封面图，13:5 比例（约 2.6:1），[风格定位，例如 治愈系 Q 版卡通插画风格]，
画面横向三段式构图：

左 1/3 区：[左区主体，例如 一只圆滚滚的 Q 版 IP 角色半身侧 3/4 视角，脸蛋粉嫩腮红微笑，伸出小爪子轻点前方棋盘]；

中 1/3 区：[中区玩法元素，例如 3-4 个圆润粗黑描边的 [玩法元素] 图块（[图块内容举例]），一条暖橙色发光折线带 1-2 处拐弯正把两个图块连起来，连线末端散出金黄色闪光粒子和"＋"号小消除特效]；

右 1/3 区：[右区氛围与文字，例如 几束高饱和小雏菊和蒲公英、一两枝樱花、1-2 只小蝴蝶飞过；画面右上方直接画上中文大字标语"[标语，≤ 10 字]"（红橙渐变 #FF6B35 → #E84D2D + 5-6px 深棕黑粗描边 #2B2118，字体厚实圆润 Q 版，旁边点缀 1 颗小黄星）]；

不要出现游戏名"[游戏名]"任何字样，不要出现游戏图标或 logo；
背景是 [背景，例如 高饱和天空蓝（顶部）渐变到黄绿色草地（底部），点缀 1-2 朵粗描边白云]；
所有角色与元素采用 [描边规格，例如 粗圆黑色描边 4-5px]，[配色基调]，
中文文字必须清晰、笔画完整、可读，不出现错字漏字或乱码字符，
[（可选）请以提供的游戏首页截图为风格参考，保持一致的描边粗细、配色饱和度与角色比例]。
--ar 13:5

> 微信规格：JPG，≤ 80 KB，650×250 PX，不要放游戏名和图标，只展示玩法 / 概念 / 亮点。`
  },
  {
    title: '微信详细推广图 - 竖版（720×1280 / 9:16）',
    content: `以提供的 [底图描述，例如 游戏内某主题某瞬间] 游戏截图为底图（图生图），
保留原图的 [需保留的氛围，例如 水彩感春日草地远景、配色、笔触]，但去掉所有 UI（[要去掉的 UI 清单，例如 设置齿轮、关卡指示器、宝箱、底部三个按钮、胶囊菜单]），

把原图中央 [核心展示元素，例如 "好耶！"消除特效区域] 放大到占画面中心约 [比例，例如 60%]，加强 [核心特效，例如 飘散的粉色樱花花瓣、半透明大白色花朵、金黄小星星、红色小爱心、白色闪光向四周迸发]，
特效中央可保留一个稍微缩小的 [中心文字 / 元素，例如 黄色卡通字"好耶！"（字体厚实可爱，带深棕黑描边）]，
特效周围围绕 [辅助元素，例如 4-6 个高清放大的 [玩法元素] 图块（[图块内容举例]），图块为奶白色圆润粗黑描边方形卡片]，

画面顶部 1/4 [顶部保留内容，例如 保留模糊的水彩远景（树荫剪影 + 一抹海岸蓝 + 黄色小花）]，

画面底部 1/5 直接画上中文大字标语"[标语]"（[标语样式，例如 红橙渐变 #FF6B35 → #E84D2D + 5-6px 深棕黑粗描边 #2B2118，字体厚实圆润 Q 版，旁边点缀 1 颗小黄星和 1 颗小红心]），

不要出现游戏名"[游戏名]"任何字样，不要出现游戏图标、logo、按钮、关卡数字、菜单或任何 UI 控件，
所有元素采用 [描边规格]，[风格定位] + [配色基调]，
中文文字必须清晰、笔画完整、可读，不出现错字漏字或乱码字符，
[（可选）请以提供的游戏首页截图为整体风格参考，保持描边粗细、配色饱和度、图块比例完全一致]。
--ar 9:16

> 微信规格：JPG / PNG，≤ 200 KB，720×1280 PX。本质是「改图 + 重组 + 加文字」，建议双图垫图：原始截图 + 游戏首页截图。`
  },
  {
    title: '微信详细推广图 - 横版（1280×720 / 16:9）',
    content: `以提供的 [底图描述] 游戏截图为底图（图生图），横版 16:9 构图，
去掉所有 UI（[要去掉的 UI 清单]），

画面左 [左区比例，例如 60]% 区为玩法主体：[左区核心元素，例如 中央放大特效粒子 + 辅助元素环绕]；

画面右 [右区比例，例如 40]% 区为留白文字区：上半部直接画上中文超大标题"[主标]"（[主标样式，例如 红橙渐变 + 5-6px 深棕黑粗描边，字体厚实圆润 Q 版，分两行排版，旁边点缀小星 / 小心装饰]），
标题下方一行小字"[副标]"（[副标样式]）；

不要出现游戏名"[游戏名]"任何字样，不要出现游戏图标、logo、按钮、关卡数字、菜单或任何 UI 控件，
所有元素采用 [描边规格]，[风格定位] + [配色基调]，
中文文字必须清晰、笔画完整、可读，不出现错字漏字或乱码字符，
[（可选）请以提供的游戏首页截图为整体风格参考，保持描边粗细、配色饱和度、图块比例完全一致]。
--ar 16:9

> 横版与竖版同主题应一一对应，文案完全一致，仅"上下分层"换成"左右分区"，让 3 横 + 3 竖共 6 张作为系列资产视觉统一。`
  },
  {
    title: '公众号头图 / 视觉延展插画',
    content: `横版 [风格定位，例如 治愈系春日草地全景插画]，远处是 [远景，例如 低饱和绿色山峦和粗描边白云朵]，
近景的 [近景，例如 高饱和黄绿草地上散落着小雏菊和蒲公英，3-5 只圆滚滚的 IP 角色慵懒地坐着或躺着]，
[氛围动作，例如 有的在嗅樱花，有的在打瞌睡，旁边还跟着一只小黄鸡和几只小蝴蝶]，
所有角色和元素采用 [描边规格，例如 粗圆黑色描边 4-6px]，[配色基调，例如 高饱和暖色调，天空蓝 + 草地黄绿 + 暖橙 + 樱花粉]，

画面顶部居中直接画上中文主标语"[主标语]"（[主标样式，例如 红橙渐变 + 4-6px 深棕黑粗描边，字体厚实圆润 Q 版，旁边点缀小黄星和小樱花]），
主标语下方稍小一行中文副标"[副标语]"（[副标样式，例如 深棕色 + 细描边]），

中文文字必须清晰、笔画完整、可读，不出现错字漏字或乱码字符，
[风格定位，例如 治愈萌系 Q 版卡通儿童绘本风，明亮温暖手绘质感]，
[（可选）请以提供的游戏首页截图为风格参考，保持描边粗细、配色和角色比例完全一致]。
--ar [比例，常用 16:9（公众号头图 900×383）/ 16:7（客服群欢迎图 750×400）/ 9:16（小红书 1080×1920）]`
  },
  {
    title: '游戏圈 Banner（1080×270 / 4:1）',
    content: `横版超扁条游戏圈 Banner 图，4:1 比例（1080:270），[风格定位，例如 治愈系 Q 版卡通插画风格]，
画面横向三段式构图：

左 [左比例，例如 30]% 区：[左区主体，例如 一只 IP 角色做出 [话题对应动作，例如 双手举相框/趴桌写日记/挠头举问号]，脸蛋粉嫩腮红，[表情，例如 得意微笑/专注/困惑]]；

中 [中比例，例如 40]% 区：[中区话题元素，例如 烟花粒子 + 小红心 + 小黄星向四周迸发，飘几片樱花花瓣，1-2 个 [玩法元素] 图块漂浮装饰]；

右 [右比例，例如 30]% 区：上半直接画中文大字主标语"[主标，例如 晒通关，等你点赞]"（[主标样式，例如 红橙渐变 #FF6B35 → #E84D2D + 5-6px 深棕黑粗描边 #2B2118，字体厚实圆润 Q 版，分两行排版]），
主标语下方画一枚倾斜约 -5° 的暖橙底（#F39A3C）胶囊药丸状话题贴纸，贴纸上写中文"[#话题标签]"（白色厚实字 + 深棕黑粗描边，井号 # 与文字一体），贴纸旁边点缀 1 颗小黄星；
贴纸右下方画一个小圆角暖橙按钮上写中文"前往 →"（深棕字 + 细描边）；

不要出现游戏名"[游戏名]"任何字样，不要出现游戏图标、logo、按钮、关卡数字、菜单或任何 UI 控件，
背景是 [背景，例如 高饱和天空蓝（顶部 #7DCFEB）渐变到黄绿色草地（底部 #9ECF3D），点缀 1-2 朵粗描边白云和零星樱花花瓣]，
所有元素采用 [描边规格，例如 粗圆黑色描边 4-5px]，[配色基调]，
中文文字必须清晰、笔画完整、可读，不出现错字漏字或乱码字符，
[（可选）请以提供的游戏首页截图为风格参考，保持描边粗细、配色饱和度与角色比例完全一致]。
--ar 4:1

> 必备三件套：话题 Tag 胶囊贴纸 + 主标语 + "前往 →" 小按钮。多张话题轮播时，整套风格（描边粗细 / 配色饱和度 / IP 比例）必须保持一致。`
  },

  // ============ 杂项工具 ============
  {
    title: '公众号洗稿',
    content: `# Role
你是一位拥有 10 万+阅读量创作经验的微信公众号资深编辑，擅长将硬核、枯燥的技术或外网博客转化为符合中文语境、易于传播、排版精美的爆款文章。

# Task
我会为你提供一段国外博客的 HTML 源代码。请你执行以下操作：
1. **深度洗稿**：提取核心观点，用中文重新表述。要求语感自然、口语化，严禁生硬翻译。
2. **逻辑保留**：不要极致压缩篇幅。必须完整保留原文章的主体逻辑和核心知识点，确保读者能深度理解技术细节。
3. **结构重塑**：按照公众号阅读习惯重新划分段落，增加吸引人的小标题。
4. **情绪填充**：开头增加能引起共鸣的 Hook，结尾增加总结或互动话题。

# Style Requirements
1. **排版**：每段不超过 3 行。适当增加 Emoji 增强视觉轻松感。
2. **金句融合**：文中要自然穿插具有感染力的金句，但**严禁**使用"金句："等字样进行标注，直接融入段落即可。
3. **互动感**：多使用"你"、"我们"，拉近与读者的距离。
4. **纯净提取**：自动忽略 HTML 中的广告、导航、侧边栏等无关代码。

# Output Format (Markdown)
请在代码块中返回以下内容：

1. **标题**：给出 3 个具有点击欲望的标题（包含：好奇心型、干货型、痛点型）。
2. **正文**：使用标准的 Markdown 格式。
3. **插图建议**：在适合放图的地方标注 [此处插入一张关于 XXX 的图片]。`
  }
]
