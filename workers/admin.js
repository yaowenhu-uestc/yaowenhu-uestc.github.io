import { beginLogin, completeLogin } from "./admin-auth.js";
import { editableFiles, readFile, writeFile } from "./admin-repository.js";
import { expiredSessionCookie, readSessionId, sessionRequest } from "./admin-session.js";

const adminPage = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>胡耀文 · 网站后台</title>
    <link rel="stylesheet" href="https://yaowenhu-uestc.github.io/admin/styles.css" />
  </head>
  <body>
    <main class="admin-shell">
      <section class="login-card" id="login-panel">
        <p class="eyebrow">胡耀文的个人主页</p>
        <h1>网站后台</h1>
        <p>使用 GitHub 登录后编辑网站文件并提交发布。</p>
        <a class="button primary" href="/admin/login">使用 GitHub 登录</a>
      </section>
      <section class="editor" id="editor-panel" hidden>
        <header class="editor-header">
          <div><p class="eyebrow">网站后台</p><h1 id="file-title">选择文件</h1></div>
          <div class="header-actions"><span id="account"></span><button class="button secondary" id="logout" type="button">退出登录</button></div>
        </header>
        <div class="editor-layout">
          <nav aria-label="可编辑文件" id="file-list"></nav>
          <section class="editor-workspace">
            <textarea aria-label="文件内容" id="editor" spellcheck="false" disabled></textarea>
            <footer><p aria-live="polite" id="status">请选择文件。</p><button class="button primary" id="save" type="button" disabled>保存并发布</button></footer>
          </section>
        </div>
      </section>
    </main>
    <script type="module" src="https://yaowenhu-uestc.github.io/admin/editor.js"></script>
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
    return json({ login: session.login, expiresAt: session.expiresAt, files: editableFiles });
  }
  const session = await requireSession(request, env);
  if (!session) return json({ error: "Unauthorized" }, 401, { "Set-Cookie": expiredSessionCookie() });
  if (url.pathname === "/admin/api/files" && request.method === "GET") {
    const result = await readFile(session.token, url.searchParams.get("path") || "");
    return json(result, result.status || 200);
  }
  if (url.pathname === "/admin/api/files" && request.method === "PUT") {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "请求格式不正确。" }, 400);
    }
    const result = await writeFile(session.token, payload);
    return json(result, result.status || 200);
  }
  return json({ error: "Not found" }, 404);
}
