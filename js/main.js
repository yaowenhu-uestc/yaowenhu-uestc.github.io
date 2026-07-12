import { education } from "./components/education.js";
import { experience } from "./components/experience.js";
import { footer } from "./components/footer.js";
import { header } from "./components/header.js";
import { hero } from "./components/hero.js";
import { projectsSection } from "./components/projects.js";
import { loadVisitStats } from "./components/stats.js";

document.querySelector("#app").innerHTML = `${header()}<main>${hero()}${about()}${experience()}${projectsSection()}${education()}</main>${footer()}`;
loadVisitStats();
import { about } from "./components/about.js";
