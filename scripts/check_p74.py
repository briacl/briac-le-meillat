import pdfplumber

pdf_path = "./briac-le-meillat/public/assets/documents/apprentissage/admin-reseau/Annexe_22_RT_BUT_annee_1_1411365.pdf"

with pdfplumber.open(pdf_path) as pdf:
    # Use 0-based index, so page 74 is index 73
    page = pdf.pages[73]
    print(page.extract_text())
