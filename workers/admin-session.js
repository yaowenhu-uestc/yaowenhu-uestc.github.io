const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64Url(bytes) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlBytes(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

export function randomId() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

function equalBytes(left, right) {
  if (left.length !== right.length) return false;
  return left.reduce((difference, byte, index) => difference | (byte ^ right[index]), 0) === 0;
}

export async function sessionCookie(sessionId, secret) {
  const signature = await sign(sessionId, secret);
  return `__Host-hyw-admin=${sessionId}.${signature}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800`;
}

export function expiredSessionCookie() {
  return "__Host-hyw-admin=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
}

export async function readSessionId(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("__Host-hyw-admin="))?.slice("__Host-hyw-admin=".length);
  if (!token) return null;
  try {
    const [sessionId, signature] = token.split(".");
    if (!sessionId || !signature) return null;
    return equalBytes(base64UrlBytes(signature), base64UrlBytes(await sign(sessionId, secret))) ? sessionId : null;
  } catch {
    return null;
  }
}

export async function sessionRequest(env, path, options = {}) {
  const session = env.ADMIN_SESSIONS.getByName("global");
  return session.fetch(`https://session${path}`, options);
}

export class AdminSession {
  constructor(ctx) {
    this.storage = ctx.storage;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    if (!key) return new Response("Missing key", { status: 400 });
    if (request.method === "GET") {
      const value = await this.storage.get(key);
      return Response.json(value || null);
    }
    if (request.method === "PUT") {
      const { value, expirationTtl } = await request.json();
      await this.storage.put(key, value, { expirationTtl });
      return new Response(null, { status: 204 });
    }
    if (request.method === "DELETE") {
      const value = await this.storage.get(key);
      await this.storage.delete(key);
      return Response.json(value || null);
    }
    return new Response("Method not allowed", { status: 405 });
  }
}
