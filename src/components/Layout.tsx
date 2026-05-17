import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { NeuralBackground } from "@/components/NeuralBackground";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useRef, useState, useEffect } from "react";
import { DodoAI } from "@/components/DodoAI";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const ROUTES = ["/", "/work", "/skills", "/achievements", "/log", "/contact"];

const NAV_LINKS = [
  { to: "/", label: "HOME" },
  { to: "/work", label: "WORK" },
  { to: "/skills", label: "STACK" },
  { to: "/achievements", label: "ACHIEVEMENTS" },
  { to: "/log", label: "LOG" },
  { to: "/contact", label: "CONTACT" },
];

export function Layout() {
  const { links, metadata, loaded, logo } = usePortfolioData();
  const navigate = useNavigate();
  const location = useLocation();

  // Resolve relative client path by stripping the base URL prefix (e.g. "/Protfolio_website")
  const basepath = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  const cleanPathname = basepath 
    ? (location.pathname.startsWith(basepath) 
        ? location.pathname.substring(basepath.length) 
        : location.pathname) || "/" 
    : location.pathname;

  const isHome = cleanPathname === "/";
  const [scrollHint, setScrollHint] = useState<{ type: "next" | "prev"; active: boolean }>({ type: "next", active: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntent = useRef(0);
  const touchLastY = useRef<number | null>(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const currentIndex = ROUTES.indexOf(cleanPathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDodoSpeaking, setIsDodoSpeaking] = useState(false);

  const mobileBottomClass = isHome
    ? (isDodoSpeaking ? "bottom-[185px]" : "bottom-[135px]")
    : (isDodoSpeaking ? "bottom-[52px]" : "bottom-0");

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [cleanPathname]);

  // Automatically redirect back to the home page on initial load / refresh
  useEffect(() => {
    if (cleanPathname !== "/") {
      navigate({ to: "/", replace: true });
    }
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchLastY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchLastY.current === null) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = touchLastY.current - currentY;
    touchLastY.current = currentY;

    const el = scrollRef.current;
    if (!el || isTriggered) return;
    
    const isBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 4;
    const isTop = el.scrollTop === 0;

    const THRESHOLD_HINT = 60;
    const THRESHOLD_TRIGGER = 600; 

    // Scale deltaY to match wheel event scale (for the progress indicator)
    const scaledDeltaY = deltaY * 4;

    if (scaledDeltaY > 0 && isBottom) {
      scrollIntent.current += scaledDeltaY;
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
              setScrollHint(prev => ({ ...prev, active: false }));
            }, 200); 
          }, 300);
        }
      }
    } else if (scaledDeltaY < 0 && isTop && currentIndex > 0) {
      scrollIntent.current += scaledDeltaY;
      if (scrollIntent.current < -THRESHOLD_HINT) setScrollHint({ type: "prev", active: true });
      if (scrollIntent.current < -THRESHOLD_TRIGGER) {
        setIsTriggered(true);
        setTimeout(() => {
          navigate({ to: ROUTES[currentIndex - 1] });
          setTimeout(() => {
            setIsTriggered(false);
            scrollIntent.current = 0;
            setScrollHint(prev => ({ ...prev, active: false }));
          }, 200);
        }, 300);
      }
    }
  };

  const handleTouchEnd = () => {
    touchLastY.current = null;
    if (!isTriggered) {
      scrollIntent.current = 0;
      setScrollHint(prev => ({ ...prev, active: false }));
    }
  };

  const progress = isTriggered ? 1 : Math.min(Math.abs(scrollIntent.current) / 1200, 1);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 radial-fade" />
      <NeuralBackground />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* DODO AI — mobile/tablet: always visible as compact bottom-right widget
                   desktop home: large hero position
                   desktop non-home: mini bottom-right widget */}

      {/* Mobile / Tablet (< md): always-visible compact widget with custom safety margins to prevent bubble & input clipping */}
      <div 
        ref={mobileContainerRef} 
        className="fixed top-28 bottom-6 left-12 right-12 md:hidden pointer-events-none z-[45]"
      >
        <motion.div 
          drag
          dragConstraints={mobileContainerRef}
          dragElastic={0.05}
          dragMomentum={true}
          className={`absolute pointer-events-none w-[90px] aspect-square opacity-95 ${mobileBottomClass} right-0`}
          style={{
            transition: "opacity 0.7s ease-out, bottom 0.7s ease-out, right 0.7s ease-out"
          }}
        >
          <div className="size-full pointer-events-auto cursor-grab active:cursor-grabbing">
            <DodoAI mini={true} onSpeakingChange={setIsDodoSpeaking} />
          </div>
        </motion.div>
      </div>
      {/* Desktop (≥ md): large hero on home, mini bottom-right on other pages */}
      <div className={`fixed z-[45] pointer-events-none transition-all duration-[1200ms] hidden md:block ${
        isHome
          ? "right-[8%] lg:right-[13%] top-[46%] -translate-y-1/2 w-[min(250px,35vw,35vh)] lg:w-[min(380px,35vw,38vh)] aspect-square opacity-100"
          : "right-8 bottom-20 w-[140px] lg:w-[180px] aspect-square opacity-90"
      }`}>
        <div className="size-full pointer-events-auto">
          <DodoAI mini={!isHome} onSpeakingChange={setIsDodoSpeaking} />
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] sm:w-fit pointer-events-none max-w-[95vw]">
        <nav className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 pl-2.5 pr-4 sm:pr-8 py-2 bg-background/40 backdrop-blur-3xl rounded-full border border-primary/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] pointer-events-auto font-display text-[10px] tracking-widest text-muted-foreground font-medium">
          {/* Logo */}
          {logo?.logo_url && (
            <img src={logo.logo_url} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-primary/20 object-cover shrink-0" />
          )}

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ to, label }) => (
              <Link 
                key={to} 
                to={to} 
                activeOptions={{ exact: true }}
                className="hover:text-primary transition-colors [&.active]:text-primary flex items-center gap-2 group"
              >
                {to === "/" && <span className="size-1 bg-current rounded-full group-[.active]:bg-primary" />}
                {label}
              </Link>
            ))}
            <div className="w-[1px] h-3 bg-white/10 mx-1" />
            <a href={links.github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GITHUB</a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 transition-all"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="size-4 text-primary" /> : <Menu className="size-4 text-white/60" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] flex flex-col md:hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 font-display">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                className="text-2xl tracking-[0.3em] uppercase text-white/50 hover:text-primary [&.active]:text-primary transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="w-12 h-[1px] bg-white/10 my-2" />
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="text-lg tracking-[0.3em] uppercase text-white/30 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              GITHUB
            </a>
          </div>
        </div>
      )}

      {/* Main content */}
      <main 
        ref={scrollRef} 
        onWheel={handleWheel} 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 relative z-10 px-3 sm:px-6 overflow-y-auto overflow-x-hidden scrollbar-hide scroll-smooth pt-20 sm:pt-28 overscroll-y-none"
      >
        <Outlet />
      </main>

      {/* Scroll Indicator */}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 font-display text-[9px] sm:text-[11px] text-muted-foreground uppercase text-center">
          <span>© {new Date().getFullYear()} {metadata.systemID} · {metadata.footer?.copyright_text || "ALL_SYSTEMS_NOMINAL"}</span>
          <span className="text-primary">UPTIME: {metadata.uptime} · LATENCY: {metadata.latency} · ENGINEER: {metadata.systemID}</span>
        </div>
      </footer>
    </div>
  );
}
