import { siteContent } from "../data.js";

export function hero() {
  const { hero: content } = siteContent;
  return `
    <section id="top" class="shell hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title">${content.name}</h1>
        <p class="hero-summary">${content.summary}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="${content.githubUrl}" target="_blank" rel="noreferrer">${content.githubButtonText} <span aria-hidden="true">↗</span></a>
          <a class="button button-secondary" href="#experience">${content.experienceButtonText} <span aria-hidden="true">↓</span></a>
        </div>
        <a class="hero-email" href="mailto:${content.email}">${content.email}</a>
      </div>
      <figure class="hero-photo">
        <img src="${content.photo}" alt="${content.name}的头像" />
      </figure>
    </section>`;
}
