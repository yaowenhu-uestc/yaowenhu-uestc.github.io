import { siteContent } from "../data.js";

export function about() {
  const { about: content } = siteContent;
  return `
    <section id="about" class="shell section about" aria-labelledby="about-title">
      <div class="section-heading">
        <h2 id="about-title" data-edit="about.title">${content.title}</h2>
      </div>
      <div class="about-intro">
        <p data-edit="about.text">${content.text}</p>
      </div>
    </section>`;
}
