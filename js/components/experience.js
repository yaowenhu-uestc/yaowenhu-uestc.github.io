import { experiences } from "../data.js";

export function experience() {
  const cards = experiences.map((item) => `
    <article class="experience-card">
      <p class="experience-date">${item.date}</p>
      <div>
        <p class="experience-company">${item.company}</p>
        <h3>${item.role}</h3>
        <p class="experience-summary">${item.summary}</p>
        <ul>${item.points.map((point) => `<li>${point}</li>`).join("")}</ul>
      </div>
    </article>`).join("");

  return `
    <section id="experience" class="shell section" aria-labelledby="experience-title">
      <div class="section-heading">
        <p class="kicker">EXPERIENCE</p>
        <h2 id="experience-title">实习经历</h2>
      </div>
      <div class="experience-list">${cards}</div>
    </section>`;
}
