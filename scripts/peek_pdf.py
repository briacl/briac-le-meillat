import pdfplumber

pdf_path = "./briac-le-meillat/public/assets/documents/apprentissage/admin-reseau/Annexe_22_RT_BUT_annee_1_1411365.pdf"

with pdfplumber.open(pdf_path) as pdf:
    for i in range(min(5, len(pdf.pages))):
        print(f"--- Page {i+1} ---")
        print(pdf.pages[i].extract_text()[:1000])
        print("\n")
