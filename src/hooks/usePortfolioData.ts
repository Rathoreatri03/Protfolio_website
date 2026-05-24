import { useEffect, useState } from "react";

const GH = "https://raw.githubusercontent.com/Rathoreatri03/Portfolio_website/Json_data";

export type Banner = { titles: string[]; description: string; imgUrl: string };
export type Skill = { 
  name: string; 
  progress: number; 
  format?: "percent" | "out10" | "custom" | "tier"; 
  customMax?: number; 
};
export type SkillCategory = { title: string; skills: Skill[] };
export type Project = { title: string; description: string; imgUrl: string; link: string };
export type Experience = Project & { duration?: string; ref?: string };
export type SuccessStory = Project;
export type ResearchInsight = Project & { year?: string };
export type Links = { 
  resume_PDF: string; 
  visume_video: string;
  github: string;
  linkedin: string;
  email: string;
  formspree_ID: string;
};
export type SystemMetadata = {
  version: string;
  systemID: string;
  userName: string;
  terminalUser: string;
  kernel: string;
  status: string;
  efficiency: string;
  uptime: string;
  latency: string;
  deployment_tag: string;
  intelligence_tag: string;
  achievement_tag: string;
  operational_log_tag: string;
  pages?: {
    work: { title1: string; title2: string };
    skills: { title1: string; title2: string };
    achievements: { title1: string; title2: string; subtitle: string };
    log: { title1: string; title2: string; subtitle: string };
    research?: { title1: string; title2: string; subtitle: string };
  };
  footer?: { copyright_text: string };
};
export type Logo = { logo_url: string };

const FALLBACK = {
  banner: {
    titles: ["AI Architect Engineer"],
    description: "Solving real-world problems with AI.",
    imgUrl: "https://res.cloudinary.com/dxh9tugzx/image/upload/v1740682112/header-img_wq7c5m.svg",
  } as Banner,
  skills: [] as SkillCategory[],
  projects: [] as Project[],
  experience: [] as Experience[],
  successStories: [] as SuccessStory[],
  researchInsights: [] as ResearchInsight[],
  links: {
    resume_PDF: "https://res.cloudinary.com/dxh9tugzx/image/upload/v1734172167/Atri_Resume.pdf", 
    visume_video: "https://res.cloudinary.com/dxh9tugzx/video/upload/v1734293129/Visume_io0vmq.mp4", 
    github: "https://github.com/Rathoreatri03", 
    linkedin: "https://www.linkedin.com/in/rathoreatri03/",
    email: "rathoreatri03@gmail.com", 
    formspree_ID: "xpwzelbd"
  } as Links,
  metadata: {
    version: "STABLE",
    systemID: "Atri_Rathore",
    userName: "Atri Rathore",
    terminalUser: "rathoreatri03@lab",
    kernel: "X-Matrix_64",
    status: "OPTIMAL",
    efficiency: "98.4%",
    uptime: "99.99%",
    latency: "12ms",
    deployment_tag: "Deployment_Stream",
    intelligence_tag: "Tactical_Intelligence",
    achievement_tag: "Achievement_Stream",
    operational_log_tag: "Operational_Log",
    pages: {
      work: { title1: "Experiments in", title2: "Motion" },
      skills: { title1: "The", title2: "Matrix" },
      achievements: { title1: "Victory", title2: "Archives", subtitle: "A CHRONOLOGICAL LOG OF HACKATHON WINS AND INNOVATION CHALLENGES" },
      log: { title1: "Neural", title2: "Milestones", subtitle: "CHRONOLOGICAL ARCHIVE OF ACHIEVEMENTS AND SYSTEM UPGRADES" },
      research: { title1: "Scientific", title2: "Insights", subtitle: "PATENTS, PUBLICATIONS, AND DISRUPTIVE DESIGN EXPLORATIONS" }
    },
    footer: { copyright_text: "ALL_SYSTEMS_DODO" }
  } as SystemMetadata,
  techStack: ["AI", "ML", "CV", "PYTHON", "PYTORCH"],
  logo: { logo_url: "" } as Logo
};

export function usePortfolioData() {
  const [banner, setBanner] = useState<Banner>(FALLBACK.banner);
  const [skills, setSkills] = useState<SkillCategory[]>(FALLBACK.skills);
  const [projects, setProjects] = useState<Project[]>(FALLBACK.projects);
  const [experience, setExperience] = useState<Experience[]>(FALLBACK.experience);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>(FALLBACK.successStories);
  const [researchInsights, setResearchInsights] = useState<ResearchInsight[]>(FALLBACK.researchInsights);
  const [links, setLinks] = useState<Links>(FALLBACK.links);
  const [metadata, setMetadata] = useState<SystemMetadata>(FALLBACK.metadata);
  const [techStack, setTechStack] = useState<string[]>(FALLBACK.techStack);
  const [logo, setLogo] = useState<Logo>(FALLBACK.logo);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancel = false;
    const j = async <T,>(url: string): Promise<T | null> => {
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) return null;
        return (await r.json()) as T;
      } catch { return null; }
    };
    (async () => {
      const v = Date.now();
      const [b, sk, pr, ex, ss, li, md, ts, lg, ri] = await Promise.all([
        j<Banner>(`${GH}/BannerDetails.json?v=${v}`),
        j<{ categories: SkillCategory[] }>(`${GH}/skillsData.json?v=${v}`),
        j<Project[]>(`${GH}/projects.json?v=${v}`),
        j<Experience[]>(`${GH}/experience.json?v=${v}`),
        j<SuccessStory[]>(`${GH}/successStories.json?v=${v}`),
        j<Links>(`${GH}/professionalLinks.json?v=${v}`),
        j<SystemMetadata>(`${GH}/systemMetadata.json?v=${v}`),
        j<string[]>(`${GH}/techstack.json?v=${v}`),
        j<Logo>(`${GH}/logo.json?v=${v}`),
        j<ResearchInsight[]>(`${GH}/researchInsights.json?v=${v}`),
      ]);
      if (cancel) return;
      
      if (b) setBanner(b);
      
      const skData = sk as any;
      if (skData?.categories) {
        setSkills(skData.categories);
      } else if (skData?.skills) {
        setSkills([{ title: "CORE_TECH", skills: skData.skills }]);
      }
      
      if (pr) setProjects(pr);
      if (ex) setExperience(ex);
      if (ss) setSuccessStories(ss);
      if (li) setLinks(li);
      if (md) setMetadata(md);
      if (ts) setTechStack(ts);
      if (lg) setLogo(lg);
      if (ri) setResearchInsights(ri);
      setLoaded(true);
    })();
    return () => { cancel = true; };
  }, []);

  return { banner, skills, projects, experience, successStories, researchInsights, links, metadata, techStack, logo, loaded };
}
