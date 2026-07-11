import json
import os

registry_path = "public/data/registry.json"
with open(registry_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Auto-map some extra images if they match paths
extra_mappings = {
    "networkbriac-visu.png": "assets/documents/apprentissage/NetworkBriac/NetworkBriac.md",
    "sae13-visu.png": "assets/documents/apprentissage/tech-internet/ccna-srwe/networkbriac-project-ccna-srwe.md", # guessing
}
# Actually I'll just map networkbriac for now
for proof in data["proofs"]:
    if proof["path"] == "assets/documents/apprentissage/NetworkBriac/NetworkBriac.md":
        proof["image"] = "assets/projects/networkbriac-visu.png"

with open(registry_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Now iterate and update Markdown files
for proof in data["proofs"]:
    if "image" in proof and proof["image"]:
        md_path = os.path.join("public", proof["path"])
        if os.path.exists(md_path):
            with open(md_path, "r", encoding="utf-8") as md_f:
                content = md_f.read()
            
            # Check if frontmatter exists and image is not in it
            if content.startswith("---"):
                end_idx = content.find("---", 3)
                if end_idx != -1:
                    frontmatter = content[3:end_idx]
                    if "image:" not in frontmatter:
                        image_line = f'image: "/{proof["image"]}"\n'
                        new_content = "---\n" + frontmatter.strip() + "\n" + image_line + content[end_idx:]
                        with open(md_path, "w", encoding="utf-8") as md_f:
                            md_f.write(new_content)
                        print(f"Updated {md_path}")
