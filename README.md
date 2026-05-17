# 🌟 Personal Portfolio Website

Welcome to my personal portfolio repository! This website is a showcase of my journey, skills, and projects in the fields of AI, machine learning, web development, and computer vision.

---

## 🗺️ Multi-Branch Repository Architecture

To keep this project highly modular and organized, the repository is split into dedicated, functional branches:

| Branch | Description / Purpose |
| :--- | :--- |
| **`main`** | **This Branch.** Contains general metadata, repo architecture guidelines, standard licensing, and overall landing documentation. |
| **`frontend_code`** | **The UI Codebase.** Houses the premium React 19 + TanStack Start application, custom layouts, assets, and styling. *This is where you should write and modify code.* |
| **`Json_data`** | **The Data Layer.** Houses all static data structures (JSON records) representing skills, work experience, research logs, and certifications for dynamic fetching. |
| **`gh-pages`** | **The Live Build.** Hosts the compiled static production assets deployed to GitHub Pages. Powered by an automated CI/CD pipeline. |

---

## 🚀 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Technologies](#technologies)
- [Branch Setup & Installation](#branch-setup--installation)
- [Repository Guidance & Customization](#repository-guidance--customization)
- [Automated Deployment](#automated-deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🧑💻 About

This portfolio serves as a digital representation of my academic, professional, and creative endeavors. Whether it's groundbreaking projects in AI, research contributions, or leadership roles, this site highlights my commitment to engineering excellence.

### 🎯 Objective:
- To showcase advanced engineering competencies in AI, Computer Vision, and full-stack web architectures.
- To serve as a high-end, interactive digital hub for recruiters, peers, and collaborators.

---

## ✨ Key Features

- **🤖 DODO AI Communication Widget:** An interactive, canvas-rendered context-aware robot assistant that models simulated AI processes with clean visual animations and glow states.
- **⚡ Hydrated Client SPA:** Fully optimized client-side hydration using pre-rendered shells to ensure 100% SEO indexability and instantaneous load times.
- **💼 Interactive Work & Timeline:** A dynamic showcase of project archives, publications, and timelines with robust search/filter abilities.
- **🎨 Glassmorphism & Micro-animations:** Premium curated dark modes utilizing modern typography (Inter/Outfit) and fluid state transitions.

---

## 🖥️ Technologies

The frontend application utilizes a modern, professional, full-stack static architecture:

### **Framework & Routing**:
- **React 19** (Functional components, hooks, hydration rendering)
- **TanStack Start (SPA Mode)** & **TanStack Router** (File-system routing, automatic code-splitting)
- **TanStack Query v5** (Robust state synchronization and client-side data fetching)

### **Styling & Effects**:
- **Tailwind CSS v4** (Modern utility styles, custom variables, native HSL tailoring)
- Canvas API (Dynamic particle systems and interactive floating elements)

### **Hosting/Deployment**:
- **GitHub Pages** (Asset-optimized static hosting)
- **Cloudflare Pages** (Optional fully-native SSR and Server Functions support via `wrangler.jsonc`)

---

## 🔧 Branch Setup & Installation

Because the codebase is modularized on the **`frontend_code`** branch, follow these updated guidelines to clone and run the portfolio locally:

### Prerequisites:
- [Node.js 22+](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed

### Steps:
1. Clone only the **`frontend_code`** branch from this repository:
   ```bash
   git clone -b frontend_code https://github.com/Rathoreatri03/Protfolio_website.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Protfolio_website
   ```

3. Install production and development dependencies:
   ```bash
   npm install
   ```

4. Spin up the development server:
   ```bash
   npm run dev
   ```

   Visit **[http://localhost:3000](http://localhost:3000)** in your browser to view and interact with the dev site.

---

## 🛠️ Repository Guidance & Customization

Customizations are handled systematically across branches:

*   **To Customize the UI/Layout:** 
    1. Checkout the `frontend_code` branch locally.
    2. Edit routing layouts in `src/routes/` or individual UI components under `src/components/`.
*   **To Update Portfolio Content (Skills, Projects, Work):**
    1. Refer to the data structures on the `Json_data` branch or dynamic local paths.
    2. Maintain JSON records (e.g. `skillsData.json`, `BannerDetails.json`) in their respective directories.

---

## 🌐 Automated Deployment

You do not need to build and deploy manually! The repository handles production deployments automatically via **GitHub Actions**:

1. When you commit and push changes to the **`frontend_code`** branch:
   ```bash
   git add .
   git commit -m "feat: implement advanced feature"
   git push origin frontend_code
   ```
2. The GitHub Actions runner ([deploy.yml](.github/workflows/deploy.yml)) automatically triggers, builds the optimized client assets, generates the correct SPA `index.html` shell, and deploys it directly to the **`gh-pages`** branch.

Your portfolio automatically goes live at:  
👉 **[https://Rathoreatri03.github.io/Protfolio_website/](https://Rathoreatri03.github.io/Protfolio_website/)**

---

## 🤝 Contributing

Contributions to improve features or implement new UI sections are highly appreciated!

### Steps:
1. Fork this repository.
2. Checkout a new feature branch from `frontend_code`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes.
4. Push to your fork and submit a Pull Request targeting the **`frontend_code`** branch.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Rathoreatri03/Protfolio_website/blob/main/LICENCE) file for details.

---

## 📞 Contact

Feel free to connect or reach out for collaborations:

- **Name**: Atri Rathore  
- **Email**: rathoreatri@gmail.com  
- **Portfolio**: [rathoreatri03.github.io/Protfolio_website](https://rathoreatri03.github.io/Protfolio_website)  
- **LinkedIn**: [linkedin.com/in/rathoreatri03](https://www.linkedin.com/in/rathoreatri03)  
- **GitHub**: [github.com/Rathoreatri03](https://github.com/Rathoreatri03)
