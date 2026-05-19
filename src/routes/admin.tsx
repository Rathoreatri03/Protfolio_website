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
  Layers,
  Briefcase,
  BookOpen,
  ArrowUp,
  ArrowDown,
  User,
  ExternalLink,
  ChevronRight,
  LogOut,
  X,
  Code2
} from "lucide-react";
import { toast } from "sonner";
import { NeuralBackground } from "../components/NeuralBackground";
import { CMSFile, DBState } from "../components/admin/types";
import { CustomListEditor } from "../components/admin/CustomListEditor";
import { ObjectTabPanel } from "../components/admin/ObjectTabPanel";
import { SkillsDataPanel } from "../components/admin/SkillsDataPanel";
import { TechStackPanel } from "../components/admin/TechStackPanel";
import { DodoPromptConfigPanel } from "../components/admin/DodoPromptConfigPanel";
import { CustomSectionPanel } from "../components/admin/CustomSectionPanel";
import { CustomSectionWizard } from "../components/admin/CustomSectionWizard";
import { ExperiencePanel } from "../components/admin/ExperiencePanel";
import { ProjectsPanel } from "../components/admin/ProjectsPanel";
import { ResearchInsightsPanel } from "../components/admin/ResearchInsightsPanel";
import { SuccessStoriesPanel } from "../components/admin/SuccessStoriesPanel";
import { JsonEditorPanel } from "../components/admin/JsonEditorPanel";



export const Route = createFileRoute("/admin")({
  component: AdminComponent,
});


