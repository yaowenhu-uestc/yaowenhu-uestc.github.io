# Repository Guidelines

## Project Structure & Module Organization

This repository is a framework-free GitHub Pages personal site. Keep each responsibility in its existing file:

- `index.html` contains document metadata, the application mount point, and module entry.
- `js/main.js` assembles the page; `js/data.js` stores static content; `js/components/` contains section renderers.
- `styles/` separates tokens, base rules, layout, components, and responsive rules through `styles/main.css`.
- Put local images and other media in `assets/`; use lowercase, hyphenated names such as `hero-photo.jpg`.

There is no generated output directory, package manager, or build step. Do not add one for routine content or styling changes.

## Local Development & Checks

Run the site locally from the repository root:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` and test both desktop and a 375px-wide mobile viewport. Before committing, run:

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check  # JavaScript syntax
git diff --check       # whitespace and patch errors
```

The project has no automated test framework. Manually verify navigation anchors, external links, rendered card counts, responsive layout, and a clean browser console. Include screenshots for visual changes in pull requests.

## Coding Style & Naming

Use two-space indentation in HTML and JavaScript, semicolons in JavaScript, and the existing CSS custom properties instead of hard-coded repeated values. Use `camelCase` for JavaScript variables and functions, plural names for collections, and descriptive kebab-case CSS classes. Keep static display content in `js/data.js`; avoid duplicating repeated cards in HTML.

## Commits & Pull Requests

Use short, imperative, capitalized commit subjects, following the existing history: `Create personal homepage` or `Update hero photo`. Keep each commit focused on one visible change.

Pull requests should state the user-facing change, list the checks run, link any relevant issue, and include desktop and mobile screenshots for layout work. Do not publish secrets, personal contact details, contract values, customer business data, or internal platform names.
