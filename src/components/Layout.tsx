import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { NeuralBackground } from "@/components/NeuralBackground";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useEffect, useRef, useState } from "react";
import { DodoAI } from "@/components/DodoAI";

const ROUTES = ["/", "/work", "/skills", "/log", "/contact"];

export function Layout() {
  const { loaded } = usePortfolioData();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrollHint, setScrollHint] = useState<{ type: "next" | "prev"; active: boolean }>({ type: "next", active: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntent = useRef(0);
  const intentTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isTriggered, setIsTriggered] = useState(false);
  const currentIndex = ROUTES.indexOf(location.pathname);

  const handleWheel = (e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el || isTriggered) return;

    const isBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 4;
    const isTop = el.scrollTop === 0;

    // Reset intent if scrolling in opposite direction
    if ((e.deltaY > 0 && scrollIntent.current < 0) || (e.deltaY < 0 && scrollIntent.current > 0)) {
      scrollIntent.current = 0;
      setScrollHint((s) => ({ ...s, active: false }));
    }

    const THRESHOLD_HINT = 60;
    const THRESHOLD_TRIGGER = 600;

    if (e.deltaY > 0 && isBottom) {
      scrollIntent.current += e.deltaY;
      
      // If on the last page (Contact), show "GOTO GITHUB" hint
      if (currentIndex === ROUTES.length - 1) {
        if (scrollIntent.current > THRESHOLD_HINT) setScrollHint({ type: "next", active: true });
        if (scrollIntent.current > THRESHOLD_TRIGGER) {
          setIsTriggered(true);
          setTimeout(() => {
            window.open("https://github.com/Rathoreatri03", "_blank");
            setIsTriggered(false);
            scrollIntent.current = 0;
            setScrollHint((s) => ({ ...s, active: false }));
          }, 600);
          return;
        }
      } else if (currentIndex < ROUTES.length - 1) {
        if (scrollIntent.current > THRESHOLD_HINT) setScrollHint({ type: "next", active: true });
        if (scrollIntent.current > THRESHOLD_TRIGGER) {
          setIsTriggered(true);
          setTimeout(() => {
            navigate({ to: ROUTES[currentIndex + 1] });
            setTimeout(() => {
              setIsTriggered(false);
              scrollIntent.current = 0;
              setScrollHint((s) => ({ ...s, active: false }));
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
            setScrollHint((s) => ({ ...s, active: false }));
          }, 200);
        }, 300);
      }
    }

    if (intentTimeout.current) clearTimeout(intentTimeout.current);
    intentTimeout.current = setTimeout(() => {
      if (!isTriggered) {
        scrollIntent.current = 0;
        setScrollHint((s) => ({ ...s, active: false }));
      }
    }, 200);
  };

  const progress = isTriggered ? 1 : Math.min(Math.abs(scrollIntent.current) / 1200, 1);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden">
      {/* Layered ambient backgrounds */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 radial-fade" />
      <NeuralBackground />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Persistent Dodo AI Companion */}
      <div 
        className={`fixed z-[45] pointer-events-none transition-all duration-[1200ms] cubic-bezier(0.34, 1.56, 0.64, 1) ${
          isHome 
            ? "right-[13%] top-[46%] -translate-y-1/2 w-[min(450px,38vw)] aspect-square opacity-100" 
            : "right-8 top-[calc(100vh-260px)] w-[180px] aspect-square opacity-90"
        }`}
      >
        <div className="size-full pointer-events-auto">
          <DodoAI mini={!isHome} />
        </div>
      </div>

      {/* Floating Card Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-5xl px-6 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-3 bg-background/40 backdrop-blur-2xl rounded-2xl border border-primary/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] pointer-events-auto">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="inline-block size-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px] shadow-primary" />
            <span className="text-primary font-bold tracking-tighter text-sm">[ATRI_LAB_v3.0]</span>
          </Link>
          <nav className="flex items-center gap-6 font-display text-[10px] tracking-widest text-muted-foreground font-medium">
            <Link to="/" className="flex items-center gap-1.5 hover:text-primary transition-colors [&.active]:text-primary group/home">
              <span className="size-2.5 flex items-center justify-center rounded-[2px] border border-current group-hover/home:border-primary transition-colors">
                <span className="size-1 bg-current rounded-full" />
              </span>
              HOME
            </Link>
            <Link to="/work" className="hover:text-primary transition-colors [&.active]:text-primary">WORK</Link>
            <Link to="/skills" className="hover:text-primary transition-colors [&.active]:text-primary">STACK</Link>
            <Link to="/log" className="hover:text-primary transition-colors [&.active]:text-primary">LOG</Link>
            <Link to="/contact" className="hover:text-primary transition-colors [&.active]:text-primary">CONTACT</Link>
            <div className="w-[1px] h-3 bg-white/10 mx-1" />
            <a href="https://github.com/Rathoreatri03" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GITHUB</a>
          </nav>
        </div>
      </header>

      <main 
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex-1 relative z-10 px-6 overflow-y-auto overflow-x-hidden scrollbar-hide scroll-smooth pt-28"
      >
        <Outlet />
      </main>

      {/* Telegram-style Scroll Indicator */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 pointer-events-none flex flex-col items-center gap-2 ${
          scrollHint.active && !(currentIndex === ROUTES.length - 1 && scrollHint.type === "next")
            ? (scrollHint.type === "next" ? "bottom-12 opacity-100 scale-110" : "top-20 opacity-100 scale-110") 
            : (scrollHint.type === "next" ? "bottom-6 opacity-0 scale-90" : "top-14 opacity-0 scale-90")
        }`}
      >
        <div className={`relative size-12 flex items-center justify-center transition-all duration-700 ${isTriggered ? "animate-spin-slow scale-125" : ""}`}>
          {/* Outer Ring */}
          <svg className="absolute inset-0 size-full -rotate-90">
            <circle
              cx="24" cy="24" r="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-primary/10"
            />
            <circle
              cx="24" cy="24" r="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={132}
              strokeDashoffset={132 - (132 * progress)}
              className={`text-primary transition-all duration-300 ${isTriggered ? "drop-shadow-[0_0_12px_hsl(var(--primary))]" : ""}`}
              strokeLinecap="round"
            />
          </svg>
          {/* Arrow Icon */}
          <div 
            className={`text-primary transition-all duration-700 ${isTriggered ? "scale-110" : ""}`}
            style={{ transform: isTriggered ? undefined : `scale(${0.9 + progress * 0.3}) rotate(${scrollHint.type === "next" ? 0 : 180}deg)` }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </div>
        <span className={`font-display text-[10px] tracking-[0.3em] text-primary uppercase bg-background/60 backdrop-blur-md px-3 py-1 border border-primary/30 transition-all duration-700 ${isTriggered ? "opacity-100 scale-110 border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]" : ""}`}>
          {isTriggered ? "System_Redirect..." : (scrollHint.type === "next" ? "Next level" : "Prev level")}
        </span>
      </div>

      <footer className="shrink-0 relative z-10 border-t border-border bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 font-display text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} ATRI_RATHORE · ALL_SYSTEMS_NOMINAL</span>
          <span className="text-primary">UPTIME: 99.99% · LATENCY: 12ms · MODEL: v3.0</span>
        </div>
      </footer>
    </div>
  );
}
