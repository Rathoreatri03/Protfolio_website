import { useEffect, useRef, useState } from "react";

/**
 * DODO AI — a friendly research-lab robot.
 * - Head + eyes track the cursor (parallax).
 * - Antenna blinks; subtle idle breathing.
 * - Click → switches to "SPEAKING" mode with an animated waveform
 *   (movie-AI style). Click again to dismiss.
 */
export function DodoAI() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [blink, setBlink] = useState(false);

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
      setLook({ x: clamp(dx * 18, 9), y: clamp(dy * 18, 7) });
      setTilt({ x: clamp(-dy * 14, 10), y: clamp(dx * 14, 10) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Blink loop
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
      t = setTimeout(loop, 2500 + Math.random() * 2500);
    };
    t = setTimeout(loop, 1800);
    return () => clearTimeout(t);
  }, []);

  // Waveform bars (35 bars)
  const bars = Array.from({ length: 35 });

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setSpeaking((s) => !s)}
      className="relative aspect-square select-none cursor-pointer [perspective:1400px]"
      aria-label="DODO AI assistant"
    >
      {/* Glow halo */}
      <div
        className={`absolute inset-8 rounded-full blur-3xl transition-all duration-500 ${
          speaking ? "bg-primary/40 scale-110" : "bg-primary/15"
        }`}
      />

      {/* Orbit ring */}
      <div
        className="absolute inset-2 rounded-full border border-primary/20 animate-rotate-slow"
        style={{ animationDuration: hovered || speaking ? "10s" : "40s" }}
      />
      <div
        className="absolute inset-10 rounded-full border border-dashed border-primary/15 animate-rotate-slow"
        style={{ animationDuration: "60s", animationDirection: "reverse" }}
      />

      {/* Robot body */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <svg viewBox="0 0 300 320" className="w-[78%] h-[78%] drop-shadow-[0_0_24px_hsl(var(--primary)/0.4)]">
          <defs>
            <linearGradient id="dodo-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.32 0.04 165)" />
              <stop offset="55%" stopColor="oklch(0.22 0.03 165)" />
              <stop offset="100%" stopColor="oklch(0.14 0.02 165)" />
            </linearGradient>
            <linearGradient id="dodo-visor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.18 0.05 165)" />
              <stop offset="100%" stopColor="oklch(0.08 0.03 165)" />
            </linearGradient>
            <radialGradient id="dodo-eye" cx="50%" cy="50%">
              <stop offset="0%" stopColor="oklch(1 0 0)" />
              <stop offset="30%" stopColor="oklch(0.95 0.18 145)" />
              <stop offset="100%" stopColor="oklch(0.55 0.20 145)" />
            </radialGradient>
            <filter id="dodo-glow">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>

          {/* Antenna */}
          <line x1="150" y1="40" x2="150" y2="70" stroke="oklch(0.45 0.05 165)" strokeWidth="3" />
          <circle
            cx="150"
            cy="34"
            r="7"
            fill="oklch(0.85 0.18 145)"
            filter="url(#dodo-glow)"
            style={{ animation: "glow-pulse 1.6s ease-in-out infinite" }}
          />

          {/* Neck */}
          <rect x="135" y="225" width="30" height="22" rx="4" fill="oklch(0.25 0.03 165)" />
          {/* Shoulders / body hint */}
          <path
            d="M60 320 Q60 255 110 250 L190 250 Q240 255 240 320 Z"
            fill="url(#dodo-body)"
            stroke="oklch(0.35 0.04 165)"
            strokeWidth="1.2"
          />
          <circle cx="150" cy="285" r="6" fill="oklch(0.85 0.18 145)" filter="url(#dodo-glow)">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Head */}
          <g
            style={{
              transform: `translate(${look.x * 0.4}px, ${look.y * 0.4}px)`,
              transformOrigin: "150px 160px",
              transition: "transform 0.18s ease-out",
            }}
          >
            {/* Head shell */}
            <rect
              x="70"
              y="80"
              width="160"
              height="150"
              rx="46"
              fill="url(#dodo-body)"
              stroke="oklch(0.4 0.05 165)"
              strokeWidth="1.5"
            />
            {/* Head highlight */}
            <rect x="78" y="86" width="144" height="40" rx="38" fill="oklch(1 0 0)" opacity="0.04" />

            {/* Ear pods */}
            <rect x="58" y="135" width="14" height="40" rx="6" fill="oklch(0.22 0.03 165)" stroke="oklch(0.4 0.05 165)" />
            <rect x="228" y="135" width="14" height="40" rx="6" fill="oklch(0.22 0.03 165)" stroke="oklch(0.4 0.05 165)" />
            <circle cx="65" cy="155" r="3" fill="oklch(0.85 0.18 145)" filter="url(#dodo-glow)" />
            <circle cx="235" cy="155" r="3" fill="oklch(0.85 0.18 145)" filter="url(#dodo-glow)" />

            {/* Visor */}
            <rect x="86" y="118" width="128" height="78" rx="32" fill="url(#dodo-visor)" stroke="oklch(0.5 0.06 165)" strokeWidth="1" />
            {/* Visor scanline shimmer */}
            <rect x="86" y="118" width="128" height="78" rx="32" fill="oklch(0.85 0.18 145)" opacity="0.04">
              <animate attributeName="opacity" values="0.02;0.08;0.02" dur="3s" repeatCount="indefinite" />
            </rect>

            {!speaking ? (
              <>
                {/* Eyes — pupils follow cursor */}
                <g style={{ transform: `translate(${look.x}px, ${look.y}px)`, transition: "transform 0.12s ease-out" }}>
                  {/* Left eye */}
                  <ellipse cx="122" cy="157" rx="16" ry={blink ? 1.5 : 16} fill="url(#dodo-eye)" filter="url(#dodo-glow)" />
                  {/* Right eye */}
                  <ellipse cx="178" cy="157" rx="16" ry={blink ? 1.5 : 16} fill="url(#dodo-eye)" filter="url(#dodo-glow)" />
                  {/* Eye sparkles */}
                  {!blink && (
                    <>
                      <circle cx="117" cy="152" r="3" fill="white" opacity="0.9" />
                      <circle cx="173" cy="152" r="3" fill="white" opacity="0.9" />
                    </>
                  )}
                </g>

                {/* Mouth — subtle smile */}
                <path
                  d="M130 184 Q150 195 170 184"
                  fill="none"
                  stroke="oklch(0.85 0.18 145)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </>
            ) : (
              <>
                {/* SPEAKING MODE — waveform inside visor */}
                <g>
                  {bars.map((_, i) => {
                    const x = 96 + i * 3.2;
                    const seed = (i * 13) % 7;
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={155}
                        width="2"
                        height="6"
                        rx="1"
                        fill="oklch(0.9 0.2 145)"
                        filter="url(#dodo-glow)"
                      >
                        <animate
                          attributeName="height"
                          values={`6;${18 + seed * 4};${10 + seed * 2};${24 - seed * 2};6`}
                          dur={`${0.7 + (i % 5) * 0.12}s`}
                          repeatCount="indefinite"
                          begin={`${i * 0.04}s`}
                        />
                        <animate
                          attributeName="y"
                          values={`155;${146 - seed * 2};150;${143 - seed};155`}
                          dur={`${0.7 + (i % 5) * 0.12}s`}
                          repeatCount="indefinite"
                          begin={`${i * 0.04}s`}
                        />
                      </rect>
                    );
                  })}
                </g>
                {/* Speaking label */}
                <text
                  x="150"
                  y="138"
                  textAnchor="middle"
                  fill="oklch(0.9 0.2 145)"
                  fontSize="8"
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing="3"
                >
                  ◉ TRANSMITTING
                </text>
              </>
            )}

            {/* Cheek dots */}
            <circle cx="98" cy="180" r="2" fill="oklch(0.85 0.18 145)" opacity="0.7" />
            <circle cx="202" cy="180" r="2" fill="oklch(0.85 0.18 145)" opacity="0.7" />

            {/* Bolt details */}
            <circle cx="82" cy="92" r="2.5" fill="oklch(0.5 0.05 165)" />
            <circle cx="218" cy="92" r="2.5" fill="oklch(0.5 0.05 165)" />
            <circle cx="82" cy="222" r="2.5" fill="oklch(0.5 0.05 165)" />
            <circle cx="218" cy="222" r="2.5" fill="oklch(0.5 0.05 165)" />
          </g>
        </svg>
      </div>

      {/* Corner brackets */}
      {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((c) => (
        <div
          key={c}
          className={`absolute ${c} border-primary/60 transition-all duration-300 ${
            hovered || speaking ? "w-10 h-10" : "w-6 h-6"
          }`}
        />
      ))}

      {/* Label */}
      <div className="absolute -bottom-1 left-0 right-0 text-center font-display text-[10px] tracking-[0.3em] text-primary/80">
        {speaking ? "◉ DODO_AI · SPEAKING" : hovered ? "◉ DODO_AI · TRACKING" : "○ DODO_AI · IDLE · CLICK_ME"}
      </div>
    </div>
  );
}
