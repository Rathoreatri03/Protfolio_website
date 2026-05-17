import { useEffect, useRef, useState } from "react";
import { Send, Terminal, X, RefreshCw, Minus, Maximize2 } from "lucide-react";
import RotatingText from "./RotatingText";

/**
 * DODO AI — a friendly research-lab robot.
 * - Head + eyes track the cursor (parallax).
 * - Antenna blinks; subtle idle breathing.
 * - Click → opens an interactive, real-time streaming chat console
 *   powered by your Cloudflare Edge worker API (0ms cold start!).
 */
const GLOBAL_GREETINGS = [
  "Aloha! 🌺 I'm DODO, Atri's custom AI assistant. Ready to explore his ML & CV capabilities?",
  "Namaste! 🙏 Welcome to Atri's digital lab. Ask me anything about his projects or hackathon wins!",
  "Bonjour! 🇨🇵 DODO operational! I'm here to decode Atri's advanced automation systems.",
  "Konnichiwa! 🇯🇵 System online! Let's analyze Atri's deep learning models together!",
  "Hello there! 👋 DODO is booted up. How may I assist you in navigating Atri's expertise today?"
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function DodoAI({ mini }: { mini?: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bubbleScrollRef = useRef<HTMLDivElement | null>(null);

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
  const [showTerminal, setShowTerminal] = useState(false);
  const [minimized, setMinimized] = useState(false);

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

  // Cycle warm global greetings when clicked but not chatting yet
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

    // Auto-expand dialogue cloud on new submission
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
      let buffer = ""; // Assemblies TCP fragments dynamically
      let aiContent = "";

      if (!reader) throw new Error("Stream unreadable.");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Append incoming decoded values to the assembly buffer
        buffer += decoder.decode(value, { stream: true });

        // Split buffer by newlines to isolate fully complete lines
        const lines = buffer.split("\n");

        // Retain the remaining incomplete fragment in the buffer
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
              
              // Set robot speech bubble to mirror the arriving streaming text in real-time
              setSpeechText(aiContent);
            } catch (err) {
              // Ignore incomplete JSON chunks safely
            }
          }
        }
      }

      // Parse any remaining tail in the buffer at the stream end
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
      if (err.name === "AbortError") {
        return; // Handled by stopRequest
      }
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

  const parseBoldTags = (text: string): React.ReactNode[] => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    boldRegex.lastIndex = 0;
    
    while ((match = boldRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const plainText = text.substring(lastIndex, matchIndex);
      
      if (plainText) {
        parts.push(plainText);
      }
      
      const boldText = match[1];
      parts.push(
        <strong 
          key={`bold-${matchIndex}`} 
          className="text-primary font-bold drop-shadow-[0_0_8px_rgba(var(--primary),0.3)] hover:brightness-125 transition-all inline"
        >
          {boldText}
        </strong>
      );
      
      lastIndex = boldRegex.lastIndex;
    }
    
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      parts.push(remainingText);
    }
    
    return parts;
  };

  const parseInlineElements = (text: string): React.ReactNode[] => {
    if (!text) return [];
    
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    linkRegex.lastIndex = 0;
    
    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const plainText = text.substring(lastIndex, matchIndex);
      
      if (plainText) {
        parts.push(...parseBoldTags(plainText));
      }
      
      const label = match[1];
      const url = match[2];
      
      parts.push(
        <a 
          key={`link-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-primary underline font-bold hover:brightness-125 transition-all drop-shadow-[0_0_8px_rgba(var(--primary),0.3)] break-all inline"
        >
          {label}
        </a>
      );
      
      lastIndex = linkRegex.lastIndex;
    }
    
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      parts.push(...parseBoldTags(remainingText));
    }
    
    return parts;
  };

  // Formats Markdown-like bold, links, and bullet points into gorgeous React elements
  const formatMessage = (text: string) => {
    if (!text) return "";
    
    const lines = text.split("\n");
    
    return lines.map((line, lineIdx) => {
      let trimmed = line.trim();
      const isBullet = trimmed.startsWith("* ");
      if (isBullet) {
        trimmed = trimmed.substring(2);
      }
      
      const renderedLine = parseInlineElements(trimmed);

      return (
        <div key={lineIdx} className={isBullet ? "pl-4 relative my-1 break-words w-full" : "my-1 break-words w-full"}>
          {isBullet && <span className="absolute left-0 text-primary font-extrabold">•</span>}
          {renderedLine}
        </div>
      );
    });
  };

  const renderTerminalContent = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d]/90 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="size-3.5 text-primary animate-pulse" />
            <span className="font-display text-[9px] sm:text-[10px] tracking-widest text-white/50 uppercase">DODO_AI // COGNITIVE_CONSOLE</span>
          </div>
          <button 
            type="button"
            onClick={() => setShowTerminal(false)} 
            className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-all z-20 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Messages Console Box */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar scroll-smooth relative"
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
              Waiting for query inputs. Close this console to talk via the mini capsule below DODO.
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
                  ? "bg-primary/15 border border-primary/25 text-white rounded-br-sm animate-in fade-in slide-in-from-right-1" 
                  : "bg-white/[0.02] border border-white/5 text-white/80 rounded-bl-sm animate-in fade-in slide-in-from-left-1"
              }`}>
                {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
              </div>
              {msg.role === "user" && (
                <div className="size-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[9px] text-white/40 font-bold shrink-0">U</div>
              )}
            </div>
          ))}

          {/* Live Streaming Token Output */}
          {streamingText && (
            <div className="flex gap-2.5 items-start justify-start animate-in fade-in duration-300">
              <div className="size-5 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-[9px] text-primary font-bold shrink-0">🤖</div>
              <div className="p-3 bg-white/[0.02] border border-white/5 text-white/80 rounded-xl rounded-bl-sm max-w-[82%] leading-relaxed relative overflow-hidden">
                {formatMessage(streamingText)}
                <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-0.5" />
                
                {/* Premium Equalizer Overlay in the top-right corner of the bubble */}
                <div className="absolute top-2 right-2 flex items-end gap-[1.5px] h-[8px] opacity-40">
                  <span className="dodo-eq-bar h-full" style={{ width: "1.5px", animationDelay: "0.1s", animationDuration: "0.5s" }} />
                  <span className="dodo-eq-bar h-[70%]" style={{ width: "1.5px", animationDelay: "0.3s", animationDuration: "0.3s" }} />
                  <span className="dodo-eq-bar h-[50%]" style={{ width: "1.5px", animationDelay: "0.0s", animationDuration: "0.6s" }} />
                </div>
              </div>
            </div>
          )}

          {/* Loader indicator */}
          {loading && !streamingText && (
            <div className="flex gap-2.5 items-start justify-start animate-in fade-in duration-300">
              <div className="size-5 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-[9px] text-primary font-bold shrink-0 animate-spin">🤖</div>
              <div className="p-3 bg-white/[0.02] border border-white/5 text-white/40 rounded-xl rounded-bl-sm italic flex items-center gap-2">
                <span>Parsing query parameters...</span>
                <div className="flex items-end gap-[2px] h-[8px] w-3">
                  <span className="dodo-eq-bar h-full" style={{ animationDelay: "0.1s", animationDuration: "0.8s" }} />
                  <span className="dodo-eq-bar h-[70%]" style={{ animationDelay: "0.4s", animationDuration: "0.6s" }} />
                  <span className="dodo-eq-bar h-[40%]" style={{ animationDelay: "0.2s", animationDuration: "0.9s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Input inside Modal */}
        <form 
          onSubmit={sendMessage}
          className="p-3 bg-[#080808]/95 border-t border-white/5 flex gap-2 items-center shrink-0"
        >
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
            placeholder={loading ? "Waiting for response..." : "Ask DODO about Atri..."}
            className="flex-1 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2.5 outline-none focus:border-primary/20 transition-all text-white placeholder:text-white/20 disabled:opacity-40"
          />
          {loading ? (
            <button 
              type="button"
              onClick={stopRequest}
              title="Stop DODO Response"
              className="size-9 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg flex items-center justify-center transition-all active:scale-[0.96] cursor-pointer animate-pulse"
            >
              <span className="block size-2.5 bg-current rounded-sm" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={!inputVal.trim()}
              className="size-9 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center hover:bg-primary/95 transition-all active:scale-[0.96] disabled:opacity-40 cursor-pointer"
            >
              <Send className="size-3.5" />
            </button>
          )}
        </form>
      </>
    );
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
      {(!showTerminal || !mini) && (
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

        {/* Dynamic Speech Bubble (Always displays latest response, fully scrollable, centered above head) */}
        {speaking && !minimized && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`absolute z-50 animate-in fade-in zoom-in-95 duration-500 bottom-[82%] left-1/2 -translate-x-1/2 ${
            mini 
              ? "w-[180px] md:w-[220px]" 
              : "w-[250px] md:w-[300px]"
          }`}>
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-[#080808]/95 backdrop-blur-2xl border border-primary/30 text-white/90 font-mono rounded-[24px] shadow-[0_15px_40px_rgba(var(--primary),0.25)] ${
              mini 
                ? "text-[10px] p-3 leading-normal" 
                : "text-[10px] md:text-xs p-4 leading-relaxed"
            }`}>
              {/* Integrated Header Row (Divider line, dynamic status/equalizer, and white controls including chat reset) */}
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 select-none">
                <div className="flex items-center gap-1.5">
                  {(speaking || loading) ? (
                    <div className="flex items-end gap-[1.5px] h-[8px] w-3 shrink-0 mb-[1.5px]">
                      <span className="dodo-eq-bar h-full w-[1.5px]" style={{ animationDelay: "0.1s", animationDuration: "0.5s" }} />
                      <span className="dodo-eq-bar h-[70%] w-[1.5px]" style={{ animationDelay: "0.3s", animationDuration: "0.3s" }} />
                      <span className="dodo-eq-bar h-[50%] w-[1.5px]" style={{ animationDelay: "0.0s", animationDuration: "0.6s" }} />
                    </div>
                  ) : (
                    <span className="inline-block size-1 bg-primary rounded-full animate-pulse" />
                  )}
                  <span className="text-[8px] tracking-widest text-primary font-bold uppercase">
                    {(speaking || loading) ? "DODO // COMMUNICATING" : "DODO // STREAM"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearChat();
                    }}
                    title="Reset Chat History"
                    className="text-white/60 hover:text-white transition-all p-0.5 cursor-pointer"
                  >
                    <RefreshCw className="size-3" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTerminal(true);
                    }}
                    title="Expand to Full-Screen Console"
                    className="text-white/60 hover:text-white transition-all p-0.5 cursor-pointer"
                  >
                    <Maximize2 className="size-3" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMinimized(true);
                    }}
                    title="Minimize Dialogue"
                    className="text-white/60 hover:text-white transition-all p-0.5 cursor-pointer"
                  >
                    <Minus className="size-3" />
                  </button>
                </div>
              </div>

              {/* Scrollable text container with guaranteed hidden scrollbar */}
              <div 
                ref={bubbleScrollRef}
                className="max-h-[100px] md:max-h-[160px] overflow-y-auto overflow-x-hidden dodo-no-scrollbar scroll-smooth w-full break-words select-text"
              >
                <div className="flex gap-1 md:gap-2 items-start w-full">
                  <span className="text-primary font-bold animate-pulse shrink-0">{'>'}</span>
                  <span className="leading-relaxed w-full break-words">
                    {loading && !streamingText ? (
                      <span className="flex items-center gap-2 italic text-white/50 text-[10px] md:text-xs">
                        <span className="size-1.5 rounded-full bg-primary animate-ping shrink-0" />
                        <span>DODO is parsing query parameters...</span>
                      </span>
                    ) : messages.length === 0 && !streamingText ? (
                      <span className="inline">
                        <RotatingText
                          texts={["Namaste! 🙏", "Aloha! 🌺", "Bonjour! 🇨🇵", "Konnichiwa! 🇯🇵", "Hello there! 👋"]}
                          mainClassName="text-primary font-bold select-none inline-flex mr-1.5"
                          staggerFrom="last"
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "-120%", opacity: 0 }}
                          staggerDuration={0.025}
                          splitLevelClassName="overflow-hidden pb-0.5"
                          transition={{ type: "spring", damping: 25, stiffness: 400 }}
                          rotationInterval={3500}
                        />
                        <span>I'm DODO, Atri's custom AI assistant. Ready to explore his ML & CV capabilities?</span>
                      </span>
                    ) : (
                      formatMessage(bubbleContent)
                    )}
                  </span>
                </div>
              </div>
              <div className="absolute flex flex-col items-center gap-1.5 pointer-events-none -bottom-[8px] left-1/2 -translate-x-1/2">
                <div className={`rounded-full bg-[#080808]/95 border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.1)] ${
                  mini ? "size-2" : "size-3"
                }`} />
                <div className={`rounded-full bg-[#080808]/95 border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.1)] ${
                  mini ? "size-1" : "size-1.5"
                }`} />
              </div>
            </div>
          </div>
        )}

        {/* Playful Miniature Bouncing Thinking Bubble when minimized */}
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
            {/* Main mini thinking cloud bubble */}
            <div className={`bg-[#080808]/95 border border-primary/30 rounded-full shadow-[0_5px_20px_rgba(var(--primary),0.2)] font-mono text-primary font-bold animate-pulse flex items-center ${
              mini 
                ? "px-2 py-1 text-[7px] gap-1 tracking-normal" 
                : "px-3.5 py-1.5 text-[9px] gap-1.5 tracking-wider"
            }`}>
              <span className="size-1 rounded-full bg-primary animate-ping shrink-0" />
              <span>DODO ACTIVE</span>
            </div>
            {/* Thought bubble trail circles trailing down */}
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

        {/* Interface Label */}
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

      {/* Small Chat Input Capsule Form (Positioned below DODO's head) */}
      {speaking && !minimized && (!showTerminal || !mini) && (
        <form 
          onSubmit={sendMessage}
          className={`animate-in slide-in-from-bottom-2 fade-in duration-500 z-30 ${
            mini 
              ? "absolute top-[96%] left-1/2 -translate-x-1/2 w-[160px] sm:w-[200px]" 
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

      {/* 📟 COGNITIVE TERMINAL CONSOLE MODAL */}
      {showTerminal && (
        mini ? (
          /* Mini Mode Floating Console Card: Restored to fit exactly in DODO's container space */
          <div className="absolute bottom-0 -right-2 md:-right-4 w-[250px] sm:w-[310px] h-[340px] sm:h-[400px] bg-[#050505]/95 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 z-50 font-mono text-xs text-left">
            {renderTerminalContent()}
          </div>
        ) : (
          /* Standard Mode: Centered Screen Modal */
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-[620px] h-[80vh] sm:h-[480px] bg-[#050505]/95 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 font-mono text-xs text-left animate-duration-300">
              {renderTerminalContent()}
            </div>
          </div>
        )
      )}
    </div>
  );
}
