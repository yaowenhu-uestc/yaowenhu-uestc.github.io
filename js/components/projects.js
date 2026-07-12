import { projects } from "../data.js";

export function projectsSection() {
  const cards = projects.map((project) => `
    <a class="project-card" href="${project.url}" target="_blank" rel="noreferrer">
      <p class="project-type">${project.type}</p>
      <div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
      <span class="project-arrow" aria-hidden="true">↗</span>
    </a>`).join("");

  return `
    <section id="work" class="shell section work" aria-labelledby="work-title">
      <div class="section-heading">
        <h2 id="work-title">代表作品</h2>
      </div>
      <div class="project-grid">${cards}</div>
    </section>`;
}
