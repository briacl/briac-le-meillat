import os, json, re

appr_dir = "/home/briacl/Development/briac-le-meillat/briac-le-meillat/public/assets/documents/apprentissage"
files_to_fix = []

def parse_frontmatter(content):
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)", content, re.DOTALL)
    if match:
        fm_text = match.group(1)
        body = match.group(2)
        fm = {}
        for line in fm_text.split("\n"):
            line = line.strip()
            if not line or ":" not in line: continue
            if "ac_lies:" in line:
                val = line.split(":", 1)[1].strip()
                try: fm["ac_lies"] = json.loads(val)
                except: fm["ac_lies"] = []
                continue
            if "techs:" in line:
                val = line.split(":", 1)[1].strip()
                try: fm["techs"] = json.loads(val)
                except: fm["techs"] = []
                continue
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip("\"").strip("\'")
        return fm, body
    return {}, content

for root, _, files in os.walk(appr_dir):
    if "NetworkBriac" in root or "sae" in root or "bordel" in root: continue
    for f in files:
        if not f.endswith(".md"): continue
        if "bible" in f.lower() or f == "reseau_vulga.md" or f == "projets_cv.md": continue
        
        p = os.path.join(root, f)
        with open(p, "r", encoding="utf-8") as fh: c = fh.read()
        fm, body = parse_frontmatter(c)
        
        needs_fix = False
        if not fm: needs_fix = True
        elif not fm.get("ac_lies"): needs_fix = True
        elif not fm.get("techs"): needs_fix = True
        elif "dev-web" in p and fm.get("competence") not in ["Programmer", "Sécuriser"]: needs_fix = True
        elif "R106" in p and fm.get("competence") != "Programmer": needs_fix = True
        
        if needs_fix:
            rel = os.path.relpath(p, appr_dir)
            files_to_fix.append({
                "path": rel,
                "current_fm": fm,
                "content_preview": body[:500]
            })

with open("/home/briacl/Development/briac-le-meillat/files_to_fix.json", "w") as f:
    json.dump(files_to_fix, f, indent=2)

print(f"Found {len(files_to_fix)} files that need intelligent mapping.")
