import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const Route = createFileRoute("/work")({
  component: Work,
});

function Work() {
  const { projects, metadata } = usePortfolioData();

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-140px)] animate-fade-up py-2 px-2 sm:px-6">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-4 mt-2 sm:mt-4 px-2 sm:px-4">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/5 rounded-full border border-primary/20 mb-3 sm:mb-4">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-display text-primary tracking-[0.3em] sm:tracking-[0.4em] uppercase">{metadata.deployment_tag}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold tracking-tighter leading-[0.85] mb-3 sm:mb-4 text-white">
          {metadata.pages?.work.title1 || "Experiments in"} <span className="text-primary text-glow italic">{metadata.pages?.work.title2 || "Motion"}</span><span className="text-primary">.</span>
        </h2>
      </div>

      <div className="flex justify-end w-full mb-3 sm:mb-4 pr-2 sm:pr-6">
        <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <span className="size-1.5 bg-primary/40 rounded-full" />
          Active Modules: <span className="text-primary font-bold">[{projects.length || "0"} entries]</span>
        </div>
      </div>

      {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="flex-1 overflow-y-auto pb-10 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: '.no-scrollbar::-webkit-scrollbar { display: none; }' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-8">
          {projects.map((proj, i) => {
            const idStr = String(i + 1).padStart(3, "0");
            return (
              <a
                key={i}
                href={proj.link?.trim() || "#"}
                target={proj.link?.trim() ? "_blank" : undefined}
                rel="noreferrer"
                className="group relative flex flex-col border border-white/5 hover:border-primary/30 bg-white/[0.02] backdrop-blur-md overflow-hidden transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(var(--primary),0.1)] h-full"
              >
                <div className="absolute top-0 left-0 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-1000 z-20" />
                <div className="relative w-full aspect-video overflow-hidden bg-black/60 border-b border-white/5">
                  <img src={proj.imgUrl} alt={proj.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] group-hover:scale-110 opacity-70 group-hover:opacity-30 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="px-4 py-1.5 border border-primary bg-primary/10 text-primary font-display text-[8px] tracking-[0.4em] uppercase backdrop-blur-md">
                      ACCESS_SOURCE
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 font-display text-[8px] text-primary/60 tracking-[0.4em] uppercase">
                    Ref_id // {idStr}
                  </div>
                </div>

                <div className="relative flex-1 p-4 sm:p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="size-1 rounded-full bg-primary" />
                    <span className="font-display text-[8px] text-primary/70 tracking-[0.2em] uppercase">
                      Neural_Module :: 0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold mb-2 tracking-tighter group-hover:text-primary transition-all duration-500 text-white">{proj.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-6 line-clamp-3 group-hover:text-foreground/80 transition-colors duration-500 font-light opacity-60 group-hover:opacity-100">{proj.description}</p>
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {["ML", "CV", "AI"].map((tag) => (
                        <span key={tag} className="text-[7px] font-mono px-2 py-0.5 border border-white/10 text-muted-foreground/40 uppercase">{tag}</span>
                      ))}
                    </div>
                    <div className="size-6 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-500">
                      <svg className="size-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 sm:pt-6 border-t border-white/5 flex items-center justify-between opacity-20 pointer-events-none">
        <div className="flex gap-6 sm:gap-10">
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-mono text-primary uppercase">ID:</span>
            <span className="text-[9px] font-display font-bold tracking-widest uppercase text-white">{metadata.systemID}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-mono text-primary uppercase">Kernel:</span>
            <span className="text-[9px] font-display font-bold tracking-widest uppercase text-white">{metadata.kernel}</span>
          </div>
        </div>
        <p className="text-[7px] font-mono tracking-[0.4em] text-white/60 uppercase hidden sm:block">{metadata.version}</p>
      </div>
    </div>
  );
}
