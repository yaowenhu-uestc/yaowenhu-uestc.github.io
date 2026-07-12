import { githubUrl } from "../data.js";

export function hero() {
  return `
    <section id="top" class="shell hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="kicker">AI PRODUCT PRACTITIONER</p>
        <h1 id="hero-title">胡耀文<br /><span>Yaowen Hu</span></h1>
        <p class="hero-summary">关注 Relationship AI、用户模型与 Agent 工作流，把复杂的模型能力做成真正可用、可持续的产品体验。</p>
        <div class="hero-actions">
          <a class="button button-primary" href="${githubUrl}" target="_blank" rel="noreferrer">访问 GitHub <span aria-hidden="true">↗</span></a>
          <a class="button button-secondary" href="#experience">查看经历 <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <figure class="hero-photo">
        <img src="assets/hero-beach.jpg" alt="胡耀文在海边" />
      </figure>
    </section>`;
}
