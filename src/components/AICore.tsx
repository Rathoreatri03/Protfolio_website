import { useEffect, useRef, useState } from "react";

/**
 * Interactive AI Neural Core:
 * - Rotating orbital rings (mouse-reactive tilt)
 * - Pulsing core with neural sparks
 * - Click → emits ripple + brief "ACTIVATED" pulse
 * - Hover → speeds up rotation, intensifies glow
 */
export function AICore() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      setTilt({ x: dy * -18, y: dx * 18 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const onClick = () => setPulse((p) => p + 1);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="relative aspect-square select-none cursor-pointer group [perspective:1200px]"
      style={{ transformStyle: "preserve-3d" }}
      aria-label="Interactive AI Neural Core"
    >
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border border-primary/30 animate-rotate-slow"
          style={{ animationDuration: hovered ? "8s" : "30s" }}
        />
        {/* Middle ring (reverse) */}
        <div
          className="absolute inset-6 rounded-full border border-primary/20 animate-rotate-slow"
          style={{
            animationDuration: hovered ? "12s" : "45s",
            animationDirection: "reverse",
          }}
        />
        {/* Inner dashed ring */}
        <div
          className="absolute inset-14 rounded-full border border-dashed border-primary/40 animate-rotate-slow"
          style={{ animationDuration: hovered ? "16s" : "60s" }}
        />

        {/* Orbiting nodes */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div
            key={deg}
            className="absolute top-1/2 left-1/2 w-0 h-0"
            style={{
              transform: `rotate(${deg}deg)`,
              animation: `rotate-slow ${hovered ? 6 : 22}s linear infinite`,
              animationDirection: i % 2 ? "reverse" : "normal",
            }}
          >
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary shadow-[0_0_12px] shadow-primary"
              style={{ left: `${42 + (i % 3) * 4}%` }}
            />
          </div>
        ))}

        {/* Core orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative size-1/2">
            {/* Glow halo */}
            <div
              className="absolute inset-0 rounded-full bg-primary/30 blur-3xl transition-all duration-500"
              style={{ transform: hovered ? "scale(1.4)" : "scale(1)" }}
            />
            {/* Neural sphere SVG */}
            <svg viewBox="0 0 200 200" className="relative w-full h-full">
              <defs>
                <radialGradient id="core-grad" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="oklch(0.95 0.18 145)" stopOpacity="1" />
                  <stop offset="55%" stopColor="oklch(0.65 0.20 145)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="oklch(0.25 0.10 145)" stopOpacity="0.6" />
                </radialGradient>
                <filter id="soft-glow">
                  <feGaussianBlur stdDeviation="2.5" />
                </filter>
              </defs>

              {/* Core sphere */}
              <circle
                cx="100"
                cy="100"
                r="55"
                fill="url(#core-grad)"
                className="transition-all duration-500"
                style={{ transformOrigin: "100px 100px", transform: hovered ? "scale(1.06)" : "scale(1)" }}
              />

              {/* Neural mesh inside */}
              <g
                stroke="oklch(0.95 0.18 145)"
                strokeOpacity="0.55"
                strokeWidth="0.8"
                fill="none"
                style={{
                  transformOrigin: "100px 100px",
                  animation: `rotate-slow ${hovered ? 8 : 24}s linear infinite`,
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i / 8) * Math.PI * 2;
                  const x = 100 + Math.cos(a) * 45;
                  const y = 100 + Math.sin(a) * 45;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="2.2" fill="oklch(0.95 0.18 145)" />
                      <line x1="100" y1="100" x2={x} y2={y} />
                      {Array.from({ length: 3 }).map((_, j) => {
                        const b = ((i + j + 1) / 8) * Math.PI * 2;
                        return (
                          <line
                            key={j}
                            x1={x}
                            y1={y}
                            x2={100 + Math.cos(b) * 45}
                            y2={100 + Math.sin(b) * 45}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </g>

              {/* Pulsing center */}
              <circle
                cx="100"
                cy="100"
                r="8"
                fill="oklch(1 0 0)"
                filter="url(#soft-glow)"
                style={{ animation: "glow-pulse 2.5s ease-in-out infinite" }}
              />
            </svg>

            {/* Click ripple */}
            {pulse > 0 && (
              <span
                key={pulse}
                className="absolute inset-0 rounded-full border-2 border-primary"
                style={{ animation: "ripple 1s ease-out forwards" }}
              />
            )}
          </div>
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
            className={`absolute ${c} w-6 h-6 border-primary transition-all duration-300 ${
              hovered ? "w-10 h-10 border-primary" : ""
            }`}
          />
        ))}
      </div>

      {/* Floating label */}
      <div className="absolute -bottom-2 left-0 right-0 text-center font-display text-[10px] tracking-[0.3em] text-primary/80">
        {hovered ? "◉ NEURAL_CORE · ENGAGED" : "○ NEURAL_CORE · IDLE"}
      </div>
    </div>
  );
}
