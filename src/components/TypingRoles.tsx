import { useEffect, useState } from "react";

const ROLES = [
  "Computer Vision Engineer",
  "Python Developer",
  "Data Analyst",
  "Business Analyst",
  "ML Engineer",
  "Model Trainer",
  "Blender Artist",
];

export function TypingRoles() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[idx];
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setDeleting(true), 1400);
        }
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
  }, [text, deleting, idx]);

  return (
    <span className="text-primary">
      {text}
      <span className="inline-block w-[2px] h-[0.9em] bg-primary align-middle ml-1 animate-blink" />
    </span>
  );
}
