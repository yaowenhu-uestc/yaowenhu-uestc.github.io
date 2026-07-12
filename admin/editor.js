const state = { content: null, dirty: false, section: "hero" };
const loginPanel = document.querySelector("#login-panel");
const studioPanel = document.querySelector("#studio-panel");
const properties = document.querySelector("#properties");
const preview = document.querySelector("#preview");
const publish = document.querySelector("#publish");
const status = document.querySelector("#status");

function api(path, options) {
  return fetch(`/admin/api${path}`, { credentials: "same-origin", ...options });
}

function setStatus(message, tone = "") {
  status.textContent = message;
  status.dataset.tone = tone;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function markDirty() {
  state.dirty = true;
  publish.disabled = false;
  setStatus("有未发布的修改。");
  refreshPreview();
}

function refreshPreview() {
  const { hero, about, experiences, projects, style } = state.content;
  const experienceHtml = experiences.map((item) => `<article data-section="experiences"><small>${escapeHtml(item.date)}</small><h3>${escapeHtml(item.company)}</h3><strong>${escapeHtml(item.role)}</strong><p>${escapeHtml(item.summary)}</p><ul>${item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></article>`).join("");
  const projectHtml = projects.map((item) => `<article data-section="projects"><small>${escapeHtml(item.type)}</small><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><span>↗</span></article>`).join("");
  preview.srcdoc = `<!doctype html><html lang="zh-CN"><head><style>:root{--accent:${escapeHtml(style.accentColor)};--radius:${Number(style.cardRadius)}px;--space:${Number(style.sectionSpace)}px}*{box-sizing:border-box}body{margin:0;color:#171717;background:#fbfbf9;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{width:min(100% - 64px,1180px);margin:auto}.nav{height:64px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e5e5;font-weight:700}.nav span{color:#777;font-size:13px}.hero{display:grid;grid-template-columns:1fr 32%;gap:64px;align-items:center;padding:52px 0}.hero h1{font-size:clamp(52px,8vw,92px);letter-spacing:-.07em;margin:0 0 18px}.hero p,.section>p,article p,li{color:#6b6b6b;line-height:1.7}.buttons{display:flex;gap:12px;margin-top:22px}.button{padding:13px 17px;border-radius:14px;background:var(--accent);color:#fff;font-size:14px;font-weight:700}.button.alt{background:#f4f4f2;color:#222}.photo{width:100%;aspect-ratio:1;border-radius:50%;object-fit:cover;background:#eee}.section{padding:var(--space) 0;border-top:1px solid #e5e5e5}.section h2{font-size:42px;letter-spacing:-.06em}.list{margin-top:28px}.experience{display:grid;gap:0}.experience article{padding:22px 0;border-top:1px solid #e5e5e5}.experience article:last-child{border-bottom:1px solid #e5e5e5}.experience h3,.projects h3{font-size:26px;margin:5px 0}.experience strong{font-size:15px}.experience ul{padding-left:18px}.projects{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:28px}.projects article{position:relative;min-height:190px;padding:22px;border:1px solid #e5e5e5;border-radius:var(--radius);background:#fff}.projects span{position:absolute;right:20px;bottom:16px;color:var(--accent);font-size:27px}small{color:#777} [data-section]{cursor:pointer;outline:0;transition:box-shadow .15s}[data-section]:hover{box-shadow:0 0 0 3px var(--accent)}@media(max-width:600px){main{width:min(100% - 32px,560px)}.hero{grid-template-columns:1fr;gap:24px}.photo{max-width:300px}.projects{grid-template-columns:1fr}}</style></head><body><main><nav class="nav"><b data-section="hero">${escapeHtml(hero.name)}</b><span>关于　经历　作品</span></nav><section class="hero" data-section="hero"><div><h1>${escapeHtml(hero.name)}</h1><p>${escapeHtml(hero.summary)}</p><div class="buttons"><span class="button">${escapeHtml(hero.githubButtonText)}</span><span class="button alt">${escapeHtml(hero.experienceButtonText)}</span></div></div><img class="photo" src="${escapeHtml(hero.photo)}" alt="头像" /></section><section class="section" data-section="about"><h2>${escapeHtml(about.title)}</h2><p>${escapeHtml(about.text)}</p></section><section class="section"><h2 data-section="experiences">实习经历</h2><div class="list experience">${experienceHtml}</div></section><section class="section"><h2 data-section="projects">代表作品</h2><div class="projects">${projectHtml}</div></section></main><script>document.addEventListener('click',e=>{const target=e.target.closest('[data-section]');if(target)parent.postMessage({section:target.dataset.section},'*')})<\/script></body></html>`;
}

function field(label, value, path, type = "text") {
  const safeValue = type === "textarea" ? escapeHtml(value) : escapeHtml(value || "");
  return `<label class="field">${label}${type === "textarea" ? `<textarea data-path="${path}">${safeValue}</textarea>` : `<input type="${type}" value="${safeValue}" data-path="${path}" />`}</label>`;
}

function renderHero() {
  const { hero } = state.content;
  properties.innerHTML = `<h2>首页形象</h2><p>修改访客首先看到的内容。</p>${field("姓名", hero.name, "hero.name")}${field("一句话介绍", hero.summary, "hero.summary", "textarea")}${field("邮箱", hero.email, "hero.email")}${field("GitHub 链接", hero.githubUrl, "hero.githubUrl")}${field("主按钮文字", hero.githubButtonText, "hero.githubButtonText")}${field("第二个按钮文字", hero.experienceButtonText, "hero.experienceButtonText")}<label class="field">头像照片<input id="photo-upload" type="file" accept="image/*" /></label>`;
}

function renderAbout() {
  const { about } = state.content;
  properties.innerHTML = `<h2>关于我</h2><p>用一段话介绍自己。</p>${field("区块标题", about.title, "about.title")}${field("自我介绍", about.text, "about.text", "textarea")}`;
}

function experienceCard(item, index) {
  return `<article class="card-editor"><h3>经历 ${index + 1}</h3>${field("时间", item.date, `experiences.${index}.date`)}${field("公司", item.company, `experiences.${index}.company`)}${field("职位", item.role, `experiences.${index}.role`)}${field("简介", item.summary, `experiences.${index}.summary`, "textarea")}${field("工作要点（一行一条）", item.points.join("\n"), `experiences.${index}.points`, "textarea")}<div class="card-actions"><button class="text-button" data-move="experiences" data-index="${index}" data-direction="up" type="button">上移</button><button class="text-button" data-move="experiences" data-index="${index}" data-direction="down" type="button">下移</button><button class="text-button danger" data-remove="experiences" data-index="${index}" type="button">删除</button></div></article>`;
}

function projectCard(item, index) {
  return `<article class="card-editor"><h3>作品 ${index + 1}</h3>${field("名称", item.title, `projects.${index}.title`)}${field("类型", item.type, `projects.${index}.type`)}${field("介绍", item.description, `projects.${index}.description`, "textarea")}${field("跳转链接", item.url, `projects.${index}.url`)}<div class="card-actions"><button class="text-button" data-move="projects" data-index="${index}" data-direction="up" type="button">上移</button><button class="text-button" data-move="projects" data-index="${index}" data-direction="down" type="button">下移</button><button class="text-button danger" data-remove="projects" data-index="${index}" type="button">删除</button></div></article>`;
}

function renderCards(kind, title, intro, card) {
  properties.innerHTML = `<h2>${title}</h2><p>${intro}</p>${state.content[kind].map(card).join("")}<button class="button secondary" id="add-card" data-kind="${kind}" type="button">添加${kind === "experiences" ? "经历" : "作品"}</button>`;
}

function renderStyle() {
  const { style } = state.content;
  properties.innerHTML = `<h2>页面风格</h2><p>保持首页现有风格，只调整三个基础视觉属性。</p>${field("主色", style.accentColor, "style.accentColor", "color")}${field("卡片圆角（px）", style.cardRadius, "style.cardRadius", "number")}${field("区块间距（px）", style.sectionSpace, "style.sectionSpace", "number")}`;
}

function renderProperties() {
  if (state.section === "hero") renderHero();
  if (state.section === "about") renderAbout();
  if (state.section === "experiences") renderCards("experiences", "实习经历", "可添加、删除和调整顺序。", experienceCard);
  if (state.section === "projects") renderCards("projects", "代表作品", "可添加、删除和调整顺序。", projectCard);
  if (state.section === "style") renderStyle();
}

function valueAtPath(path) {
  return path.split(".").reduce((value, key) => value[key], state.content);
}

function updatePath(path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const parent = keys.reduce((target, key) => target[key], state.content);
  parent[lastKey] = path.endsWith(".points") ? value.split("\n").map((point) => point.trim()).filter(Boolean) : value;
  markDirty();
}

properties.addEventListener("input", (event) => {
  if (event.target.dataset.path) updatePath(event.target.dataset.path, event.target.value);
});

properties.addEventListener("click", (event) => {
  const { move, remove, index, direction, kind } = event.target.dataset;
  if (move) {
    const current = Number(index);
    const next = direction === "up" ? current - 1 : current + 1;
    if (!state.content[move][next]) return;
    [state.content[move][current], state.content[move][next]] = [state.content[move][next], state.content[move][current]];
    markDirty(); renderProperties();
  }
  if (remove) {
    state.content[remove].splice(Number(index), 1);
    markDirty(); renderProperties();
  }
  if (event.target.id === "add-card") {
    state.content[kind].push(kind === "experiences" ? { date: "", company: "", role: "", summary: "", points: [] } : { title: "", type: "", description: "", url: "" });
    markDirty(); renderProperties();
  }
});

properties.addEventListener("change", async (event) => {
  if (event.target.id !== "photo-upload" || !event.target.files[0]) return;
  const file = event.target.files[0];
  setStatus("正在上传照片…");
  const data = await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); });
  const response = await api("/assets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name, data }) });
  const result = await response.json();
  if (!response.ok) return setStatus(result.error || "照片上传失败。", "error");
  state.content.hero.photo = result.path;
  markDirty();
});

