import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData, Skill, SkillCategory } from "@/hooks/usePortfolioData";
import { useState, useMemo } from "react";
import { X, Maximize2 } from "lucide-react";

export const Route = createFileRoute("/skills")({
  component: Skills,
});

const CHART_COLORS = [
  "#FF9D00", // Orange
  "#FF4D00", // Dark Orange/Red
  "#FF2D55", // Pink/Red
  "#00A3FF", // Bright Blue
  "#00FF9D", // Green
  "#9D00FF", // Purple
];

function CategoryRadarModal({ category, onClose }: { category: SkillCategory, onClose: () => void }) {
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);
  
  const size = 350;
  const center = size / 2;
  const radius = size * 0.35;
  const axes = category.skills.map(s => s.name);
  const angleStep = (Math.PI * 2) / Math.max(axes.length, 3); // Ensure at least a triangle

  // Remove the old getPoints function since we'll map the single polygon inline

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#080808] border border-primary/30 rounded-3xl p-6 md:p-10 shadow-[0_0_100px_rgba(var(--primary),0.15)] overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-mono text-primary tracking-[0.4em] uppercase">Tactical_Intelligence_Overlay</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter text-white uppercase">
              {category.title}<span className="text-primary">_</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-primary/20 hover:border-primary transition-all duration-300">
            <X className="size-5 text-white/60" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Radar Chart with Highlights */}
          <div className="flex justify-center">
            <svg width={size} height={size} className="overflow-visible drop-shadow-[0_0_20px_rgba(var(--primary),0.1)]">
              {[0.2, 0.4, 0.6, 0.8, 1].map((lvl) => (
                <circle key={lvl} cx={center} cy={center} r={radius * lvl} className="fill-none stroke-white/5 stroke-[0.5px]" />
              ))}
              {axes.map((axis, i) => {
                const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
                const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
                
                // Add a small offset based on the angle to prevent text overlapping with the line
                const textRadiusOffset = 30;
                const textX = center + (radius + textRadiusOffset) * Math.cos(i * angleStep - Math.PI / 2);
                const textY = center + (radius + textRadiusOffset) * Math.sin(i * angleStep - Math.PI / 2);
                
                return (
                  <g key={axis}>
                    <line x1={center} y1={center} x2={x} y2={y} className="stroke-white/10 stroke-[0.5px]" />
                    <text x={textX} y={textY} textAnchor="middle" className="fill-white/40 text-[7.5px] font-mono tracking-widest uppercase">{axis}</text>
                  </g>
                );
              })}
              
              {/* Single Polygon mapping true percentages */}
              <polygon 
                points={
                  category.skills.map((skill, i) => {
                    const val = skill.progress;
                    const x = center + (radius * (val / 100)) * Math.cos(i * angleStep - Math.PI / 2);
                    const y = center + (radius * (val / 100)) * Math.sin(i * angleStep - Math.PI / 2);
                    return `${x},${y}`;
                  }).join(" ")
                }
                fill={CHART_COLORS[0]}
                fillOpacity={0.15}
                stroke={CHART_COLORS[0]}
                strokeWidth={1.5}
                className="transition-all duration-500 ease-out" 
              />
              
              {/* Skill Points/Vertices */}
              {category.skills.map((skill, i) => {
                const val = skill.progress;
                const x = center + (radius * (val / 100)) * Math.cos(i * angleStep - Math.PI / 2);
                const y = center + (radius * (val / 100)) * Math.sin(i * angleStep - Math.PI / 2);
                const isHighlighted = highlightedSkill === skill.name;
                const anyHighlighted = highlightedSkill !== null;
                
                return (
                  <circle
                    key={`pt-${skill.name}`}
                    cx={x}
                    cy={y}
                    r={isHighlighted ? 6 : 3}
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    className="transition-all duration-300"
                    style={{
                      opacity: isHighlighted ? 1 : anyHighlighted ? 0.3 : 0.8,
                      filter: isHighlighted ? `drop-shadow(0 0 10px ${CHART_COLORS[i % CHART_COLORS.length]})` : "none"
                    }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Interactive Skill Stats */}
          <div className="grid grid-cols-2 gap-4">
            {category.skills.map((skill, i) => (
              <div 
                key={skill.name} 
                onMouseEnter={() => setHighlightedSkill(skill.name)}
                onMouseLeave={() => setHighlightedSkill(null)}
                className={`p-4 bg-white/[0.03] border rounded-xl transition-all duration-300 cursor-crosshair ${
                  highlightedSkill === skill.name ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.1)] scale-[1.02]" : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`size-1.5 rounded-full transition-all duration-500 ${highlightedSkill === skill.name ? "animate-pulse" : ""}`} style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-[9px] font-display font-bold tracking-widest text-white/70 uppercase truncate">{skill.name}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className={`text-xl font-display font-bold transition-colors duration-300 ${highlightedSkill === skill.name ? "text-primary" : "text-white"}`}>{skill.progress}%</span>
                  <span className="text-[7px] font-mono text-primary/60 uppercase">Optimal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  const { skills, metadata } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-140px)] animate-fade-up overflow-hidden py-2 px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 mt-4 px-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/5 rounded-full border border-primary/20 mb-4">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-display text-primary tracking-[0.4em] uppercase">{metadata.intelligence_tag}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter leading-[0.85] mb-4 text-white">
            {metadata.pages?.skills.title1 || "The"} <span className="text-primary text-glow italic">{metadata.pages?.skills.title2 || "Matrix"}</span><span className="text-primary">.</span>
          </h2>
        </div>

        {/* Diagnostic Grid - Hidden Scrollbar */}
        <div className="flex-1 overflow-y-auto pr-4 pb-10 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{ __html: '.no-scrollbar::-webkit-scrollbar { display: none; }' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-16">
            {skills.map((category, catIdx) => (
              <div key={category.title} className="flex flex-col group">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-primary/30 font-bold">0{catIdx + 1}</span>
                    <h3 className="text-[11px] font-display font-bold tracking-[0.3em] text-white/70 group-hover:text-primary transition-colors duration-500 uppercase">
                      {category.title}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedCategory(category)} className="flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full hover:bg-primary/20 hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <span className="text-[7px] font-mono tracking-widest uppercase text-white/60">ANALYZE</span>
                    <Maximize2 className="size-2.5 text-primary" />
                  </button>
                </div>

                <div className="space-y-6 cursor-pointer" onClick={() => setSelectedCategory(category)}>
                  {category.skills.map((s) => (
                    <div key={s.name} className="group/skill">
                      <div className="flex justify-between items-end mb-2.5">
                        <p className="text-[11px] font-display font-bold tracking-[0.15em] text-white/30 group-hover/skill:text-white transition-all duration-300 uppercase">
                          {s.name}
                        </p>
                        <span className="text-[10px] font-mono font-bold text-white/10 group-hover/skill:text-primary transition-colors">
                          {s.progress}%
                        </span>
                      </div>

                      <div className="relative flex gap-[1.5px] h-3">
                        {Array.from({ length: 15 }).map((_, segmentIdx) => {
                          const isActive = segmentIdx / 15 < s.progress / 100;
                          return (isActive ? <div key={segmentIdx} className="h-full flex-1 bg-primary/50 group-hover/skill:bg-primary rounded-[0.5px] transition-all duration-500" /> : <div key={segmentIdx} className="h-full flex-1 bg-white/5 rounded-[0.5px]" />);
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

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

      {selectedCategory && (
        <CategoryRadarModal category={selectedCategory} onClose={() => setSelectedCategory(null)} />
      )}
    </>
  );
}
