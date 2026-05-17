import React from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
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

export const formatMessage = (text: string): React.ReactNode => {
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
