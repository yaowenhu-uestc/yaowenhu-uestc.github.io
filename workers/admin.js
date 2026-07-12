import { beginLogin, completeLogin } from "./admin-auth.js";
import { editableFiles, readFile, writeFile } from "./admin-repository.js";
import { expiredSessionCookie, readSessionId, sessionRequest } from "./admin-session.js";

const adminPageUrl = "https://yaowenhu-uestc.github.io/admin/index.html";

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

async function serveAdminPage() {
  const response = await fetch(adminPageUrl);
  if (!response.ok) return new Response("管理员页面尚未发布。", { status: 503 });
  return new Response(response.body, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
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
