import { createFileRoute } from "@tanstack/react-router";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useState, useEffect } from "react";
import { 
  BookOpen, 
  ExternalLink, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Activity,
  Cpu,
  Terminal
} from "lucide-react";

export const Route = createFileRoute("/research")({
  component: Research,
});

function Research() {
  const { researchInsights, metadata } = usePortfolioData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const length = researchInsights.length;

  const handleNext = () => {
    if (length === 0 || isAnimating) return;
    triggerAnimation();
    setActiveIndex((prev) => (prev + 1) % length);
  };

  const handlePrev = () => {
    if (length === 0 || isAnimating) return;
    triggerAnimation();
    setActiveIndex((prev) => (prev - 1 + length) % length);
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Swiping and dragging logic
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStart === null) return;
    const dragEnd = e.clientX;
    const diff = dragStart - dragEnd;
    if (diff > 80) {
      handleNext();
    } else if (diff < -80) {
      handlePrev();
    }
    setDragStart(null);
  };

  const getWrappedDiff = (index: number, active: number, total: number) => {
    let diff = index - active;
    const half = Math.floor(total / 2);
    while (diff > half) diff -= total;
    while (diff < -half) diff += total;
    return diff;
  };

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  if (length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center text-white">
        <Activity className="size-8 text-[#00ff88] animate-spin mb-4" />
        <h3 className="font-display text-xs font-semibold tracking-widest text-[#00ff88]/80 uppercase">Accessing Research Modules...</h3>
        <p className="text-[10px] text-muted-foreground font-mono mt-2 tracking-widest uppercase">Decoupling dynamic layers...</p>
      </div>
    );
  }

  const activeInsight = researchInsights[activeIndex];
  const isPatentActive = activeInsight?.description.toLowerCase().includes("patent");

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-140px)] animate-fade-up py-4 px-4 sm:px-6 relative select-none">
      
      {/* Custom Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cyber-deck {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        .cyber-grid-pattern {
          background-image: linear-gradient(rgba(0, 255, 136, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 255, 136, 0.02) 1px, transparent 1px);
          background-size: 16px 16px;
        }
        @keyframes scanline-v {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline-v 5s linear infinite;
        }
        .text-neon {
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-4 mt-2 px-2 sm:px-4">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-[#00ff88]/5 rounded-full border border-[#00ff88]/20 mb-3">
          <span className="size-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-display text-[#00ff88] tracking-[0.3em] sm:tracking-[0.4em] uppercase">
            {metadata.intelligence_tag || "TACTICAL_INTELLIGENCE"}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold tracking-tighter leading-[0.85] mb-2 text-white">
          {metadata.pages?.research?.title1 || "Scientific"} <span className="text-[#00ff88] text-glow italic">{metadata.pages?.research?.title2 || "Insights"}</span><span className="text-[#00ff88]">.</span>
        </h2>
        {metadata.pages?.research?.subtitle && (
          <p className="max-w-2xl text-[9px] sm:text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase mt-1">
            {metadata.pages.research.subtitle}
          </p>
        )}
      </div>

      {/* Active Count HUD */}
      <div className="flex justify-between items-center w-full mb-3 px-2 sm:px-6">
        <div className="text-[8px] sm:text-[9px] font-mono text-muted-foreground/60 tracking-wider uppercase">
          SECURE_NODE: <span className="text-white">RESEARCH_DECK_0x{length.toString(16).toUpperCase()}</span>
        </div>
        <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <span className="size-1.5 bg-[#00ff88]/40 rounded-full" />
          Intel Ledger: <span className="text-[#00ff88] font-bold">[{activeIndex + 1} / {length}]</span>
        </div>
      </div>

      {/* ── 3D CYBER-DECK CAROUSEL VIEWPORT ── */}
      <div 
        className="relative w-full h-[320px] sm:h-[420px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing cyber-deck"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Holographic Backdrop Aura */}
        <div className="absolute w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] rounded-full bg-[#00ff88]/5 blur-[80px] pointer-events-none z-0" />

        {researchInsights.map((insight, i) => {
          const diff = getWrappedDiff(i, activeIndex, length);
          const absDiff = Math.abs(diff);
          const isVisible = absDiff <= (isMobile ? 1 : 2);
          const isPatent = insight.description.toLowerCase().includes("patent");

          let translateX = 0;
          let translateZ = 0;
          let rotateY = 0;
          let scale = 1;
          let opacity = 0;

          if (diff === 0) {
            translateX = 0;
            translateZ = 0;
            rotateY = 0;
            scale = 1;
            opacity = 1;
          } else {
            const dir = diff > 0 ? 1 : -1;
            
            if (isMobile) {
              translateX = dir * 65;
              translateZ = -120;
              rotateY = -dir * 25;
              scale = 0.8;
              opacity = absDiff === 1 ? 0.35 : 0;
            } else if (isTablet) {
              translateX = dir * 55;
              translateZ = -180;
              rotateY = -dir * 30;
              scale = 0.85;
              opacity = absDiff === 1 ? 0.5 : 0.1;
            } else {
              if (absDiff === 1) {
                translateX = dir * 62;
                translateZ = -160;
                rotateY = -dir * 35;
                scale = 0.9;
                opacity = 0.6;
              } else if (absDiff === 2) {
                translateX = dir * 110;
                translateZ = -320;
                rotateY = -dir * 45;
                scale = 0.75;
                opacity = 0.15;
              }
            }
          }

          const cardStyle: React.CSSProperties = {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: isMobile ? "240px" : "340px",
            height: isMobile ? "260px" : "360px",
            marginLeft: isMobile ? "-120px" : "-170px",
            marginTop: isMobile ? "-130px" : "-180px",
            transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
            opacity: isVisible ? opacity : 0,
            zIndex: 10 - absDiff,
            pointerEvents: diff === 0 ? "auto" : absDiff === 1 ? "auto" : "none",
            cursor: diff === 0 ? "default" : absDiff === 1 ? "pointer" : "default",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          };

          return (
            <div
              key={i}
              style={cardStyle}
              onClick={() => diff !== 0 && setActiveIndex(i)}
              className={`group flex flex-col justify-between border rounded-2xl overflow-hidden backdrop-blur-md bg-[#0a0a0a]/90 shadow-[0_15px_45px_rgba(0,0,0,0.8)] select-none transition-all duration-300 ${
                diff === 0 
                  ? "border-[#00ff88]/50 shadow-[0_0_35px_rgba(0,255,136,0.2)]" 
                  : "border-white/5 opacity-40 hover:opacity-75 hover:border-white/20"
              }`}
            >
              {/* Visual image section (Top half of the card) */}
              <div className="relative w-full h-[45%] shrink-0 overflow-hidden bg-black/40 border-b border-white/5">
                {insight.imgUrl ? (
                  <img 
                    src={insight.imgUrl} 
                    alt={insight.title} 
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      diff === 0 ? "scale-100 opacity-90 grayscale-0" : "scale-105 opacity-40 grayscale"
                    }`} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                    {isPatent ? (
                      <Award className={`size-12 ${diff === 0 ? "text-[#00ff88]" : "text-white/20"}`} />
                    ) : (
                      <BookOpen className={`size-12 ${diff === 0 ? "text-[#00ff88]" : "text-white/20"}`} />
                    )}
                  </div>
                )}

                {/* Floating Classification Badge (Top-right of image) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/80 border border-white/10 rounded-full backdrop-blur-md z-20">
                  {isPatent ? (
                    <Award className="size-3 text-[#00ff88]" />
                  ) : (
                    <BookOpen className="size-3 text-[#00ff88]" />
                  )}
                  <span className="font-mono text-[8px] tracking-wider text-[#00ff88] uppercase">
                    {isPatent ? "PATENT" : "LIT"}
                  </span>
                </div>

                {/* Floating Reference ID Badge (Top-left of image) */}
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 border border-white/10 rounded-md font-mono text-[8px] text-white/60 z-20">
                  REF-{String(i + 1).padStart(3, "0")}
                </div>

                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Details & text section (Bottom half of the card) */}
              <div className="relative flex-1 p-5 flex flex-col justify-between">
                {/* Active scanner sweep & brackets */}
                {diff === 0 && (
                  <>
                    <div className="absolute inset-0 cyber-grid-pattern opacity-30 pointer-events-none" />
                    <div className="absolute left-0 right-0 top-0 h-[2px] bg-[#00ff88] animate-scanline pointer-events-none shadow-[0_0_10px_#00ff88]" />
                    
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#00ff88]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#00ff88]" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#00ff88]" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#00ff88]" />
                  </>
                )}

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className={`font-display text-xs md:text-sm font-semibold tracking-tight text-center leading-snug line-clamp-3 ${
                    diff === 0 ? "text-white" : "text-white/60"
                  }`}>
                    {insight.title}
                  </h3>
                </div>

                {/* Bottom specs details */}
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-[7px] font-mono text-muted-foreground/30">
                  <span>SYSTEM_SECURE_0x0{i + 1}</span>
                  <span>STATUS: ACTIVE</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CAROUSEL CONTROLS ── */}
      <div className="flex flex-col items-center gap-4 mb-6 z-10 relative">
        <div className="flex items-center gap-6">
          <button
            onClick={handlePrev}
            className="p-2 border border-white/5 hover:border-[#00ff88]/30 hover:bg-[#00ff88]/5 rounded-xl text-white hover:text-[#00ff88] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            aria-label="Previous insight"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Dots Navigator */}
          <div className="flex gap-2">
            {researchInsights.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  triggerAnimation();
                  setActiveIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? "w-6 bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.5)]" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 border border-white/5 hover:border-[#00ff88]/30 hover:bg-[#00ff88]/5 rounded-xl text-white hover:text-[#00ff88] transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            aria-label="Next insight"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* ── HOLOGRAPHIC TELEMETRY DATA PANEL ── */}
      <div 
        key={activeIndex}
        className="w-full max-w-3xl mx-auto border border-white/5 bg-[#070707]/60 backdrop-blur-xl rounded-2xl p-6 shadow-[0_15px_35px_rgba(0,0,0,0.6)] animate-fade-up z-10"
      >
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-[#00ff88] animate-pulse" />
            <span className="font-mono text-[9px] text-[#00ff88] tracking-widest uppercase">
              ACTIVE_RESEARCH_DOSSIER // DECRYPTED_
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#00ff88] animate-ping" />
            <span className="font-mono text-[8px] text-muted-foreground/60 uppercase">CLASSIFIED_SECURE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content (Title, Description, Link) */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="text-[8px] font-mono text-[#00ff88]/60 uppercase tracking-widest mb-1">[SUBJECT]</div>
              <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
                {activeInsight.title}
              </h3>
            </div>

            <div>
              <div className="text-[8px] font-mono text-[#00ff88]/60 uppercase tracking-widest mb-1">[SYNOPSIS]</div>
              <p className="text-xs text-muted-foreground/90 font-light leading-relaxed">
                {activeInsight.description}
              </p>
            </div>

            {activeInsight.link?.trim() && (
              <div className="pt-2">
                <a
                  href={activeInsight.link.trim()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff88]/5 hover:bg-[#00ff88]/20 border border-[#00ff88]/20 hover:border-[#00ff88] rounded-xl transition-all duration-300 text-xs font-mono tracking-wider text-[#00ff88]"
                >
                  ACCESS FULL RESOURCE <ExternalLink className="size-3" />
                </a>
              </div>
            )}
          </div>

          {/* Telemetry Attributes List */}
          <div className="border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between font-mono text-[9px] text-muted-foreground space-y-3">
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:block gap-2">
                <div>
                  <span className="text-[#00ff88]/40 block uppercase tracking-wider mb-0.5">Asset ID</span>
                  <span className="text-white font-semibold">RES-ID-{String(activeIndex + 1).padStart(3, "0")}</span>
                </div>
                <div>
                  <span className="text-[#00ff88]/40 block uppercase tracking-wider mb-0.5 font-mono">Classification</span>
                  <span className="text-white font-semibold">{isPatentActive ? "PATENT DECREE" : "LITERATURE CHAPTER"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:block gap-2">
                <div>
                  <span className="text-[#00ff88]/40 block uppercase tracking-wider mb-0.5">Year of Publishing</span>
                  <span className="text-white font-semibold">{activeInsight.year?.trim() || "—"}</span>
                </div>
                <div>
                  <span className="text-[#00ff88]/40 block uppercase tracking-wider mb-0.5">Resource URL</span>
                  {activeInsight.link?.trim() ? (
                    <a 
                      href={activeInsight.link.trim()} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[#00ff88] hover:underline block truncate max-w-[120px] sm:max-w-[180px]"
                      title={activeInsight.link.trim()}
                    >
                      {activeInsight.link.trim()}
                    </a>
                  ) : (
                    <span className="text-white/30 font-semibold">—</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:block gap-2">
                <div>
                  <span className="text-[#00ff88]/40 block uppercase tracking-wider mb-0.5">Registry Status</span>
                  <span className="text-[#00ff88] font-bold">OPTIMAL // RUNNING</span>
                </div>
                <div>
                  <span className="text-[#00ff88]/40 block uppercase tracking-wider mb-0.5">Memory Offset</span>
                  <span className="text-white">0x{(activeIndex + 1).toString(16).toUpperCase().padStart(4, "0")}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[8px] text-muted-foreground/40">
              <Shield className="size-3 text-[#00ff88]/40" />
              <span>AUTHENTICITY GUARANTEED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info block */}
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between opacity-20 pointer-events-none">
        <div className="flex gap-6 sm:gap-10">
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-mono text-[#00ff88] uppercase">ID:</span>
            <span className="text-[9px] font-display font-bold tracking-widest uppercase text-white">{metadata.systemID}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-mono text-[#00ff88] uppercase">Kernel:</span>
            <span className="text-[9px] font-display font-bold tracking-widest uppercase text-white">{metadata.kernel}</span>
          </div>
        </div>
        <p className="text-[7px] font-mono tracking-[0.4em] text-white/60 uppercase hidden sm:block">{metadata.version}</p>
      </div>
    </div>
  );
}
