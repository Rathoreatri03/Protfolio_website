import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Maximize2, Minus } from "lucide-react";
import RotatingText from "./RotatingText";
import { Message, formatMessage } from "../lib/dodoFormatter";

type DodoSpeechBubbleProps = {
  bubbleScrollRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  streamingText: string;
  messages: Message[];
  bubbleContent: string;
  clearChat: () => void;
  setShowTerminal: (show: boolean) => void;
  setMinimized: (min: boolean) => void;
  mini: boolean;
  showContent: boolean;
};

export function DodoSpeechBubble({
  bubbleScrollRef,
  loading,
  streamingText,
  messages,
  bubbleContent,
  clearChat,
  setShowTerminal,
  setMinimized,
  mini,
  showContent,
}: DodoSpeechBubbleProps) {
  return (
    <motion.div 
      layoutId={mini ? "dodo-bubble-mini" : "dodo-bubble-full"}
      transition={{ type: "spring", stiffness: 100, damping: 22 }}
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-50 bottom-[82%] left-1/2 -translate-x-1/2 max-w-[85vw] ${
      mini 
        ? "w-[180px] md:w-[220px]" 
        : "w-[250px] md:w-[300px]"
    }`}>
      <motion.div 
        layoutId={mini ? "dodo-bubble-content-mini" : "dodo-bubble-content-full"}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-[#080808]/95 backdrop-blur-2xl border border-primary/30 text-white/90 font-mono rounded-[24px] shadow-[0_15px_40px_rgba(var(--primary),0.25)] ${
        mini 
          ? "text-[10px] p-3 leading-normal" 
          : "text-[10px] md:text-xs p-4 leading-relaxed"
      }`}>
        {/* Holographic Text Transition Wrapper */}
        <div className={`transition-opacity duration-300 ${showContent ? "opacity-100" : "opacity-0"}`}>
          {/* Integrated Header Row (Divider line, dynamic status/equalizer, and white controls including chat reset) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 select-none">
            <div className="flex items-center gap-1.5">
              {(messages.length > 0 || loading || streamingText) ? (
                <div className="flex items-end gap-[1.5px] h-[8px] w-3 shrink-0 mb-[1.5px]">
                  <span className="dodo-eq-bar h-full w-[1.5px]" style={{ animationDelay: "0.1s", animationDuration: "0.5s" }} />
                  <span className="dodo-eq-bar h-[70%] w-[1.5px]" style={{ animationDelay: "0.3s", animationDuration: "0.3s" }} />
                  <span className="dodo-eq-bar h-[50%] w-[1.5px]" style={{ animationDelay: "0.0s", animationDuration: "0.6s" }} />
                </div>
              ) : (
                <span className="inline-block size-1 bg-primary rounded-full animate-pulse" />
              )}
              <span className="text-[8px] tracking-widest text-primary font-bold uppercase">
                {(messages.length > 0 || loading || streamingText) ? "DODO // COMMUNICATING" : "DODO // STREAM"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                type="button"
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
                type="button"
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
                type="button"
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
      </motion.div>
    </motion.div>
  );
}
