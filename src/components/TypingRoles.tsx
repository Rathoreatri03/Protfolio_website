import { useEffect, useState } from "react";

type Titles = string[];

export function TypingRoles({ roles }: { roles?: Titles }) {
  const ROLES = roles && roles.length ? roles : ["AI Engineer"];
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[idx % ROLES.length];
    const speed = deleting ? 35 : 75;
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1300);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIdx((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, ROLES]);

  return (
    <span className="text-primary">
      {text}
      <span className="inline-block w-[2px] h-[0.9em] bg-primary align-middle ml-1 animate-blink" />
    </span>
  );
}
