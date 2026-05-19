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
    included_datasets = dodo_config.get("included_datasets", {})

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

    # Standard datasets loaded
    metadata = load_json("systemMetadata.json") or {}
    links = load_json("professionalLinks.json") or {}
    logo = load_json("logo.json") or {}
    banner = load_json("BannerDetails.json") or {}
    experience = load_json("experience.json") or []
    projects = load_json("projects.json") or []
    research = load_json("researchInsights.json") or []
    success_stories = load_json("successStories.json") or []
    skills_data = load_json("skillsData.json") or {}
    techstack = load_json("techstack.json") or []

    processed_keys = set()

    # 1. Add System Metadata (if included)
    if included_datasets.get("systemMetadata", True) and metadata:
        processed_keys.add("systemMetadata")
        prompt_lines.append("#### 🌐 System Parameters & Metadata:")
        prompt_lines.append(f"- **Engineer / Programmer:** {metadata.get('userName', 'Atri Rathore')}")
        prompt_lines.append(f"- **System ID:** {metadata.get('systemID', 'Atri_Rathore')}")
        prompt_lines.append(f"- **Terminal User:** {metadata.get('terminalUser', 'rathoreatri03@lab')}")
        prompt_lines.append(f"- **Kernel Version:** {metadata.get('kernel', 'X-Matrix_64')}")
        prompt_lines.append(f"- **Uptime Rate:** {metadata.get('uptime', '99.99%')}")
        prompt_lines.append(f"- **Operational Latency:** {metadata.get('latency', '12ms')}")
        prompt_lines.append("")

    # 2. Add Professional Links & Contacts (if included)
    if included_datasets.get("professionalLinks", True) and links:
        processed_keys.add("professionalLinks")
        prompt_lines.append("#### 🔗 Official Contact Information & Links:")
        prompt_lines.append("Always provide these EXACT URLs when asked for Atri's contact info, GitHub, LinkedIn, Resume, or Visume. Output them as clean markdown links:")
        if links.get("email"):
            prompt_lines.append(f"- **Email Address:** {links['email']} (mailto:{links['email']})")
        if links.get("github"):
            prompt_lines.append(f"- **GitHub Profile:** [{links['github']}]({links['github']})")
        prompt_lines.append("- **LinkedIn Profile:** [https://www.linkedin.com/in/rathoreatri03/](https://www.linkedin.com/in/rathoreatri03/)")
        if links.get("resume_PDF"):
            prompt_lines.append(f"- **Official Resume (PDF):** [View Atri's Resume]({links['resume_PDF']})")
        if links.get("visume_video"):
            prompt_lines.append(f"- **Video Resume (Visume):** [Watch Atri's Video Resume]({links['visume_video']})")
        prompt_lines.append("")

    # 3. Add Brand Logo URL (if included)
    if included_datasets.get("logo", False) and logo and logo.get("logo_url"):
        processed_keys.add("logo")
        prompt_lines.append("#### 🏷️ Official Brand Logo:")
        prompt_lines.append(f"- **Logo URL:** {logo['logo_url']}")
        prompt_lines.append("")

    # 4. Add User Description & Titles (if included)
    if included_datasets.get("BannerDetails", True) and banner:
        processed_keys.add("BannerDetails")
        prompt_lines.append("#### 👤 Executive Professional Summary:")
        prompt_lines.append(f"Atri serves under these titles: {', '.join(banner.get('titles', []))}.")
        prompt_lines.append(f"**Bio & Overview:** {banner.get('description', '')}")
        prompt_lines.append("")

    # 5. Add Professional Experience (if included)
    if included_datasets.get("experience", True) and experience:
        processed_keys.add("experience")
        prompt_lines.append("#### 💼 Professional Experience & Milestones:")
        for exp in experience:
            prompt_lines.append(f"- **{exp['title']}** ({exp.get('duration', 'N/A')})")
            prompt_lines.append(f"  - *Details:* {exp.get('description', '')}")
            if exp.get("ref"):
                prompt_lines.append(f"  - *System Reference:* `{exp['ref']}`")
            if exp.get("link") and exp["link"].strip():
                prompt_lines.append(f"  - *Associated Document:* [View Document]({exp['link']})")
        prompt_lines.append("")

    # 6. Add Projects (if included)
    if included_datasets.get("projects", True) and projects:
        processed_keys.add("projects")
        prompt_lines.append("#### 🛠️ Core Engineering Projects:")
        for proj in projects:
            prompt_lines.append(f"- **{proj['title']}**")
            prompt_lines.append(f"  - *Description:* {proj.get('description', '')}")
            if proj.get("link") and proj["link"].strip():
                prompt_lines.append(f"  - *Repository Link:* [{proj['link']}]({proj['link']})")
        prompt_lines.append("")

    # 7. Add Research, Book Chapters & Patents (if included)
    if included_datasets.get("researchInsights", True) and research:
        processed_keys.add("researchInsights")
        prompt_lines.append("#### 📚 Scientific Research & Intellectual Property:")
        for item in research:
            prompt_lines.append(f"- **{item['title']}**")
            prompt_lines.append(f"  - *Summary:* {item.get('description', '')}")
            if item.get("link") and item["link"].strip():
                prompt_lines.append(f"  - *Publication Link:* [Taylor & Francis / Publisher link]({item['link']})")
        prompt_lines.append("")

    # 8. Add Success Stories & Hackathon Victories (if included)
    if included_datasets.get("successStories", True) and success_stories:
        processed_keys.add("successStories")
        prompt_lines.append("#### 🏆 Hackathon Victories & Competitive Achievements:")
        for story in success_stories:
            prompt_lines.append(f"- **{story['title']}**")
            prompt_lines.append(f"  - *Achievement:* {story.get('description', '')}")
            if story.get("link") and story["link"].strip():
                prompt_lines.append(f"  - *Reference URL:* [{story['link']}]({story['link']})")
        prompt_lines.append("")

    # 9. Add Skills (if included)
    if included_datasets.get("skillsData", True) and skills_data and "categories" in skills_data:
        processed_keys.add("skillsData")
        prompt_lines.append("#### 📊 Core Knowledge Matrix (Skills & Proficiencies):")
        for cat in skills_data["categories"]:
            prompt_lines.append(f"- **{cat['title']}:**")
            skills_list = [f"{skill['name']} ({skill['progress']}% proficiency)" for skill in cat.get("skills", [])]
            prompt_lines.append(f"  - {', '.join(skills_list)}")
        prompt_lines.append("")

    # 10. Add Tech Stack marquee items (if included)
    if included_datasets.get("techstack", True) and techstack:
        processed_keys.add("techstack")
        prompt_lines.append(f"#### ⚙️ Rapid Deployment Tech Stack: {', '.join(techstack)}")
        prompt_lines.append("")

    # 11. Add dynamic/custom future sections dynamically from json_structure.json!
    for key, registry in json_structure.items():
        if key in processed_keys or key == "dodoPromptConfig" or key == "admin_config/json_structure" or key == "dodo_prompt" or key == "compile_prompt_py":
            continue
            
        # Check if included in the dataset (default to True for custom/new sections)
        if not included_datasets.get(key, True):
            continue
            
        # Load the custom file data
        data = load_json(f"{key}.json")
        if not data:
            continue
            
        title = registry.get("title", key)
        section_type = registry.get("type", "list")
        
        if section_type == "list" and isinstance(data, list):
            prompt_lines.append(f"#### 📋 {title}:")
            for item in data:
                if not isinstance(item, dict):
                    continue
                # Determine bullet header
                item_title = item.get("title") or item.get("name") or next((v for k, v in item.items() if isinstance(v, str) and k != "imgUrl" and k != "link"), "")
                prompt_lines.append(f"- **{item_title}**")
                for k, v in item.items():
                    if k not in ["title", "name"] and v and str(v).strip():
                        # Skip image URLs in chat prompt to avoid bloating tokens
                        if k in ["imgUrl", "image"]:
                            continue
                        prompt_lines.append(f"  - *{k.capitalize()}:* {v}")
            prompt_lines.append("")
            
        elif section_type == "object" and isinstance(data, dict):
            prompt_lines.append(f"#### ℹ️ {title}:")
            for k, v in data.items():
                if v and str(v).strip():
                    if k in ["imgUrl", "image"]:
                        continue
                    prompt_lines.append(f"- **{k.capitalize()}:** {v}")
            prompt_lines.append("")
            
        elif section_type == "tags" and isinstance(data, list):
            prompt_lines.append(f"#### 🏷️ {title}: {', '.join(data)}")
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
