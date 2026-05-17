# ✨ Atri Rathore's Personal Portfolio (Frontend Codebase)

A state-of-the-art, premium portfolio website designed for an **AI Architect & Machine Learning Engineer**. Built with cutting-edge frontend technologies including **React 19**, **TanStack Start (SPA Mode)**, and **Tailwind CSS v4**, this application boasts curated dark-mode color palettes, fluid glassmorphism elements, and highly responsive interactive components.

---

## 🌟 Key Features

*   **🤖 DODO AI Communication Interface:** An interactive, context-aware AI assistant widget styled with dynamic canvas elements, HSL glow effects, visual pulse rings, and interactive micro-animations.
*   **⚡ TanStack Start Architecture:** Powered by a highly optimized React router configuration designed with file-system routing, automatic prerendering, and preloading.
*   **🛠️ Full-Stack Static Build (SSG/SPA):** Fully optimized for static hosting (GitHub Pages) by utilizing TanStack Start's SPA mode which compiles a highly structured, hydration-ready `_shell.html` shell.
*   **📁 Modular Layouts & Pages:**
    *   **Home:** A striking hero header showcasing key specializations.
    *   **Work:** Grid layout of projects, papers, and contributions.
    *   **Stack:** A categorized, interactive layout representing skills and domain competencies.
    *   **Achievements:** Timelines and highlights of notable achievements.
    *   **Research Log:** Interactive logger for reading research logs and updates.
    *   **Contact:** Responsive contact form integrated with clean input validations.

---

## 🛠️ Technology Stack

*   **Core UI:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
*   **Routing & Framework:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (SPA Mode), [TanStack Router](https://tanstack.com/router)
*   **State & Queries:** [TanStack Query v5](https://tanstack.com/query)
*   **Icons & Motion:** [Lucide React](https://lucide.dev/), Tailwind micro-animations, canvas-based rendering
*   **Utilities:** `clsx`, `tailwind-merge`, `zod` (runtime schema validation)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js 22+** installed on your system.

### 1. Install Dependencies
Restore the project lockfile using `npm`:
```bash
npm install
```

### 2. Run the Development Server
Run the local dev server with Hot Module Replacement (HMR) enabled:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

### 3. Build for Production
To compile and statically build the SPA shell and client assets:
```bash
npm run build
```
The build artifacts will be output to:
*   `dist/client/` (Static client-side SPA bundle and pre-rendered `_shell.html`)
*   `dist/server/` (Server-side rendering assets)

---

## 🛫 CI/CD & Deployment

This project is configured with a fully automated continuous deployment pipeline using **GitHub Actions**.

*   **Workflow Config:** [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
*   **Trigger:** Automatically triggers whenever you push commits to the `frontend_code` branch.
*   **Mechanism:**
    1.  Checks out the repository and installs dependencies.
    2.  Compiles the production bundle via `npm run build`.
    3.  Copies the compiler-generated SPA shell `_shell.html` to `index.html` and `404.html` (for direct routing fallback support).
    4.  Deploys the static client-side build to the **`gh-pages`** branch.
