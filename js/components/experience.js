import { experiences } from "../data.js";

export function experience() {
  const cards = experiences.map((item, index) => `
    <article class="experience-card" data-edit-card="experiences" data-edit-index="${index}">
      <p class="experience-date" data-edit="experiences.${index}.date">${item.date}</p>
      <div>
        <p class="experience-company" data-edit="experiences.${index}.company">${item.company}</p>
        <h3 data-edit="experiences.${index}.role">${item.role}</h3>
        <p class="experience-summary" data-edit="experiences.${index}.summary">${item.summary}</p>
        <ul>${item.points.map((point, pointIndex) => `<li data-edit="experiences.${index}.points.${pointIndex}">${point}</li>`).join("")}</ul>
      </div>
    </article>`).join("");

  return `
    <section id="experience" class="shell section" aria-labelledby="experience-title">
      <div class="section-heading">
        <h2 id="experience-title">实习经历</h2>
      </div>
      <div class="experience-list">${cards}</div>
    </section>`;
}
