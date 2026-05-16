import { useState } from "react";
import { toast } from "sonner";

export function ContactTerminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("ERROR: Please fill in all fields (Name, Email, Message).");
      return;
    }
    setSending(true);
    
    try {
      const response = await fetch("https://formspree.io/f/xpwzelbd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        toast.success("SUCCESS: Signal received. Transmission complete.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("ERROR: Transmission relay failed. Please try again.");
      }
    } catch (error) {
      toast.error("FATAL: Network uplink unstable. Could not transmit.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative group max-w-2xl w-full mx-auto">
      <form
        onSubmit={onSubmit}
        className="relative bg-[#0d0d0d] border border-white/10 rounded-lg shadow-2xl overflow-hidden font-mono text-[12px] group-hover:border-primary/20 transition-all duration-700"
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-white/5">
          <div className="flex gap-2">
            <div className="size-2 rounded-full bg-[#ff5f56]/60" />
            <div className="size-2 rounded-full bg-[#ffbd2e]/60" />
            <div className="size-2 rounded-full bg-[#27c93f]/60" />
          </div>
          <div className="text-[9px] text-white/20 tracking-wider">rathoreatri03@lab: ~/contact</div>
          <div className="size-3" />
        </div>

        <div className="p-6 space-y-6 relative">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] z-10 bg-[length:100%_2px]" />

          {/* User-Friendly Header Block */}
          <div className="flex items-start gap-4 mb-4 border-b border-white/5 pb-4">
            <div className="text-primary font-bold opacity-40">
              <pre className="text-[7px]">
{`  ___
 |__ \\
   / /
  |_|`}
              </pre>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest underline">System_Manual :: How_To_Send</p>
              <p className="text-[9px] text-white/30 leading-tight">
                1. Enter identifier (Name) // 2. Enter relay (Email) <br/>
                3. Input payload (Message) // 4. Execute transmit
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <TerminalField 
              label="source-" 
              highlight="NAME"
              comment="# [ENTER YOUR FULL NAME]"
              value={name} 
              onChange={setName} 
              placeholder="e.g. John Doe"
            />
            <TerminalField 
              label="source-" 
              highlight="EMAIL"
              comment="# [ENTER YOUR CONTACT EMAIL]"
              value={email} 
              onChange={setEmail} 
              type="email" 
              placeholder="e.g. john@example.com"
            />
            
            <div className="space-y-2">
              <p className="text-[9px] text-primary/40 italic"># [TYPE YOUR MESSAGE BELOW]</p>
              <div className="flex items-center gap-2">
                <span className="text-primary/30 font-bold">rathoreatri03@lab:~$</span>
                <span className="text-white/40 italic">cat &gt; <span className="text-white font-bold not-italic underline decoration-primary/40">MESSAGE</span>.txt</span>
              </div>
              <div className="relative bg-white/[0.02] border border-white/5 rounded px-4 py-3 focus-within:border-primary/20 transition-all">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-transparent border-none outline-none text-white font-medium placeholder:text-white/5 resize-none text-[13px]"
                  placeholder="How can we collaborate? Describe your project here..."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-primary/30 font-bold">rathoreatri03@lab:~$</span>
              <span className="animate-pulse inline-block w-2 h-4 bg-primary/40" />
            </div>
            
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.98] disabled:opacity-40 rounded flex items-center justify-center gap-3 group/btn"
            >
              <span className="text-[11px]">
                {sending ? "TRANSMITTING..." : "sh ./SEND_MESSAGE.sh"}
              </span>
              {!sending && <span className="group-hover:translate-x-1 transition-transform">→</span>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function TerminalField({
  label,
  highlight,
  comment,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  highlight: string;
  comment: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[9px] text-primary/40 italic">{comment}</p>
      <div className="flex items-center gap-2">
        <span className="text-primary/30 font-bold">rathoreatri03@lab:~$</span>
        <span className="text-white/40 italic">export {label}<span className="text-white font-bold not-italic underline decoration-primary/40">{highlight}</span>=</span>
      </div>
      <div className="relative bg-white/[0.02] border border-white/5 rounded px-4 h-10 flex items-center focus-within:border-primary/20 transition-all">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-white font-bold placeholder:text-white/5 text-[13px]"
          autoComplete="off"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
