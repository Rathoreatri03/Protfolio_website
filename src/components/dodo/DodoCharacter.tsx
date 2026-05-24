import React, { memo } from "react";

type DodoCharacterProps = {
  look: { x: number; y: number };
  tilt: { x: number; y: number };
  speaking: boolean;
  loading: boolean;
  blink: boolean;
  mood: "neutral" | "sleepy" | "happy" | "petting";
  streamingText: string;
};

export const DodoCharacter = memo(function DodoCharacter({
  look,
  tilt,
  speaking,
  loading,
  blink,
  mood,
  streamingText,
}: DodoCharacterProps) {
  return (
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
            {/* EYES */}
            <g className="transition-all duration-300" style={{ transform: (speaking || loading) ? "translateY(-15px)" : "translateY(0px)" }}>
              {mood === "petting" ? (
                <>
                  <path d="M95 155 Q115 140 135 155" fill="none" stroke="oklch(0.95 0.2 145)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_12px_hsl(var(--primary))]" />
                  <path d="M165 155 Q185 140 205 155" fill="none" stroke="oklch(0.95 0.2 145)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_12px_hsl(var(--primary))]" />
                </>
              ) : (loading && !streamingText) ? (
                <>
                  <path d="M95 145 Q115 160 135 145" fill="none" stroke="oklch(0.95 0.2 145)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_12px_hsl(var(--primary))]" />
                  <path d="M165 145 Q185 160 205 145" fill="none" stroke="oklch(0.95 0.2 145)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_12px_hsl(var(--primary))]" />
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

            {/* MOUTH WAVEFORM (Visible when speaking/generating) */}
            {(speaking || loading) && (
              <g className="animate-in fade-in duration-300" transform="translate(75 95) scale(0.5)">
                <path 
                  d="M80 150 L95 130 L110 170 L125 140 L140 160 L155 120 L170 180 L185 145 L200 165 L220 150" 
                  fill="none" 
                  stroke="oklch(0.95 0.2 145)" 
                  strokeWidth="6" 
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
  );
});
