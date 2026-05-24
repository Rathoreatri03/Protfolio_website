import { createFileRoute } from "@tanstack/react-router";
import { ContactTerminal } from "@/components/ContactTerminal";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  const { links, metadata } = usePortfolioData();
  const [currentPage, setCurrentPage] = useState(0);

  const getDisplayValue = (key: string, url: string) => {
    if (key === "email") return url;
    
    try {
      const trimmedUrl = url.trim();
      if (trimmedUrl.startsWith("http")) {
        const parsed = new URL(trimmedUrl);
        const pathSegments = parsed.pathname.split("/").filter(Boolean);
        
        if (key === "github") return `@${pathSegments[0] || "Rathoreatri03"}`;
        if (key === "linkedin" || key === "linkdien") return `/in/${pathSegments[1] || pathSegments[0] || "rathoreatri03"}`;
        if (key === "orcidid") {
          const orcidParam = parsed.searchParams.get("orcid");
          if (orcidParam) return orcidParam;
          return pathSegments[pathSegments.length - 1] || "0009-0009-0342-227X";
        }
        if (key === "huggingface") return `@${pathSegments[0] || "Rathoreatri03"}`;
        if (key === "kaggle") return `@${pathSegments[0] || "rathoreatri03"}`;
        if (key === "medium") return `${pathSegments[0] || "@rathoreatri03"}`;
        if (key === "scholar") {
          const userParam = parsed.searchParams.get("user");
          return userParam || "rathoreatri03";
        }
        if (key === "resume_PDF") return "ATRI_RESUME.PDF";
        if (key === "visume_video") return "VISUME_VIDEO.MOV";

        // Dynamic fallback for any future custom URL
        if (pathSegments.length > 0) {
          return `@${pathSegments[pathSegments.length - 1]}`;
        }
        return parsed.hostname;
      }
    } catch (e) {
      // ignore
    }
    
    if (key === "github") return "@Rathoreatri03";
    if (key === "linkedin" || key === "linkdien") return "/in/rathoreatri03";
    if (key === "orcidid") return "0009-0009-0342-227X";
    return "ACCESS_LINK";
  };

  const getIcon = (key: string) => {
    switch (key) {
      case "email": return "✉";
      case "github": return "◆";
      case "linkedin":
      case "linkdien": return "▣";
      case "orcidid": return "❖";
      case "resume_PDF": return "📄";
      case "visume_video": return "▶";
      default: return "⬢";
    }
  };

  const priority = ["email", "github", "linkedin", "linkdien", "orcidid", "resume_PDF", "visume_video"];

  const contactLinks = Object.entries(links)
    .filter(([key, val]) => val && typeof val === "string" && val.trim() !== "")
    .sort(([keyA], [keyB]) => {
      const idxA = priority.indexOf(keyA);
      const idxB = priority.indexOf(keyB);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return keyA.localeCompare(keyB);
    })
    .map(([key, val]) => {
      const url = val.trim();
      let label = key.toUpperCase().replace(/_PDF$/i, "").replace(/_VIDEO$/i, "").replace(/_/g, " ");
      if (label === "LINKDIEN") label = "LINKEDIN";
      if (label === "ORCIDID") label = "ORCID ID";
      
      const valueText = getDisplayValue(key, url);
      const icon = getIcon(key);
      const href = key === "email" ? `mailto:${url}` : url;

      return { label, valueText, href, icon };
    })
    .filter((item, index, self) => self.findIndex((t) => t.label === item.label) === index);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(contactLinks.length / itemsPerPage);
  const displayedLinks = contactLinks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section
      id="contact"
      className="max-w-6xl mx-auto min-h-[calc(100vh-160px)] flex items-center justify-center animate-fade-up relative overflow-hidden py-8 sm:py-4 px-2 sm:px-6"
    >
      {/* Background Signal Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="size-[300px] sm:size-[500px] border border-primary/20 rounded-full animate-[ping_5s_infinite]" />
      </div>

      {/* Stack on mobile (1 col), side-by-side on desktop (2 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 sm:gap-12 items-center w-full relative z-10">

        {/* Left: Info */}
        <div className="space-y-5 sm:space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10 mb-3 sm:mb-4">
              <span className="size-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-display text-primary tracking-[0.4em] uppercase">Status :: Ready</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[0.8] mb-3 sm:mb-4">
              Send a <br />
              <span className="text-primary italic text-glow">Signal</span>.
            </h2>

            <p className="text-muted-foreground/50 text-xs sm:text-sm font-light max-w-sm leading-relaxed border-l border-white/5 pl-4 sm:pl-6">
              Initiate a high-bandwidth collaboration for AI research
              or complex computer vision systems.
            </p>
          </div>

          <div className="space-y-2 max-w-sm">
            <div className="space-y-2 min-h-[174px] sm:min-h-[200px] flex flex-col justify-start">
              {displayedLinks.map(({ label, valueText, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between border border-white/5 bg-white/[0.01] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg group hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary/30 group-hover:text-primary transition-colors text-sm sm:text-base">{icon}</span>
                    <div className="space-y-0">
                      <p className="text-[7px] font-mono text-primary/20 tracking-[0.3em] uppercase">{label}</p>
                      <p className="text-[11px] sm:text-[12px] font-display font-bold group-hover:text-primary transition-colors">{valueText}</p>
                    </div>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all text-primary text-[10px]">→</span>
                </a>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 px-1 font-mono text-[9px] text-muted-foreground select-none">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-2 py-1 bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-20 disabled:pointer-events-none rounded cursor-pointer"
                >
                  &lt; PREV
                </button>
                <div className="flex gap-2 items-center">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`size-2 rounded-full border transition-all cursor-pointer ${
                        idx === currentPage
                          ? "bg-primary border-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                          : "bg-transparent border-white/20 hover:border-white/40"
                      }`}
                      aria-label={`Page ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-2 py-1 bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-20 disabled:pointer-events-none rounded cursor-pointer"
                >
                  NEXT &gt;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Terminal — hidden on very small screens, shown from sm up */}
        <div className="relative group scale-95 sm:scale-95 lg:scale-95 origin-right hidden sm:block">
          <div className="absolute -top-3 -right-3 size-12 border-t border-r border-primary/20 group-hover:border-primary/40 transition-all" />
          <div className="absolute -bottom-3 -left-3 size-12 border-b border-l border-primary/20 group-hover:border-primary/40 transition-all" />
          <ContactTerminal />
          <div className="absolute -bottom-6 right-0 text-[7px] font-mono text-primary/10 tracking-widest uppercase">
            Enc: AES_256 // Signal: 98%
          </div>
        </div>

        {/* Show terminal full-width on mobile */}
        <div className="block sm:hidden w-full">
          <ContactTerminal />
        </div>
      </div>
    </section>
  );
}
