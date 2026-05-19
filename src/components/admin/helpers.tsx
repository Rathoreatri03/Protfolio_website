import React from "react";
import { ExternalLink } from "lucide-react";

// Sleek helper to render a text input with an integrated "Open Link" action button if it contains a URL
export const renderUrlInput = (
  value: string,
  onChange: (val: string) => void,
  placeholder = "https://...",
  className = "w-full cyber-input font-mono-fira"
) => {
  const isUrl = value && (
    value.startsWith("http://") || 
    value.startsWith("https://") || 
    value.includes("cloudinary.com") || 
    value.includes("github.com")
  );
  return (
    <div className="relative flex items-center w-full">
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${className} ${isUrl ? "pr-10" : ""}`}
      />
      {isUrl && (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute right-3 p-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground hover:text-[#00ff88] hover:border-[#00ff88]/30 hover:bg-[#00ff88]/10 transition-all cursor-pointer z-10 flex items-center justify-center"
          title="Open Live Link"
        >
          <ExternalLink className="size-3.5" />
        </a>
      )}
    </div>
  );
};

// Recursively renders a beautiful dynamic form for nested JSON objects and primitive values
export const renderDynamicObjectEditor = (
  obj: any, 
  onChange: (newObj: any) => void, 
  path: string[] = []
): React.ReactNode => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;

  const handleFieldChange = (key: string, value: any) => {
    const updated = { ...obj, [key]: value };
    onChange(updated);
  };

  const formatLabel = (str: string) => {
    return str
      .replace(/_/g, " ")
      .replace(/([A-Z]+)/g, " $1")
      .replace(/([A-Z][a-z])/g, " $1")
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {Object.entries(obj).map(([key, val]) => {
        const label = formatLabel(key);

        // 1. Nested Object
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
          return (
            <div key={key} className="glass-card p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold tracking-wider text-[#00ff88] uppercase">{label}</span>
              </div>
              {renderDynamicObjectEditor(val, (newSubObj) => handleFieldChange(key, newSubObj), [...path, key])}
            </div>
          );
        }

        // 2. Array of Strings
        if (Array.isArray(val)) {
          const isStringArray = val.every(item => typeof item === "string");
          if (isStringArray) {
            return (
              <div key={key} className="space-y-1.5 animate-in fade-in duration-300">
                <label className="block text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
                  {label} (Comma Separated)
                </label>
                <input
                  type="text"
                  value={val.join(", ")}
                  onChange={(e) => {
                    const arr = e.target.value.split(",").map(t => t.trim());
                    handleFieldChange(key, arr);
                  }}
                  className="w-full cyber-input font-sans"
                />
              </div>
            );
          }
        }

        // 3. String Values
        if (typeof val === "string") {
          const isUrl = val.startsWith("http://") || val.startsWith("https://") || val.includes("cloudinary.com") || val.includes("github.com");
          const isLongText = val.length > 100 || key.toLowerCase().includes("description") || key.toLowerCase().includes("bio");

          return (
            <div key={key} className="space-y-1.5 animate-in fade-in duration-300">
              <label className="block text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
                {label}
              </label>
              {isLongText ? (
                <textarea
                  rows={5}
                  value={val}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="w-full cyber-input font-sans leading-relaxed resize-none"
                />
              ) : isUrl ? (
                renderUrlInput(
                  val,
                  (newVal) => handleFieldChange(key, newVal),
                  `Enter ${label.toLowerCase()} URL`
                )
              ) : (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="w-full cyber-input font-sans"
                />
              )}
            </div>
          );
        }

        // 4. Number Values
        if (typeof val === "number") {
          return (
            <div key={key} className="space-y-1.5 animate-in fade-in duration-300">
              <label className="block text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
                {label}
              </label>
              <input
                type="number"
                value={val}
                onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
                className="w-full cyber-input font-mono-fira"
              />
            </div>
          );
        }

        // 5. Boolean Values
        if (typeof val === "boolean") {
          return (
            <div key={key} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl animate-in fade-in duration-300">
              <label className="text-white text-xs font-bold tracking-wide uppercase">
                {label}
              </label>
              <button
                type="button"
                onClick={() => handleFieldChange(key, !val)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  val ? "bg-[#00ff88]" : "bg-white/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                    val ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

// Compile active selected datasets locally into Atri's Information block
export const compileAtrisInformationText = (db: any, included: Record<string, boolean>): string => {
  if (!db) return "";
  const prompt_lines: string[] = [];

  // 1. System Metadata
  if (included.systemMetadata && db.systemMetadata?.content) {
    const m = db.systemMetadata.content;
    prompt_lines.push("#### 🌐 System Parameters & Metadata:");
    prompt_lines.push(`- **Engineer / Programmer:** ${m.userName || "Atri Rathore"}`);
    prompt_lines.push(`- **System ID:** ${m.systemID || "Atri_Rathore"}`);
    prompt_lines.push(`- **Terminal User:** ${m.terminalUser || "rathoreatri03@lab"}`);
    prompt_lines.push(`- **Kernel Version:** ${m.kernel || "X-Matrix_64"}`);
    prompt_lines.push(`- **Uptime Rate:** ${m.uptime || "99.99%"}`);
    prompt_lines.push(`- **Operational Latency:** ${m.latency || "12ms"}`);
    prompt_lines.push("");
  }

  // 2. Links
  if (included.professionalLinks && db.professionalLinks?.content) {
    const l = db.professionalLinks.content;
    prompt_lines.push("#### 🔗 Official Contact Information & Links:");
    prompt_lines.push("Always provide these EXACT URLs when asked for Atri's contact info, GitHub, LinkedIn, Resume, or Visume. Output them as clean markdown links:");
    if (l.email) prompt_lines.push(`- **Email Address:** ${l.email} (mailto:${l.email})`);
    if (l.github) prompt_lines.push(`- **GitHub Profile:** [${l.github}](${l.github})`);
    prompt_lines.push("- **LinkedIn Profile:** [https://www.linkedin.com/in/rathoreatri03/](https://www.linkedin.com/in/rathoreatri03/)");
    if (l.resume_PDF) prompt_lines.push(`- **Official Resume (PDF):** [View Atri's Resume](${l.resume_PDF})`);
    if (l.visume_video) prompt_lines.push(`- **Video Resume (Visume):** [Watch Atri's Video Resume](${l.visume_video})`);
    prompt_lines.push("");
  }

  // 2b. Brand Logo
  if (included.logo && db.logo?.content?.logo_url) {
    prompt_lines.push("#### 🏷️ Official Brand Logo:");
    prompt_lines.push(`- **Logo URL:** ${db.logo.content.logo_url}`);
    prompt_lines.push("");
  }

  // 3. Banner
  if (included.BannerDetails && db.BannerDetails?.content) {
    const b = db.BannerDetails.content;
    if (b.titles && b.titles.length) {
      prompt_lines.push("#### 👤 Executive Professional Summary:");
      prompt_lines.push(`Atri serves under these titles: ${b.titles.join(", ")}.`);
      prompt_lines.push(`**Bio & Overview:** ${b.description || ""}`);
      prompt_lines.push("");
    }
  }

  // 4. Experience
  if (included.experience && db.experience?.content && db.experience.content.length) {
    prompt_lines.push("#### 💼 Professional Experience & Milestones:");
    for (const exp of db.experience.content) {
      prompt_lines.push(`- **${exp.title}** (${exp.duration || "N/A"})`);
      prompt_lines.push(`  - *Details:* ${exp.description || ""}`);
      if (exp.ref) prompt_lines.push(`  - *System Reference:* \`${exp.ref}\``);
      if (exp.link && exp.link.trim()) prompt_lines.push(`  - *Associated Document:* [View Document](${exp.link})`);
    }
    prompt_lines.push("");
  }

  // 5. Projects
  if (included.projects && db.projects?.content && db.projects.content.length) {
    prompt_lines.push("#### 🛠️ Core Engineering Projects:");
    for (const proj of db.projects.content) {
      prompt_lines.push(`- **${proj.title}**`);
      prompt_lines.push(`  - *Description:* ${proj.description || ""}`);
      if (proj.link && proj.link.trim()) prompt_lines.push(`  - *Repository Link:* [${proj.link}](${proj.link})`);
    }
    prompt_lines.push("");
  }

  // 6. Research
  if (included.researchInsights && db.researchInsights?.content && db.researchInsights.content.length) {
    prompt_lines.push("#### 📚 Scientific Research & Intellectual Property:");
    for (const item of db.researchInsights.content) {
      prompt_lines.push(`- **${item.title}**`);
      prompt_lines.push(`  - *Summary:* ${item.description || ""}`);
      if (item.link && item.link.trim()) prompt_lines.push(`  - *Publication Link:* [Taylor & Francis / Publisher link](${item.link})`);
    }
    prompt_lines.push("");
  }

  // 7. Victories
  if (included.successStories && db.successStories?.content && db.successStories.content.length) {
    prompt_lines.push("#### 🏆 Hackathon Victories & Competitive Achievements:");
    for (const story of db.successStories.content) {
      prompt_lines.push(`- **${story.title}**`);
      prompt_lines.push(`  - *Achievement:* ${story.description || ""}`);
      if (story.link && story.link.trim()) prompt_lines.push(`  - *Reference URL:* [${story.link}](${story.link})`);
    }
    prompt_lines.push("");
  }

  // 8. Skills
  if (included.skillsData && db.skillsData?.content && db.skillsData.content.categories && db.skillsData.content.categories.length) {
    prompt_lines.push("#### 📊 Core Knowledge Matrix (Skills & Proficiencies):");
    for (const cat of db.skillsData.content.categories) {
      prompt_lines.push(`- **${cat.title}:**`);
      const list = (cat.skills || []).map((s: any) => `${s.name} (${s.progress}% proficiency)`).join(", ");
      prompt_lines.push(`  - ${list}`);
    }
    prompt_lines.push("");
  }

  // 9. Techstack
  if (included.techstack && db.techstack?.content && db.techstack.content.length) {
    prompt_lines.push(`#### ⚙️ Rapid Deployment Tech Stack: ${db.techstack.content.join(", ")}`);
    prompt_lines.push("");
  }

  return prompt_lines.join("\n");
};
