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
  orcidid: string;
  linkdien: string;
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
    titles: ["AI Engineer"],
    description: "",
    imgUrl: "",
  } as Banner,
  skills: [] as SkillCategory[],
  projects: [] as Project[],
  experience: [] as Experience[],
  successStories: [] as SuccessStory[],
  researchInsights: [] as ResearchInsight[],
  links: {
    resume_PDF: "", 
    visume_video: "", 
    github: "", 
    linkedin: "",
    email: "", 
    orcidid: "",
    linkdien: ""
  } as Links,
  metadata: {
    version: "1.0.0",
    systemID: "Core_System",
    userName: "Developer",
    terminalUser: "guest@lab",
    kernel: "Matrix_Kernel",
    status: "BOOTING",
    efficiency: "100%",
    uptime: "100%",
    latency: "0ms",
    deployment_tag: "",
    intelligence_tag: "",
    achievement_tag: "",
    operational_log_tag: "",
    pages: {
      work: { title1: "", title2: "" },
      skills: { title1: "", title2: "" },
      achievements: { title1: "", title2: "", subtitle: "" },
      log: { title1: "", title2: "", subtitle: "" },
      research: { title1: "", title2: "", subtitle: "" }
    },
    footer: { copyright_text: "ALL_SYSTEMS_OPERATIONAL" }
  } as SystemMetadata,
  techStack: [] as string[],
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
