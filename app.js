/**
 * GST NOC Studio - Interactive Generator Script
 * Handles real-time document preview, templates, print layout, Word export & sample data.
 */

// Initialize Lucide Icons
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// State & Form Elements
const formFields = [
  'owner_name',
  'owner_father',
  'relationship_type',
  'owner_id_type',
  'owner_id_num',
  'owner_address',
  'business_name',
  'applicant_name',
  'applicant_designation',
  'business_constitution',
  'applicant_father',
  'business_activity',
  'property_number',
  'property_building',
  'property_locality',
  'property_city',
  'property_state',
  'property_pincode',
  'electricity_meter_no',
  'electricity_board',
  'rent_nature',
  'premises_use',
  'execution_date',
  'execution_place',
  'stamp_offset',
  'toggle_witnesses',
  'toggle_verification'
];

// Sample Data Set
const sampleData = {
  noc_template: 'family',
  owner_name: 'Ramesh Kumar Sharma',
  owner_father: 'Late Shri Om Prakash Sharma',
  relationship_type: 'Father',
  owner_id_type: 'Aadhaar Card',
  owner_id_num: 'XXXX-XXXX-8921',
  owner_address: 'House No. 142, Sector 15, Part-1, Gurugram, Haryana - 122001',
  business_name: 'M/s Apex Digital Innovations',
  applicant_name: 'Vikas Sharma',
  applicant_designation: 'Proprietor',
  business_constitution: 'Sole Proprietorship',
  applicant_father: 'Ramesh Kumar Sharma',
  business_activity: 'IT Consulting, Web Development & Digital Marketing Services',
  property_number: 'Office Space No. 304, 3rd Floor',
  property_building: 'Vipul Business Park',
  property_locality: 'Sohna Road, Sector 48',
  property_city: 'Gurugram',
  property_state: 'Haryana',
  property_pincode: '122018',
  electricity_meter_no: 'DHBVN-9482019482',
  electricity_board: 'DHBVN (Dakshin Haryana Bijli Vitran Nigam)',
  rent_nature: 'free',
  premises_use: 'Principal Place of Business',
  execution_date: new Date().toISOString().split('T')[0],
  execution_place: 'Gurugram',
  stamp_offset: '0',
  toggle_witnesses: true,
  toggle_verification: true
};

// Format Date nicely
function formatDate(dateString) {
  if (!dateString) return '___________';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      const day = date.getDate();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      // Suffix
      let suffix = 'th';
      if (day === 1 || day === 21 || day === 31) suffix = 'st';
      else if (day === 2 || day === 22) suffix = 'nd';
      else if (day === 3 || day === 23) suffix = 'rd';

      return `${day}${suffix} day of ${month}, ${year}`;
    }
  } catch (e) {
    return dateString;
  }
  return dateString;
}

// Show Toast
function showToast(message = 'Copied to clipboard!') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast) return;
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Get current form values
function getFormValues() {
  const values = {};
  
  // Template radio
  const checkedRadio = document.querySelector('input[name="noc_template"]:checked');
  values.noc_template = checkedRadio ? checkedRadio.value : 'family';

  // Text inputs & selects
  formFields.forEach(field => {
    const el = document.getElementById(field);
    if (!el) return;
    if (el.type === 'checkbox') {
      values[field] = el.checked;
    } else {
      values[field] = el.value.trim();
    }
  });

  return values;
}

// Save to localStorage
function saveToStorage() {
  try {
    const values = getFormValues();
    localStorage.setItem('gst_noc_data', JSON.stringify(values));
  } catch (e) {
    console.warn('Storage save failed', e);
  }
}

// Restore from localStorage
function loadFromStorage() {
  try {
    const saved = localStorage.getItem('gst_noc_data');
    if (saved) {
      const data = JSON.parse(saved);
      populateForm(data);
      return true;
    }
  } catch (e) {
    console.warn('Storage load failed', e);
  }
  return false;
}

// Populate Form
function populateForm(data) {
  // Radio
  if (data.noc_template) {
    const radio = document.querySelector(`input[name="noc_template"][value="${data.noc_template}"]`);
    if (radio) radio.checked = true;
  }

  // Inputs
  formFields.forEach(field => {
    const el = document.getElementById(field);
    if (!el) return;
    if (data[field] !== undefined) {
      if (el.type === 'checkbox') {
        el.checked = !!data[field];
      } else {
        el.value = data[field];
      }
    }
  });

  updatePreview();
}

