import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData, Experience } from "@/hooks/usePortfolioData";

export const Route = createFileRoute("/log")({
  component: Log,
});

function Log() {
  const { experience } = usePortfolioData();

  return (
    <section id="log" className="max-w-7xl mx-auto animate-fade-up pb-32">
      <div className="flex flex-col items-center text-center mb-20 px-4">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/5 rounded-full border border-primary/20 mb-6">
          <span className="size-1.5 rounded-full bg-primary animate-ping" />
          <span className="text-[10px] font-display text-primary tracking-[0.4em] uppercase">Operational_Log_v4.2</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-display font-bold tracking-tighter leading-[0.85] mb-6">
          Neural <span className="text-primary italic">Milestones</span>.
        </h2>
        <p className="text-muted-foreground/60 max-w-xl text-sm font-light tracking-wide uppercase">
          Chronological archive of mission-critical achievements and system upgrades.
        </p>
      </div>

      <div className="relative">
        {/* Perfectly Centered Timeline Stem */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary via-primary/10 to-transparent transform md:-translate-x-1/2" />

        <div className="space-y-32 md:space-y-48">
          {(experience.length ? experience : Array.from({ length: 4 })).map((e, i) => {
            const ex = e as Experience | undefined;
            const isLeft = i % 2 === 0;
            const idStr = String(i + 1).padStart(2, "0");
            
            return (
              <div 
                key={i} 
                className="relative flex flex-col md:flex-row items-center w-full group"
              >
                {/* Central Point */}
                <div className="absolute left-8 md:left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                  <div className="absolute inset-[-4px] rounded-full border border-primary/20 group-hover:border-primary transition-colors" />
                  <div className="absolute inset-[4px] rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                </div>

                {/* Left Side: Media or Info */}
                <div className={`w-full md:w-[42%] ml-16 md:ml-0 ${isLeft ? "md:order-1 md:text-right" : "md:order-3 md:text-left"}`}>
                  <div className={`space-y-4 transition-all duration-700 ${isLeft ? "md:translate-x-[-20px] group-hover:translate-x-0" : "md:translate-x-[20px] group-hover:translate-x-0"}`}>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl group-hover:border-primary/30 transition-all duration-700">
                      {ex?.imgUrl ? (
                        <img 
                          src={ex.imgUrl} 
                          alt={ex.title} 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-full h-full animate-pulse bg-primary/5" />
                      )}
                      <div className="absolute top-4 left-4 py-1 px-3 border border-white/10 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-mono text-primary/60 tracking-widest uppercase">
                        Source_Media // {idStr}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Central Space (The Stem Gap) */}
                <div className="hidden md:block md:w-[16%] md:order-2" />

                {/* Right Side: Info or Media (The "Opposite" Data) */}
                <div className={`w-full md:w-[42%] ml-16 md:ml-0 mt-8 md:mt-0 ${isLeft ? "md:order-3 md:text-left" : "md:order-1 md:text-right"}`}>
                  <div className={`space-y-6 transition-all duration-700 ${isLeft ? "md:translate-x-[20px] group-hover:translate-x-0" : "md:translate-x-[-20px] group-hover:translate-x-0"}`}>
                    <div className={`flex flex-col ${isLeft ? "md:items-start" : "md:items-end"} gap-2`}>
                      <span className="text-[10px] font-mono text-primary tracking-[0.4em] uppercase">Archive_Ref :: 2024_Q{4-i}</span>
                      <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight leading-none group-hover:text-glow transition-all">
                        {ex?.title || "loading…"}
                      </h3>
                    </div>
                    
                    <p className={`text-sm text-muted-foreground/60 leading-relaxed font-light max-w-md ${isLeft ? "" : "md:ml-auto"} group-hover:text-foreground transition-colors duration-500`}>
                      {ex?.description || ""}
                    </p>

                    <div className={`flex items-center gap-6 pt-4 border-t border-white/5 ${isLeft ? "" : "md:flex-row-reverse"}`}>
                      <a 
                        href={ex?.link || "#"}
                        target="_blank"
                        className="text-[10px] font-display font-bold tracking-widest text-primary border border-primary/20 px-4 py-1.5 rounded-full hover:bg-primary/10 transition-all"
                      >
                        FULL_REPORT
                      </a>
                      <span className="text-[9px] font-mono opacity-20 uppercase tracking-tighter">Checksum_Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
