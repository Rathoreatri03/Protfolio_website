import { useEffect, useRef, useState } from "react";

/**
 * DODO AI — a friendly research-lab robot.
 * - Head + eyes track the cursor (parallax).
 * - Antenna blinks; subtle idle breathing.
 * - Click → switches to "SPEAKING" mode with an animated waveform
 *   (movie-AI style). Click again to dismiss.
 */
export function DodoAI({ mini }: { mini?: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [blink, setBlink] = useState(false);
  const [mood, setMood] = useState<"neutral" | "sleepy" | "happy" | "petting">("neutral");

  // Cursor tracking
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
      setLook({ x: clamp(dx * 20, 15), y: clamp(dy * 20, 12) });
      setTilt({ x: clamp(-dy * 10, 8), y: clamp(dx * 10, 8) });
      
      if (hovered) {
        setMood("petting");
      } else {
        setMood("neutral");
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mood, hovered]);

  // Subtle Mood Cycle
  useEffect(() => {
    const moods: (Exclude<typeof mood, "petting">)[] = ["neutral", "sleepy", "happy"];
    const interval = setInterval(() => {
      if (!hovered && !speaking) {
        setMood(moods[Math.floor(Math.random() * moods.length)]);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [hovered, speaking]);

  // Blink loop
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
      t = setTimeout(loop, 4000 + Math.random() * 4000);
    };
    t = setTimeout(loop, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMood("neutral");
      }}
      onClick={() => setSpeaking((s) => !s)}
      className="relative aspect-square select-none cursor-pointer [perspective:1000px]"
      aria-label="DODO Communication Interface"
    >
      {/* Subtle Glow Aura */}
      <div className={`absolute inset-0 rounded-full blur-[50px] transition-all duration-1000 ${
        speaking ? "bg-primary/30" : "bg-primary/10"
      }`} />

      {/* Main Face Container */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <svg viewBox="0 0 300 300" className="w-[95%] h-[95%] overflow-visible">
          <defs>
            <radialGradient id="face-glass" cx="40%" cy="40%" r="70%">
              <stop offset="0%" stopColor="oklch(0.25 0.05 165 / 0.8)" />
              <stop offset="100%" stopColor="oklch(0.1 0.02 165 / 0.95)" />
            </radialGradient>
          </defs>

          {/* Minimalist Capsule Head */}
          <g style={{
            transform: `translate(${look.x * 0.3}px, ${look.y * 0.3}px)`,
            transition: "transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)"
          }}>
            <rect 
              x="60" y="90" width="180" height="120" rx="60" 
              fill="url(#face-glass)" 
              stroke="oklch(0.85 0.18 145 / 0.4)" 
              strokeWidth="2"
              className="drop-shadow-[0_0_20px_rgba(var(--primary),0.1)]"
            />

            {/* Eyes / Waveform */}
            <g style={{
              transform: `translate(${look.x * 0.8}px, ${look.y * 0.8}px)`,
              transition: "transform 0.15s ease-out"
            }}>
              {!speaking ? (
                <g>
                  {mood === "petting" ? (
                    <>
                      <path d="M95 155 Q115 140 135 155" fill="none" stroke="oklch(0.95 0.2 145)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_12px_hsl(var(--primary))]" />
                      <path d="M165 155 Q185 140 205 155" fill="none" stroke="oklch(0.95 0.2 145)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_12px_hsl(var(--primary))]" />
                    </>
                  ) : (
                    <>
                      <circle 
                        cx="115" cy="150" 
                        r={blink ? 1 : mood === "sleepy" ? 2 : 7} 
                        fill="oklch(0.95 0.2 145)" 
                        className="transition-all duration-500 drop-shadow-[0_0_12px_hsl(var(--primary))]"
                      />
                      <circle 
                        cx="185" cy="150" 
                        r={blink ? 1 : mood === "sleepy" ? 2 : 7} 
                        fill="oklch(0.95 0.2 145)" 
                        className="transition-all duration-500 drop-shadow-[0_0_12px_hsl(var(--primary))]"
                      />
                    </>
                  )}
                </g>
              ) : (
                <g>
                  {/* REAL RADIO WAVEFORM (Sharp Jagged peaks) */}
                  <path 
                    d="M80 150 L95 130 L110 170 L125 140 L140 160 L155 120 L170 180 L185 145 L200 165 L220 150" 
                    fill="none" 
                    stroke="oklch(0.95 0.2 145)" 
                    strokeWidth="3.5" 
                    strokeLinejoin="miter"
                    className="drop-shadow-[0_0_15px_hsl(var(--primary))]"
                  >
                    <animate 
                      attributeName="d" 
                      values="M80 150 L95 130 L110 170 L125 140 L140 160 L155 120 L170 180 L185 145 L200 165 L220 150;
                              M80 150 L95 160 L110 140 L125 175 L140 130 L155 160 L170 110 L185 170 L200 140 L220 150;
                              M80 150 L95 130 L110 170 L125 140 L140 160 L155 120 L170 180 L185 145 L200 165 L220 150" 
                      dur="0.18s" 
                      repeatCount="indefinite" 
                    />
                  </path>
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Interface Status Labels - Brought closer and enlarged */}
      <div className={`absolute left-0 right-0 flex justify-center pointer-events-none transition-all duration-700 ${mini ? "bottom-2" : "bottom-6"}`}>
        <div className={`flex items-center transition-all ${
          mini ? "gap-1.5 px-2 py-0.5" : "gap-3 px-4 py-1"
        } bg-primary/10 backdrop-blur-md rounded-full border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]`}>
          <span className={`${mini ? "size-1" : "size-2"} rounded-full bg-primary ${speaking ? "animate-ping" : hovered ? "animate-pulse" : "opacity-30"}`} />
          <span className={`font-display tracking-[0.3em] text-primary uppercase transition-all ${
            mini ? "text-[7px]" : "text-[11px] font-bold"
          }`}>
            {speaking ? "Communicating" : hovered ? "User_Detected" : "Nominal"}
          </span>
        </div>
      </div>
    </div>
  );
}
