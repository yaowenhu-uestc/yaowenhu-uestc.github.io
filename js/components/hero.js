import { email, githubUrl } from "../data.js";

export function hero() {
  return `
    <section id="top" class="shell hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title">胡耀文</h1>
        <p class="hero-summary">创造一个原本不存在、后来被很多人使用的产品。</p>
        <div class="hero-actions">
          <a class="button button-primary" href="${githubUrl}" target="_blank" rel="noreferrer">访问 GitHub <span aria-hidden="true">↗</span></a>
          <a class="button button-secondary" href="#experience">查看经历 <span aria-hidden="true">↓</span></a>
        </div>
        <a class="hero-email" href="mailto:${email}">${email}</a>
      </div>
      <figure class="hero-photo">
        <img src="assets/hero-beach.jpg" alt="胡耀文在海边" />
      </figure>
    </section>`;
}
