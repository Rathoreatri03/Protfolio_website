import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TypingRoles } from "@/components/TypingRoles";
import { NeuralBackground } from "@/components/NeuralBackground";
import { AICore } from "@/components/AICore";
import { ContactTerminal } from "@/components/ContactTerminal";
import avatarImg from "@/assets/avatar.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atri Rathore — AI / Computer Vision Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Atri Rathore — AI engineer, computer vision researcher and Python developer building intelligent real-world systems.",
      },
      { property: "og:title", content: "Atri Rathore — AI Research Lab" },
      {
        property: "og:description",
        content: "AI / ML / Computer Vision portfolio and research log.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
  }),
  component: Index,
});

// ── Data layer ────────────────────────────────────────────────────────────────
const GH = "https://raw.githubusercontent.com/Rathoreatri03/Protfolio_website/Json_data";

type Banner = { titles: string[]; description: string; imgUrl: string };
type Skill = { name: string; progress: number };
type Project = { title: string; description: string; imgUrl: string; link: string };
type Experience = Project;
type Links = { resume_PDF: string; visume_video: string };

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

const STACK = [
  "PYTHON", "PYTORCH", "TENSORFLOW", "OPENCV", "YOLO", "TRANSFORMERS",
  "PANDAS", "NUMPY", "SCIKIT-LEARN", "CUDA", "DOCKER", "BLENDER",
  "LANGCHAIN", "HUGGING-FACE", "GIT", "LINUX",
];