function AdminComponent() {
  const [token, setToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<"checking" | "unauthorized" | "authorized">("checking");
  const [inputKey, setInputKey] = useState("");
  const [isSubmittingKey, setIsSubmittingKey] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  
  const [db, setDb] = useState<DBState | null>(null);
  
  const [activeTab, setActiveTab] = useState<string>("systemMetadata");
  const [editMode, setEditMode] = useState<"visual" | "json">("visual");

  // Custom Schema Wizard States
  const [showWizard, setShowWizard] = useState(false);

  const handleDeleteCustomSection = async (sectionKey: string) => {
    if (!db || !token || !window.confirm(`Are you sure you want to permanently delete custom section "${sectionKey}" from GitHub?`)) return;
    
    setPublishing(sectionKey);
    try {
      // 1. Instantly delete the file from GitHub
      const res = await fetch(`${WORKER_BASE}/api/cms/delete`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ filename: sectionKey })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Failed to delete ${sectionKey}.json from GitHub`);
      }

      // 2. Also remove from legacy systemMetadata registry if present
      const updatedMetadata = { ...db.systemMetadata };
      if (updatedMetadata.content.customSections) {
        const custom = { ...updatedMetadata.content.customSections };
        delete custom[sectionKey];
        updatedMetadata.content.customSections = custom;
      }

      // 3. Remove from active DB state in-memory
      const updatedDb = { ...db };
      delete updatedDb[sectionKey];
      updatedDb.systemMetadata = updatedMetadata;
      setDb(updatedDb);

      if (activeTab === sectionKey) {
        setActiveTab("systemMetadata");
      }

      // 4. Save metadata registry update to GitHub
      await fetch(`${WORKER_BASE}/api/cms/save`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: "systemMetadata",
          content: updatedMetadata.content
        })
      });

      toast.success(`Successfully deleted "${sectionKey}" from GitHub!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPublishing(null);
    }
  };

  const [publishing, setPublishing] = useState<string | null>(null);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  // ── 100% PRODUCTION EDGE MODE: Always fetch dynamically from live Cloudflare & GitHub! ──
  const WORKER_BASE = "https://dodo-ai-agent.dodoai.workers.dev";

  // Dynamically load premium fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch (e) {}
    };
  }, []);

  // 1. Verify Credentials & Retrieve Auth Token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryToken = urlParams.get("token");

    if (queryToken !== null) {
      // Clear token from URL immediately to prevent exposure!
      window.history.replaceState({}, document.title, window.location.pathname);
      
      if (queryToken === "") {
        setToken(null);
        setAuthStatus("unauthorized");
        return;
      }
    }

    // Sessions do not persist across refreshes (in-memory only)
    if (queryToken) {
      setToken(queryToken);

      // Verify Token on the live Worker API
      fetch(`${WORKER_BASE}/api/cms/verify`, {
        headers: { "Authorization": `Bearer ${queryToken}` }
      })
      .then(res => {
        if (res.ok) {
          setAuthStatus("authorized");
          loadDatabase(queryToken);
        } else {
          setAuthStatus("unauthorized");
        }
      })
      .catch(() => {
        setAuthStatus("unauthorized");
      });
    } else {
      setAuthStatus("unauthorized");
    }
  }, []);

  // Securely verify credentials entered via the popup modal
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setIsSubmittingKey(true);
    setKeyError(null);

    try {
      const res = await fetch(`${WORKER_BASE}/api/cms/verify`, {
        headers: { "Authorization": `Bearer ${inputKey.trim()}` }
      });

      if (res.ok) {
        setToken(inputKey.trim());
        setAuthStatus("authorized");
        await loadDatabase(inputKey.trim());
        toast.success("Terminal Access Granted!");
      } else {
        setKeyError("INVALID KERNEL ACCESS KEY. DECRYPTION TIMEOUT.");
        toast.error("Verification failed: Invalid key.");
      }
    } catch (err: any) {
      setKeyError("ERROR: OPERATIONS KERNEL UNREACHABLE.");
      toast.error("Network error during verification.");
    } finally {
      setIsSubmittingKey(false);
    }
  };

  // Securely close session and destroy memory footprints
  const handleLogout = () => {
    setToken(null);
    setAuthStatus("unauthorized");
    setDb(null);
    setInputKey("");
    setKeyError(null);
    toast.success("Operations Session Discharged Safely.");
  };

  // 2. Fetch all Portfolio Datasets in one single secure call
  const loadDatabase = async (authToken: string) => {
    try {
      const res = await fetch(`${WORKER_BASE}/api/cms/load`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (!res.ok) {
        throw new Error("Failed to download master dynamic databases from Cloudflare Worker.");
      }
      const data = await res.json() as { db: DBState };
      const loadedDb = data.db;

      // ── Backward Compatibility Migration ──
      // If legacy customSections metadata exists in systemMetadata but lacks a standalone file,
      // reconstruct it in memory.
      const customSectionsRegistry = loadedDb.systemMetadata?.content?.customSections || {};
      for (const [key, sec] of Object.entries(customSectionsRegistry) as [string, any][]) {
        if (!loadedDb[key] || loadedDb[key].content?.schema === undefined) {
          const contentValue = loadedDb[key]?.content !== undefined 
            ? loadedDb[key].content 
            : (sec.content !== undefined ? sec.content : (sec.type === "list" ? [] : {}));
            
          loadedDb[key] = {
            content: {
              title: sec.title || key,
              type: sec.type || "object",
              schema: sec.schema || [],
              content: contentValue
            },
            sha: loadedDb[key]?.sha || ""
          };
        }
      }

      setDb(loadedDb);
      toast.success("Primal dynamic databases compiled successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to load database contents.");
    }
  };

  // 3. Save a specific JSON file back to GitHub
  const saveFile = async (fileKey: string) => {
    if (!token || !db) return;
    setPublishing(fileKey);

    try {
      const payload = {
        filename: fileKey,
        content: db[fileKey].content
      };

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
        throw new Error(errData.error || `Failed to save ${fileKey}.json`);
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
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#050505] text-white">
        <div className="relative size-20 flex items-center justify-center rounded-full bg-primary/5 border border-primary/20 animate-pulse mb-6 shadow-[0_0_50px_rgba(0,255,136,0.1)]">
          <RefreshCw className="size-8 text-[#00ff88] animate-spin" />
        </div>
        <h2 className="font-display text-xs font-semibold tracking-[0.4em] text-[#00ff88] uppercase neon-text-glow">Authenticating Core Session</h2>
        <p className="text-[10px] text-muted-foreground font-mono mt-3 uppercase tracking-widest">Decrypting Terminal Keys...</p>
      </div>
    );
  }

  // Render unauthorized access screen
  if (authStatus === "unauthorized") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white relative px-4 select-none">
        <NeuralBackground />
        
        <form 
          onSubmit={handleLoginSubmit}
          className="relative max-w-sm w-full glass-card rounded-3xl p-8 border border-white/5 shadow-[0_15px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500"
        >
          {/* Neon Header Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent shadow-[0_0_12px_#00ff88]" />

          <div className="flex flex-col items-center gap-3">
            <div className="size-16 rounded-2xl bg-white/[0.01] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,136,0.02)]">
              <Lock className="size-7 text-[#00ff88] animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold tracking-[0.3em] uppercase text-white">Security Gateway</h1>
              <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase tracking-wider">Dodo Operations Kernel</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed font-sans px-2">
              Authentication required to modify portfolio memory databases. Enter your operations security key to open workspace.
            </p>

            <div className="space-y-2">
              <input 
                type="password"
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="Security Access Token"
                className="w-full cyber-input text-center font-mono-fira text-sm tracking-widest placeholder:tracking-normal placeholder:font-sans focus:placeholder-opacity-50"
                disabled={isSubmittingKey}
              />

              {keyError && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-[9.5px] font-mono tracking-wide uppercase leading-tight animate-in fade-in slide-in-from-top-1">
                  ⚠️ {keyError}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingKey || !inputKey.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#00ff88] hover:bg-[#00ff88]/90 disabled:bg-[#00ff88]/40 disabled:text-[#050505]/40 text-[#050505] text-xs font-bold rounded-xl shadow-[0_4px_25px_rgba(0,255,136,0.15)] transition-all uppercase"
          >
            {isSubmittingKey ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                <span>Decrypting Layers...</span>
              </>
            ) : (
              <>
                <Unlock className="size-3.5" />
                <span>Establish Connection</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  if (!db) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#050505] text-white">
        <RefreshCw className="size-10 text-[#00ff88] animate-spin mb-4" />
        <h2 className="font-display text-xs font-semibold tracking-widest text-[#00ff88]/80 uppercase">Downloading dynamic databases from GitHub...</h2>
        <p className="text-[10px] text-muted-foreground font-mono mt-2 tracking-widest uppercase">Syncing CDN layers in real-time...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#050505] font-sans antialiased text-white selection:bg-[#00ff88]/20 relative">
      <NeuralBackground />
      <style>{`
        select.cyber-input option {
          background-color: #080808 !important;
          color: #ffffff !important;
        }
        select.cyber-input {
          color-scheme: dark;
        }
        body {
          font-family: 'Outfit', sans-serif;

          background-color: #050505;
          overflow: hidden;
        }
        .font-mono-fira {
          font-family: 'Fira Code', monospace;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.012);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card:hover {
          border-color: rgba(0, 255, 136, 0.12);
          background: rgba(255, 255, 255, 0.02);
          box-shadow: 0 12px 40px 0 rgba(0, 255, 136, 0.03);
        }
        .cyber-input {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 10px 14px;
          color: #ffffff;
          font-size: 13px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cyber-input:focus {
          outline: none;
          border-color: #00ff88;
          box-shadow: 0 0 16px rgba(0, 255, 136, 0.15);
          background: rgba(255, 255, 255, 0.035);
        }
        .neon-text-glow {
          text-shadow: 0 0 12px rgba(0, 255, 136, 0.4);
        }
        .active-tab-glow {
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
        }

        /* ── EXQUISITE UX: HIDE ALL UGLY SCROLLBARS NATIVELY ── */
        ::-webkit-scrollbar {
          display: none !important;
          width: 0px !important;
          background: transparent !important;
        }
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `}</style>
      
      {/* ── STATIC LEFT PANEL NAV (Minimize Enabled) ── */}
      <aside className={`h-full shrink-0 bg-[#080808]/95 border-r border-white/5 p-5 flex flex-col justify-between glass-card md:rounded-none select-none transition-all duration-300 ease-in-out z-20 ${
        sidebarMinimized ? "w-20" : "w-64"
      }`}>
        <div className="flex flex-col h-[88%]">
          {/* Logo Header with Collapse Trigger */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="size-10 shrink-0 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                <Terminal className="size-5 text-[#00ff88]" />
              </div>
              {!sidebarMinimized && (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <h1 className="font-display text-sm tracking-[0.25em] text-white uppercase font-bold">Dodo CMS</h1>
                  <p className="text-[9px] text-[#00ff88] font-mono-fira tracking-widest uppercase mt-0.5">Edge Operations</p>
                </div>
              )}
            </div>

            {/* Collapse toggle icon button */}
            <button 
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
              className="p-1.5 rounded-lg bg-white/[0.02] border border-white/10 hover:border-[#00ff88]/30 hover:bg-[#00ff88]/10 text-muted-foreground hover:text-[#00ff88] transition-all ml-1.5 shrink-0"
              title={sidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <ChevronRight className={`size-3.5 transition-transform duration-300 ${sidebarMinimized ? "" : "rotate-180 text-[#00ff88]"}`} />
            </button>
          </div>
 
          {/* Navigation Links - Standard + Dynamic Custom Sections */}
          <nav className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-width-none">
            {[
              { id: "systemMetadata", title: "System Info", label: "systemMetadata.json", icon: LayoutGrid },
              { id: "professionalLinks", title: "Professional Links", label: "professionalLinks.json", icon: Globe },
              { id: "logo", title: "Brand Logo", label: "logo.json", icon: Globe },
              { id: "BannerDetails", title: "Banner Details", label: "BannerDetails.json", icon: User },
              { id: "experience", title: "Work Experience", label: "experience.json", icon: Briefcase },
              { id: "projects", title: "Core Projects", label: "projects.json", icon: Wrench },
              { id: "researchInsights", title: "Scientific Research", label: "researchInsights.json", icon: BookOpen },
              { id: "successStories", title: "Achievements Log", label: "successStories.json", icon: Trophy },
              { id: "skillsData", title: "Skills Matrix", label: "skillsData.json", icon: Layers },
              { id: "techstack", title: "Tech Stack", label: "techstack.json", icon: Wrench },
              { id: "dodoPromptConfig", title: "Assistant Rules", label: "dodoPromptConfig.json", icon: Terminal },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditMode("visual");
                  }}
                  className={`flex items-start gap-3 py-2 px-3 rounded-lg text-left transition-all duration-300 relative shrink-0 ${
                    sidebarMinimized ? "justify-center px-0 py-3" : ""
                  } ${
                    isActive 
                      ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 active-tab-glow" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                  title={sidebarMinimized ? tab.title : undefined}
                >
                  <Icon className={`size-3.5 shrink-0 ${isActive ? "text-[#00ff88]" : "text-muted-foreground"} mt-0.5`} />
                  {!sidebarMinimized && (
                    <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className={`text-[10px] font-bold tracking-wide uppercase truncate ${isActive ? "text-white" : "text-muted-foreground"}`}>
                        {tab.title}
                      </span>
                      <span className="text-[8px] font-mono-fira text-muted-foreground/50 truncate mt-0.5">
                        {tab.label}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Render Custom Dynamic Sections Registry */}
            {db && Object.keys(db)
              .filter(key => !["systemMetadata", "professionalLinks", "logo", "BannerDetails", "experience", "projects", "researchInsights", "successStories", "skillsData", "techstack", "dodoPromptConfig"].includes(key))
              .map(key => {
                const sec = db[key]?.content;
                if (!sec || !sec.title) return null;
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      setEditMode("visual");
                    }}
                    className={`flex items-start gap-3 py-2 px-3 rounded-lg text-left transition-all duration-300 relative shrink-0 ${
                      sidebarMinimized ? "justify-center px-0 py-3" : ""
                    } ${
                      isActive 
                        ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 active-tab-glow" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                    title={sidebarMinimized ? sec.title : undefined}
                  >
                    <Layers className={`size-3.5 shrink-0 ${isActive ? "text-[#00ff88]" : "text-muted-foreground"} mt-0.5`} />
                    {!sidebarMinimized && (
                      <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className={`text-[10px] font-bold tracking-wide uppercase truncate ${isActive ? "text-white" : "text-muted-foreground"}`}>
                          {sec.title}
                        </span>
                        <span className="text-[8px] font-mono-fira text-[#00ff88]/60 truncate mt-0.5">
                          {sec.type === "list" ? "Dynamic List" : "Single Config"}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}

            {/* Create Custom Section Action Button */}
            {db && (
              <button
                onClick={() => setShowWizard(true)}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg text-left transition-all duration-300 border border-dashed border-white/10 hover:border-[#00ff88]/30 hover:bg-[#00ff88]/5 text-muted-foreground hover:text-[#00ff88] shrink-0 ${
                  sidebarMinimized ? "justify-center px-0 py-3" : ""
                }`}
                title="Create Dynamic Custom Section"
              >
                <Plus className="size-3.5 shrink-0" />
                {!sidebarMinimized && (
                  <span className="text-[9px] font-bold tracking-wider uppercase">
                    New Custom Section
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* System Credentials Status Footer */}
        <div className="pt-4 border-t border-white/5 font-mono-fira text-[9px] text-muted-foreground flex flex-col gap-2 shrink-0">
          {sidebarMinimized ? (
            <div className="flex flex-col items-center gap-3">
              <div className="text-[#00ff88] flex justify-center" title="Core Session Secure">
                <Unlock className="size-3.5 animate-pulse" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all flex items-center justify-center"
                title="Secure Log Out"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>CORE STATUS:</span>
                <span className="text-[#00ff88] flex items-center gap-1 font-bold"><Unlock className="size-3" /> SECURE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>KERNEL REF:</span>
                <span>{db?.systemMetadata?.content?.kernel || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>DATABASE:</span>
                <span>REAL-TIME API</span>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 font-bold uppercase rounded-lg transition-all"
                title="Secure Log Out"
              >
                <LogOut className="size-3" /> Close Session
              </button>
            </div>
          )}
        </div>
      </aside>
 
      {/* ── INDEPENDENTLY SCROLLABLE RIGHT PANEL ── */}
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-12 w-full max-w-[1600px] mx-auto">
        {db && editMode === "visual" && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setEditMode("json")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00ff88]/20 bg-[#00ff88]/5 hover:bg-[#00ff88]/10 hover:border-[#00ff88]/30 text-[#00ff88] text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer"
            >
              <Code2 className="size-3.5" />
              <span>View JSON Source</span>
            </button>
          </div>
        )}

        {editMode === "json" && db ? (
          <JsonEditorPanel
            activeTab={activeTab}
            db={db}
            setDb={setDb}
            saveFile={saveFile}
            publishing={publishing}
            onClose={() => setEditMode("visual")}
          />
        ) : (
          <>
            {/* ── TAB 1: systemMetadata.json ── */}
            {activeTab === "systemMetadata" && (
              <ObjectTabPanel
                fileKey="systemMetadata"
                title="systemMetadata.json"
                description="Configure your personal profile details, user variables, and latency metrics."
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 2: professionalLinks.json ── */}
            {activeTab === "professionalLinks" && (
              <ObjectTabPanel
                fileKey="professionalLinks"
                title="professionalLinks.json"
                description="Manage your professional online profiles, contact parameters, and resume paths."
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 3: logo.json ── */}
            {activeTab === "logo" && (
              <ObjectTabPanel
                fileKey="logo"
                title="logo.json"
                description="Configure the primary system logo and branding URL settings."
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 4: BannerDetails.json ── */}
            {activeTab === "BannerDetails" && (
              <ObjectTabPanel
                fileKey="BannerDetails"
                title="BannerDetails.json"
                description="Manage your primary executive bio, summary statement, and active subtitles."
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 5: experience.json ── */}
            {activeTab === "experience" && (
              <ExperiencePanel
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 6: projects.json ── */}
            {activeTab === "projects" && (
              <ProjectsPanel
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 7: researchInsights.json ── */}
            {activeTab === "researchInsights" && (
              <ResearchInsightsPanel
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 8: successStories.json ── */}
            {activeTab === "successStories" && (
              <SuccessStoriesPanel
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 9: skillsData.json ── */}
            {activeTab === "skillsData" && (
              <SkillsDataPanel
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 10: techstack.json ── */}
            {activeTab === "techstack" && (
              <TechStackPanel
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── TAB 11: dodoPromptConfig.json ── */}
            {activeTab === "dodoPromptConfig" && (
              <DodoPromptConfigPanel
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
              />
            )}

            {/* ── CUSTOM DYNAMIC SECTIONS RENDERING ENGINE ── */}
            {db && !["systemMetadata", "professionalLinks", "logo", "BannerDetails", "experience", "projects", "researchInsights", "successStories", "skillsData", "techstack", "dodoPromptConfig"].includes(activeTab) && (
              <CustomSectionPanel
                activeTab={activeTab}
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
                handleDeleteCustomSection={handleDeleteCustomSection}
              />
            )}

            {/* ── CUSTOM SCHEMA CREATOR WIZARD MODAL ── */}
            {showWizard && db && (
              <CustomSectionWizard
                db={db}
                setDb={setDb}
                onClose={() => setShowWizard(false)}
                setActiveTab={setActiveTab}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

