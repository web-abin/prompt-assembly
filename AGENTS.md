# 部署

以下是将本项目稳定部署到 GitHub Pages 的推荐流程与常见问题排查，确保不会再出现线上加载 /src/main.jsx 导致 404 的问题。

## 部署方式（二选一）
- GitHub Actions（推荐）
  - 保持 vite.config.js 中 base 为 /prompt-assembly/（项目页路径）。
  - 构建输出默认在 dist（无需额外配置）。
  - 使用 .github/workflows/pages.yml 自动构建并发布 dist 到 Pages。
  - 适合自动化、每次推送自动发布。
- 分支/docs 目录
  - vite.config.js 中 base 仍为 /prompt-assembly/。
  - 将构建输出设置为 docs（或手动把 dist 产物复制到 docs）。
  - 在 Settings → Pages 中选择 “Deploy from a branch”，分支 main，目录 /docs。

## 关键配置
- vite.config.js
  - base: /prompt-assembly/
  - 若使用 Actions，构建输出使用默认 dist；若使用分支/docs，构建输出到 docs。
- 路由
  - 采用 HashRouter（已启用），避免项目页路径下的 404 刷新问题。

## 操作步骤（Actions）
1. 推送到 main 分支或在 Actions 手动触发 “Deploy to GitHub Pages”。
2. 在 Settings → Pages 选择 Source 为 “GitHub Actions”。
3. 部署完成后访问：https://web-abin.github.io/prompt-assembly/

## 常见问题与排查
- 页面请求了 /src/main.jsx 导致 404
  - 原因：线上环境必须加载构建产物，不应引用源码路径。
  - 处理：确保通过 Vite 构建发布（dist 或 docs），并正确选择 Actions 或分支/docs 发布模式。
- 静态资源路径 404
  - 检查 vite.config.js 的 base 是否为 /prompt-assembly/。
  - 清理浏览器缓存或强制刷新（Ctrl/Command + Shift + R）。
- 切换发布方式后仍旧 404
  - 在 Pages 面板确认当前 Source（Actions 或分支/docs）。
  - 确认构建产物内存在 index.html 与 assets/。

## 验证
- 本地：npm run build 后检查 dist（或 docs）目录结构。
- 线上：打开 https://web-abin.github.io/prompt-assembly/，查看页面是否加载 dist/docs 下的 assets，而非 /src/main.jsx。

## 页面样式约定
- 各功能页的样式应做**局部隔离**，避免继续把大量页面专用样式堆进 `App.css` / `index.css` 等全局样式表。
- 推荐做法：为该页建立 `*.module.css`（CSS Modules），在页面组件根节点挂载模块根 class，仅在该文件内书写该页布局与皮肤；与全局的交互仅限于必要的布局容器（如 `ToolPageLayout`）。
- 需要复用多块页面时再抽取**共享**片段或变量，而不是默认写全局。