function useGithubData() {
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

// ── Component ─────────────────────────────────────────────────────────────────
function Index() {
  const { banner, skills, projects, experience, links, loaded } = useGithubData();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden">
      {/* Layered ambient backgrounds */}
      <div className="fixed inset-0 grid-bg pointer-events-none animate-grid-pulse z-0 radial-fade" />
      <NeuralBackground />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0 animate-glow-pulse" />

      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between font-display text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px] shadow-primary" />
            <span className="text-primary font-bold">[ATRI_LAB_v3.0]</span>
            <span className="hidden sm:inline text-muted-foreground">/ neural / research</span>
            {loaded && <span className="hidden md:inline text-primary/60">· LIVE_FEED</span>}
          </div>
          <nav className="flex gap-5 text-muted-foreground">
            <a href="#work" className="hover:text-primary transition-colors">WORK</a>
            <a href="#skills" className="hover:text-primary transition-colors">STACK</a>
            <a href="#log" className="hover:text-primary transition-colors">LOG</a>
            <a href="#contact" className="hover:text-primary transition-colors">CONTACT</a>
            <a href="https://github.com/Rathoreatri03" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GITHUB</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-32 px-6 pb-24">
        {/* HERO */}
        <section className="max-w-6xl mx-auto animate-fade-up grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <div className="mb-5 font-display text-primary flex items-center gap-2 text-xs sm:text-sm">
              <span className="size-2 bg-primary rounded-full animate-pulse" />
              MODEL_LOADED :: NEURAL_NET_ONLINE
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
              ARCHITECTING<br />
              <span className="text-primary text-glow">INTELLIGENT</span> SYSTEMS<span className="text-primary">.</span>
            </h1>

            <div className="font-display text-lg md:text-2xl mb-8 min-h-[2em]">
              <span className="text-muted-foreground">&gt;_ role: </span>
              <TypingRoles roles={banner.titles} />
            </div>

            <p className="max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
              I'm <span className="text-foreground font-medium">Atri Rathore</span> — {banner.description.slice(0, 280)}…
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={links.resume_PDF}
                target="_blank" rel="noreferrer"
                className="group relative inline-flex items-center justify-center h-12 px-6 bg-primary text-primary-foreground font-display font-bold text-sm tracking-tight hover:bg-primary/90 transition-all active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10">⬢ INITIALIZE_RESUME.PDF</span>
                <span className="absolute inset-0 animate-shimmer" />
              </a>
              <a
                href={links.visume_video}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 border border-border bg-white/5 backdrop-blur font-display text-sm hover:bg-primary/10 hover:border-primary/60 transition-colors"
              >
                ▶ WATCH_VISUME.MOV
              </a>
              <a
                href="mailto:rathoreatri03@gmail.com"
                className="inline-flex items-center justify-center h-12 px-6 border border-border font-display text-sm hover:bg-primary/10 hover:border-primary/60 transition-colors"
              >
                ⇄ ESTABLISH_CONTACT
              </a>
            </div>
          </div>

          {/* Hero visual — interactive AI Core */}
          <div className="relative animate-fade-in delay-300 hidden lg:block">
            <AICore />
          </div>
        </section>

        {/* Marquee */}
        <div
          id="skills"
          className="mt-20 mb-20 max-w-7xl mx-auto w-full overflow-hidden border-y border-border py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        >
          <div className="flex gap-12 animate-marquee whitespace-nowrap font-display text-xs tracking-[0.25em] text-muted-foreground">
            {[...STACK, ...STACK].map((s, i) => (
              <span key={i} className="hover:text-primary transition-colors">▸ {s}</span>
            ))}
          </div>
        </div>

        {/* SKILLS GRID */}
        <section className="max-w-5xl mx-auto mb-24">
          <h2 className="font-display text-xs text-primary mb-8 uppercase tracking-[0.3em]">
            $ ./skills --list --verbose
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {skills.map((s, i) => (
              <div key={s.name + i} className="group animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex justify-between items-baseline mb-2 font-display text-xs">
                  <span className="text-foreground">{s.name}</span>
                  <span className="text-primary">{s.progress}%</span>
                </div>
                <div className="h-[3px] w-full bg-border overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000 relative"
                    style={{ width: `${s.progress}%` }}
                  >
                    <div className="absolute inset-0 animate-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="work" className="max-w-6xl mx-auto mt-12 border-t border-border pt-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-xs text-primary mb-3 uppercase tracking-[0.3em]">
                $ ./selected_work --all
              </h2>
              <p className="text-2xl md:text-4xl font-display font-bold tracking-tight">
                Experiments in <span className="text-primary">motion</span>.
              </p>
            </div>
            <span className="hidden md:block font-display text-xs text-muted-foreground">
              [{projects.length || "…"} ENTRIES]
            </span>
          </div>

          <div className="space-y-4">
            {(projects.length ? projects : Array.from({ length: 4 })).map((p, i) => {
              const proj = p as Project | undefined;
              const idStr = String(i + 1).padStart(3, "0");
              const reverse = i % 2 === 1;
              return (
                <a
                  key={i}
                  href={proj?.link?.trim() || "#"}
                  target={proj?.link?.trim() ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`group relative grid md:grid-cols-[1.1fr_1fr] gap-0 border border-border hover:border-primary/60 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:bg-primary/[0.04] hover:shadow-[0_20px_60px_-20px] hover:shadow-primary/30 hover:-translate-y-1 animate-fade-up ${
                    reverse ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Top accent line */}
                  <span className="absolute top-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700" />

                  {/* Image side */}
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px] overflow-hidden bg-black/60 scanlines">
                    {proj ? (
                      <img
                        src={proj.imgUrl}
                        alt={proj.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] group-hover:scale-105 group-hover:rotate-[0.4deg]"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full animate-pulse bg-primary/5" />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/10 to-transparent md:bg-gradient-to-l opacity-90 group-hover:opacity-60 transition-opacity" />
                    {/* Scan beam */}
                    <div className="absolute inset-x-0 h-[2px] bg-primary/70 shadow-[0_0_12px] shadow-primary animate-scan opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Hover crosshair */}
                    <div className="absolute top-3 right-3 size-8 border border-primary/0 group-hover:border-primary/60 transition-all duration-500 rotate-45" />
                  </div>

                  {/* Content side */}
                  <div className="relative p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between mb-4 font-display text-[10px] tracking-widest">
                        <span className="text-primary">{`>_ PROJ_${idStr}`}</span>
                        <div className="flex gap-1.5">
                          {["AI", "CV", "PY"].map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 border border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">
                        {proj?.title || "loading…"}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {proj?.description?.slice(0, 220) || ""}
                        {proj && proj.description.length > 220 ? "…" : ""}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border flex justify-between items-center font-display text-[11px] tracking-widest">
                      <span className="text-muted-foreground">$ git clone --open</span>
                      <span className="inline-flex items-center gap-2 text-primary">
                        <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                          LAUNCH
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ABOUT */}
        <section className="max-w-5xl mx-auto mt-32 border-t border-border pt-16 grid md:grid-cols-[280px_1fr] gap-12 items-start">
          <div className="relative animate-float group/avatar">
            <div className="aspect-square overflow-hidden border border-border bg-card relative scanlines">
              <img
                src={avatarImg}
                alt="Atri Rathore"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
              <div className="absolute inset-0 border border-primary/0 group-hover/avatar:border-primary/40 transition-colors" />
            </div>
            <div className="absolute -bottom-3 -right-3 px-3 py-1 bg-primary text-primary-foreground font-display text-[10px] font-bold tracking-widest animate-glow-pulse">
              ● ONLINE
            </div>
            <div className="absolute -top-3 -left-3 px-3 py-1 border border-primary/40 bg-background font-display text-[10px] text-primary tracking-widest">
              v3.0
            </div>
          </div>
          <div>
            <h2 className="font-display text-xs text-primary mb-4 uppercase tracking-[0.3em]">
              $ ./about --verbose
            </h2>
            <p className="text-lg md:text-xl leading-relaxed mb-4">
              I build at the intersection of <span className="text-primary">vision</span>,{" "}
              <span className="text-primary">data</span> and <span className="text-primary">automation</span>.
              Real-time accident-detection, lunar-surface analysis, medical-diagnostic models — turning raw signal into useful action.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Currently shipping open-source AI tooling, training perception models, and exploring the edges of
              generative and analytical workflows.
            </p>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="log" className="max-w-5xl mx-auto mt-32 border-t border-border pt-16">
          <h2 className="font-display text-xs text-primary mb-12 uppercase tracking-[0.3em]">
            $ ./system_history --tail
          </h2>
          <div className="space-y-6">
            {(experience.length ? experience : Array.from({ length: 4 })).map((e, i) => {
              const ex = e as Experience | undefined;
              return (
                <a
                  key={i}
                  href={ex?.link?.trim() || "#"}
                  target={ex?.link?.trim() ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group grid md:grid-cols-[80px_1fr] gap-4 md:gap-8 border border-border hover:border-primary/50 p-5 transition-all hover:bg-primary/5 animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {ex?.imgUrl ? (
                    <div className="size-20 overflow-hidden border border-border bg-card">
                      <img src={ex.imgUrl} alt={ex.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="size-20 bg-primary/5 animate-pulse" />
                  )}
                  <div>
                    <h4 className="font-display font-bold text-base mb-2 group-hover:text-primary transition-colors">
                      {ex?.title || "loading…"}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{ex?.description || ""}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="max-w-6xl mx-auto mt-32 border-t border-border pt-16">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
            <div>
              <h2 className="font-display text-xs text-primary mb-4 uppercase tracking-[0.3em]">
                $ ./contact --init
              </h2>
              <p className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[0.95] mb-6">
                Let's build the <span className="text-primary text-glow">future</span>.
              </p>
              <p className="text-muted-foreground mb-10 max-w-md leading-relaxed">
                Open to AI research collaborations, freelance ML engineering and ambitious computer-vision work.
                Drop a packet on the right — or ping me on any channel below.
              </p>

              <div className="font-display text-sm space-y-1">
                {[
                  ["MAIL", "rathoreatri03@gmail.com", "mailto:rathoreatri03@gmail.com", "✉"],
                  ["GITHUB", "@Rathoreatri03", "https://github.com/Rathoreatri03", "◆"],
                  ["LINKEDIN", "/in/rathoreatri03", "https://www.linkedin.com/in/rathoreatri03/", "▣"],
                ].map(([k, v, h, icon]) => (
                  <a
                    key={k}
                    href={h}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between border-b border-border py-4 group hover:border-primary/60 hover:px-2 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-primary text-base">{icon}</span>
                      <span className="text-muted-foreground tracking-widest text-xs">{k}</span>
                    </span>
                    <span className="group-hover:text-primary text-foreground transition-all group-hover:translate-x-1 inline-block">
                      {v} <span className="text-primary">→</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <ContactTerminal />
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 font-display text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} ATRI_RATHORE · ALL_SYSTEMS_NOMINAL</span>
          <span className="text-primary">UPTIME: 99.99% · LATENCY: 12ms · MODEL: v3.0</span>
        </div>
      </footer>
    </div>
  );
}
