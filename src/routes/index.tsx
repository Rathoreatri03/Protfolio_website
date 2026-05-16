import { createFileRoute } from "@tanstack/react-router";
import { TypingRoles } from "@/components/TypingRoles";
import avatar from "@/assets/avatar.jpg";
import projGuard from "@/assets/proj-guard.jpg";
import projVision from "@/assets/proj-vision.jpg";
import projData from "@/assets/proj-data.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atri Rathore — AI Research & Computer Vision Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Atri Rathore — AI researcher, computer vision engineer, and Python developer building intelligent systems.",
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

const SKILLS = [
  { name: "Python", level: 95 },
  { name: "Image Processing", level: 90 },
  { name: "Object Detection", level: 95 },
  { name: "PyTorch", level: 85 },
  { name: "OpenCV", level: 92 },
  { name: "TensorFlow", level: 80 },
  { name: "Data Analysis", level: 88 },
  { name: "Blender", level: 75 },
];

const STACK_MARQUEE = [
  "PYTHON", "PYTORCH", "OPENCV", "TENSORFLOW", "YOLO", "PANDAS",
  "NUMPY", "SCIKIT-LEARN", "CUDA", "DOCKER", "BLENDER", "GIT",
];

const PROJECTS = [
  {
    id: "001",
    title: "PROJECT G.U.A.R.D",
    tag: "COMPUTER_VISION",
    desc: "AI-powered accident detection system that monitors traffic feeds in real-time and alerts authorities the moment an incident is detected.",
    img: projGuard,
    link: "https://github.com/Rathoreatri03/G.U.A.R.D",
    featured: true,
  },
  {
    id: "002",
    title: "OBJECT_DETECTION",
    tag: "PERCEPTION",
    desc: "Real-time multi-class detection pipelines optimized for edge inference and low-light environments.",
    img: projVision,
    link: "https://github.com/Rathoreatri03",
  },
  {
    id: "003",
    title: "DATA_VIZ_SUITE",
    tag: "ANALYTICS",
    desc: "Interactive analytical dashboards translating noisy datasets into clear business signal.",
    img: projData,
    link: "https://github.com/Rathoreatri03",
  },
];

