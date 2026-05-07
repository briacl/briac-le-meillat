import pdfplumber

pdf_path = "./briac-le-meillat/public/assets/documents/apprentissage/admin-reseau/Annexe_22_RT_BUT_annee_1_1411365.pdf"

with pdfplumber.open(pdf_path) as pdf:
    for i in range(19, min(40, len(pdf.pages))):
        print(f"--- Page {i+1} ---")
        page = pdf.pages[i]
        print(page.extract_text()[:500]) # Just a bit to identify
        print("\n")
