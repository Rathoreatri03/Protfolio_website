import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { NeuralBackground } from "@/components/NeuralBackground";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useRef, useState } from "react";
import { DodoAI } from "@/components/DodoAI";

const ROUTES = ["/", "/work", "/skills", "/achievements", "/log", "/contact"];

export function Layout() {
  const { links, metadata, loaded, logo } = usePortfolioData();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrollHint, setScrollHint] = useState<{ type: "next" | "prev"; active: boolean }>({ type: "next", active: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntent = useRef(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const currentIndex = ROUTES.indexOf(location.pathname);

  const handleWheel = (e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el || isTriggered) return;
    const isBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 4;
    const isTop = el.scrollTop === 0;

    const THRESHOLD_HINT = 60;
    const THRESHOLD_TRIGGER = 600;

    if (e.deltaY > 0 && isBottom) {
      scrollIntent.current += e.deltaY;
      if (currentIndex === ROUTES.length - 1) {
        return;
      } else if (currentIndex < ROUTES.length - 1) {
        if (scrollIntent.current > THRESHOLD_HINT) setScrollHint({ type: "next", active: true });
        if (scrollIntent.current > THRESHOLD_TRIGGER) {
          setIsTriggered(true);
          setTimeout(() => {
            navigate({ to: ROUTES[currentIndex + 1] });
            setTimeout(() => {
              setIsTriggered(false);
              scrollIntent.current = 0;
              setScrollHint({ type: "next", active: false });
            }, 200); 
          }, 300);
        }
      }
    } else if (e.deltaY < 0 && isTop && currentIndex > 0) {
      scrollIntent.current += e.deltaY;
      if (scrollIntent.current < -THRESHOLD_HINT) setScrollHint({ type: "prev", active: true });
      if (scrollIntent.current < -THRESHOLD_TRIGGER) {
        setIsTriggered(true);
        setTimeout(() => {
          navigate({ to: ROUTES[currentIndex - 1] });
          setTimeout(() => {
            setIsTriggered(false);
            scrollIntent.current = 0;
            setScrollHint({ type: "prev", active: false });
          }, 200);
        }, 300);
      }
    }
  };

  const progress = isTriggered ? 1 : Math.min(Math.abs(scrollIntent.current) / 1200, 1);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 radial-fade" />
      <NeuralBackground />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className={`fixed z-[45] pointer-events-none transition-all duration-[1200ms] ${isHome ? "right-[13%] top-[38%] -translate-y-1/2 w-[min(450px,38vw)] aspect-square opacity-100" : "right-8 top-[calc(100vh-260px)] w-[180px] aspect-square opacity-90"}`}>
        <div className="size-full pointer-events-auto">
          <DodoAI mini={!isHome} />
        </div>
      </div>

      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-fit pointer-events-none">
        <nav className="flex items-center gap-6 pl-2.5 pr-8 py-2 bg-background/40 backdrop-blur-3xl rounded-full border border-primary/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] pointer-events-auto font-display text-[10px] tracking-widest text-muted-foreground font-medium">
          {logo?.logo_url && (
            <img src={logo.logo_url} alt="Logo" className="w-10 h-10 rounded-full border border-primary/20 object-cover mr-2" />
          )}
          <Link to="/" className="hover:text-primary transition-colors [&.active]:text-primary flex items-center gap-2 group">
            <span className="size-1 bg-current rounded-full group-[.active]:bg-primary" />
            HOME
          </Link>
          <Link to="/work" className="hover:text-primary transition-colors [&.active]:text-primary">WORK</Link>
          <Link to="/skills" className="hover:text-primary transition-colors [&.active]:text-primary">STACK</Link>
          <Link to="/achievements" className="hover:text-primary transition-colors [&.active]:text-primary">ACHIEVEMENTS</Link>
          <Link to="/log" className="hover:text-primary transition-colors [&.active]:text-primary">LOG</Link>
          <Link to="/contact" className="hover:text-primary transition-colors [&.active]:text-primary">CONTACT</Link>
          <div className="w-[1px] h-3 bg-white/10 mx-1" />
          <a href={links.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GITHUB</a>
        </nav>
      </header>

      <main ref={scrollRef} onWheel={handleWheel} className="flex-1 relative z-10 px-6 overflow-y-auto overflow-x-hidden scrollbar-hide scroll-smooth pt-28">
        <Outlet />
      </main>

      {/* Scroll Indicator - Hidden on Last Page */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 pointer-events-none flex flex-col items-center gap-2 ${
          scrollHint.active && currentIndex < ROUTES.length - 1 && scrollHint.type === "next"
            ? "bottom-12 opacity-100 scale-110"
            : scrollHint.active && currentIndex > 0 && scrollHint.type === "prev"
            ? "top-20 opacity-100 scale-110"
            : "opacity-0 scale-90"
        }`}
      >
        <div className={`relative size-12 flex items-center justify-center transition-all ${isTriggered ? "animate-spin-slow scale-125" : ""}`}>
          <svg className="absolute inset-0 size-full -rotate-90">
            <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary/10" />
            <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray={132} strokeDashoffset={132 - (132 * progress)} className="text-primary transition-all duration-300" strokeLinecap="round" />
          </svg>
          <div className="text-primary" style={{ transform: `rotate(${scrollHint.type === "next" ? 0 : 180}deg)` }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
          </div>
        </div>
        <span className="font-display text-[10px] tracking-[0.3em] text-primary uppercase bg-background/60 backdrop-blur-md px-3 py-1 border border-primary/30">
          {scrollHint.type === "next" ? "Next level" : "Prev level"}
        </span>
      </div>

      <footer className="shrink-0 relative z-10 border-t border-border bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 font-display text-[11px] text-muted-foreground uppercase">
          <span>© {new Date().getFullYear()} {metadata.systemID} · {metadata.footer?.copyright_text || "ALL_SYSTEMS_NOMINAL"}</span>
          <span className="text-primary">UPTIME: {metadata.uptime} · LATENCY: {metadata.latency} · ENGINEER: {metadata.systemID}</span>
        </div>
      </footer>
    </div>
  );
}
