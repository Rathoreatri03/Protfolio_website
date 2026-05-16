import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export const Route = createFileRoute("/achievements")({
  component: Achievements,
});

function Achievements() {
  const { successStories, metadata } = usePortfolioData();

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-140px)] animate-fade-up overflow-hidden py-2 px-6">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12 mt-4 px-4">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/5 rounded-full border border-primary/20 mb-4">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-display text-primary tracking-[0.4em] uppercase">{metadata.achievement_tag}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter leading-[0.85] mb-4 text-white">
          {metadata.pages?.achievements.title1 || "Victory"} <span className="text-primary text-glow italic">{metadata.pages?.achievements.title2 || "Archives"}</span><span className="text-primary">.</span>
        </h2>
        <div className="flex items-center justify-center gap-6 text-xs md:text-sm font-display tracking-[0.2em] text-muted-foreground uppercase opacity-80">
          <span>{metadata.pages?.achievements.subtitle || "A CHRONOLOGICAL LOG OF HACKATHON WINS AND INNOVATION CHALLENGES."}</span>
        </div>
      </div>

      {/* Internal Scroll Section */}
      <div className="flex-1 overflow-y-auto pr-4 pb-20 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: '.no-scrollbar::-webkit-scrollbar { display: none; }' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {successStories.map((story, i) => (
            <div key={i} className="group relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-700 shadow-2xl hover:shadow-primary/5">
              <div className="absolute top-4 right-6 text-[40px] font-display font-black text-white/5 group-hover:text-primary/10 transition-colors z-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={story.imgUrl} alt={story.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-8 relative z-10">
                <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight leading-tight group-hover:text-primary transition-colors text-glow-hover text-white">{story.title}</h3>
                <p className="text-sm text-muted-foreground/60 leading-relaxed font-light group-hover:text-foreground transition-colors duration-500 mt-4">{story.description}</p>
                {story.link && (
                  <div className="pt-6">
                    <a href={story.link} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-display font-bold tracking-[0.2em] text-primary/60 hover:text-primary transition-all group/link">
                      ACCESS_INTEL 
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/link:translate-x-1 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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
