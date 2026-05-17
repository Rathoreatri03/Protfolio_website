import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Check, 
  RefreshCw, 
  Plus, 
  Trash, 
  Save, 
  Globe, 
  Terminal, 
  LayoutGrid, 
  Trophy, 
  Wrench, 
  Layers
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminComponent,
});

type CMSFile = "systemMetadata" | "professionalLinks" | "BannerDetails" | "experience" | "projects" | "researchInsights" | "successStories" | "skillsData" | "techstack";

interface DBState {
  systemMetadata: { content: any; sha: string };
  professionalLinks: { content: any; sha: string };
  BannerDetails: { content: any; sha: string };
  experience: { content: any[]; sha: string };
  projects: { content: any[]; sha: string };
  researchInsights: { content: any[]; sha: string };
  successStories: { content: any[]; sha: string };
  skillsData: { content: any; sha: string };
  techstack: { content: string[]; sha: string };
}

function AdminComponent() {
  const [token, setToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<"checking" | "unauthorized" | "authorized">("checking");
  
  const [db, setDb] = useState<DBState | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "projects" | "achievements" | "skills">("general");
  const [publishing, setPublishing] = useState<string | null>(null);

  // Dynamically resolve base URL: use localhost:8787 during dev, and live worker in production!
  const WORKER_BASE = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8787"
    : "https://dodo-ai-agent.dodoai.workers.dev";

  // 1. Verify Credentials & Retrieve Auth Token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryToken = urlParams.get("token");

    // If query token is explicitly set to empty (e.g. ?token=), clear session and restrict access
    if (queryToken === "") {
      localStorage.removeItem("dodo_cms_token");
      setToken(null);
      setAuthStatus("unauthorized");
      return;
    }

    const activeToken = queryToken || localStorage.getItem("dodo_cms_token");

    if (activeToken) {
      setToken(activeToken);
      localStorage.setItem("dodo_cms_token", activeToken);

      // Verify Token on the live Worker API
      fetch(`${WORKER_BASE}/api/cms/verify`, {
        headers: { "Authorization": `Bearer ${activeToken}` }
      })
      .then(res => {
        if (res.ok) {
          setAuthStatus("authorized");
          loadDatabase(activeToken);
        } else {
          localStorage.removeItem("dodo_cms_token");
          setAuthStatus("unauthorized");
        }
      })
      .catch(() => {
        localStorage.removeItem("dodo_cms_token");
        setAuthStatus("unauthorized");
      });
    } else {
      setAuthStatus("unauthorized");
    }
  }, []);

  const GH_RAW_BASE = "https://raw.githubusercontent.com/Rathoreatri03/Protfolio_website/Json_data";

  // 2. Fetch all Portfolio Datasets directly from raw GitHub CDN (Zero API Rate Limit!)
  const loadDatabase = async (authToken: string) => {
    try {
      const files: CMSFile[] = [
        "systemMetadata",
        "professionalLinks",
        "BannerDetails",
        "experience",
        "projects",
        "researchInsights",
        "successStories",
        "skillsData",
        "techstack"
      ];
      
      const cacheBust = Date.now();

      // Fetch raw content in parallel (100% immune to API rate limits!)
      const contentFetches = files.map(filename => 
        fetch(`${GH_RAW_BASE}/${filename}.json?v=${cacheBust}`, { cache: "no-store" }).then(res => {
          if (!res.ok) throw new Error(`Failed to load ${filename}.json`);
          return res.json();
        })
      );

      const contents = await Promise.all(contentFetches);

      const loadedDb: any = {};
      for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        loadedDb[filename] = {
          content: contents[i],
          sha: "" // Stored as empty initially, fetched dynamically right before saving!
        };
      }

      setDb(loadedDb as DBState);
      toast.success("All portfolio datasets successfully loaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to load database contents.");
    }
  };

  // 3. Save a specific JSON file back to GitHub
  const saveFile = async (fileKey: CMSFile) => {
    if (!token || !db) return;
    setPublishing(fileKey);

    const payload = {
      filename: fileKey,
      content: db[fileKey].content
    };

    try {
      const res = await fetch(`${WORKER_BASE}/api/cms/save`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to deploy CMS update.");
      }

      toast.success(`Successfully saved and recompiled ${fileKey}!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPublishing(null);
    }
  };

  // Render checking lockscreen
  if (authStatus === "checking") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#070707]">
        <div className="relative size-16 flex items-center justify-center rounded-full bg-primary/5 border border-primary/20 animate-pulse mb-6">
          <RefreshCw className="size-6 text-primary animate-spin" />
        </div>
        <h2 className="font-display text-sm tracking-[0.3em] text-primary uppercase">Analyzing Terminal Session</h2>
        <p className="text-xs text-muted-foreground mt-2 font-mono">Authenticating security credentials...</p>
      </div>
    );
  }

  // Render unauthorized access screen
  if (authStatus === "unauthorized") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#0a0505] px-6">
        <div className="size-16 flex items-center justify-center rounded-full bg-red-500/5 border border-red-500/20 mb-6 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
          <ShieldAlert className="size-8 text-red-500 animate-bounce" />
        </div>
        <h1 className="font-display text-lg tracking-[0.4em] text-red-500 uppercase">ACCESS DENIED</h1>
        <p className="max-w-md text-xs text-muted-foreground mt-3 leading-relaxed font-mono">
          Security token is missing or has expired. You must provide a valid kernel authentication query to open this workspace.
        </p>
        <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-lg max-w-sm w-full font-mono text-[10px] text-left text-muted-foreground">
          <span className="text-primary font-bold">Diagnostics:</span><br />
          URL parameter '?token=...' required.<br />
          Verify environment variables inside Wrangler Cloud console.
        </div>
      </div>
    );
  }

  if (!db) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#070707]">
        <RefreshCw className="size-8 text-primary animate-spin mb-4" />
        <h2 className="font-display text-xs tracking-widest text-muted-foreground uppercase">Downloading master databases from GitHub...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080808] font-sans antialiased text-white selection:bg-primary/20">
      
      {/* ── SIDE PANEL NAV ── */}
      <aside className="w-full md:w-64 shrink-0 bg-[#0c0c0c] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between">
        <div>
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Terminal className="size-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xs tracking-[0.2em] text-white uppercase font-bold">Dodo CMS</h1>
              <p className="text-[9px] text-primary/80 font-mono tracking-wider uppercase">Admin Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-xs font-medium tracking-wide uppercase transition-all ${
                activeTab === "general" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutGrid className="size-4" />
              General Metadata
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-xs font-medium tracking-wide uppercase transition-all ${
                activeTab === "projects" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              <Wrench className="size-4" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-xs font-medium tracking-wide uppercase transition-all ${
                activeTab === "achievements" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              <Trophy className="size-4" />
              Achievements
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-xs font-medium tracking-wide uppercase transition-all ${
                activeTab === "skills" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              <Layers className="size-4" />
              Skills & Tech Stack
            </button>
          </nav>
        </div>

        {/* System Credentials Status */}
        <div className="mt-8 pt-6 border-t border-white/5 font-mono text-[9px] text-muted-foreground flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span>CORE SECTOR:</span>
            <span className="text-emerald-500 flex items-center gap-1"><Unlock className="size-2.5" /> SECURE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>KERNEL REF:</span>
            <span>{db.systemMetadata.content.kernel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>DEPLOY HOST:</span>
            <span>GitHub Pages</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CMS CONTENT EDITOR ── */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">

        {/* ── TAB 1: GENERAL METADATA ── */}
        {activeTab === "general" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">General Metadata</h2>
                <p className="text-xs text-muted-foreground mt-1">Configure your personal info, official biography, and contact URLs.</p>
              </div>
              <button
                onClick={async () => {
                  await saveFile("systemMetadata");
                  await saveFile("professionalLinks");
                  await saveFile("BannerDetails");
                }}
                disabled={publishing !== null}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground text-xs font-semibold rounded-md shadow-md transition-all uppercase"
              >
                {publishing ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                Publish General
              </button>
            </div>

            {/* Editor Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Form card: System metadata */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-primary border-b border-white/5 pb-2 uppercase">⚙️ System Info</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1 text-[10px] uppercase">User Name</label>
                    <input 
                      type="text" 
                      value={db.systemMetadata.content.userName} 
                      onChange={e => setDb({...db, systemMetadata: {...db.systemMetadata, content: {...db.systemMetadata.content, userName: e.target.value}}})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 text-[10px] uppercase">System ID</label>
                    <input 
                      type="text" 
                      value={db.systemMetadata.content.systemID} 
                      onChange={e => setDb({...db, systemMetadata: {...db.systemMetadata, content: {...db.systemMetadata.content, systemID: e.target.value}}})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-muted-foreground mb-1 text-[10px] uppercase">Kernel Version</label>
                      <input 
                        type="text" 
                        value={db.systemMetadata.content.kernel} 
                        onChange={e => setDb({...db, systemMetadata: {...db.systemMetadata, content: {...db.systemMetadata.content, kernel: e.target.value}}})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground mb-1 text-[10px] uppercase">Latency</label>
                      <input 
                        type="text" 
                        value={db.systemMetadata.content.latency} 
                        onChange={e => setDb({...db, systemMetadata: {...db.systemMetadata, content: {...db.systemMetadata.content, latency: e.target.value}}})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form card: Professional Links */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-primary border-b border-white/5 pb-2 uppercase">🔗 Professional Links</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1 text-[10px] uppercase">Email Contact</label>
                    <input 
                      type="text" 
                      value={db.professionalLinks.content.email} 
                      onChange={e => setDb({...db, professionalLinks: {...db.professionalLinks, content: {...db.professionalLinks.content, email: e.target.value}}})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 text-[10px] uppercase">GitHub Profile</label>
                    <input 
                      type="text" 
                      value={db.professionalLinks.content.github} 
                      onChange={e => setDb({...db, professionalLinks: {...db.professionalLinks, content: {...db.professionalLinks.content, github: e.target.value}}})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 text-[10px] uppercase">Resume PDF URL</label>
                    <input 
                      type="text" 
                      value={db.professionalLinks.content.resume_PDF} 
                      onChange={e => setDb({...db, professionalLinks: {...db.professionalLinks, content: {...db.professionalLinks.content, resume_PDF: e.target.value}}})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Form card: Bio Details */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 md:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-primary border-b border-white/5 pb-2 uppercase">👤 Bio & Core Titles</h3>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-1 text-[10px] uppercase">Professional Titles (Comma separated)</label>
                    <input 
                      type="text" 
                      value={db.BannerDetails.content.titles.join(", ")} 
                      onChange={e => setDb({...db, BannerDetails: {...db.BannerDetails, content: {...db.BannerDetails.content, titles: e.target.value.split(",").map(s => s.trim())}}})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 text-[10px] uppercase">Official Portfolio Biography</label>
                    <textarea 
                      rows={5}
                      value={db.BannerDetails.content.description} 
                      onChange={e => setDb({...db, BannerDetails: {...db.BannerDetails, content: {...db.BannerDetails.content, description: e.target.value}}})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary font-sans leading-relaxed text-sm"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 2: PROJECTS ── */}
        {activeTab === "projects" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Core Engineering Projects</h2>
                <p className="text-xs text-muted-foreground mt-1">Manage, add, or delete your technical portfolios and repository links.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newProj = { title: "New Project", description: "Write description here...", link: "" };
                    setDb({...db, projects: {...db.projects, content: [...db.projects.content, newProj]}});
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] border border-white/10 hover:bg-white/10 text-xs font-semibold rounded-md transition-all"
                >
                  <Plus className="size-3.5" />
                  Add Project
                </button>
                <button
                  onClick={() => saveFile("projects")}
                  disabled={publishing !== null}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground text-xs font-semibold rounded-md shadow-md transition-all uppercase"
                >
                  {publishing === "projects" ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  Deploy Projects
                </button>
              </div>
            </div>

            {/* List of projects */}
            <div className="space-y-4">
              {db.projects.content.map((proj, idx) => (
                <div key={idx} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 relative group space-y-4">
                  
                  {/* Delete button */}
                  <button
                    onClick={() => {
                      const updated = db.projects.content.filter((_, i) => i !== idx);
                      setDb({...db, projects: {...db.projects, content: updated}});
                      toast.info(`Removed project "${proj.title}" from local stack.`);
                    }}
                    className="absolute right-4 top-4 size-8 flex items-center justify-center rounded-full bg-red-500/5 hover:bg-red-500/25 border border-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Trash className="size-3.5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-muted-foreground mb-1 text-[9px] uppercase font-mono">Project Name</label>
                      <input 
                        type="text" 
                        value={proj.title} 
                        onChange={e => {
                          const updated = [...db.projects.content];
                          updated[idx].title = e.target.value;
                          setDb({...db, projects: {...db.projects, content: updated}});
                        }}
                        className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground mb-1 text-[9px] uppercase font-mono">GitHub / Deploy Link</label>
                      <input 
                        type="text" 
                        value={proj.link} 
                        onChange={e => {
                          const updated = [...db.projects.content];
                          updated[idx].link = e.target.value;
                          setDb({...db, projects: {...db.projects, content: updated}});
                        }}
                        className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-1.5 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-muted-foreground mb-1 text-[9px] uppercase font-mono">Description</label>
                      <textarea 
                        rows={3}
                        value={proj.description} 
                        onChange={e => {
                          const updated = [...db.projects.content];
                          updated[idx].description = e.target.value;
                          setDb({...db, projects: {...db.projects, content: updated}});
                        }}
                        className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-1.5 text-white focus:outline-none focus:border-primary font-sans leading-relaxed text-sm"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: ACHIEVEMENTS ── */}
        {activeTab === "achievements" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Hackathon Victories & Achievements</h2>
                <p className="text-xs text-muted-foreground mt-1">Configure your real hackathon records (SRM, NSUT, INNOV8) so Dodo replies perfectly.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newVictory = { title: "New Hackathon Win", description: "Secured 1st place...", link: "" };
                    setDb({...db, successStories: {...db.successStories, content: [...db.successStories.content, newVictory]}});
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] border border-white/10 hover:bg-white/10 text-xs font-semibold rounded-md transition-all"
                >
                  <Plus className="size-3.5" />
                  Add Victory
                </button>
                <button
                  onClick={() => saveFile("successStories")}
                  disabled={publishing !== null}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground text-xs font-semibold rounded-md shadow-md transition-all uppercase"
                >
                  {publishing === "successStories" ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  Deploy Victories
                </button>
              </div>
            </div>

            {/* List of achievements */}
            <div className="space-y-4">
              {db.successStories.content.map((story, idx) => (
                <div key={idx} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 relative group space-y-4">
                  
                  {/* Delete button */}
                  <button
                    onClick={() => {
                      const updated = db.successStories.content.filter((_, i) => i !== idx);
                      setDb({...db, successStories: {...db.successStories, content: updated}});
                      toast.info(`Removed achievement "${story.title}"`);
                    }}
                    className="absolute right-4 top-4 size-8 flex items-center justify-center rounded-full bg-red-500/5 hover:bg-red-500/25 border border-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Trash className="size-3.5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-muted-foreground mb-1 text-[9px] uppercase font-mono">Hackathon Name</label>
                      <input 
                        type="text" 
                        value={story.title} 
                        onChange={e => {
                          const updated = [...db.successStories.content];
                          updated[idx].title = e.target.value;
                          setDb({...db, successStories: {...db.successStories, content: updated}});
                        }}
                        className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground mb-1 text-[9px] uppercase font-mono">Reference URL (Optional)</label>
                      <input 
                        type="text" 
                        value={story.link || ""} 
                        onChange={e => {
                          const updated = [...db.successStories.content];
                          updated[idx].link = e.target.value;
                          setDb({...db, successStories: {...db.successStories, content: updated}});
                        }}
                        placeholder="https://"
                        className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-1.5 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-muted-foreground mb-1 text-[9px] uppercase font-mono">Achievement Summary</label>
                      <textarea 
                        rows={3}
                        value={story.description} 
                        onChange={e => {
                          const updated = [...db.successStories.content];
                          updated[idx].description = e.target.value;
                          setDb({...db, successStories: {...db.successStories, content: updated}});
                        }}
                        className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-1.5 text-white focus:outline-none focus:border-primary font-sans leading-relaxed text-sm"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: SKILLS ── */}
        {activeTab === "skills" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Skills & Tech Stack</h2>
                <p className="text-xs text-muted-foreground mt-1">Configure skill categories, expertises, and dynamic tech stack lists.</p>
              </div>
              <button
                onClick={async () => {
                  await saveFile("skillsData");
                  await saveFile("techstack");
                }}
                disabled={publishing !== null}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground text-xs font-semibold rounded-md shadow-md transition-all uppercase"
              >
                {publishing ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                Deploy Skills
              </button>
            </div>

            <div className="space-y-6">
              
              {/* Card 1: Tech stack marquee */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-primary border-b border-white/5 pb-2 uppercase">⚙️ Rapid Deployment Tech Stack</h3>
                <div className="space-y-2">
                  <label className="block text-muted-foreground text-[10px] uppercase font-mono">Tech Stack Items (Comma separated)</label>
                  <input 
                    type="text" 
                    value={db.techstack.content.join(", ")} 
                    onChange={e => setDb({...db, techstack: {...db.techstack, content: e.target.value.split(",").map(s => s.trim()).filter(Boolean)}})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
              </div>

              {/* Card 2: Skill category details */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-6">
                <h3 className="text-sm font-semibold tracking-wider text-primary border-b border-white/5 pb-2 uppercase">📊 Neural Skill Matrices</h3>
                
                <div className="space-y-6">
                  {db.skillsData.content.categories?.map((cat: any, cIdx: number) => (
                    <div key={cIdx} className="p-4 bg-white/[0.01] border border-white/5 rounded-lg space-y-4">
                      
                      <div className="flex justify-between items-center">
                        <div className="w-1/2">
                          <label className="block text-muted-foreground text-[9px] uppercase font-mono">Category Title</label>
                          <input 
                            type="text" 
                            value={cat.title} 
                            onChange={e => {
                              const updated = {...db.skillsData.content};
                              updated.categories[cIdx].title = e.target.value;
                              setDb({...db, skillsData: {...db.skillsData, content: updated}});
                            }}
                            className="bg-transparent border-b border-white/10 focus:border-primary text-white font-bold text-sm focus:outline-none pb-1 mt-1 w-full"
                          />
                        </div>
                      </div>

                      {/* Skills list inside category */}
                      <div className="space-y-3 pl-4 border-l border-white/5">
                        {cat.skills?.map((skill: any, sIdx: number) => (
                          <div key={sIdx} className="grid grid-cols-12 gap-3 items-center">
                            
                            <div className="col-span-6">
                              <input 
                                type="text" 
                                value={skill.name} 
                                onChange={e => {
                                  const updated = {...db.skillsData.content};
                                  updated.categories[cIdx].skills[sIdx].name = e.target.value;
                                  setDb({...db, skillsData: {...db.skillsData, content: updated}});
                                }}
                                className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-1 font-mono text-xs focus:outline-none focus:border-primary"
                              />
                            </div>

                            <div className="col-span-4 flex items-center gap-2">
                              <input 
                                type="number" 
                                value={skill.progress} 
                                onChange={e => {
                                  const updated = {...db.skillsData.content};
                                  updated.categories[cIdx].skills[sIdx].progress = parseInt(e.target.value) || 0;
                                  setDb({...db, skillsData: {...db.skillsData, content: updated}});
                                }}
                                className="w-16 bg-white/[0.02] border border-white/10 rounded px-2 py-1 font-mono text-xs focus:outline-none focus:border-primary text-center"
                              />
                              <span className="text-[10px] text-muted-foreground uppercase font-mono">%</span>
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
