import json
import os
from bs4 import BeautifulSoup

def scrape_moodle_manual():
    # Définition des dossiers
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(base_dir, "moodle_page.html")
    output_file = os.path.join(base_dir, "raw_resources.json")
    course_url = "https://moodle.univ-artois.fr/course/view.php?id=105"

    if not os.path.exists(input_file):
        print("\n" + "="*60)
        print("ÉTAPE 1 : RÉCUPÉRATION DE LA PAGE")
        print(f"1. Ouvre cette URL dans ton navigateur : {course_url}")
        print("2. Connecte-toi à Moodle.")
        print("3. Une fois sur la page du cours, fais un clic droit -> 'Enregistrer sous...'")
        print("   (Choisis bien le format 'Page Web, HTML uniquement')")
        print(f"4. Enregistre le fichier sous le nom 'moodle_page.html' dans :\n   {base_dir}")
        print("="*60 + "\n")
        print("Relance le script une fois que le fichier 'moodle_page.html' est présent.")
        return

    print(f"Analyse de {input_file}...")
    
    try:
        with open(input_file, "r", encoding="utf-8") as f:
            html_content = f.read()
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier : {e}")
        return

    soup = BeautifulSoup(html_content, "html.parser")
    resources = []
    
    # On cherche les instances d'activités (la structure peut varier selon le thème Moodle)
    # On essaie plusieurs sélecteurs courants
    items = soup.select(".activity-instance, .activityinstance, .activity-item")
    
    print(f"Analyse de {len(items)} éléments potentiels trouvés...")
    
    for item in items:
        try:
            # On cherche le nom de la ressource
            name_elem = item.select_one(".instancename, .aalink")
            if not name_elem:
                name_elem = item
            
            # On récupère le texte et on nettoie les labels invisibles de Moodle (accessibilité)
            # Souvent Moodle ajoute du texte pour les lecteurs d'écran
            for span in name_elem.find_all("span", class_="accesshide"):
                span.decompose()
                
            text = name_elem.get_text().strip()
            
            # Logique de filtrage : on cherche ce qui commence par R (ex: R201)
            if text.startswith("R"):
                link = item.find("a") if item.name != "a" else item
                url = link.get("href") if link else ""
                
                # Nettoyage supplémentaire des suffixes Moodle courants
                clean_name = text.replace(" Fichier", "").replace(" Dossier", "").replace(" URL", "").strip()
                
                resources.append({
                    "id_moodle": clean_name.split()[0],
                    "nom_complet": clean_name,
                    "url": url
                })
        except Exception as e:
            continue

    # Sauvegarde en JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(resources, f, indent=4, ensure_ascii=False)
    
    print(f"\nExtraction terminée : {len(resources)} ressources trouvées.")
    print(f"Fichier sauvegardé : {output_file}")
    
    # Optionnel : supprimer le fichier HTML après traitement pour rester propre
    # os.remove(input_file)

if __name__ == "__main__":
    scrape_moodle_manual()
