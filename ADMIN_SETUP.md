# 网站后台配置

后台入口：`https://hyw-visit-counter.infidive-tv.workers.dev/admin`

## GitHub App

在 GitHub Developer Settings 创建 GitHub App，并设置：

- Callback URL：`https://hyw-visit-counter.infidive-tv.workers.dev/admin/auth/callback`
- Repository permissions：`Contents: Read and write`、`Metadata: Read-only`
- User authorization：启用 OAuth web flow 与用户访问令牌过期
- 安装范围：仅 `yaowenhu-uestc/yaowenhu-uestc.github.io`

创建后，将 App 的 Client ID 与 Client secret 写入 Worker：

```bash
npx wrangler secret put GITHUB_APP_CLIENT_ID
npx wrangler secret put GITHUB_APP_CLIENT_SECRET
npx wrangler secret put SESSION_SECRET
```

`SESSION_SECRET` 使用至少 32 字节的随机字符串。

## 发布顺序

先推送本仓库，让 `admin/` 静态资源由 GitHub Pages 发布；再执行：

```bash
npx wrangler deploy
```

登录仅接受 GitHub 用户名 `yaowenhu-uestc`。编辑器只允许修改 `index.html`、`js/data.js` 和 `styles/` 下的样式文件。
