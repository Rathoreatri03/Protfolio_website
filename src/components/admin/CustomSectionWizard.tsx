import React, { useState } from "react";
import { Wrench, X, Layers, LayoutGrid, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { DBState } from "./types";

interface CustomSectionWizardProps {
  db: DBState;
  setDb: (db: DBState) => void;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  editSectionKey?: string;
}

export function CustomSectionWizard({
  db,
  setDb,
  onClose,
  setActiveTab,
  editSectionKey
}: CustomSectionWizardProps) {
  const sectionToEdit = editSectionKey ? db.systemMetadata?.content?.customSections?.[editSectionKey] : null;

  const [wizardName, setWizardName] = useState(sectionToEdit ? sectionToEdit.title : "");
  const [wizardType, setWizardType] = useState<"list" | "object">(sectionToEdit ? sectionToEdit.type : "list");
  const [wizardFields, setWizardFields] = useState<Array<{ key: string; label: string; type: "string" | "longtext" | "url" | "percentage" | "number" | "boolean" }>>(
    sectionToEdit && sectionToEdit.schema ? sectionToEdit.schema : [{ key: "title", label: "Title", type: "string" }]
  );

  const handleGenerateSection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wizardName.trim()) {
      toast.error("Please enter a valid section name.");
      return;
    }
    const sectionKey = editSectionKey || wizardName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    
    if (!editSectionKey) {
      if (["systemMetadata", "professionalLinks", "logo", "BannerDetails", "experience", "projects", "researchInsights", "successStories", "skillsData", "techstack", "dodoPromptConfig"].includes(sectionKey)) {
        toast.error("This name conflicts with a standard portfolio table name.");
        return;
      }

      if (db?.systemMetadata?.content?.customSections?.[sectionKey]) {
        toast.error("A custom section with this name already exists.");
        return;
      }
    }

    const updatedMetadata = { ...db.systemMetadata };
    const custom = { ...(updatedMetadata.content.customSections || {}) };

    if (editSectionKey) {
      const existingSection = custom[editSectionKey];
      let existingContent = existingSection?.content;

      // Migrate content safely if layout type changes
      if (wizardType === "list" && !Array.isArray(existingContent)) {
        existingContent = [];
      } else if (wizardType === "object" && (Array.isArray(existingContent) || typeof existingContent !== "object")) {
        existingContent = {};
      }

      custom[editSectionKey] = {
        ...existingSection,
        title: wizardName.trim(),
        type: wizardType,
        schema: wizardFields,
        content: existingContent
      };
    } else {
      custom[sectionKey] = {
        title: wizardName.trim(),
        type: wizardType,
        schema: wizardFields,
        content: wizardType === "list" ? [] : {}
      };
    }

    updatedMetadata.content.customSections = custom;

    setDb({
      ...db,
      systemMetadata: updatedMetadata
    });

    setActiveTab(sectionKey);
    onClose();
    toast.success(editSectionKey ? `Dynamic section "${wizardName}" schema updated!` : `Dynamic section "${wizardName}" created!`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-xl rounded-3xl border border-[#00ff88]/30 bg-[#080808]/95 overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.15)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Wrench className="size-4 text-[#00ff88]" />
            <span className="text-xs font-bold tracking-widest uppercase text-white font-mono-fira">{editSectionKey ? "Edit Section Schema" : "Custom Section Builder"}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section Title Name */}
          <div className="space-y-1.5">
            <label className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Section Name</label>
            <input
              type="text"
              value={wizardName}
              onChange={(e) => setWizardName(e.target.value)}
              placeholder="e.g. Certifications, Publications"
              className="w-full cyber-input font-sans text-sm font-bold text-white placeholder-white/20"
            />
          </div>

          {/* Structure Type Select */}
          <div className="space-y-1.5">
            <label className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Layout Structure Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setWizardType("list")}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-1.5 ${
                  wizardType === "list"
                    ? "bg-[#00ff88]/5 border-[#00ff88]/20 text-[#00ff88]"
                    : "bg-white/[0.005] border-white/5 text-muted-foreground hover:bg-white/[0.02]"
                }`}
              >
                <Layers className="size-4 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">List of Items</span>
                <span className="text-[8px] leading-normal font-sans opacity-70">A timeline or collection layout (e.g. lists of certificates, coursework, honors).</span>
              </button>
              <button
                type="button"
                onClick={() => setWizardType("object")}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-1.5 ${
                  wizardType === "object"
                    ? "bg-[#00ff88]/5 border-[#00ff88]/20 text-[#00ff88]"
                    : "bg-white/[0.005] border-white/5 text-muted-foreground hover:bg-white/[0.02]"
                }`}
              >
                <LayoutGrid className="size-4 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Single Config Object</span>
                <span className="text-[8px] leading-normal font-sans opacity-70">A single block of key-value configuration items (e.g. specific user variables).</span>
              </button>
            </div>
          </div>

          {/* Field Builder */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Define Fields & Data Types</span>
              <button
                type="button"
                onClick={() => {
                  setWizardFields([...wizardFields, { key: `field_${Date.now()}`, label: "New Field", type: "string" }]);
                }}
                className="flex items-center gap-1 text-[9px] font-bold text-[#00ff88] hover:text-[#00ff88]/80 uppercase tracking-widest cursor-pointer"
              >
                <Plus className="size-3" /> Add Field
              </button>
            </div>

            <div className="space-y-3">
              {wizardFields.map((field, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start p-3 bg-white/[0.005] border border-white/5 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
                  {/* Label Input */}
                  <div className="flex-1 w-full space-y-1">
                    <span className="text-[8px] font-mono text-muted-foreground tracking-widest uppercase">Display Label</span>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const updated = [...wizardFields];
                        const newLabel = e.target.value;
                        const newKey = newLabel.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "");
                        updated[index] = { ...updated[index], label: newLabel, key: newKey };
                        setWizardFields(updated);
                      }}
                      className="w-full cyber-input text-xs font-sans"
                      placeholder="Field Label"
                    />
                  </div>

                  {/* Editor Type Input */}
                  <div className="w-full sm:w-44 space-y-1">
                    <span className="text-[8px] font-mono text-muted-foreground tracking-widest uppercase">Input Type</span>
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const updated = [...wizardFields];
                        updated[index] = { ...updated[index], type: e.target.value as any };
                        setWizardFields(updated);
                      }}
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

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardFields.length <= 1) {
                        toast.error("A section must contain at least one field.");
                        return;
                      }
                      setWizardFields(wizardFields.filter((_, i) => i !== index));
                    }}
                    className="mt-5 p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 border border-white/10 hover:border-red-500/20 transition-all self-end shrink-0 cursor-pointer"
                  >
                    <Trash className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all uppercase cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleGenerateSection(e)}
            className="flex-1 py-3 bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#050505] text-xs font-bold rounded-xl shadow-[0_4px_20px_rgba(0,255,136,0.2)] transition-all uppercase cursor-pointer"
          >
            {editSectionKey ? "Update Schema" : "Generate Section"}
          </button>
        </div>
      </div>
    </div>
  );
}
