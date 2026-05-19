import React from "react";
import { Terminal, X, Send } from "lucide-react";
import { Message, formatMessage } from "../../lib/dodoFormatter";

type DodoTerminalProps = {
  messages: Message[];
  streamingText: string;
  loading: boolean;
  inputVal: string;
  setInputVal: (val: string) => void;
  sendMessage: (e?: React.FormEvent) => void;
  stopRequest: () => void;
  setShowTerminal: (show: boolean) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export function DodoTerminal({
  messages,
  streamingText,
  loading,
  inputVal,
  setInputVal,
  sendMessage,
  stopRequest,
  setShowTerminal,
  scrollRef,
}: DodoTerminalProps) {
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
}