const EXPERIENCE = [
  {
    when: "2024 — PRESENT",
    role: "AI / ML Engineer",
    org: "Independent Research",
    desc: "Building computer-vision systems for safety, monitoring, and automation. Open-source contributor and toolmaker.",
  },
  {
    when: "2023 — 2024",
    role: "Certified Data Scientist",
    org: "ABC Institute",
    desc: "Structured training in statistical learning, ML pipelines and applied data science.",
  },
  {
    when: "2022 — 2023",
    role: "Python Developer & ML Practitioner",
    org: "Personal Projects",
    desc: "Shipped Python tooling, object-detection pipelines and Blender automations driven by ML.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      {/* Ambient grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none animate-grid-pulse z-0" />

      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between font-display text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-bold">[ATRI_LAB_v3.0]</span>
            <span className="hidden sm:inline text-muted-foreground">/ research / intelligence</span>
          </div>
          <nav className="flex gap-5 text-muted-foreground">
            <a href="#work" className="hover:text-primary transition-colors">WORK</a>
            <a href="#skills" className="hover:text-primary transition-colors">STACK</a>
            <a href="#log" className="hover:text-primary transition-colors">LOG</a>
            <a
              href="https://github.com/Rathoreatri03"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              GITHUB
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-32 px-6 pb-24">
        {/* HERO */}
        <section className="max-w-5xl mx-auto animate-fade-up">
          <div className="mb-5 font-display text-primary flex items-center gap-2 text-xs sm:text-sm">
            <span className="size-2 bg-primary rounded-full animate-pulse" />
            SYSTEM_ACTIVE :: RESEARCHER_LOGGED_IN
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
            ARCHITECTING <span className="text-primary">INTELLIGENT</span>
            <br />
            SYSTEMS.
          </h1>

          <div className="font-display text-lg md:text-2xl mb-10 min-h-[2em]">
            <span className="text-muted-foreground">&gt;_ role: </span>
            <TypingRoles />
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
            <p className="max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              I'm <span className="text-foreground font-medium">Atri Rathore</span>, an AI/ML engineer obsessed with
              leveraging cutting-edge tech in artificial intelligence, machine learning and computer vision to
              solve real-world problems — from accident-detection systems to perception pipelines.
            </p>
            <div className="flex flex-col gap-3 min-w-[260px] w-full md:w-auto">
              <a
                href="https://res.cloudinary.com/dxh9tugzx/image/upload/v1734172167/Atri_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 bg-primary text-primary-foreground font-display font-bold text-sm tracking-tight hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                INITIALIZE_RESUME.PDF
              </a>
              <a
                href="https://res.cloudinary.com/dxh9tugzx/video/upload/v1734129794/visume_gffywo.mp4"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 border border-border bg-white/5 font-display text-sm hover:bg-white/10 hover:border-primary/50 transition-colors"
              >
                ▶ WATCH_VISUME.MOV
              </a>
            </div>
          </div>

          {/* Marquee */}
          <div
            id="skills"
            className="w-full overflow-hidden border-y border-border py-4 mb-24 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          >
            <div className="flex gap-12 animate-marquee whitespace-nowrap font-display text-xs tracking-[0.25em] text-muted-foreground">
              {[...STACK_MARQUEE, ...STACK_MARQUEE].map((s, i) => (
                <span key={i} className="hover:text-primary transition-colors">{s}</span>
              ))}
            </div>
          </div>

          {/* SKILLS GRID */}
          <div className="mb-24">
            <h2 className="font-display text-xs text-primary mb-8 uppercase tracking-[0.3em]">
              ./skills --list
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {SKILLS.map((s) => (
                <div key={s.name} className="group">
                  <div className="flex justify-between items-baseline mb-2 font-display text-xs">
                    <span className="text-foreground">{s.name}</span>
                    <span className="text-primary">{s.level}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-700 group-hover:bg-primary/80"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="work" className="max-w-5xl mx-auto mt-12 border-t border-border pt-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-xs text-primary mb-3 uppercase tracking-[0.3em]">
                ./selected_work
              </h2>
              <p className="text-2xl md:text-3xl font-display font-bold tracking-tight">
                Experiments in motion.
              </p>
            </div>
            <span className="hidden md:block font-display text-xs text-muted-foreground">
              [{PROJECTS.length} ENTRIES]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Featured */}
            <a
              href={PROJECTS[0].link}
              target="_blank"
              rel="noreferrer"
              className="md:col-span-8 group block bg-card border border-border p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="font-display text-[10px] text-primary mb-2 tracking-widest">
                    PROJ_{PROJECTS[0].id} · {PROJECTS[0].tag}
                  </p>
                  <h3 className="font-display text-2xl font-bold group-hover:text-primary transition-colors">
                    {PROJECTS[0].title}
                  </h3>
                </div>
                <span className="text-xs font-display text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN →
                </span>
              </div>
              <div className="w-full aspect-[2/1] overflow-hidden border border-white/5 mb-6 bg-black/40">
                <img
                  src={PROJECTS[0].img}
                  alt={PROJECTS[0].title}
                  width={1280}
                  height={768}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                {PROJECTS[0].desc}
              </p>
            </a>

            <div className="md:col-span-4 flex flex-col gap-6">
              {PROJECTS.slice(1).map((p) => (
                <a
                  key={p.id}
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex-1 bg-card border border-border p-6 hover:border-primary/50 transition-colors flex flex-col"
                >
                  <p className="font-display text-[10px] text-primary mb-2 tracking-widest">
                    PROJ_{p.id} · {p.tag}
                  </p>
                  <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <div className="w-full aspect-[16/10] overflow-hidden border border-white/5 mb-3 bg-black/40">
                    <img
                      src={p.img}
                      alt={p.title}
                      width={800}
                      height={600}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="max-w-5xl mx-auto mt-32 border-t border-border pt-16 grid md:grid-cols-[240px_1fr] gap-12 items-start">
          <div className="relative">
            <div className="aspect-square overflow-hidden border border-border bg-card">
              <img
                src={avatar}
                alt="Atri Rathore"
                width={800}
                height={800}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 px-3 py-1 bg-primary text-primary-foreground font-display text-[10px] font-bold tracking-widest">
              ONLINE
            </div>
          </div>
          <div>
            <h2 className="font-display text-xs text-primary mb-4 uppercase tracking-[0.3em]">
              ./about --verbose
            </h2>
            <p className="text-lg md:text-xl leading-relaxed mb-4">
              I build at the intersection of <span className="text-primary">vision</span>,{" "}
              <span className="text-primary">data</span> and{" "}
              <span className="text-primary">automation</span>. Whether it's a real-time accident-detection
              network or a 3D pipeline driven by ML, I love turning raw signal into useful action.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Currently shipping open-source AI tooling, training models for perception tasks, and exploring
              the edges of generative & analytical workflows.
            </p>
          </div>
        </section>

        {/* EXPERIENCE / LOG */}
        <section id="log" className="max-w-5xl mx-auto mt-32 border-t border-border pt-16">
          <h2 className="font-display text-xs text-primary mb-12 uppercase tracking-[0.3em]">
            ./system_history
          </h2>
          <div className="space-y-10">
            {EXPERIENCE.map((e) => (
              <div
                key={e.when}
                className="grid md:grid-cols-[200px_1fr] gap-3 md:gap-8 border-l border-border md:border-l-0 pl-4 md:pl-0 relative"
              >
                <span className="font-display text-xs text-muted-foreground tracking-widest">{e.when}</span>
                <div>
                  <h4 className="font-bold text-lg mb-1">{e.role}</h4>
                  <p className="text-primary font-display text-xs mb-3 uppercase tracking-widest">{e.org}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="max-w-5xl mx-auto mt-32 border-t border-border pt-16">
          <div className="grid md:grid-cols-2 gap-10 items-end">
            <div>
              <h2 className="font-display text-xs text-primary mb-4 uppercase tracking-[0.3em]">
                ./contact --init
              </h2>
              <p className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[0.95]">
                Let's build the <span className="text-primary">future</span>.
              </p>
              <p className="text-muted-foreground mt-4 max-w-md">
                Open to AI research collaborations, freelance ML engineering and ambitious computer-vision work.
              </p>
            </div>
            <div className="font-display text-sm space-y-3">
              <a
                href="mailto:rathoreatri03@gmail.com"
                className="flex justify-between items-center border-b border-border py-3 group hover:border-primary/50 transition-colors"
              >
                <span className="text-muted-foreground">MAIL</span>
                <span className="group-hover:text-primary transition-colors">rathoreatri03@gmail.com →</span>
              </a>
              <a
                href="https://github.com/Rathoreatri03"
                target="_blank"
                rel="noreferrer"
                className="flex justify-between items-center border-b border-border py-3 group hover:border-primary/50 transition-colors"
              >
                <span className="text-muted-foreground">GITHUB</span>
                <span className="group-hover:text-primary transition-colors">@Rathoreatri03 →</span>
              </a>
              <a
                href="https://www.linkedin.com/in/atri-rathore"
                target="_blank"
                rel="noreferrer"
                className="flex justify-between items-center border-b border-border py-3 group hover:border-primary/50 transition-colors"
              >
                <span className="text-muted-foreground">LINKEDIN</span>
                <span className="group-hover:text-primary transition-colors">/in/atri-rathore →</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 font-display text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} ATRI_RATHORE · ALL_SYSTEMS_NOMINAL</span>
          <span className="text-primary">UPTIME: 99.99% · LATENCY: 12ms</span>
        </div>
      </footer>
    </div>
  );
}
