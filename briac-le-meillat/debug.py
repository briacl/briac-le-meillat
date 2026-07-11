import re
with open('/Users/blemeill/Development/briac-le-meillat/briac-le-meillat/public/assets/documents/apprentissage/tech-internet/tp2-passerelle_linux.md', 'r') as f:
    content = f.read()

h1_match = re.search(r'\n#\s+(.*?)\n', content)
print("H1 matched:", h1_match is not None)
if h1_match:
    print(h1_match.group(0))

subtitle_exists = "> **" in content and "*Briac Le Meillat*" in content
print("Subtitle exists:", subtitle_exists)

