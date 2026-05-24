export type LinksArg = {
  github?: string;
  linkedin?: string;
  email?: string;
  resume_PDF?: string;
};

export function initDeveloperConsole(links?: LinksArg) {
  if (typeof window === "undefined") return;

  // Clear developer console to remove any warning noises
  console.clear();

  const githubLink = links?.github || "https://github.com/Rathoreatri03";
  const linkedinLink = links?.linkedin || "https://www.linkedin.com/in/rathoreatri03/";
  const emailLink = links?.email || "rathoreatri03@gmail.com";
  const cvLink = links?.resume_PDF || "https://res.cloudinary.com/dxh9tugzx/image/upload/v1734172167/Atri_Resume.pdf";

  // Vibrant custom styled console statements matching the matrix theme
  const titleStyle = `
    color: #00ff66;
    font-size: 16px;
    font-weight: bold;
    font-family: monospace;
    text-shadow: 0 0 10px rgba(0, 255, 102, 0.5);
    background: #080808;
    padding: 8px 12px;
    border: 1px dashed #00ff66;
    border-radius: 4px;
  `;

  const bannerStyle = `
    color: #00ff66;
    font-family: monospace;
    font-size: 10px;
    font-weight: bold;
    line-height: 1.25;
  `;

  const labelStyle = `
    color: #38bdf8;
    font-family: monospace;
    font-weight: bold;
    font-size: 11px;
  `;

  const valueStyle = `
    color: #f1f5f9;
    font-family: monospace;
    font-size: 11px;
  `;

  const linkStyle = `
    color: #e11d48;
    font-family: monospace;
    font-weight: bold;
    text-decoration: underline;
    font-size: 11px;
  `;

  const footerStyle = `
    color: #a78bfa;
    font-family: monospace;
    font-style: italic;
    font-size: 11px;
  `;

  const asciiArt = `
     █████╗ ████████╗██████╗ ██╗  
    ██╔══██╗╚══██╔══╝██╔══██╗██║  
    ███████║   ██║   ██████╔╝██║  
    ██╔══██║   ██║   ██╔══██╗██║  
    ██║  ██║   ██║   ██║  ██║██║  
    ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  
  `;

  console.log(`%c${asciiArt}`, bannerStyle);
  console.log(`%c🚀 Welcome to Atri Rathore's Portfolio Matrix 🚀`, titleStyle);
  console.log("");
  console.log(`%c[SYSTEM_STATUS]: %cONLINE // COGNITIVE AGENTS ACTIVE`, labelStyle, valueStyle);
  console.log(`%c[ENGINEER]:      %cAtri Rathore`, labelStyle, valueStyle);
  console.log(`%c[CORE_ROLE]:     %cAI Architect & Computer Vision Specialist`, labelStyle, valueStyle);
  console.log("");
  console.log(`%c[GITHUB]:        %c👉 ${githubLink}`, labelStyle, linkStyle);
  console.log(`%c[LINKEDIN]:      %c👉 ${linkedinLink}`, labelStyle, linkStyle);
  console.log(`%c[EMAIL]:         %c👉 ${emailLink}`, labelStyle, linkStyle);
  console.log(`%c[OFFICIAL_CV]:   %c👉 ${cvLink}`, labelStyle, linkStyle);
  console.log("");
  console.log(`%c"The matrix is everywhere. Pushing the boundaries of Artificial Intelligence."`, footerStyle);
}