document.querySelectorAll(".section-button").forEach((button) => button.addEventListener("click", () => {
  state.section = button.dataset.section;
  document.querySelector(".section-button.active").classList.remove("active");
  button.classList.add("active");
  renderProperties();
}));

window.addEventListener("message", (event) => {
  if (!event.data?.section) return;
  document.querySelector(`.section-button[data-section="${event.data.section}"]`)?.click();
});

publish.addEventListener("click", async () => {
  publish.disabled = true;
  setStatus("正在发布更新…");
  const response = await api("/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: state.content }) });
  const result = await response.json();
  if (!response.ok) { setStatus(result.error || "发布失败。", "error"); publish.disabled = false; return; }
  state.dirty = false;
  setStatus("已发布，主页将在一分钟左右更新。", "success");
});

document.querySelector("#logout").addEventListener("click", async () => { await fetch("/admin/logout", { method: "POST", credentials: "same-origin" }); window.location.reload(); });

async function initialize() {
  const sessionResponse = await api("/session");
  if (!sessionResponse.ok) return;
  const session = await sessionResponse.json();
  const contentResponse = await api("/content");
  const result = await contentResponse.json();
  if (!contentResponse.ok) return setStatus(result.error || "主页内容加载失败。", "error");
  state.content = result.content;
  document.querySelector("#account").textContent = session.login;
  loginPanel.hidden = true; studioPanel.hidden = false;
  renderProperties(); refreshPreview(); setStatus("已加载。点击左侧区块开始编辑。");
}

initialize();
