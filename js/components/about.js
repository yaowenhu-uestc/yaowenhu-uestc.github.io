import { aboutSections } from "../data.js";

function sectionContent(section) {
  return section.groups.map((group) => `
    <div class="about-group">
      <h3>${group.title}</h3>
      <div class="principle-list">${group.items.map(([principle, description]) => `
        <div class="principle-row">
          <strong>${principle}</strong>
          <p>${description}</p>
        </div>`).join("")}</div>
    </div>`).join("");
}

export function about() {
  return `
    <section id="about" class="shell section about" aria-labelledby="about-title">
      <div class="section-heading">
        <h2 id="about-title">关于我</h2>
      </div>
      <div class="about-intro">
        <p>胡耀文，大三，就读于电子科技大学，行政管理专业。</p>
        <p>比起优化一个已经存在的东西，我更喜欢定义一个原本不存在的东西。</p>
      </div>
      <div class="about-accordions">${aboutSections.map((section) => `
        <details>
          <summary>${section.title}<span aria-hidden="true">+</span></summary>
          <div class="about-detail">${sectionContent(section)}</div>
        </details>`).join("")}</div>
    </section>`;
}
