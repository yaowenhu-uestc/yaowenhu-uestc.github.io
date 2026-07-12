const state = { path: null, content: "", sha: null, dirty: false };
const loginPanel = document.querySelector("#login-panel");
const editorPanel = document.querySelector("#editor-panel");
const fileList = document.querySelector("#file-list");
const editor = document.querySelector("#editor");
const fileTitle = document.querySelector("#file-title");
const status = document.querySelector("#status");
const save = document.querySelector("#save");
const account = document.querySelector("#account");

function api(path, options) {
  return fetch(`/admin/api${path}`, { credentials: "same-origin", ...options });
}

function setStatus(message, tone = "") {
  status.textContent = message;
  status.dataset.tone = tone;
}

function updateSaveState() {
  save.disabled = !state.path || !state.dirty;
}

function renderFiles(files) {
  fileList.replaceChildren(...files.map((path) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = path;
    button.className = path === state.path ? "file active" : "file";
    button.addEventListener("click", () => loadFile(path));
    return button;
  }));
}

async function loadFile(path) {
  if (state.dirty && !window.confirm("当前修改尚未保存，仍要切换文件吗？")) return;
  setStatus("正在读取文件…");
  const response = await api(`/files?path=${encodeURIComponent(path)}`);
  const file = await response.json();
  if (!response.ok) return setStatus(file.error || "无法读取文件。", "error");
  Object.assign(state, { path, content: file.content, sha: file.sha, dirty: false });
  editor.value = file.content;
  editor.disabled = false;
  fileTitle.textContent = path;
  renderFiles([...fileList.querySelectorAll(".file")].map((button) => button.textContent));
  setStatus("已加载。修改后可保存并发布。");
  updateSaveState();
}

editor.addEventListener("input", () => {
  state.dirty = editor.value !== state.content;
  setStatus(state.dirty ? "有未保存修改。" : "已加载。修改后可保存并发布。");
  updateSaveState();
});

save.addEventListener("click", async () => {
  save.disabled = true;
  setStatus("正在提交到 GitHub…");
  const response = await api("/files", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: state.path, content: editor.value, sha: state.sha })
  });
  const result = await response.json();
  if (!response.ok) {
    setStatus(result.error || "保存失败。", "error");
    return updateSaveState();
  }
  Object.assign(state, { content: editor.value, sha: result.sha, dirty: false });
  const link = document.createElement("a");
  link.href = result.commitUrl;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "查看提交 ↗";
  status.replaceChildren(document.createTextNode("已提交，等待 GitHub Pages 发布。 "), link);
  status.dataset.tone = "success";
  updateSaveState();
});

document.querySelector("#logout").addEventListener("click", async () => {
  await fetch("/admin/logout", { method: "POST", credentials: "same-origin" });
  window.location.reload();
});

async function initialize() {
  const response = await api("/session");
  if (!response.ok) return;
  const session = await response.json();
  loginPanel.hidden = true;
  editorPanel.hidden = false;
  account.textContent = session.login;
  renderFiles(session.files);
  loadFile(session.files[0]);
}

initialize();
