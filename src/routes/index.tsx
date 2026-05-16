import { createFileRoute } from "@tanstack/react-router";
import { TypingRoles } from "@/components/TypingRoles";
import { DodoAI } from "@/components/DodoAI";
import { usePortfolioData } from "@/hooks/usePortfolioData";
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

function Index() {
  const { banner, links } = usePortfolioData();
  const STACK = [
    "PYTHON", "PYTORCH", "TENSORFLOW", "OPENCV", "YOLO", "TRANSFORMERS",
    "PANDAS", "NUMPY", "SCIKIT-LEARN", "CUDA", "DOCKER", "BLENDER",
    "LANGCHAIN", "HUGGING-FACE", "GIT", "LINUX",
  ];

  return (
    <div className="h-full flex flex-col justify-center gap-20 py-12">
      {/* HERO */}
      <section className="max-w-6xl mx-auto w-full animate-fade-up grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
        <div>
          <div className="mb-6 font-display text-primary flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-[11px] opacity-60">
            <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            MODEL_LOADED :: NEURAL_NET_ONLINE
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] mb-6">
            ARCHITECTING<br />
            <span className="text-primary text-glow">INTELLIGENT</span><br />
            SYSTEMS<span className="text-primary">.</span>
          </h1>

          <div className="font-display text-xl md:text-3xl mb-8 min-h-[1.5em]">
            <span className="text-muted-foreground">&gt;_ role: </span>
            <TypingRoles roles={banner.titles} />
          </div>

          <p className="max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
            I'm <span className="text-foreground font-medium">Atri Rathore</span> — {banner.description.slice(0, 260)}…
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={links.resume_PDF}
              target="_blank" rel="noreferrer"
              className="group relative inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground font-display font-bold text-xs tracking-tight hover:bg-primary/90 transition-all active:scale-[0.98] overflow-hidden"
            >
              <span className="relative z-10">⬢ INITIALIZE_RESUME.PDF</span>
              <span className="absolute inset-0 animate-shimmer" />
            </a>
            <a
              href={links.visume_video}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center h-12 px-6 border border-border bg-white/5 backdrop-blur font-display text-xs hover:bg-primary/10 hover:border-primary/60 transition-colors"
            >
              ▶ WATCH_VISUME.MOV
            </a>
            <a
              href="mailto:rathoreatri03@gmail.com"
              className="inline-flex items-center justify-center h-12 px-6 border border-border font-display text-xs hover:bg-primary/10 hover:border-primary/60 transition-colors"
            >
              ⇄ ESTABLISH_CONTACT
            </a>
          </div>
        </div>

        {/* Empty div to preserve grid spacing for persistent DodoAI in Layout */}
        <div className="hidden lg:block h-[450px]" />
      </section>

      {/* Marquee Strip with Integrated Label */}
      <div className="relative w-full shrink-0 mt-auto">
        {/* Centered Line-Join Label */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-[1px] bg-white/10" />
          <div className="flex items-center gap-3 px-2">
            <div className="size-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)] animate-pulse" />
            <span className="text-[10px] font-display font-bold text-primary tracking-[0.5em] uppercase whitespace-nowrap text-glow">
              Core_Capabilities
            </span>
            <div className="size-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)] animate-pulse" />
          </div>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Marquee content */}
        <div className="overflow-hidden border-b border-white/10 py-8 animate-fade-up delay-700">
          {/* Spotlight Glow Overlay */}
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            <div className="w-1/4 h-full bg-primary/10 blur-[40px] rounded-full" />
          </div>
          
          {/* Edge Fading Mask */}
          <div className="absolute inset-0 pointer-events-none [background:linear-gradient(to_right,var(--background)_0%,transparent_20%,transparent_80%,var(--background)_100%)]" />

          <div className="flex gap-16 animate-marquee whitespace-nowrap font-display text-[11px] tracking-[0.4em] text-muted-foreground uppercase">
            {[...STACK, ...STACK].map((s, i) => (
              <span 
                key={i} 
                className="hover:text-primary transition-all cursor-default relative group"
              >
                <span className="group-hover:text-glow">▸ {s}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
