import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData, Experience } from "@/hooks/usePortfolioData";

export const Route = createFileRoute("/log")({
  component: Log,
});

function Log() {
  const { experience, metadata } = usePortfolioData();

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-140px)] animate-fade-up overflow-hidden py-2 px-6">
      
      {/* Header - Driven by Metadata */}
      <div className="flex flex-col items-center text-center mb-12 mt-4 px-4">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/5 rounded-full border border-primary/20 mb-4">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-display text-primary tracking-[0.4em] uppercase">{metadata.operational_log_tag}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter leading-[0.85] mb-4 text-white">
          {metadata.pages?.log.title1 || "Neural"} <span className="text-primary text-glow italic">{metadata.pages?.log.title2 || "Milestones"}</span><span className="text-primary">.</span>
        </h2>
        <div className="flex items-center justify-center gap-6 text-xs md:text-sm font-display tracking-[0.2em] text-muted-foreground uppercase opacity-80">
          <span>{metadata.pages?.log.subtitle || "CHRONOLOGICAL ARCHIVE OF ACHIEVEMENTS AND SYSTEM UPGRADES"}</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="flex-1 overflow-y-auto pr-4 pb-20 no-scrollbar relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: '.no-scrollbar::-webkit-scrollbar { display: none; }' }} />
        
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/20 to-transparent transform -translate-x-1/2 z-0" />

        <div className="space-y-24 md:space-y-32 relative z-10">
          {experience.map((ex, i) => {
            const isLeft = i % 2 === 0;
            const idStr = String(i + 1).padStart(2, "0");
            
            return (
              <div key={i} className="relative flex flex-col md:flex-row items-center w-full group">
                <div className="absolute left-8 md:left-1/2 top-1/2 size-4 transform -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                  <div className="absolute inset-[-4px] rounded-full border border-primary/20 group-hover:border-primary transition-colors" />
                  <div className="absolute inset-[4px] rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                </div>

                <div className={`w-full md:w-[42%] ml-16 md:ml-0 ${isLeft ? "md:order-1 md:text-right" : "md:order-3 md:text-left"}`}>
                  <div className={`transition-all duration-700 ${isLeft ? "md:translate-x-[-15px] group-hover:translate-x-0" : "md:translate-x-[15px] group-hover:translate-x-0"}`}>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl group-hover:border-primary/30 transition-all duration-700">
                      <img src={ex.imgUrl} alt={ex.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0" />
                      <div className="absolute top-3 left-3 py-0.5 px-2 border border-white/10 bg-black/60 backdrop-blur-md rounded-full text-[7px] font-mono text-primary/60 tracking-widest uppercase">
                        Ref_id // {idStr}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block md:w-[16%] md:order-2" />

                <div className={`w-full md:w-[42%] ml-16 md:ml-0 mt-6 md:mt-0 ${isLeft ? "md:order-3 md:text-left" : "md:order-1 md:text-right"}`}>
                  <div className={`space-y-4 transition-all duration-700 ${isLeft ? "md:translate-x-[15px] group-hover:translate-x-0" : "md:translate-x-[-15px] group-hover:translate-x-0"}`}>
                    <div className={`flex flex-col ${isLeft ? "md:items-start" : "md:items-end"} gap-1.5`}>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-mono text-primary tracking-[0.4em] uppercase whitespace-nowrap">{ex.ref || "ARCHIVE_REF // NULL"}</span>
                        {ex.duration && (
                          <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase border-l border-white/10 pl-4">{ex.duration}</span>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight leading-none group-hover:text-primary transition-all text-white">
                        {ex.title}
                      </h3>
                    </div>
                    
                    <p className={`text-[11px] text-muted-foreground/60 leading-relaxed font-light max-w-sm ${isLeft ? "" : "md:ml-auto"} group-hover:text-foreground transition-colors duration-500 line-clamp-3`}>
                      {ex.description}
                    </p>

                    <div className={`flex items-center gap-4 pt-3 border-t border-white/5 ${isLeft ? "" : "md:flex-row-reverse"}`}>
                      {ex.link && (
                        <a href={ex.link} target="_blank" className="text-[8px] font-display font-bold tracking-widest text-primary border border-primary/20 px-3 py-1 rounded-full hover:bg-primary/10 transition-all">
                          FULL_REPORT
                        </a>
                      )}
                      <span className="text-[8px] font-mono opacity-20 uppercase tracking-tighter">Checksum_Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - Driven by Metadata */}
      <div className="mt-4 pt-6 border-t border-white/5 flex items-center justify-between opacity-20 pointer-events-none">
        <div className="flex gap-10">
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-mono text-primary uppercase">ID:</span>
            <span className="text-[9px] font-display font-bold tracking-widest uppercase text-white">{metadata.systemID}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-mono text-primary uppercase">Kernel:</span>
            <span className="text-[9px] font-display font-bold tracking-widest uppercase text-white">{metadata.kernel}</span>
          </div>
        </div>
        <p className="text-[7px] font-mono tracking-[0.4em] text-white/60 uppercase">{metadata.version}</p>
      </div>
    </div>
  );
}
