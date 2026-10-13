# GST NOC Studio - No Objection Certificate Generator for GST Registration

A fast, responsive, and privacy-focused web application designed to generate legally compliant **No Objection Certificates (NOC)** and **Consent Letters** for Goods and Services Tax (GST) registration (Form GST REG-01) under Indian Tax law (CGST Act, 2017).

---

## 🚀 How to Run the Website

You have two simple ways to run and use the website:

### Option 1: Directly Open in Any Browser (Zero Installation)
Simply double-click or open `index.html` in your browser (Google Chrome, Microsoft Edge, Brave, Firefox):
```text
C:\Users\Karan Anand\.gemini\antigravity\scratch\gst-noc-generator\index.html
```

### Option 2: Run with Python Local Web Server
Open PowerShell in this folder and run:
```powershell
python -m http.server 8080
```
Then visit in your browser:
```
http://localhost:8080
```

---

## 🌟 Key Features

1. **4 Tailored Legal Templates**:
   - **Parental / Family Consent**: When property is owned by Father, Mother, Spouse, or Relative (Rent-free commercial use).
   - **Landlord / Third-Party Property Owner**: Commercial or residential leased property.
   - **Director / Partner Owned Property**: Director/Partner offering self-owned property to Company or LLP.
   - **Shared Premises / Co-working**: Shared office or desk space.

2. **Real-time Live A4 Preview**:
   - Updates keystroke-by-keystroke as you fill the form.
   - Realistic Indian legal document typography and structure.

3. **Print & Non-Judicial Stamp Paper Simulator**:
   - **Plain Paper Mode**: Generates clean A4 document with 0 offset.
   - **Stamp Paper Spacing Offset**: Leaves 50mm, 80mm, or 110mm margin at the top so you can feed standard ₹10, ₹50, or ₹100 non-judicial stamp paper directly into your printer!

4. **Multiple Export Formats**:
   - **Print / PDF**: Optimized print stylesheet (`@media print`) for clean vector A4 PDF export.
   - **Export to Word (.doc)**: Directly download an editable Microsoft Word document.
   - **Copy Plain Text**: One-click copy for email or pasting into other editors.

5. **GST Portal Compliance Safeguards**:
   - Clause explicitly linking the **Electricity Bill / Consumer CA Number** to satisfy Rule 8 of CGST Rules, 2017.
   - In-app **GST Portal Checklist & Guidelines Modal** detailing upload sizes (<500 KB) and common reasons for Form GST REG-03 clarification queries.
   - Optional **Solemn Verification** and **Witness** sections.

6. **100% Client-Side Privacy**:
   - No data is sent to any remote server. Your sensitive details (PAN, Aadhaar, Address) stay strictly on your local machine.
   - Auto-saves draft to browser `localStorage` so you never lose progress.

---

## 📋 Checklist for Uploading on GST Portal (Form GST REG-01)

When applying for GST registration under **"Consent"** or **"Rented"** premises:
1. **Signed NOC**: Print this generated NOC, get the property owner's signature in blue ink, and scan it.
2. **Electricity Bill**: Upload a recent electricity bill (not older than 2 months) where the consumer name matches the owner's name.
3. **Owner's ID Proof**: Attach a self-attested copy of the property owner's Aadhaar or PAN card.
4. **File Format & Size**: Keep the combined or single PDF under 500 KB / 1 MB.
