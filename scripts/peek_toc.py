import pdfplumber

pdf_path = "./briac-le-meillat/public/assets/documents/apprentissage/admin-reseau/Annexe_22_RT_BUT_annee_1_1411365.pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total Pages: {len(pdf.pages)}")
    for i in range(min(5, len(pdf.pages))):
        print(f"--- Page {i+1} ---")
        page = pdf.pages[i]
        print(page.extract_text())
        print("\n")
