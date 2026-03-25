# 部署到 GitHub Pages

本项目使用 **GitHub Actions** 在每次推送到 `main`（或 `master`）时自动执行 `npm run build`，并把 `dist` 发布为网站。

## 重要：不要用「从分支部署 /(root)」

若你在 **Settings → Pages** 里看到的是：

- Source：**Deploy from a branch**
- Branch：`main` / Folder：`/(root)`

这种方式会把**仓库根目录**当静态站，而本仓库根目录没有构建后的 HTML/JS，页面会空白或 404。

请改为：

1. 同一页面找到 **Build and deployment**。
2. 在 **Source** 里选择 **GitHub Actions**（不要选 Deploy from a branch）。

保存后，再按下面推送代码，由工作流负责发布 `dist/`。

## 一次性准备

1. **仓库推到 GitHub**  
   在 GitHub 新建仓库，把本地项目推上去（默认分支名为 `main` 或 `master` 均可，工作流两者都支持）。

2. **开启 Pages 的 Actions 来源（必须点保存）**  
   - 打开仓库 **Settings → Pages**。  
   - **Build and deployment → Source** 选 **GitHub Actions**。  
   - 若页面底部有 **Save**，务必点击保存；仅下拉选中但未保存时，后台仍未启用 Actions 部署，后续会出现 **404 Creating Pages deployment**。  
   - 若曾选过「从分支部署」，先改成 **GitHub Actions** 再保存。

3. **首次运行工作流**（若需要）  
   - 打开 **Actions** 标签，选中 **Deploy to GitHub Pages**，点 **Run workflow** 可手动触发（`workflow_dispatch`）。

4. **访问地址**  
   - 一般为：`https://<你的用户名>.github.io/<仓库名>/`  
   - 例如仓库名是 `prompt-assembly`，则多为 `https://<user>.github.io/prompt-assembly/`  
   - 部署完成后，在 **Settings → Pages** 顶部会显示 **Your site is live at …** 的链接。

## 日常发布

```bash
git add .
git commit -m "你的说明"
git push origin main
```

推送后，在 **Actions** 里等 **Deploy to GitHub Pages** 变绿（约 1～2 分钟），再刷新站点。

## 本地自检

```bash
npm ci
npm run build
npm run preview
```

浏览器打开终端里显示的地址，确认页面与路由（`#/…`）正常。

## 故障排查

| 现象 | 处理 |
|------|------|
| 站点空白、控制台 404 资源 | 确认 **Source 是 GitHub Actions**；确认 `vite.config.js` 里 `base: './'` 未被改错。 |
| Actions 报错 `npm ci` 失败 | 确保已提交 `package-lock.json` 并执行 `npm ci` 本地能通过。 |
| 部署成功但仍是旧页面 | 强刷或无痕打开；或等 CDN 缓存几分钟。 |
| 需要 `github.io` 根域名（如 `user.github.io` 仓库） | 把 `vite.config.js` 的 `base` 改为 `'/'` 再构建；本说明默认是 **项目页** `/<仓库名>/`。 |
| **`deploy-pages` 报错：`Creating Pages deployment failed` / `HttpError: Not Found` (404)** | 见下一节。 |

### `Failed to create deployment (status: 404)` / `Ensure GitHub Pages has been enabled`

说明 GitHub 端**还没有为当前仓库登记「通过 Actions 发布 Pages」**，`deploy-pages` 调用创建部署的 API 会返回 404。按顺序检查：

1. **Settings → Pages**  
   - **Source** 必须是 **GitHub Actions**。  
   - 若有 **Save**，保存一次。改完等几秒再 **Re-run** 失败的工作流。

2. **仓库可见性与套餐**  
   - **私有仓库**：免费账号若未开通「私有仓库的 GitHub Pages」，可能无法通过 Actions 部署；可先把仓库改为 **Public** 再试，或升级 GitHub 套餐后重试。  
   - **Fork 的仓库**：默认往往不能往 `gh-pages`/Actions Pages 发布，需用**自己名下的非 fork 仓库**。

3. **组织仓库**  
   - 若在 **Organization** 下，需管理员在组织 **Settings → Actions → General** 允许 **GitHub Actions**，且 **Pages** 策略允许从 Actions 部署。

4. **仍失败时**  
   - 在 **Settings → Pages** 将 Source 临时改为 **Deploy from a branch**，任选分支保存；再改回 **GitHub Actions** 并保存，强制刷新 Pages 配置后重新运行 workflow。

## 与截图里「Branch + /(root)」的区别

| 方式 | 含义 |
|------|------|
| **GitHub Actions（当前项目）** | CI 构建 `dist`，由 GitHub 托管 `dist` 里的静态文件。 |
| **Branch + /(root)** | 直接托管**分支根目录**里的文件，不会自动跑 Vite，不适合本仓库结构。 |
