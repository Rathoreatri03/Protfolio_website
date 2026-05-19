import React, { useState } from "react";
import { RefreshCw, Save, Layers, Settings, Plus, Trash, X } from "lucide-react";
import { DBState, CMSFile } from "./types";
import { CustomListEditor } from "./CustomListEditor";
import { CustomSectionWizard } from "./CustomSectionWizard";
import { renderUrlInput } from "./helpers";
import { toast } from "sonner";

interface CustomSectionPanelProps {
  activeTab: string;
  db: DBState;
  setDb: (db: DBState) => void;
  saveFile: (fileKey: CMSFile) => Promise<void>;
  publishing: string | null;
  handleDeleteCustomSection: (sectionKey: string) => void;
}

export function CustomSectionPanel({
  activeTab,
  db,
  setDb,
  saveFile,
  publishing,
  handleDeleteCustomSection
}: CustomSectionPanelProps) {
  const [showEditSchema, setShowEditSchema] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  
  // Field Creation States
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldType, setNewFieldType] = useState<"string" | "longtext" | "url" | "percentage" | "number" | "boolean">("string");

  const section = db[activeTab]?.content;
  if (!section) return null;

  const handleCustomSectionSave = () => {
    saveFile(activeTab as CMSFile);
  };

  const updateCustomContent = (newContent: any) => {
    setDb({
      ...db,
      [activeTab]: {
        ...db[activeTab],
        content: {
          ...section,
          content: newContent
        }
      }
    });
  };

  const handleAddFieldSubmit = () => {
    if (!newFieldLabel.trim()) {
      toast.error("Please enter a field label.");
      return;
    }
    if (!newFieldKey.trim()) {
      toast.error("Invalid field key generated.");
      return;
    }
    
    const schema = section.schema || [];
    if (schema.some((f: any) => f.key === newFieldKey)) {
      toast.error("A field with this name already exists in this section.");
      return;
    }

    const newField = {
      key: newFieldKey,
      label: newFieldLabel.trim(),
      type: newFieldType
    };

    const newSchema = [...schema, newField];
    
    let updatedContent = section.content;
    if (section.type === "object") {
      const defaultVal = newFieldType === "percentage" || newFieldType === "number" ? 0 : newFieldType === "boolean" ? false : "";
      updatedContent = { ...(section.content || {}), [newFieldKey]: defaultVal };
    }

    setDb({
      ...db,
      [activeTab]: {
        ...db[activeTab],
        content: {
          ...section,
          schema: newSchema,
          content: updatedContent
        }
      }
    });

    setNewFieldLabel("");
    setNewFieldKey("");
    setNewFieldType("string");
    setShowAddFieldModal(false);
    toast.success(`Field "${newFieldLabel}" added to schema!`);
  };

  const handleDeleteField = (fieldKey: string, fieldLabel: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete field "${fieldLabel}"? This will erase its value for all entries.`)) return;

    const newSchema = (section.schema || []).filter((f: any) => f.key !== fieldKey);
    let newContent = section.content;

    if (section.type === "object") {
      newContent = { ...(section.content || {}) };
      delete newContent[fieldKey];
    } else if (section.type === "list") {
      newContent = (section.content || []).map((item: any) => {
        const updatedItem = { ...item };
        delete updatedItem[fieldKey];
        return updatedItem;
      });
    }

    setDb({
      ...db,
      [activeTab]: {
        ...db[activeTab],
        content: {
          ...section,
          schema: newSchema,
          content: newContent
        }
      }
    });

    toast.success(`Removed field "${fieldLabel}" from schema.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">{section.title}</h2>
            <span className="text-[9px] font-mono-fira px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground uppercase bg-white/[0.02]">
              {section.type === "list" ? "Dynamic List" : "Single Config"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Dynamic custom collection saved in systemMetadata.json.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditSchema(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#00ff88]/20 bg-[#00ff88]/5 hover:bg-[#00ff88]/10 text-[#00ff88] text-xs font-bold rounded-lg transition-all uppercase cursor-pointer"
          >
            <Settings className="size-3.5" />
            <span>Configure Layout</span>
          </button>
          <button
            onClick={() => handleDeleteCustomSection(activeTab)}
            className="px-4 py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold rounded-lg transition-all uppercase cursor-pointer"
          >
            Delete Section
          </button>
          <button
            onClick={handleCustomSectionSave}
            disabled={publishing !== null}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] hover:bg-[#00ff88]/90 disabled:bg-[#00ff88]/40 text-[#050505] text-xs font-bold rounded-lg shadow-[0_4px_20px_rgba(0,255,136,0.2)] transition-all uppercase cursor-pointer"
          >
            {publishing === activeTab ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Publish Changes
          </button>
        </div>
      </div>

      {/* If Section Type is Object */}
      {section.type === "object" && (
        <div className="glass-card rounded-2xl p-6 w-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5">
            <div className="flex items-center gap-3">
              <Layers className="size-4 text-[#00ff88]" />
              <h3 className="text-xs font-bold tracking-wider uppercase text-white">Configure Fields</h3>
            </div>
            <button
              onClick={() => setShowAddFieldModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff88]/5 hover:bg-[#00ff88]/10 text-[#00ff88] text-[10px] font-bold uppercase rounded-lg border border-[#00ff88]/20 transition-all cursor-pointer animate-pulse-glow"
            >
              <Plus className="size-3" />
              <span>Add Field</span>
            </button>
          </div>
          
          {(!section.schema || section.schema.length === 0) ? (
            <div className="py-12 text-center text-muted-foreground text-xs font-mono-fira uppercase tracking-wider">
              No fields configured. Click "Add Field" to define data attributes.
            </div>
          ) : (
            <div className="space-y-5">
              {section.schema?.map((field: any) => {
                const val = section.content?.[field.key];
                const handleObjectFieldChange = (newVal: any) => {
                  const updatedContent = { ...(section.content || {}), [field.key]: newVal };
                  updateCustomContent(updatedContent);
                };

                return (
                  <div key={field.key} className="space-y-1.5 p-3.5 bg-white/[0.005] border border-white/5 rounded-2xl relative group">
                    <div className="flex items-center justify-between">
                      <label className="block text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
                        {field.label}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteField(field.key, field.label)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all p-1 rounded hover:bg-white/5 cursor-pointer"
                        title="Delete Field"
                      >
                        <Trash className="size-3.5" />
                      </button>
                    </div>

                    {field.type === "string" && (
                      <input
                        type="text"
                        value={val || ""}
                        onChange={(e) => handleObjectFieldChange(e.target.value)}
                        className="w-full cyber-input font-sans"
                      />
                    )}

                    {field.type === "longtext" && (
                      <textarea
                        rows={5}
                        value={val || ""}
                        onChange={(e) => handleObjectFieldChange(e.target.value)}
                        className="w-full cyber-input font-sans leading-relaxed resize-none"
                      />
                    )}

                    {field.type === "url" && (
                      renderUrlInput(
                        val || "",
                        handleObjectFieldChange,
                        `Enter ${field.label.toLowerCase()}`
                      )
                    )}

                    {field.type === "percentage" && (
                      <div className="space-y-1.5 mt-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono-fira text-[#00ff88]">{val || 0}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={val || 0}
                          onChange={(e) => handleObjectFieldChange(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
                        />
                      </div>
                    )}

                    {field.type === "number" && (
                      <input
                        type="number"
                        value={val !== undefined ? val : 0}
                        onChange={(e) => handleObjectFieldChange(parseFloat(e.target.value) || 0)}
                        className="w-full cyber-input font-mono-fira"
                      />
                    )}

                    {field.type === "boolean" && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono-fira text-muted-foreground uppercase">{val ? "Enabled" : "Disabled"}</span>
                        <button
                          type="button"
                          onClick={() => handleObjectFieldChange(!val)}
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
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* If Section Type is List of Items */}
      {section.type === "list" && (
        <div className="space-y-6">
          {/* Schema Fields Summary for lists */}
          <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 bg-white/[0.01]">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="size-3.5 text-[#00ff88]" />
                Schema Fields Configuration
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(!section.schema || section.schema.length === 0) ? (
                  <span className="text-[9px] font-mono text-muted-foreground/60 italic">No fields defined yet. Click "Add Field" to start.</span>
                ) : (
                  section.schema.map((f: any) => (
                    <span key={f.key} className="text-[9px] font-mono-fira bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-muted-foreground flex items-center gap-1.5 hover:border-red-500/30 group/tag transition-all">
                      <span>{f.label}</span>
                      <span className="opacity-40">({f.type})</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteField(f.key, f.label)}
                        className="text-muted-foreground hover:text-red-400 font-bold ml-0.5 cursor-pointer text-xs"
                        title="Delete Field"
                      >
                        &times;
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setShowAddFieldModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#00ff88]/20 bg-[#00ff88]/5 hover:bg-[#00ff88]/10 text-[#00ff88] text-xs font-bold rounded-lg transition-all uppercase cursor-pointer self-start sm:self-auto"
            >
              <Plus className="size-3.5" />
              <span>Add Field</span>
            </button>
          </div>

          <CustomListEditor
            schema={section.schema || []}
            content={section.content || []}
            onChange={updateCustomContent}
            renderUrlInput={renderUrlInput}
          />
        </div>
      )}

      {/* ── ADD FIELD DIALOG POPUP MODAL ── */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md rounded-3xl border border-[#00ff88]/30 bg-[#080808]/95 overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.15)] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="size-4 text-[#00ff88]" />
                <span className="text-xs font-bold tracking-widest uppercase text-white font-mono-fira">Add Field to Schema</span>
              </div>
              <button
                onClick={() => setShowAddFieldModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Field Label</label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => {
                    setNewFieldLabel(e.target.value);
                    const key = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "");
                    setNewFieldKey(key);
                  }}
                  placeholder="e.g. Subtitle, External Link"
                  className="w-full cyber-input text-xs font-sans text-white font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Input Type</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="w-full cyber-input text-xs font-sans bg-[#050505] border-white/10 text-white cursor-pointer"
                >
                  <option value="string">Plain Text</option>
                  <option value="longtext">Biography / Textarea</option>
                  <option value="url">URL with live preview</option>
                  <option value="percentage">Percentage Slider</option>
                  <option value="number">Numeric Value</option>
                  <option value="boolean">Toggle Switch</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFieldModal(false)}
                className="flex-1 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddFieldSubmit}
                className="flex-1 py-2.5 bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#050505] text-xs font-bold rounded-xl shadow-[0_4px_20px_rgba(0,255,136,0.2)] transition-all uppercase cursor-pointer"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditSchema && (
        <CustomSectionWizard
          db={db}
          setDb={setDb}
          onClose={() => setShowEditSchema(false)}
          setActiveTab={() => {}}
          editSectionKey={activeTab}
        />
      )}
    </div>
  );
}
