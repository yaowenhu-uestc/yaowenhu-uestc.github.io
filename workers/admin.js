import { beginLogin, completeLogin } from "./admin-auth.js";
import { readSiteContent, uploadAsset, writeSiteContent } from "./admin-repository.js";
import { expiredSessionCookie, readSessionId, sessionRequest } from "./admin-session.js";

const adminPage = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>胡耀文 · 主页编辑</title>
    <link rel="stylesheet" href="https://yaowenhu-uestc.github.io/admin/styles.css?v=visual-1" />
  </head>
  <body>
    <main class="admin-shell">
      <section class="login-card" id="login-panel">
        <p class="eyebrow">胡耀文的个人主页</p>
        <h1>编辑主页</h1>
        <p>登录后，像编辑演示文稿一样直接修改主页内容。</p>
        <a class="button primary" href="/admin/login">使用 GitHub 登录</a>
      </section>
      <section class="studio" id="studio-panel" hidden>
        <header class="studio-header">
          <div><p class="eyebrow">个人主页</p><h1>编辑主页</h1></div>
          <div class="header-actions"><span id="account"></span><button class="button secondary" id="logout" type="button">退出登录</button><button class="button primary" id="publish" type="button" disabled>发布更新</button></div>
        </header>
        <div class="studio-layout">
          <nav class="section-list" aria-label="页面区块"><button class="section-button active" data-section="hero" type="button">首页形象</button><button class="section-button" data-section="about" type="button">关于我</button><button class="section-button" data-section="experiences" type="button">实习经历</button><button class="section-button" data-section="projects" type="button">代表作品</button><button class="section-button" data-section="style" type="button">页面风格</button></nav>
          <section class="canvas-wrap"><div class="canvas-bar">实时预览 <span>点击内容即可编辑</span></div><iframe id="preview" title="个人主页预览"></iframe></section>
          <aside class="properties" id="properties"></aside>
        </div>
        <p class="status" aria-live="polite" id="status">正在加载主页…</p>
      </section>
    </main>
    <script type="module" src="https://yaowenhu-uestc.github.io/admin/editor.js?v=visual-1"></script>
  </body>
</html>`;

function json(value, status = 200, headers = {}) {
  return Response.json(value, { status, headers });
}

async function currentSession(request, env) {
  if (!env.SESSION_SECRET) return null;
  const sessionId = await readSessionId(request, env.SESSION_SECRET);
  if (!sessionId) return null;
  const response = await sessionRequest(env, `/session?key=session:${sessionId}`);
  const session = await response.json();
  return session?.expiresAt > Date.now() ? { ...session, sessionId } : null;
}

async function requireSession(request, env) {
  const session = await currentSession(request, env);
  return session || null;
}

function serveAdminPage() {
  return new Response(adminPage, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/admin")) return null;
  if (url.pathname === "/admin" || url.pathname === "/admin/") return serveAdminPage();
  if (url.pathname === "/admin/login" && request.method === "GET") return beginLogin(request, env);
  if (url.pathname === "/admin/auth/callback" && request.method === "GET") return completeLogin(request, env);
  if (url.pathname === "/admin/logout" && request.method === "POST") {
    const session = await currentSession(request, env);
    if (session) await sessionRequest(env, `/session?key=session:${session.sessionId}`, { method: "DELETE" });
    return json({ ok: true }, 200, { "Set-Cookie": expiredSessionCookie() });
  }
  if (url.pathname === "/admin/api/session" && request.method === "GET") {
    const session = await requireSession(request, env);
    if (!session) return json({ error: "Unauthorized" }, 401, { "Set-Cookie": expiredSessionCookie() });
    return json({ login: session.login, expiresAt: session.expiresAt });
  }
  const session = await requireSession(request, env);
  if (!session) return json({ error: "Unauthorized" }, 401, { "Set-Cookie": expiredSessionCookie() });
  if (url.pathname === "/admin/api/content" && request.method === "GET") {
    const result = await readSiteContent(session.token);
    return json(result, result.status || 200);
  }
  if (url.pathname === "/admin/api/content" && request.method === "PUT") {
    let payload;
    try { payload = await request.json(); } catch { return json({ error: "请求格式不正确。" }, 400); }
    const result = await writeSiteContent(session.token, payload);
    return json(result, result.status || 200);
  }
  if (url.pathname === "/admin/api/assets" && request.method === "POST") {
    let payload;
    try { payload = await request.json(); } catch { return json({ error: "请求格式不正确。" }, 400); }
    const result = await uploadAsset(session.token, payload);
    return json(result, result.status || 200);
  }
  return json({ error: "Not found" }, 404);
}
