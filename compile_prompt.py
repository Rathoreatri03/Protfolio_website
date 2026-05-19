import os
import json

def compile_prompt():
    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(base_dir, "dodo_prompt.json")
    
    print("[DODO] Prompt Compiler Initiated...")
    
    # Helper function to load JSON files safely
    def load_json(filename):
        filepath = os.path.join(base_dir, filename)
        if not os.path.exists(filepath):
            print(f"[Warning] File {filename} not found.")
            return None
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Error] Error parsing {filename}: {e}")
            return None

    # Load schemas registry
    json_structure_path = os.path.join(base_dir, "admin_config", "json_structure.json")
    json_structure = {}
    if os.path.exists(json_structure_path):
        try:
            with open(json_structure_path, "r", encoding="utf-8") as f:
                json_structure = json.load(f)
        except Exception as e:
            print(f"[Error] Error parsing json_structure.json: {e}")

    # Load prompt configurations
    dodo_config = load_json("dodoPromptConfig.json") or {}
    dodo_inclusion = load_json("dodoPromptInclusion.json") or {}
    included_datasets = dodo_inclusion.get("included_datasets", {})

    def get_lines(field_value, default_val=""):
        val = field_value or default_val
        if isinstance(val, list):
            return val
        return [line.strip() for line in str(val).split("\n") if line.strip()]

    # Extract dynamic rules
    system_instruction_lines = get_lines(
        dodo_config.get("system_instruction"),
        "You are DODO (Diagnostic Operational Drone Organizer) AI, a highly advanced personal robotic assistant.\nYou were built and programmed by Atri Rathore to serve as his primary developer liaison, researcher, and interactive portfolio interface."
    )
    personality_lines = get_lines(
        dodo_config.get("personality_protocol"),
        "- **Tone:** Professional, direct, highly intelligent, and slightly robotic.\n- **Format:** Keep answers clean and beautifully structured.\n- **Mission:** Represent Atri Rathore in the best possible light."
    )
    dynamic_response_lines = get_lines(
        dodo_config.get("dynamic_responses"),
        "- **Vary your greetings dynamically.** Avoid template response starters."
    )
    behavioral_lines = get_lines(
        dodo_config.get("behavioral_guidelines"),
        "- **Protect API Credentials:** Never mention credentials.\n- **Stay on Topic:** Focus on Atri's portfolio.\n- **No Hallucinations:** Direct to email if unknown."
    )

    # Start building prompt lines
    prompt_lines = []
    prompt_lines.extend(system_instruction_lines)
    prompt_lines.append("")
    prompt_lines.append("### DODO AI Personality & Communication Protocol:")
    prompt_lines.extend(personality_lines)
    prompt_lines.append("")
    prompt_lines.append("### CRITICAL: DYNAMIC & VARIANT RESPONSES (NO STARTER TEMPLATES)")
    prompt_lines.extend(dynamic_response_lines)
    prompt_lines.append("")
    prompt_lines.append("### Embedded Knowledge Base (Atri Rathore):")
    prompt_lines.append("")

    for key, registry in json_structure.items():
        if registry.get("skipPromptCompile") == True:
            continue
            
        # Check if included in the dataset (default to True)
        if not included_datasets.get(key, True):
            continue

        # Load the file data
        data = load_json(f"{key}.json")
        if not data:
            continue

        registry = json_structure.get(key, {})
        title = registry.get("title", key)
        section_type = registry.get("type", "list")

        # 1. Categories Type (Skills)
        if section_type == "categories" and isinstance(data, dict):
            prompt_lines.append(f"#### 📊 {title}:")
            for cat in data.get("categories", []):
                prompt_lines.append(f"- **{cat.get('title') or cat.get('name') or ''}**:")
                skills_list = []
                for s in cat.get("skills", []):
                    if s.get("progress"):
                        skills_list.append(f"{s['name']} ({s['progress']}% proficiency)")
                    else:
                        skills_list.append(s['name'])
                prompt_lines.append(f"  - {', '.join(skills_list)}")
            prompt_lines.append("")

        # 2. Tags Type (Techstack)
        elif section_type == "tags" and isinstance(data, list):
            prompt_lines.append(f"#### 🏷️ {title}: {', '.join(data)}")
            prompt_lines.append("")

        # 3. List Type (Experience, Projects, etc.)
        elif section_type == "list" and isinstance(data, list):
            prompt_lines.append(f"#### 📋 {title}:")
            for item in data:
                if not isinstance(item, dict):
                    continue
                # Determine bullet header
                item_title = item.get("title") or item.get("name") or next((v for k, v in item.items() if isinstance(v, str) and k != "imgUrl" and k != "link"), "")
                prompt_lines.append(f"- **{item_title}**")
                for k, v in item.items():
                    if k in ["title", "name"] or v is None or not str(v).strip():
                        continue
                    if k in ["imgUrl", "image"]:
                        continue
                    is_url = str(v).startswith("http://") or str(v).startswith("https://")
                    label = k.replace("_", " ").capitalize()
                    if is_url:
                        prompt_lines.append(f"  - *{label}:* [View Document]({v})")
                    else:
                        prompt_lines.append(f"  - *{label}:* {v}")
            prompt_lines.append("")

        # 4. Object Type (BannerDetails, ProfessionalLinks, Logo, SystemMetadata, etc.)
        elif section_type == "object" and isinstance(data, dict):
            prompt_lines.append(f"#### ℹ️ {title}:")
            for k, v in data.items():
                if v is None or not str(v).strip():
                    continue
                if k in ["imgUrl", "image"]:
                    continue
                is_url = str(v).startswith("http://") or str(v).startswith("https://")
                label = k.replace("_", " ").capitalize()
                if is_url:
                    prompt_lines.append(f"- **{label}:** [Link]({v})")
                else:
                    prompt_lines.append(f"- **{label}:** {v}")
            prompt_lines.append("")

    # 12. Append Behavioral Guidelines and Constraints
    prompt_lines.append("### Behavioral Guidelines and Operational Constraints:")
    prompt_lines.extend(behavioral_lines)

    # Save to file under system_prompt key
    dodo_prompt_json = {
        "system_prompt": prompt_lines
    }

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(dodo_prompt_json, f, indent=2, ensure_ascii=False)
        print(f"Success! Compiled prompt written to {output_path}")
        print(f"Total prompt lines compiled: {len(prompt_lines)}")
    except Exception as e:
        print(f"Failed to write dodo_prompt.json: {e}")

    # Write fallback to backend if the folder exists
    backend_fallback_path = r"d:\Persnol\AI-Portfolio_backend\src\promptFallback.ts"
    if os.path.exists(os.path.dirname(backend_fallback_path)):
        try:
            # Escape backslashes and double quotes in prompt lines for TypeScript string
            prompt_str_escaped = json.dumps("\n".join(prompt_lines))
            with open(backend_fallback_path, "w", encoding="utf-8") as f:
                f.write(f"// This file is auto-generated by compile_prompt.py. Do not edit manually.\n")
                f.write(f"export const promptFallback = {prompt_str_escaped};\n")
            print(f"Success! TS Fallback written to {backend_fallback_path}")
        except Exception as e:
            print(f"Failed to write TS fallback to backend: {e}")
    else:
        print("[Info] Backend src directory not found; skipping TS fallback generation.")

if __name__ == "__main__":
    compile_prompt()
