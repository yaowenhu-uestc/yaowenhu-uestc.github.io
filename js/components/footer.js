import { githubUrl } from "../data.js";

export function footer() {
  return `
    <footer class="shell footer">
      <div class="visit-stats" aria-label="访问统计">
        <p><span id="total-visits">—</span>总访问</p>
        <p><span id="today-visits">—</span>今日访问</p>
      </div>
      <a href="${githubUrl}" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
    </footer>`;
}
