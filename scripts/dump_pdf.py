import pdfplumber

pdf_path = "./briac-le-meillat/public/assets/documents/apprentissage/admin-reseau/Annexe_22_RT_BUT_annee_1_1411365.pdf"
output_text = "pdf_dump.txt"

with pdfplumber.open(pdf_path) as pdf:
    with open(output_text, "w", encoding="utf-8") as f:
        for page in pdf.pages:
            f.write(page.extract_text() or "")
            f.write("\n--- PAGE BREAK ---\n")
