const experiences = [
  {
    date: "2026.02 — 至今",
    company: "百度健康业务部",
    role: "AI 产品实习生",
    summary: "负责 AI 医院后台管理系统的产品规划与功能设计，搭建覆盖基础入驻、深度合作与 AI 共建的运营后台。",
    points: [
      "规划 AI 分导诊、AI 加号、智能候诊室、诊后管理、医生 Agent 与 Copilot 等核心模块。",
      "设计医院、科室、AI 分导诊与 AI 加号等数据维度，支持关键经营指标的可视化分析。",
      "推动医院批量入驻、医生管理、服务开通与内容运营工具落地。"
    ]
  },
  {
    date: "2025.10 — 2026.02",
    company: "好未来平台产品部",
    role: "AI 产品实习生",
    summary: "参与学而思亲子 App 家长社区从 0 到 1 建设，服务 3000+ 家长端用户。",
    points: [
      "完成社区基础建设与核心功能规划，覆盖推荐、搜索、审核和发帖等关键链路。",
      "规划 AI 学习集、讨论答疑与资料分享双模块，设计家长创建、分享与反馈闭环。",
      "制定分阶段供给策略，完成热门资料覆盖与种子用户共建，解决冷启动问题。"
    ]
  },
  {
    date: "2025.07 — 2025.10",
    company: "龙猫数据 · 大客户负责人部",
    role: "数据产品实习生",
    summary: "负责多模态数据集交付与标注运营，支持多个模型训练场景。",
    points: [
      "完成 6 个项目从立项到验收的流程管理，保障按期交付。",
      "通过标注流程优化缩短项目周期，提升整体交付效率。",
      "组织规则对齐、培训答疑与 SOP 建设，完善团队协同和质量管理。"
    ]
  }
];

const featuredWork = [
  {
    title: "AI Product Playbook",
    description: "沉淀 AI 产品判断、Prompt、Skill、Agent 与工作流实践。",
    url: "https://github.com/Diefeng-Hu/ai-product-playbook"
  },
  {
    title: "diefeng-skills",
    description: "面向个人工作流的 Agent Skills 集合。",
    url: "https://github.com/Diefeng-Hu/diefeng-skills"
  },
  {
    title: "infiDive Discover",
    description: "面向关系型 AI 的 iOS Dark Mode 发现页原型。",
    url: "https://github.com/Diefeng-Hu/infidive-discover"
  },
  {
    title: "Weekend Agent Demo",
    description: "将周末规划转化为可执行建议的 Agent 演示。",
    url: "https://github.com/Diefeng-Hu/weekend-agent-demo"
  }
];

const repositoryGroups = [
  {
    title: "AI 产品与方法论",
    items: [
      ["ai-product-playbook", "AI 产品判断、Prompt、Skill、Agent 与工作流实践"],
      ["My-road-to-Internet-Product-Manager", "我的互联网产品之路"],
      ["diefeng-skills", "Personal Agent Skills collection"]
    ]
  },
  {
    title: "Agent 与自动化",
    items: [
      ["weekend-agent-demo", "周末规划助手 Agent Demo"],
      ["weekend-planner", "周末规划工具"],
      ["netlify-deploy", "静态站点部署 Skill"]
    ]
  },
  {
    title: "交互原型",
    items: [
      ["infidive-discover", "infiDive 发现页 iOS Dark Mode Mockup"],
      ["risk-review-demo", "风险评审交互演示"],
      ["digital-twin-disaster-recovery-ppt", "数字孪生灾备演示"],
      ["stella-ppt", "交互演示作品"],
      ["demo", "网页演示项目"]
    ]
  },
  {
    title: "早期项目",
    items: [
      ["L-System-Flower-Simulation", "基于 L-System 的植物生长模拟"]
    ]
  }
];

function renderExperiences() {
  document.querySelector("#experience-list").innerHTML = experiences.map((item) => `
    <article class="experience-card">
      <p class="experience-date">${item.date}</p>
      <div>
        <p class="experience-company">${item.company}</p>
        <h3 class="experience-role">${item.role}</h3>
        <p class="experience-summary">${item.summary}</p>
        <ul class="experience-points">${item.points.map((point) => `<li>${point}</li>`).join("")}</ul>
      </div>
    </article>
  `).join("");
}

function renderFeaturedWork() {
  document.querySelector("#featured-work").innerHTML = featuredWork.map((item, index) => `
    <a class="featured-card" href="${item.url}" target="_blank" rel="noreferrer">
      <div class="featured-top"><span class="featured-number">0${index + 1}</span><span class="featured-icon" aria-hidden="true">↗</span></div>
      <div><h3>${item.title}</h3><p>${item.description}</p></div>
    </a>
  `).join("");
}

function renderRepositories() {
  document.querySelector("#repository-groups").innerHTML = repositoryGroups.map((group) => `
    <section class="repository-group">
      <h3>${group.title}</h3>
      <div class="repository-list">${group.items.map(([name, description]) => `
        <a class="repository-link" href="https://github.com/Diefeng-Hu/${name}" target="_blank" rel="noreferrer">
          <span><span class="repository-name">${name}</span><span class="repository-description">${description}</span></span>
          <span class="repository-arrow" aria-hidden="true">↗</span>
        </a>
      `).join("")}</div>
    </section>
  `).join("");
}

renderExperiences();
renderFeaturedWork();
renderRepositories();