// Helper to wrap value or placeholder
function val(text, placeholder) {
  if (text && text.trim().length > 0) {
    return `<span class="doc-fill">${escapeHtml(text)}</span>`;
  }
  return `<span class="text-slate-400 italic font-mono">[${placeholder}]</span>`;
}

// Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate the Document HTML
function renderDocument(data) {
  // Offset setup
  const offsetMm = parseInt(data.stamp_offset || '0', 10);
  const spacer = document.getElementById('stamp-spacer');
  if (spacer) {
    if (offsetMm > 0) {
      spacer.style.height = `${offsetMm * 3.78}px`; // approximate mm to px conversion
      spacer.classList.remove('hidden');
    } else {
      spacer.style.height = '0px';
      spacer.classList.add('hidden');
    }
  }

  // Construct Full Premises Address
  const addressParts = [];
  if (data.property_number) addressParts.push(data.property_number);
  if (data.property_building) addressParts.push(data.property_building);
  if (data.property_locality) addressParts.push(data.property_locality);
  if (data.property_city) addressParts.push(data.property_city);
  if (data.property_state) addressParts.push(data.property_state);
  if (data.property_pincode) addressParts.push(`PIN: ${data.property_pincode}`);
  
  const fullPremisesAddress = addressParts.length > 0 
    ? addressParts.join(', ')
    : '';

  // Determine Title & Subtitle based on Template
  let docTitle = 'NO OBJECTION CERTIFICATE';
  let docSubtitle = 'FOR GOODS AND SERVICES TAX (GST) REGISTRATION';
  
  if (data.noc_template === 'family') {
    docTitle = 'CONSENT LETTER / NO OBJECTION CERTIFICATE';
    docSubtitle = '(UNDER PARENTAL / FAMILY CONSENT FOR GST REGISTRATION)';
  } else if (data.noc_template === 'landlord') {
    docTitle = 'NO OBJECTION CERTIFICATE';
    docSubtitle = '(ISSUED BY PROPERTY OWNER / LANDLORD FOR GST REGISTRATION)';
  } else if (data.noc_template === 'director') {
    docTitle = 'NO OBJECTION CERTIFICATE & CONSENT LETTER';
    docSubtitle = '(FROM DIRECTOR / PARTNER FOR USE OF OWNED PREMISES)';
  } else if (data.noc_template === 'shared') {
    docTitle = 'NO OBJECTION CERTIFICATE FOR SHARED PREMISES';
    docSubtitle = '(FOR REGISTRATION UNDER GOODS AND SERVICES TAX)';
  }

  // Salutation Header
  const salutation = `
    <div class="text-center mb-8 border-b-2 border-slate-900 pb-4">
      <h2 class="text-xl sm:text-2xl font-bold uppercase tracking-wide legal-heading text-slate-950">${docTitle}</h2>
      <p class="text-xs sm:text-sm font-semibold text-slate-700 tracking-wider mt-1">${docSubtitle}</p>
      <div class="mt-4 text-xs font-serif font-semibold text-slate-800">
        TO WHOMSOEVER IT MAY CONCERN / BEFORE THE PROPER OFFICER OF GST
      </div>
    </div>
  `;

  // Owner Declaration Header
  let idPhrase = '';
  if (data.owner_id_type && data.owner_id_type !== 'None' && data.owner_id_num) {
    idPhrase = `, holding ${val(data.owner_id_type, "ID Type")} No: ${val(data.owner_id_num, "ID Number")}`;
  }

  const ownerDeclaration = `
    <p class="mb-4 text-justify">
      I, ${val(data.owner_name, "Owner Full Name")}, 
      Son/Daughter/Wife of ${val(data.owner_father, "Owner's Father/Husband Name")}, 
      residing at ${val(data.owner_address, "Owner's Full Residential Address")}${idPhrase}, 
      do hereby solemnly affirm, declare, and state as under:
    </p>
  `;

  // Clause 1: Absolute Ownership
  const meterPhrase = data.electricity_meter_no 
    ? ` having Electricity Meter / CA / Consumer No: ${val(data.electricity_meter_no, "Meter/CA Number")}${data.electricity_board ? ` issued by ${val(data.electricity_board, "Electricity Board")}` : ''}`
    : '';

  const clause1 = `
    <p class="mb-3 text-justify">
      <strong>1. That I am the absolute lawful owner</strong> and in peaceful, legal possession of the commercial / residential premises situated at:
      <br/>
      <span class="block my-2 pl-4 py-1.5 border-l-2 border-slate-400 font-semibold text-slate-900 bg-slate-50/75 rounded-r">
        ${fullPremisesAddress ? escapeHtml(fullPremisesAddress) : '<span class="text-slate-400 italic">[Complete Property Address: Shop/Flat No, Building, Locality, City, State - PIN]</span>'}${meterPhrase ? '<br/><span class="text-xs font-normal text-slate-700">' + meterPhrase + '</span>' : ''}
      </span>
      hereinafter referred to as the <em>"Said Premises"</em>.
    </p>
  `;

  // Clause 2: Applicant & Relationship
  let relationshipStatement = '';
  if (data.noc_template === 'family') {
    relationshipStatement = `That ${val(data.applicant_name, "Applicant Name")} is my ${val(data.relationship_type, "Relationship (e.g. Son/Daughter)")}, and is the ${val(data.applicant_designation, "Designation")} of the ${val(data.business_constitution, "Constitution")} having trade name <strong>${val(data.business_name, "Business Trade Name")}</strong>.`;
  } else if (data.noc_template === 'director') {
    relationshipStatement = `That I am a ${val(data.applicant_designation, "Director/Partner")} in <strong>${val(data.business_name, "Company/Firm Name")}</strong> (${val(data.business_constitution, "Constitution")}), and ${val(data.applicant_name, "Applicant Name")} is authorized on behalf of the company/firm to manage operations and obtain regulatory compliances.`;
  } else {
    relationshipStatement = `That ${val(data.applicant_name, "Applicant Name")}, in the capacity of ${val(data.applicant_designation, "Designation")} of <strong>${val(data.business_name, "Business Trade Name")}</strong> (${val(data.business_constitution, "Constitution")}), has approached me seeking permission to establish their business operations at the Said Premises.`;
  }

  const clause2 = `
    <p class="mb-3 text-justify">
      <strong>2. Purpose & Relationship:</strong> ${relationshipStatement}
    </p>
  `;

  // Clause 3: Grant of No Objection for GST Registration
  const businessActivityPhrase = data.business_activity 
    ? ` for carrying out business activities pertaining to ${val(data.business_activity, "Nature of Business Activities")}`
    : '';

  const clause3 = `
    <p class="mb-3 text-justify">
      <strong>3. Grant of No Objection:</strong> That I have <strong>no objection whatsoever</strong> to <strong>${val(data.business_name, "Business Trade Name")}</strong> and its ${val(data.applicant_designation, "Designation")}, ${val(data.applicant_name, "Applicant Name")}, using and occupying the Said Premises as their <strong>${val(data.premises_use, "Principal Place of Business")}</strong>${businessActivityPhrase}, and applying for and obtaining <strong>Goods and Services Tax (GST) Registration</strong> from the Central / State GST Authorities under the provisions of the Central Goods and Services Tax Act, 2017 (CGST Act) and relevant State GST Acts.
    </p>
  `;

  // Clause 4: Commercial & Rent Terms
  let rentClauseText = '';
  if (data.rent_nature === 'free') {
    rentClauseText = `<strong>4. Rent-Free Consent Arrangement:</strong> That the use and occupation of the Said Premises is granted purely on a <strong>rent-free consent basis</strong>, out of mutual love, affection, and understanding, without demanding or charging any rental consideration, security deposit, lease compensation, or conferring any tenancy or title rights in the property to the business.`;
  } else if (data.rent_nature === 'nominal') {
    rentClauseText = `<strong>4. Commercial Terms:</strong> That the Said Premises is provided under mutual consensus and understanding between the parties, and the occupancy is permissible for the conduct of lawful business operations without creating any mortgage or lien over the property.`;
  } else {
    rentClauseText = `<strong>4. Tenancy & Occupancy Terms:</strong> That the Said Premises has been let out / leased to the applicant under mutually agreed terms, and as the lawful owner, I fully confirm my consent for issuance of GST registration on the premises.`;
  }

  const clause4 = `<p class="mb-3 text-justify">${rentClauseText}</p>`;

  // Clause 5: Authority to submit utility bill
  const clause5 = `
    <p class="mb-3 text-justify">
      <strong>5. Submission of Address Proof:</strong> That I expressly authorize and consent to the applicant submitting a copy of the <strong>Electricity Bill / Property Tax Receipt / Municipal Khata</strong> standing in my name${data.electricity_meter_no ? ` (Consumer / Meter No: ${val(data.electricity_meter_no, "Meter No")})` : ''} before the Goods and Services Tax Department as valid and authentic proof of principal place of business in support of Form GST REG-01.
    </p>
  `;

  // Clause 6: Non-revocation undertaking
  const clause6 = `
    <p class="mb-4 text-justify">
      <strong>6. Undertaking:</strong> That I undertake not to revoke this consent arbitrarily without providing reasonable prior written intimation to the concerned GST Tax Authorities and the applicant.
    </p>
  `;

  // Date and Place Execution Line
  const executionSection = `
    <div class="mt-8 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs sm:text-sm">
      <div>
        <p><strong>Date:</strong> ${formatDate(data.execution_date)}</p>
        <p class="mt-1"><strong>Place:</strong> ${val(data.execution_place, "Place / City")}</p>
      </div>

      <div class="text-right flex flex-col items-end">
        <div class="h-14 w-40 border-b border-dashed border-slate-400 flex items-end justify-center pb-1 text-slate-400 text-xs italic">
          (Signature of Owner)
        </div>
        <p class="mt-2 font-bold text-slate-900">${val(data.owner_name, "Owner Full Name")}</p>
        <p class="text-xs text-slate-600">Property Owner / Consenting Party</p>
        <p class="text-xs text-slate-500 font-mono mt-0.5">${data.owner_id_num ? escapeHtml(data.owner_id_type + ': ' + data.owner_id_num) : ''}</p>
      </div>
    </div>
  `;

  // Optional Solemn Verification
  let verificationSection = '';
  if (data.toggle_verification) {
    verificationSection = `
      <div class="mt-8 pt-4 border-t border-slate-300 text-xs text-slate-700">
        <h3 class="font-bold uppercase tracking-wider text-slate-900 mb-1 text-center">VERIFICATION</h3>
        <p class="text-justify leading-relaxed">
          Verified at ${val(data.execution_place, "City")} on this ${formatDate(data.execution_date)}, that the contents of paragraphs 1 to 6 of this No Objection Certificate are true and correct to the best of my personal knowledge and belief. Nothing material has been concealed, misrepresented, or falsely stated herein.
        </p>
        <div class="mt-6 flex justify-end">
          <div class="text-right">
            <div class="h-10 w-36 border-b border-dashed border-slate-400"></div>
            <p class="text-xs font-bold text-slate-900 mt-1">DEPONENT</p>
          </div>
        </div>
      </div>
    `;
  }

  // Optional Witnesses
  let witnessSection = '';
  if (data.toggle_witnesses) {
    witnessSection = `
      <div class="mt-8 pt-4 border-t border-slate-200">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">IN THE PRESENCE OF WITNESSES:</h4>
        <div class="grid grid-cols-2 gap-8 text-xs text-slate-700">
          <div class="space-y-1">
            <p class="font-semibold text-slate-900">1. Witness One:</p>
            <p>Signature: __________________________</p>
            <p>Name: _____________________________</p>
            <p>Address: __________________________</p>
          </div>

          <div class="space-y-1">
            <p class="font-semibold text-slate-900">2. Witness Two:</p>
            <p>Signature: __________________________</p>
            <p>Name: _____________________________</p>
            <p>Address: __________________________</p>
          </div>
        </div>
      </div>
    `;
  }

  return `
    ${salutation}
    ${ownerDeclaration}
    ${clause1}
    ${clause2}
    ${clause3}
    ${clause4}
    ${clause5}
    ${clause6}
    ${executionSection}
    ${verificationSection}
    ${witnessSection}
  `;
}

