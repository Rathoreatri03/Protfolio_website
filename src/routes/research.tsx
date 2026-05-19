import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { BookOpen, ExternalLink, Award } from "lucide-react";

export const Route = createFileRoute("/research")({
  component: Research,
});

function Research() {
  const { researchInsights, metadata } = usePortfolioData();

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-140px)] animate-fade-up py-2 px-2 sm:px-6">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-4 mt-2 sm:mt-4 px-2 sm:px-4">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/5 rounded-full border border-primary/20 mb-3 sm:mb-4">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-display text-primary tracking-[0.3em] sm:tracking-[0.4em] uppercase">
            {metadata.intelligence_tag || "TACTICAL_INTELLIGENCE"}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold tracking-tighter leading-[0.85] mb-3 sm:mb-4 text-white">
          {metadata.pages?.research?.title1 || "Scientific"} <span className="text-primary text-glow italic">{metadata.pages?.research?.title2 || "Insights"}</span><span className="text-primary">.</span>
        </h2>
        {metadata.pages?.research?.subtitle && (
          <p className="max-w-2xl text-[9px] sm:text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase mt-2">
            {metadata.pages.research.subtitle}
          </p>
        )}
      </div>

      <div className="flex justify-end w-full mb-3 sm:mb-4 pr-2 sm:pr-6">
        <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <span className="size-1.5 bg-primary/40 rounded-full" />
          Research Assets: <span className="text-primary font-bold">[{researchInsights.length || "0"} entries]</span>
        </div>
      </div>

      {/* Grid — 1 col mobile, 2 col tablet/desktop */}
      <div className="flex-1 overflow-y-auto pb-10 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: '.no-scrollbar::-webkit-scrollbar { display: none; }' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {researchInsights.map((insight, i) => {
            const idStr = String(i + 1).padStart(3, "0");
            const isPatent = insight.description.toLowerCase().includes("patent");

            return (
              <div
                key={i}
                className="group relative flex flex-col sm:flex-row border border-white/5 hover:border-primary/30 bg-white/[0.01] backdrop-blur-md overflow-hidden transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(var(--primary),0.05)] min-h-[180px]"
              >
                <div className="absolute top-0 left-0 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-[1.2s] z-20" />
                
                {/* Visual Block */}
                {insight.imgUrl ? (
                  <div className="relative w-full sm:w-44 aspect-video sm:aspect-auto overflow-hidden bg-black/60 border-b sm:border-b-0 sm:border-r border-white/5 shrink-0">
                    <img 
                      src={insight.imgUrl} 
                      alt={insight.title} 
                      loading="lazy" 
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] group-hover:scale-110 opacity-60 group-hover:opacity-40 grayscale group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="w-full sm:w-44 aspect-video sm:aspect-auto flex items-center justify-center bg-white/[0.02] border-b sm:border-b-0 sm:border-r border-white/5 shrink-0">
                    {isPatent ? (
                      <Award className="size-10 text-primary/30 group-hover:text-primary transition-colors duration-500" />
                    ) : (
                      <BookOpen className="size-10 text-primary/30 group-hover:text-primary transition-colors duration-500" />
                    )}
                  </div>
                )}

                {/* Details Content */}
                <div className="relative flex-1 p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-1.5 rounded-full bg-primary" />
                      <span className="font-display text-[8px] text-primary/70 tracking-[0.2em] uppercase">
                        {isPatent ? "PATENT_DECREE" : "LITERATURE_CHAPTER"} // 0{i + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold mb-2 tracking-tighter group-hover:text-primary transition-all duration-500 text-white leading-snug">
                      {insight.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed font-light opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      {insight.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-mono text-muted-foreground/40 tracking-wider">
                      INDEX_REF // {idStr}
                    </span>
                    {insight.link?.trim() && (
                      <a
                        href={insight.link.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 hover:bg-primary/20 border border-primary/20 hover:border-primary rounded-full transition-all duration-300 text-[8px] font-mono tracking-wider text-primary"
                      >
                        ACCESS RESOURCE <ExternalLink className="size-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info block */}
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
