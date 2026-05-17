import { createFileRoute } from "@tanstack/react-router";
import { ContactTerminal } from "@/components/ContactTerminal";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
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
            {[
              ["MAIL", "rathoreatri03@gmail.com", "mailto:rathoreatri03@gmail.com", "✉"],
              ["GIT", "@Rathoreatri03", "https://github.com/Rathoreatri03", "◆"],
              ["INTEL", "/in/rathoreatri03", "https://www.linkedin.com/in/rathoreatri03/", "▣"],
            ].map(([k, v, h, icon]) => (
              <a
                key={k}
                href={h}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border border-white/5 bg-white/[0.01] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg group hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary/30 group-hover:text-primary transition-colors text-sm sm:text-base">{icon}</span>
                  <div className="space-y-0">
                    <p className="text-[7px] font-mono text-primary/20 tracking-[0.3em] uppercase">{k}</p>
                    <p className="text-[11px] sm:text-[12px] font-display font-bold group-hover:text-primary transition-colors">{v}</p>
                  </div>
                </div>
                <span className="opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all text-primary text-[10px]">→</span>
              </a>
            ))}
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
