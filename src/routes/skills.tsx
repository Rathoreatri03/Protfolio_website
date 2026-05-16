import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useState } from "react";

const STACK = [
  "PYTHON", "PYTORCH", "TENSORFLOW", "OPENCV", "YOLO", "TRANSFORMERS",
  "PANDAS", "NUMPY", "SCIKIT-LEARN", "CUDA", "DOCKER", "BLENDER",
  "LANGCHAIN", "HUGGING-FACE", "GIT", "LINUX",
];

export const Route = createFileRoute("/skills")({
  component: Skills,
});

function Skills() {
  const { skills } = usePortfolioData();
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [calibrating, setCalibrating] = useState<string | null>(null);

  const categories = {
    "Vision_Core": ["Image Processing", "Object Detection", "3D Modeling"],
    "Neural_Logic": ["ML Research", "Model Training", "Model Architecture Design"],
    "System_Engine": ["Python Development", "Data Analysis", "Statistics"]
  };

  const handleCalibrate = (name: string) => {
    setCalibrating(name);
    setTimeout(() => setCalibrating(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-160px)] animate-fade-up overflow-hidden py-4">
      
      {/* Cylindrical Tech Hub (Minimal) */}
      <div className="relative mb-4">
        <div className="h-12 w-full overflow-hidden [perspective:800px] [mask-image:radial-gradient(50%_100%_at_50%_0%,black_70%,transparent_100%)]">
          <div className="flex gap-16 animate-marquee whitespace-nowrap [transform:rotateX(-15deg)_translateZ(20px)] py-2">
            {[...STACK, ...STACK].map((s, i) => (
              <div 
                key={i}
                onMouseEnter={() => setHoveredTech(s)}
                onMouseLeave={() => setHoveredTech(null)}
                className={`font-display text-[9px] font-bold tracking-[0.5em] transition-all duration-700 ${
                  hoveredTech === s ? "text-primary scale-110 translate-y-[-1px]" : "text-muted-foreground/10"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        
        {/* Fill Space with Live Data Stream */}
        <div className="flex justify-between items-center px-4 -mt-1 opacity-20 pointer-events-none">
          <div className="flex gap-4 overflow-hidden max-w-lg">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="text-[6px] font-mono whitespace-nowrap animate-pulse" style={{ animationDelay: `${i * 300}ms` }}>
                [0x{Math.random().toString(16).slice(2, 6).toUpperCase()}] :: NEURAL_SYNC...
              </span>
            ))}
          </div>
          <div className="h-[1px] flex-1 mx-6 bg-gradient-to-r from-primary/20 to-transparent" />
          <span className="text-[6px] font-mono text-primary/30 uppercase tracking-[0.3em]">STATE :: NOMINAL</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {/* Header - Very Compact */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10 mb-2">
              <span className="size-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[7px] font-display text-primary tracking-[0.4em] uppercase">Matrix_v4.2</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter leading-[0.85]">
              The <span className="text-primary italic">Matrix</span>.
            </h2>
          </div>
          
          <div className="hidden md:flex gap-10 text-right opacity-40">
            <div className="space-y-0.5">
              <p className="text-[7px] font-mono text-primary uppercase tracking-widest">Efficiency</p>
              <p className="text-[11px] font-display font-bold tracking-widest">98.4%</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[7px] font-mono text-primary uppercase tracking-widest">Load</p>
              <p className="text-[11px] font-display font-bold tracking-widest">OPTIMAL</p>
            </div>
          </div>
        </div>

        {/* Diagnostic Grid - Super High Density */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 flex-1 py-4">
          {Object.entries(categories).map(([category, skillNames], catIdx) => (
            <div key={category} className="space-y-4 animate-fade-up" style={{ animationDelay: `${catIdx * 100}ms` }}>
              <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                <span className="text-[8px] font-mono text-primary/30">0{catIdx + 1}</span>
                <h3 className="text-[9px] font-display font-bold tracking-[0.4em] text-foreground/60 uppercase">{category}</h3>
              </div>

              <div className="space-y-5">
                {skillNames.map((name) => {
                  const s = skills.find(sk => sk.name === name);
                  if (!s) return null;
                  const isCalibrating = calibrating === s.name;
                  
                  return (
                    <div 
                      key={name} 
                      className="group cursor-pointer"
                      onClick={() => handleCalibrate(s.name)}
                    >
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-[10px] font-display font-bold tracking-[0.15em] text-muted-foreground/60 group-hover:text-primary transition-all duration-300 uppercase">
                          {s.name}
                        </p>
                        <span className={`text-[9px] font-mono font-bold ${isCalibrating ? "text-primary animate-pulse" : "text-primary/20"}`}>
                          {isCalibrating ? "SYNC" : `${s.progress}%`}
                        </span>
                      </div>

                      {/* Segmented Meter (Thinner) */}
                      <div className="relative flex gap-[2px] h-2.5">
                        {Array.from({ length: 12 }).map((_, segmentIdx) => {
                          const isActive = segmentIdx / 12 < s.progress / 100;
                          return (
                            <div 
                              key={segmentIdx}
                              className={`h-full flex-1 transition-all duration-500 rounded-[1px] ${
                                isCalibrating 
                                  ? "bg-primary" 
                                  : isActive 
                                    ? "bg-primary/70 group-hover:bg-primary shadow-[0_0_8px_rgba(var(--primary),0.1)]" 
                                    : "bg-white/5"
                              }`}
                              style={{ 
                                transitionDelay: isCalibrating ? `${segmentIdx * 10}ms` : "0ms",
                                opacity: isActive ? 1 : 0.05
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between opacity-20 hover:opacity-100 transition-all duration-700">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-mono text-primary uppercase">Processor:</span>
              <span className="text-[9px] font-display font-bold tracking-widest">NEURAL_v4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-mono text-primary uppercase">Cluster:</span>
              <span className="text-[9px] font-display font-bold tracking-widest">H100_READY</span>
            </div>
          </div>
          <p className="text-[7px] font-mono tracking-[0.4em]">STABLE_BUILD_2026</p>
        </div>
      </div>
    </div>
  );
}
