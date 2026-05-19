import { useEffect, useRef, useState } from "react";
import { Send, Terminal, X, RefreshCw, Minus, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Message, formatMessage } from "../../lib/dodoFormatter";
import { DodoCharacter } from "./DodoCharacter";
import { DodoTerminal } from "./DodoTerminal";
import { DodoSpeechBubble } from "./DodoSpeechBubble";

const GLOBAL_GREETINGS = [
  "Aloha! 🌺 I'm DODO, Atri's custom AI assistant. Ready to explore his ML & CV capabilities?",
  "Namaste! 🙏 Welcome to Atri's digital lab. Ask me anything about his projects or hackathon wins!",
  "Bonjour! 🇨🇵 DODO operational! I'm here to decode Atri's advanced automation systems.",
  "Konnichiwa! 🇯🇵 System online! Let's analyze Atri's deep learning models together!",
  "Hello there! 👋 DODO is booted up. How may I assist you in navigating Atri's expertise today?"
];

export function DodoAI({ mini, onSpeakingChange }: { mini?: boolean; onSpeakingChange?: (speaking: boolean) => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bubbleScrollRef = useRef<HTMLDivElement | null>(null);

  const [look, setLook] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    onSpeakingChange?.(speaking);
  }, [speaking, onSpeakingChange]);
  
  const [blink, setBlink] = useState(false);
  const [mood, setMood] = useState<"neutral" | "sleepy" | "happy" | "petting">("neutral");
  const [speechText, setSpeechText] = useState("");

  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (speaking) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [speaking]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const stopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    if (streamingText) {
      setMessages((prev) => [...prev, { role: "assistant", content: streamingText }]);
      setStreamingText("");
    }
  };

  // Live Cloudflare Edge production URL used for both local development and global hosting!
  const API_ENDPOINT = "https://dodo-ai-agent.dodoai.workers.dev/api/chat";

  // Reactive speech bubble helper
  const latestAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");
  const bubbleContent = streamingText
    ? streamingText
    : latestAssistantMessage
      ? latestAssistantMessage.content
      : speechText;

  // Cycle greetings when clicked but not chatting yet
  useEffect(() => {
    if (speaking && messages.length === 0) {
      const pickRandom = () => GLOBAL_GREETINGS[Math.floor(Math.random() * GLOBAL_GREETINGS.length)];
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

  // Keep speech bubble scrolled to bottom as text stream grows
  useEffect(() => {
    if (bubbleScrollRef.current) {
      bubbleScrollRef.current.scrollTop = bubbleScrollRef.current.scrollHeight;
    }
  }, [bubbleContent, messages, streamingText, speaking]);

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

    setMinimized(false);

    const userPrompt = inputVal.trim();
    setInputVal("");
    setLoading(true);
    setStreamingText("");

    const updatedHistory: Message[] = [...messages, { role: "user", content: userPrompt }];
    setMessages(updatedHistory);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory,
          model: "google/gemma-3-12b"
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Relay offline. Connection failed.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let aiContent = "";

      if (!reader) throw new Error("Stream unreadable.");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("data: ")) {
            const dataStr = trimmedLine.slice(6);
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                aiContent += `\n[API Error]: ${parsed.error}`;
                setStreamingText(aiContent);
                setSpeechText("Downstream error detected.");
                continue;
              }
              const content = parsed.choices?.[0]?.delta?.content || "";
              aiContent += content;
              setStreamingText(aiContent);
              setSpeechText(aiContent);
            } catch (err) {}
          }
        }
      }

      const finalTrimmed = buffer.trim();
      if (finalTrimmed.startsWith("data: ")) {
        const dataStr = finalTrimmed.slice(6);
        if (dataStr !== "[DONE]") {
          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content || "";
            aiContent += content;
            setStreamingText(aiContent);
            setSpeechText(aiContent);
          } catch (e) {}
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
      setStreamingText("");
    } catch (err: any) {
      if (err.name === "AbortError") return;
      const errMsg = `System Error: ${err.message || "Failed to reach diagnostic server."}`;
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
      setSpeechText("Error detected. Core network unstable.");
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSpeechText("Chat log wiped. Systems clean.");
    setStreamingText("");
  };

  return (
    <div className="relative size-full flex flex-col items-center justify-center">
      {/* Custom self-contained cognitive animation styles */}
      <style>{`
        @keyframes dodo-bar-bounce {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        .dodo-eq-bar {
          display: inline-block;
          width: 2px;
          background-color: oklch(0.85 0.18 145);
          border-radius: 9999px;
          transform-origin: bottom;
          animation: dodo-bar-bounce 0.6s ease-in-out infinite;
        }
        .dodo-no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .dodo-no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* 🤖 ROBOT FACE WRAPPER */}
      {!showTerminal && (
        <div
          ref={wrapRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setMood("neutral");
          }}
          onClick={() => {
            if (speaking) {
              if (minimized) {
                setMinimized(false);
              } else {
                setSpeaking(false);
              }
            } else {
              setSpeaking(true);
              setMinimized(false);
            }
          }}
          className={`relative aspect-square select-none cursor-pointer [perspective:1000px] shrink-0 transition-all duration-700 ${
            mini ? "w-full" : speaking ? "w-[160px] sm:w-[200px] md:w-[250px] lg:w-[300px]" : "w-full"
          }`}
          aria-label="DODO Communication Interface"
        >
          {/* Subtle Glow Aura */}
          <div className={`absolute inset-0 rounded-full blur-[50px] transition-all duration-1000 ${
            speaking ? "bg-primary/30" : "bg-primary/10"
          }`} />

          {/* Sci-Fi Miniature Speech Bubble CTA */}
          <AnimatePresence mode="wait">
            {!speaking && (
              <motion.div
                layoutId={mini ? "dodo-bubble-mini" : "dodo-bubble-full"}
                transition={{ type: "spring", stiffness: 100, damping: 22 }}
                className="absolute z-50 bottom-[82%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
              >
                <motion.div
                  layoutId={mini ? "dodo-bubble-content-mini" : "dodo-bubble-content-full"}
                  transition={{ type: "spring", stiffness: 100, damping: 22 }}
                  className={`bg-[#080808]/95 backdrop-blur-2xl border border-primary/30 text-primary font-mono rounded-full shadow-[0_5px_15px_rgba(var(--primary),0.15)] animate-pulse whitespace-nowrap ${
                    mini ? "px-3 py-1 text-[7px] tracking-wider" : "px-4 py-1.5 text-[8px] tracking-widest font-bold"
                  }`}
                >
                  {mini ? "DODO // TAP TO TALK" : "DODO // CLICK TO TALK"}
                </motion.div>
                
                <div className={`flex flex-col items-center ${mini ? "gap-0.5" : "gap-1"}`}>
                  <div className={`rounded-full bg-[#080808]/95 border border-primary/30 shadow-[0_0_8px_rgba(var(--primary),0.1)] ${mini ? "size-1.5" : "size-2"}`} />
                  <div className={`rounded-full bg-[#080808]/95 border border-primary/30 shadow-[0_0_8px_rgba(var(--primary),0.1)] ${mini ? "size-1" : "size-1.5"}`} />
                </div>
              </motion.div>
            )}

            {speaking && !minimized && (
              <DodoSpeechBubble
                bubbleScrollRef={bubbleScrollRef}
                loading={loading}
                streamingText={streamingText}
                messages={messages}
                bubbleContent={bubbleContent}
                clearChat={clearChat}
                setShowTerminal={setShowTerminal}
                setMinimized={setMinimized}
                mini={!!mini}
                showContent={showContent}
              />
            )}
          </AnimatePresence>

          {speaking && minimized && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setMinimized(false);
              }}
              title="DODO is thinking. Click to expand!"
              className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-50 animate-in fade-in zoom-in-95 duration-500 hover:scale-105 transition-all ${
                "bottom-[82%]"
              }`}
            >
              <div className={`bg-[#080808]/95 border border-primary/30 rounded-full shadow-[0_5px_20px_rgba(var(--primary),0.2)] font-mono text-primary font-bold animate-pulse flex items-center ${
                mini 
                  ? "px-2 py-1 text-[7px] gap-1 tracking-normal" 
                  : "px-3.5 py-1.5 text-[9px] gap-1.5 tracking-wider"
              }`}>
                <span className="size-1 rounded-full bg-primary animate-ping shrink-0" />
                <span>DODO ACTIVE</span>
              </div>
              <div className={`flex flex-col items-center ${mini ? "gap-0.5" : "gap-1"}`}>
                <div className={`rounded-full bg-[#080808]/95 border border-primary/30 shadow-[0_0_8px_rgba(var(--primary),0.1)] animate-pulse [animation-delay:0.2s] ${
                  mini ? "size-1.5" : "size-2"
                }`} />
                <div className={`rounded-full bg-[#080808]/95 border border-primary/30 shadow-[0_0_8px_rgba(var(--primary),0.1)] animate-pulse [animation-delay:0.4s] ${
                  mini ? "size-1" : "size-1.5"
                }`} />
              </div>
            </div>
          )}

          <DodoCharacter
            look={look}
            tilt={tilt}
            speaking={speaking}
            loading={loading}
            blink={blink}
            mood={mood}
            streamingText={streamingText}
          />

          <div className={`absolute left-0 right-0 flex justify-center pointer-events-none transition-all duration-700 ${mini ? "bottom-3" : "bottom-6"}`}>
            <div className={`flex items-center transition-all ${
              mini ? "gap-1.5 px-2 py-0.5" : "gap-3 px-4 py-1"
            } bg-primary/10 backdrop-blur-md rounded-full border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]`}>
              <span className={`${mini ? "size-1" : "size-2"} rounded-full bg-primary ${hovered ? "animate-pulse" : "opacity-30"}`} />
              <span className={`font-display tracking-[0.3em] text-primary uppercase transition-all ${
                mini ? "text-[7px]" : "text-[11px] font-bold"
              }`}>
                {hovered ? "User_Detected" : "DODO AI"}
              </span>
            </div>
          </div>
        </div>
      )}

      {speaking && !minimized && !showTerminal && (
        <form 
          onSubmit={sendMessage}
          className={`animate-in slide-in-from-bottom-2 fade-in duration-500 z-30 transition-opacity duration-300 ${
            showContent ? "opacity-100" : "opacity-0 pointer-events-none"
          } ${
            mini 
              ? "absolute top-[96%] left-1/2 -translate-x-1/2 w-[160px] max-w-[80vw] sm:w-[200px]" 
              : "mt-4 w-full max-w-[210px] sm:max-w-[250px]"
          }`}
        >
          <div className="relative flex items-center bg-[#080808]/80 backdrop-blur-xl border border-primary/30 rounded-full px-3 py-1.5 focus-within:border-primary/60 transition-all shadow-[0_0_20px_rgba(var(--primary),0.05)]">
            <input 
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={loading}
              placeholder="Ask DODO..."
              className="w-full bg-transparent text-white placeholder:text-white/30 text-[10px] sm:text-xs outline-none pr-12 pl-1"
            />
            <div className="absolute right-1.5 flex items-center">
              {loading ? (
                <button 
                  type="button"
                  onClick={stopRequest}
                  title="Stop DODO Response"
                  className="text-red-500 hover:text-red-400 hover:brightness-125 transition-all p-1 animate-pulse cursor-pointer"
                >
                  <span className="block size-2 bg-current rounded-sm" />
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="text-primary hover:brightness-125 transition-all p-1 disabled:opacity-30 cursor-pointer"
                >
                  <Send className="size-3" />
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {showTerminal && (
        <div className="absolute bottom-[-15px] -right-2 md:-right-4 w-[85vw] max-w-[260px] md:max-w-[320px] h-[360px] md:h-[460px] bg-[#050505]/95 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 z-50 font-mono text-xs text-left origin-bottom-right">
          <DodoTerminal
            messages={messages}
            streamingText={streamingText}
            loading={loading}
            inputVal={inputVal}
            setInputVal={setInputVal}
            sendMessage={sendMessage}
            stopRequest={stopRequest}
            setShowTerminal={setShowTerminal}
            scrollRef={scrollRef}
          />
        </div>
      )}
    </div>
  );
}
