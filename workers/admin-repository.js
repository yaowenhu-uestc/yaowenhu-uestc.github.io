const repository = "yaowenhu-uestc/yaowenhu-uestc.github.io";

export const editableFiles = [
  "index.html",
  "js/data.js",
  "styles/base.css",
  "styles/components.css",
  "styles/layout.css",
  "styles/main.css",
  "styles/responsive.css",
  "styles/tokens.css"
];

function repositoryPath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function decodeContent(value) {
  const bytes = Uint8Array.from(atob(value.replaceAll("\n", "")), (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeContent(value) {
  const bytes = new TextEncoder().encode(value);
  let encoded = "";
  for (let index = 0; index < bytes.length; index += 0x8000) encoded += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(encoded);
}

async function github(token, path, options = {}) {
  return fetch(`https://api.github.com/repos/${repository}/contents/${repositoryPath(path)}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "Hywen-Website-Editor",
      "X-GitHub-Api-Version": "2026-03-10",
      ...options.headers
    }
  });
}

export async function readFile(token, path) {
  if (!editableFiles.includes(path)) return { error: "该文件不允许编辑。", status: 403 };
  const response = await github(token, path);
  if (!response.ok) return { error: "无法读取该文件。", status: response.status };
  const file = await response.json();
  return { content: decodeContent(file.content), sha: file.sha };
}

export async function writeFile(token, { path, content, sha }) {
  if (!editableFiles.includes(path)) return { error: "该文件不允许编辑。", status: 403 };
  if (typeof content !== "string" || typeof sha !== "string") return { error: "保存参数不完整。", status: 400 };
  const response = await github(token, path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `Edit ${path} via website editor`, content: encodeContent(content), sha, branch: "main" })
  });
  if (response.status === 409) return { error: "远端文件已更新，请重新加载后再保存。", status: 409 };
  if (!response.ok) return { error: "GitHub 未能保存该文件。", status: response.status };
  const result = await response.json();
  return { commitUrl: result.commit.html_url, sha: result.content.sha };
}