// Update the live preview
function updatePreview() {
  const data = getFormValues();
  const container = document.getElementById('document-content');
  if (container) {
    container.innerHTML = renderDocument(data);
  }
  saveToStorage();
}

// Export as Microsoft Word (.doc)
function exportWord() {
  const data = getFormValues();
  const content = renderDocument(data);
  const tradeName = data.business_name || 'GST_Business';
  const cleanFilename = `GST_NOC_${tradeName.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>GST No Objection Certificate</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #000; }
        h2 { text-align: center; font-size: 16pt; margin-bottom: 2pt; font-weight: bold; }
        p { text-align: justify; margin-bottom: 8pt; }
        .doc-fill { font-weight: bold; text-decoration: underline; }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = cleanFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Downloaded Word (.doc) file successfully!');
}

// Copy Text to Clipboard
function copyText() {
  const container = document.getElementById('document-content');
  if (!container) return;

  // Clean plain text representation
  const plainText = container.innerText;
  navigator.clipboard.writeText(plainText).then(() => {
    showToast('NOC content copied to clipboard!');
  }).catch(err => {
    console.error('Copy failed', err);
    showToast('Failed to copy. Please select and copy manually.');
  });
}

// Trigger Print
function printDocument() {
  window.print();
}

// Reset Form
function resetForm() {
  if (confirm('Are you sure you want to clear all form fields?')) {
    localStorage.removeItem('gst_noc_data');
    formFields.forEach(field => {
      const el = document.getElementById(field);
      if (!el) return;
      if (el.type === 'checkbox') {
        el.checked = true;
      } else {
        el.value = '';
      }
    });

    const defaultRadio = document.querySelector('input[name="noc_template"][value="family"]');
    if (defaultRadio) defaultRadio.checked = true;

    // Set today's date
    const dateEl = document.getElementById('execution_date');
    if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];

    updatePreview();
    showToast('Form has been cleared.');
  }
}

// Load Sample Data
function loadSample() {
  populateForm(sampleData);
  showToast('Loaded realistic sample data!');
}

// Event Listeners setup
function setupEventListeners() {
  // Input changes
  formFields.forEach(field => {
    const el = document.getElementById(field);
    if (!el) return;
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
  });

  // Radios
  const radios = document.querySelectorAll('input[name="noc_template"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      // Adjust relationship dropdown default smartly based on template
      const relSelect = document.getElementById('relationship_type');
      if (relSelect) {
        if (radio.value === 'family') relSelect.value = 'Father';
        else if (radio.value === 'landlord') relSelect.value = 'Landlord / Property Owner';
        else if (radio.value === 'director') relSelect.value = 'Director of the Company';
        else if (radio.value === 'shared') relSelect.value = 'Landlord / Property Owner';
      }
      updatePreview();
    });
  });

  // Buttons
  const btnSample = document.getElementById('btn-sample');
  if (btnSample) btnSample.addEventListener('click', loadSample);

  const btnClear = document.getElementById('btn-clear');
  if (btnClear) btnClear.addEventListener('click', resetForm);

  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) btnCopy.addEventListener('click', copyText);

  const btnWord = document.getElementById('btn-word');
  if (btnWord) btnWord.addEventListener('click', exportWord);

  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) btnPrint.addEventListener('click', printDocument);

  const btnPrintTop = document.getElementById('btn-print-top');
  if (btnPrintTop) btnPrintTop.addEventListener('click', printDocument);

  // Modal handlers
  const modal = document.getElementById('guidelines-modal');
  const btnOpenModal = document.getElementById('btn-guidelines');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCloseModalBottom = document.getElementById('btn-close-modal-bottom');

  if (btnOpenModal && modal) {
    btnOpenModal.addEventListener('click', () => modal.classList.remove('hidden'));
  }
  if (btnCloseModal && modal) {
    btnCloseModal.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (btnCloseModalBottom && modal) {
    btnCloseModalBottom.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  setupEventListeners();

  // Set default execution date if empty
  const dateEl = document.getElementById('execution_date');
  if (dateEl && !dateEl.value) {
    dateEl.value = new Date().toISOString().split('T')[0];
  }

  // Check saved or prefill sample
  const hasLoaded = loadFromStorage();
  if (!hasLoaded) {
    populateForm(sampleData);
  } else {
    updatePreview();
  }
});
