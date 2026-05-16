import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData, Project } from "@/hooks/usePortfolioData";

export const Route = createFileRoute("/work")({
  component: Work,
});

function Work() {
  const { projects } = usePortfolioData();

  return (
    <section id="work" className="max-w-6xl mx-auto animate-fade-up">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {(projects.length ? projects : Array.from({ length: 4 })).map((p, i) => {
          const proj = p as Project | undefined;
          const idStr = String(i + 1).padStart(3, "0");
          return (
            <a
              key={i}
              href={proj?.link?.trim() || "#"}
              target={proj?.link?.trim() ? "_blank" : undefined}
              rel="noreferrer"
              className="group relative flex flex-col border border-white/5 hover:border-primary/30 bg-white/[0.02] backdrop-blur-md overflow-hidden transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(var(--primary),0.1)] animate-fade-up h-full"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-1000 z-20" />
              
              {/* Media Section (Vertical Rectangle Top) */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/60 border-b border-white/5">
                {proj ? (
                  <>
                    <img
                      src={proj.imgUrl}
                      alt={proj.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] group-hover:scale-110 group-hover:blur-[1px] opacity-70 group-hover:opacity-30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                      <div className="px-5 py-2 border border-primary bg-primary/10 text-primary font-display text-[10px] tracking-[0.4em] uppercase backdrop-blur-md">
                        View_Project
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full animate-pulse bg-primary/5" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 font-display text-[9px] text-primary/60 tracking-[0.4em] uppercase">
                  Reference // {idStr}
                </div>
              </div>

              {/* Content Section */}
              <div className="relative flex-1 p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="size-1 rounded-full bg-primary" />
                  <span className="font-display text-[9px] text-primary/70 tracking-[0.3em] uppercase">
                    Neural_Module :: 01
                  </span>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 tracking-tighter group-hover:text-glow transition-all duration-500">
                  {proj?.title || "loading…"}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-8 line-clamp-4 group-hover:text-foreground/80 transition-colors duration-500 font-light opacity-60 group-hover:opacity-100">
                  {proj?.description || ""}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {["ML", "CV", "AI"].map((tag) => (
                      <span key={tag} className="text-[8px] font-display px-2 py-0.5 border border-white/10 text-muted-foreground/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="size-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-500">
                    <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
