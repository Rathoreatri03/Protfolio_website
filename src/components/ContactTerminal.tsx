import { useState } from "react";
import { toast } from "sonner";

export function ContactTerminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("All fields required: name, email, message");
      return;
    }
    setSending(true);
    const subject = encodeURIComponent(`[ATRI_LAB] Inbound from ${name}`);
    const body = encodeURIComponent(
      `From: ${name} <${email}>\n\n${message}\n\n--\nSent via atri.lab terminal`,
    );
    window.location.href = `mailto:rathoreatri03@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast.success("Transmission relay opened in your mail client");
    }, 500);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative border border-border bg-card/40 backdrop-blur-md font-display text-sm overflow-hidden group"
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-border">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-yellow-500/80" />
          <span className="size-2.5 rounded-full bg-primary" />
        </div>
        <span className="text-[10px] text-muted-foreground tracking-widest">
          atri@lab ~ /contact/send.sh
        </span>
        <span className="text-[10px] text-primary animate-pulse">● REC</span>
      </div>

      <div className="p-5 space-y-4">
        <Field label="--from-name" value={name} onChange={setName} placeholder="your_name" />
        <Field label="--from-email" value={email} onChange={setEmail} placeholder="you@domain.com" type="email" />
        <div>
          <label className="block text-[11px] text-primary/80 mb-1.5 tracking-widest">
            $ payload
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="// describe the mission, collaboration or idea..."
            className="w-full bg-black/40 border border-border focus:border-primary outline-none p-3 text-sm resize-none transition-all focus:shadow-[0_0_0_3px] focus:shadow-primary/10 text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="relative w-full h-11 bg-primary text-primary-foreground font-display font-bold text-sm tracking-tight hover:bg-primary/90 transition-all active:scale-[0.98] overflow-hidden disabled:opacity-60"
        >
          <span className="relative z-10">
            {sending ? "→ TRANSMITTING…" : "▲ TRANSMIT_PACKET"}
          </span>
          <span className="absolute inset-0 animate-shimmer" />
        </button>

        <p className="text-[10px] text-muted-foreground tracking-widest pt-2 border-t border-border">
          # opens your default mail client · response_time: &lt; 24h
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] text-primary/80 mb-1.5 tracking-widest">
        $ {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-border focus:border-primary outline-none px-3 h-10 text-sm transition-all focus:shadow-[0_0_0_3px] focus:shadow-primary/10 text-foreground placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
