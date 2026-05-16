import { useEffect, useState } from "react";

const GH = "https://raw.githubusercontent.com/Rathoreatri03/Protfolio_website/Json_data";

export type Banner = { titles: string[]; description: string; imgUrl: string };
export type Skill = { name: string; progress: number };
export type Project = { title: string; description: string; imgUrl: string; link: string };
export type Experience = Project;
export type Links = { resume_PDF: string; visume_video: string };

const FALLBACK = {
  banner: {
    titles: [
      "Computer Vision Engineer", "Python Developer", "Data Analyst",
      "ML Engineer", "Model Trainer", "Blender Artist",
    ],
    description:
      "I leverage cutting-edge AI, machine learning and computer vision to solve real-world problems — from autonomous perception to medical diagnostics.",
    imgUrl: "https://res.cloudinary.com/dxh9tugzx/image/upload/v1740682112/header-img_wq7c5m.svg",
  } as Banner,
  skills: [
    { name: "Python Development", progress: 85 },
    { name: "Image Processing", progress: 90 },
    { name: "Object Detection", progress: 95 },
    { name: "Model Training", progress: 85 },
    { name: "ML Research", progress: 90 },
    { name: "Data Analysis", progress: 85 },
    { name: "3D Modeling", progress: 80 },
    { name: "Statistics", progress: 85 },
  ] as Skill[],
  projects: [] as Project[],
  experience: [] as Experience[],
  links: {
    resume_PDF: "https://res.cloudinary.com/dxh9tugzx/image/upload/v1734172167/Atri_Resume.pdf",
    visume_video: "https://res.cloudinary.com/dxh9tugzx/video/upload/v1734293129/Visume_io0vmq.mp4",
  } as Links,
};

export function usePortfolioData() {
  const [banner, setBanner] = useState<Banner>(FALLBACK.banner);
  const [skills, setSkills] = useState<Skill[]>(FALLBACK.skills);
  const [projects, setProjects] = useState<Project[]>(FALLBACK.projects);
  const [experience, setExperience] = useState<Experience[]>(FALLBACK.experience);
  const [links, setLinks] = useState<Links>(FALLBACK.links);
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
      const [b, sk, pr, ex, li] = await Promise.all([
        j<Banner>(`${GH}/BannerDetails.json`),
        j<{ skills: Skill[] }>(`${GH}/skillsData.json`),
        j<Project[]>(`${GH}/projects.json`),
        j<Experience[]>(`${GH}/experience.json`),
        j<Links>(`${GH}/professionalLinks.json`),
      ]);
      if (cancel) return;
      if (b) setBanner(b);
      if (sk?.skills) setSkills(sk.skills);
      if (pr) setProjects(pr);
      if (ex) setExperience(ex);
      if (li) setLinks(li);
      setLoaded(true);
    })();
    return () => { cancel = true; };
  }, []);

  return { banner, skills, projects, experience, links, loaded };
}
