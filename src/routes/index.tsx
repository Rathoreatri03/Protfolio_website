import { createFileRoute } from "@tanstack/react-router";
import { TypingRoles } from "@/components/TypingRoles";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Portfolio — AI / Computer Vision Engineer" },
      { name: "description", content: "AI / ML / Computer Vision portfolio and research log." },
    ],
  }),
  component: Index,
} as any));

function Index() {
  const { banner, links, metadata, techStack } = usePortfolioData();

  return (
    <div className="min-h-full flex flex-col justify-center gap-6 sm:gap-8 py-6 sm:py-8">
      {/* HERO */}
      <section className="max-w-6xl mx-auto w-full animate-fade-up px-2 sm:px-0 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-center pt-4 sm:pt-8">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-4 sm:mb-6 text-white uppercase">
            {metadata.userName.split(" ")[0]}<br />
            <span className="text-primary text-glow">{metadata.userName.split(" ").slice(1).join(" ")}</span><span className="text-primary">.</span>
          </h1>

          <div className="font-display text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 min-h-[1.2em]">
            <span className="text-muted-foreground">&gt;_ role: </span>
            <TypingRoles roles={banner.titles} />
          </div>

          <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 sm:mb-8 opacity-80 text-justify">
            I'm <span className="text-foreground font-medium">{metadata.userName}</span> — {banner.description}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <a
              href={links.resume_PDF}
              target="_blank" rel="noreferrer"
              className="group relative inline-flex items-center justify-center h-10 sm:h-12 px-5 sm:px-8 bg-primary text-primary-foreground font-display font-bold text-[10px] sm:text-xs tracking-tight hover:bg-primary/90 transition-all active:scale-[0.98] overflow-hidden"
            >
              <span className="relative z-10">⬢ INITIALIZE_RESUME.PDF</span>
              <span className="absolute inset-0 animate-shimmer" />
            </a>
            <a
              href={links.visume_video}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center h-10 sm:h-12 px-4 sm:px-6 border border-border bg-white/5 backdrop-blur font-display text-[10px] sm:text-xs hover:bg-primary/10 hover:border-primary/60 transition-colors text-white/60"
            >
              ▶ WATCH_VISUME.MOV
            </a>
            <a
              href={`mailto:${links.email}`}
              className="inline-flex items-center justify-center h-10 sm:h-12 px-4 sm:px-6 border border-border font-display text-[10px] sm:text-xs hover:bg-primary/10 hover:border-primary/60 transition-colors text-white/60"
            >
              ⇄ ESTABLISH_CONTACT
            </a>
          </div>
        </div>

        {/* Spacer for DODO AI on desktop */}
        <div className="hidden lg:block h-[450px]" />
      </section>

      {/* Marquee Strip */}
      <div className="relative w-full shrink-0 mt-auto">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-[1px] bg-white/10" />
          <div className="flex items-center gap-3 px-2">
            <div className="size-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)] animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-display font-bold text-primary tracking-[0.4em] sm:tracking-[0.5em] uppercase whitespace-nowrap text-glow">
              Core_Capabilities
            </span>
            <div className="size-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)] animate-pulse" />
          </div>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        <div className="relative overflow-hidden border-b border-white/10 py-5 sm:py-8 animate-fade-up delay-700">
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            <div className="w-1/4 h-full bg-primary/5 blur-[40px] rounded-full" />
          </div>
          <div className="absolute inset-0 pointer-events-none [background:linear-gradient(to_right,var(--background)_0%,transparent_20%,transparent_80%,var(--background)_100%)]" />

          <div className="flex gap-10 sm:gap-16 animate-marquee whitespace-nowrap font-display text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground uppercase">
            {[...techStack, ...techStack].map((s, i) => (
              <span key={i} className="hover:text-primary transition-all cursor-default relative group">
                <span className="group-hover:text-glow">▸ {s}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
