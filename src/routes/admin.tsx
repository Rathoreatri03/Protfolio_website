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
  Code2,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { NeuralBackground } from "../components/NeuralBackground";
import { CMSFile, DBState } from "../components/admin/types";
import { CustomSectionPanel } from "../components/admin/CustomSectionPanel";
import { CustomSectionWizard } from "../components/admin/CustomSectionWizard";
import { JsonEditorPanel } from "../components/admin/JsonEditorPanel";
import { ConfirmModal } from "../components/admin/ConfirmModal";
import { SecurityGateway } from "../components/admin/SecurityGateway";
import { AdminSidebar } from "../components/admin/AdminSidebar";



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
  const [isReloading, setIsReloading] = useState(false);

  const reloadDatabase = async () => {
    if (!token) {
      toast.error("Access token not available. Please verify session.");
      return;
    }
    setIsReloading(true);
    toast.loading("Reloading dynamic files from GitHub...", { id: "refresh-db" });
    try {
      await loadDatabase(token);
      toast.success("All data files updated to latest remote version!", { id: "refresh-db" });
    } catch (err: any) {
      toast.error(err.message || "Failed to reload databases.", { id: "refresh-db" });
    } finally {
      setIsReloading(false);
    }
  };

  // Custom Schema Wizard States
  const [showWizard, setShowWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideSystemFiles, setHideSystemFiles] = useState(true);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const handleDeleteCustomSection = async (sectionKey: string) => {
    if (!db || !token) return;

    setConfirmModal({
      isOpen: true,
      title: "Delete Section Data",
      message: `Are you sure you want to permanently delete the section "${sectionKey}" and its JSON data schema from GitHub? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setPublishing(sectionKey);
        try {
          // 1. Instantly delete the content and schema files from GitHub
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
            throw new Error(errData.error || `Failed to delete ${sectionKey} from GitHub`);
          }

          // 2. Remove from active DB state in-memory or reset if standard section
          const isStandard = [
            "systemMetadata", "professionalLinks", "logo", "BannerDetails", 
            "experience", "projects", "researchInsights", "successStories", 
            "skillsData", "techstack", "dodoPromptConfig"
          ].includes(sectionKey);

          const updatedDb = { ...db };
          if (isStandard) {
            updatedDb[sectionKey] = {
              content: sectionKey === "experience" || sectionKey === "projects" || sectionKey === "researchInsights" || sectionKey === "successStories" || sectionKey === "techstack"
                ? []
                : sectionKey === "skillsData"
                  ? { categories: [] }
                  : sectionKey === "dodoPromptConfig"
                    ? {
                        system_instruction: "",
                        personality_protocol: "",
                        behavioral_guidelines: "",
                        atris_information: ""
                      }
                    : {},
              sha: "",
              schema: db[sectionKey]?.schema || [],
              type: db[sectionKey]?.type || "object",
              title: db[sectionKey]?.title || sectionKey
            };
          } else {
            delete updatedDb[sectionKey];
            if (activeTab === sectionKey) {
              const remainingKeys = Object.keys(updatedDb);
              setActiveTab(remainingKeys[0] || "");
            }
          }
          setDb(updatedDb);

          // 3. Rebuild and save updated admin_config/json_structure
          const jsonStructure: Record<string, any> = {};
          for (const key of Object.keys(updatedDb)) {
            if (key !== "admin_config/json_structure" && key !== "dodo_prompt") {
              jsonStructure[key] = {
                title: updatedDb[key].title || key,
                type: updatedDb[key].type || "list",
                schema: updatedDb[key].schema || []
              };
            }
          }
          await fetch(`${WORKER_BASE}/api/cms/save`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              filename: "admin_config/json_structure",
              content: jsonStructure
            })
          });

          toast.success(`Successfully deleted "${sectionKey}" from GitHub!`);
        } catch (err: any) {
          toast.error(err.message);
        } finally {
          setPublishing(null);
        }
      }
    });
  };

  const [publishing, setPublishing] = useState<string | null>(null);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  // ── 100% PRODUCTION EDGE MODE: Always fetch dynamically from live Cloudflare & GitHub! ──
  const WORKER_BASE = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8787"
    : "https://dodo-ai-agent.dodoai.workers.dev";

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

      // Unwrap any potential legacy wrapped values cleanly
      for (const key of Object.keys(loadedDb)) {
        if (loadedDb[key]?.content && typeof loadedDb[key].content === "object" && "schema" in loadedDb[key].content && "content" in loadedDb[key].content) {
          loadedDb[key].content = (loadedDb[key].content as any).content;
        }
      }

      // Ensure all standard keys exist. If they are missing (deleted or not on GitHub), populate with default empty structures.
      const standardKeys = [
        "systemMetadata", "professionalLinks", "logo", "BannerDetails", 
        "experience", "projects", "researchInsights", "successStories", 
        "skillsData", "techstack", "dodoPromptConfig"
      ];
      const registry = loadedDb["admin_config/json_structure"]?.content || {};
      for (const key of standardKeys) {
        if (!loadedDb[key]) {
          const regInfo = registry[key] || {};
          loadedDb[key] = {
            content: key === "experience" || key === "projects" || key === "researchInsights" || key === "successStories" || key === "techstack"
              ? []
              : key === "skillsData"
                ? { categories: [] }
                : key === "dodoPromptConfig"
                  ? {
                      system_instruction: "",
                      personality_protocol: "",
                      behavioral_guidelines: "",
                      atris_information: ""
                    }
                  : {},
            sha: "",
            schema: regInfo.schema || [],
            type: regInfo.type || "object",
            title: regInfo.title || key
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
      // 1. Save the content file (clean content only)
      const contentToSave = db[fileKey].content;
      const resSection = await fetch(`${WORKER_BASE}/api/cms/save`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: fileKey,
          content: contentToSave
        })
      });

      if (!resSection.ok) {
        const errData = await resSection.json();
        throw new Error(errData.error || `Failed to save ${fileKey}.json`);
      }

      // 2. Rebuild and save the unified admin_config/json_structure config
      const jsonStructure: Record<string, any> = {};
      for (const key of Object.keys(db)) {
        if (key !== "admin_config/json_structure" && key !== "dodo_prompt") {
          jsonStructure[key] = {
            title: db[key].title || key,
            type: db[key].type || "list",
            schema: db[key].schema || []
          };
        }
      }

      const resSchema = await fetch(`${WORKER_BASE}/api/cms/save`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          filename: "admin_config/json_structure",
          content: jsonStructure
        })
      });

      if (!resSchema.ok) {
        const errData = await resSchema.json();
        throw new Error(errData.error || "Failed to update admin_config/json_structure.json");
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
      <SecurityGateway
        inputKey={inputKey}
        setInputKey={setInputKey}
        isSubmittingKey={isSubmittingKey}
        keyError={keyError}
        handleLoginSubmit={handleLoginSubmit}
      />
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
      
      {/* ── STATIC LEFT PANEL NAV ── */}
      <AdminSidebar
        db={db}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setEditMode={setEditMode}
        setShowWizard={setShowWizard}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
        hideSystemFiles={hideSystemFiles}
        setHideSystemFiles={setHideSystemFiles}
        handleLogout={handleLogout}
      />
 
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

        {db && db[activeTab]?.isSystemFile ? (
          <JsonEditorPanel
            activeTab={activeTab}
            db={db}
            setDb={setDb}
            saveFile={saveFile}
            publishing={publishing}
            onClose={() => {}}
            onRefresh={reloadDatabase}
            isRefreshing={isReloading}
          />
        ) : editMode === "json" && db ? (
          <JsonEditorPanel
            activeTab={activeTab}
            db={db}
            setDb={setDb}
            saveFile={saveFile}
            publishing={publishing}
            onClose={() => setEditMode("visual")}
            onRefresh={reloadDatabase}
            isRefreshing={isReloading}
          />
        ) : (
          <>
            {/* ── UNIFIED SCHEMA/CONTENT SECTION PANEL (Covers standard dynamic lists, objects, tag clouds, matrices, & custom sections!) ── */}
            {db && (
              <CustomSectionPanel
                activeTab={activeTab}
                db={db}
                setDb={setDb}
                saveFile={saveFile}
                publishing={publishing}
                handleDeleteCustomSection={handleDeleteCustomSection}
                token={token}
                onRefresh={reloadDatabase}
                isRefreshing={isReloading}
              />
            )}

            {/* ── CUSTOM SCHEMA CREATOR WIZARD MODAL ── */}
            {showWizard && db && (
              <CustomSectionWizard
                db={db}
                setDb={setDb}
                onClose={() => setShowWizard(false)}
                setActiveTab={setActiveTab}
                token={token}
              />
            )}
          </>
        )}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        />
      </main>
    </div>
  );
}

