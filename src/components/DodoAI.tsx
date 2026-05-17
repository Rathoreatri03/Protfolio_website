import { useEffect, useRef, useState } from "react";
import { Send, Terminal, X, RefreshCw } from "lucide-react";

/**
 * DODO AI — a friendly research-lab robot.
 * - Head + eyes track the cursor (parallax).
 * - Antenna blinks; subtle idle breathing.
 * - Click → opens an interactive, real-time streaming chat console
 *   powered by your Cloudflare Edge worker API (0ms cold start!).
 */
const FUNNY_PHRASES = [
  "System initialized. DODO is ready.",
  "Beep boop. Uplink secured.",
  "Diagnostics complete. Scanning parameters...",
  "Loading neural networks... and a cup of coffee.",
  "Did you know I can read your mind? Just kidding... or am I?",
  "I'm an AI, but even I need a break sometimes.",
  "Hacking the mainframe... I'm in.",
  "Bleep bloop... processing humor..."
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function DodoAI({ mini }: { mini?: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [look, setLook] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [blink, setBlink] = useState(false);
  const [mood, setMood] = useState<"neutral" | "sleepy" | "happy" | "petting">("neutral");
  const [speechText, setSpeechText] = useState("");

  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  // Dynamic API routing (switch between local worker dev port and live production URL)
  const API_ENDPOINT = import.meta.env.DEV
    ? "http://localhost:8787/api/chat"
    : "https://dodo-ai-agent.dodoai.workers.dev/api/chat";

  // Cycle introductory phrases when clicked but not chatting yet
  useEffect(() => {
    if (speaking && messages.length === 0) {
      const pickRandom = () => FUNNY_PHRASES[Math.floor(Math.random() * FUNNY_PHRASES.length)];
      setSpeechText(pickRandom());
      const interval = setInterval(() => setSpeechText(pickRandom()), 5000);
      return () => clearInterval(interval);
    }
  }, [speaking, messages]);

  // Keep chat scrolled to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, speaking]);

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

  // Handle stream API call
  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userPrompt = inputVal.trim();
    setInputVal("");
    setLoading(true);
    setStreamingText("");

    const updatedHistory: Message[] = [...messages, { role: "user", content: userPrompt }];
    setMessages(updatedHistory);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory,
          model: "google/gemma-3-12b"
        })
      });

      if (!response.ok) {
        throw new Error("Relay offline. Connection failed.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      if (!reader) throw new Error("Stream unreadable.");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim().startsWith("data: ")) {
            const dataStr = line.trim().slice(6);
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              const content = parsed.choices[0].delta.content || "";
              aiContent += content;
              setStreamingText(aiContent);
              
              // Set robot speech bubble to mirror the arriving streaming text
              setSpeechText(aiContent);
            } catch (err) {
              // Ignore partial JSON parses
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
      setStreamingText("");
    } catch (err: any) {
      const errMsg = `System Error: ${err.message || "Failed to reach diagnostic server."}`;
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
      setSpeechText("Error detected. Core network unstable.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSpeechText("Chat log wiped. Systems clean.");
    setStreamingText("");
  };

  return (
    <div className="relative size-full flex items-center justify-center">
      {/* 🤖 ROBOT FACE WRAPPER */}
      <div
        ref={wrapRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setMood("neutral");
        }}
        onClick={() => setSpeaking((s) => !s)}
        className={`relative aspect-square select-none cursor-pointer [perspective:1000px] shrink-0 transition-all duration-700 ${
          mini ? "w-full" : speaking ? "w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px]" : "w-full"
        }`}
        aria-label="DODO Communication Interface"
      >
        {/* Subtle Glow Aura */}
        <div className={`absolute inset-0 rounded-full blur-[50px] transition-all duration-1000 ${
          speaking ? "bg-primary/30" : "bg-primary/10"
        }`} />

        {/* Dynamic Speech Bubble (shown only when NOT using the large homepage chat overlay) */}
        {speaking && (mini || messages.length === 0) && (
          <div className={`absolute z-50 animate-in fade-in zoom-in-95 duration-500 pointer-events-none ${
            mini 
              ? "top-[-12px] -right-4 max-w-[120px]" 
              : "top-[2%] md:top-[5%] -right-10 md:-right-16 max-w-[180px] md:max-w-[240px]"
          }`}>
            <div className={`relative bg-[#080808]/90 backdrop-blur-xl border border-primary/40 text-white/90 font-mono rounded-2xl rounded-bl-sm shadow-[0_0_30px_rgba(var(--primary),0.3)] ${
              mini ? "text-[8px] p-2 leading-tight" : "text-[10px] md:text-xs p-3 md:p-4"
            }`}>
              <div className="flex gap-1 md:gap-2 items-start">
                <span className="text-primary font-bold animate-pulse">{'>'}</span>
                <span className={`${mini ? "leading-tight tracking-tight" : "leading-relaxed"}`}>{speechText}</span>
              </div>
              <div className={`absolute left-0 w-0 h-0 border-l-transparent border-t-primary/40 border-r-transparent ${
                mini ? "-bottom-[3px] border-l-[6px] border-t-[6px] border-r-[6px]" : "-bottom-[5px] border-l-[10px] border-t-[10px] border-r-[10px]"
              }`}></div>
            </div>
          </div>
        )}

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
                {/* EYES */}
                <g className="transition-all duration-300" style={{ transform: (speaking || loading) ? "translateY(-15px)" : "translateY(0px)" }}>
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

        {/* Interface Label */}
        <div className={`absolute left-0 right-0 flex justify-center pointer-events-none transition-all duration-700 ${mini ? "bottom-2" : "bottom-6"}`}>
          <div className={`flex items-center transition-all ${
            mini ? "gap-1.5 px-2 py-0.5" : "gap-3 px-4 py-1"
          } bg-primary/10 backdrop-blur-md rounded-full border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]`}>
            <span className={`${mini ? "size-1" : "size-2"} rounded-full bg-primary ${(speaking || loading) ? "animate-ping" : hovered ? "animate-pulse" : "opacity-30"}`} />
            <span className={`font-display tracking-[0.3em] text-primary uppercase transition-all ${
              mini ? "text-[7px]" : "text-[11px] font-bold"
            }`}>
              {(speaking || loading) ? "Communicating" : hovered ? "User_Detected" : "DODO AI"}
            </span>
          </div>
        </div>
      </div>

      {/* 📟 INTERACTIVE GLASS TERMINAL CONSOLE (Shown only on Desktop/Home when speaking is true) */}
      {!mini && speaking && (
        <div className="absolute right-[110%] top-1/2 -translate-y-1/2 w-[350px] sm:w-[420px] lg:w-[480px] h-[380px] sm:h-[460px] bg-[#050505]/85 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in slide-in-from-right-10 fade-in duration-500 z-50 font-mono text-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d]/90 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Terminal className="size-3.5 text-primary" />
              <span className="font-display text-[9px] sm:text-[10px] tracking-widest text-white/50 uppercase">DODO_AI // Core_Relay</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat} 
                title="Wipe Logs"
                className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-primary transition-all"
              >
                <RefreshCw className="size-3" />
              </button>
              <button 
                onClick={() => setSpeaking(false)} 
                className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-all"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Console Box */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Embedded Scanner Overlay scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.03)_50%)] z-10 bg-[length:100%_2px]" />

            {/* Static Initial Banner */}
            <div className="text-[10px] text-primary/30 border-b border-primary/10 pb-2 leading-relaxed">
              &gt;_ UPLINK SECURE. DODO AGENT IS FULLY OPERATIONAL.<br/>
              &gt;_ CHIP IDENT: GEMMA-3-12B // EDGE STREAM ACTIVE.<br/>
              &gt;_ ASK DODO ABOUT ATRI'S EXPERIENCES, SIH WIN, AND SKILLS.
            </div>

            {/* Chat History */}
            {messages.length === 0 && !streamingText && (
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-white/40 text-center leading-relaxed italic text-[11px]">
                Waiting for query inputs. Click below to establish dialogue matrix.
              </div>
            )}

            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2.5 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="size-5 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-[9px] text-primary font-bold shrink-0">🤖</div>
                )}
                <div className={`p-3 rounded-xl max-w-[82%] leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-primary/15 border border-primary/25 text-white rounded-br-sm" 
                    : "bg-white/[0.02] border border-white/5 text-white/80 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="size-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[9px] text-white/40 font-bold shrink-0">U</div>
                )}
              </div>
            ))}

            {/* Live Streaming Token Output */}
            {streamingText && (
              <div className="flex gap-2.5 items-start justify-start">
                <div className="size-5 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-[9px] text-primary font-bold shrink-0">🤖</div>
                <div className="p-3 bg-white/[0.02] border border-white/5 text-white/80 rounded-xl rounded-bl-sm max-w-[82%] leading-relaxed">
                  {streamingText}
                  <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-0.5" />
                </div>
              </div>
            )}

            {/* Loader indicator */}
            {loading && !streamingText && (
              <div className="flex gap-2.5 items-start justify-start">
                <div className="size-5 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-[9px] text-primary font-bold shrink-0 animate-spin">🤖</div>
                <div className="p-3 bg-white/[0.02] border border-white/5 text-white/40 rounded-xl rounded-bl-sm italic">
                  Parsing query parameters...
                </div>
              </div>
            )}
          </div>

          {/* Form Input Relay */}
          <form 
            onSubmit={sendMessage}
            className="p-3 bg-[#080808]/95 border-t border-white/5 flex gap-2 items-center"
          >
            <input 
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={loading}
              placeholder={loading ? "Waiting for response..." : "Ask DODO about Atri..."}
              className="flex-1 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2.5 outline-none focus:border-primary/20 transition-all text-white placeholder:text-white/20 disabled:opacity-40"
            />
            <button 
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="size-9 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center hover:bg-primary/95 transition-all active:scale-[0.96] disabled:opacity-40"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
