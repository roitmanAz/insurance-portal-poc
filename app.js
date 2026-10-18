/**
 * Ofek Health - Claims Processing & Intelligent Pre-Validation System
 * Client-Side JavaScript Logic (Vanilla ES6)
 * Implements UX Architecture Guidelines & Product Specification
 */

const App = {
  // Local State
  state: {
    currentView: "customer-view",
    activeScenarioId: null,
    claims: [],
    handlers: [],
    currentClaimId: "CLM-2026-8810",
    wizard: {
      currentStep: 1,
      beneficiary: "self",
      dependentData: {},
      selectedCategory: null,
      fields: {
        serviceDate: "28/09/2026",
        claimAmount: "",
        providerName: "",
        doctorName: ""
      },
      docs: {},
      varianceDismissed: false,
      varianceExplanation: "",
      customerEdits: [],
      pendingDiscrepancyEdit: null,
      returnToStepAfterEdit: null,
      auditTrail: []
    },
    guardianships: [],
    guardianship: {
      isApproved: false,
      wardName: "רחל ישראלי",
      wardId: "019283746",
      wardDob: "12/05/1954",
      guardianName: "ישראל ישראלי",
      guardianId: "028475913",
      courtCase: 'א"פ 42918-03-24',
      courtName: "בית המשפט לענייני משפחה - מחוז תל אביב",
      appointmentType: "צו מינוי אפוטרופוס מבית המשפט לענייני משפחה",
      scope: "עניינים רפואיים, ביטוחיים ואישיים",
      approvalDate: "12/03/2024",
      documentName: "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf",
      verifiedAt: null
    }
  },

  // Initialize Application
  init() {
    this.loadStateFromStorage();
    this.updateGuardianshipUI();
    this.renderCategoryGrid();
    this.renderCustomerClaims();
    this.renderHandlerInbox();
    this.renderManagerView();
    this.renderExecView();
    this.setupRejectionModal();
    this.bindEvents();
    this.updateActiveScenarioUI();

    // Ensure Clean Default View States (Question 2 & 3)
    this.closeWizardAndShowDashboard();
    this.closeInspectorAndShowInbox();
  },

  // State & LocalStorage Protocol (UX Rule #6)
  loadStateFromStorage() {
    const savedClaims = localStorage.getItem("ofek_claims_db");
    if (savedClaims) {
      this.state.claims = JSON.parse(savedClaims);
    } else {
      this.state.claims = JSON.parse(JSON.stringify(MOCK_DATA.claims));
      this.saveClaimsToStorage();
    }

    this.state.handlers = JSON.parse(JSON.stringify(MOCK_DATA.handlers));

    const savedDraft = localStorage.getItem("ofek_wizard_draft");
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        this.state.wizard = { ...this.state.wizard, ...parsedDraft };
        this.showToast("טיוטת תביעה קודמת שוחזרה בהצלחה מ-LocalStorage", "primary");
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }

    const savedList = localStorage.getItem("ofek_guardianships_list");
    if (savedList) {
      try {
        this.state.guardianships = JSON.parse(savedList);
      } catch (e) {
        console.error("Failed to parse guardianships list", e);
      }
    }

    const savedGuardianship = localStorage.getItem("ofek_guardianship_data");
    if (savedGuardianship) {
      try {
        const parsedGuard = JSON.parse(savedGuardianship);
        this.state.guardianship = { ...this.state.guardianship, ...parsedGuard };
        if (this.state.guardianship.isApproved && (!this.state.guardianships || this.state.guardianships.length === 0)) {
          this.state.guardianships = [{ ...this.state.guardianship }];
        }
      } catch (e) {
        console.error("Failed to parse guardianship data", e);
      }
    }
  },

  saveClaimsToStorage() {
    localStorage.setItem("ofek_claims_db", JSON.stringify(this.state.claims));
  },

  saveDraftToStorage() {
    // Only save textual data, not binary file objects (UX Protocol #6)
    const draft = {
      beneficiary: this.state.wizard.beneficiary,
      dependentData: this.state.wizard.dependentData,
      selectedCategory: this.state.wizard.selectedCategory,
      fields: this.state.wizard.fields,
      currentStep: this.state.wizard.currentStep
    };
    localStorage.setItem("ofek_wizard_draft", JSON.stringify(draft));
    const indicator = document.getElementById("draftSavedIndicator");
    if (indicator) {
      indicator.innerHTML = `<i class="fa-solid fa-cloud-check text-success"></i> נשמר מקומית (${new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })})`;
    }
  },

  resetAllData() {
    // 1. Wipe all localStorage items completely
    localStorage.removeItem("ofek_claims_db");
    localStorage.removeItem("ofek_wizard_draft");
    localStorage.removeItem("ofek_guardianship_data");
    localStorage.removeItem("ofek_guardianships_list");
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("Storage clear notice", e);
    }

    // 2. Reset Guardianship State & UI back to fresh unapproved baseline
    this.state.guardianships = [];
    this.state.guardianship = {
      isApproved: false,
      wardName: "רחל ישראלי",
      wardId: "019283746",
      wardDob: "12/05/1954",
      guardianName: "ישראל ישראלי",
      guardianId: "028475913",
      courtCase: 'א"פ 42918-03-24',
      courtName: "בית המשפט לענייני משפחה - מחוז תל אביב",
      appointmentType: "צו מינוי אפוטרופוס מבית המשפט לענייני משפחה",
      scope: "עניינים רפואיים, ביטוחיים ואישיים",
      approvalDate: "12/03/2024",
      documentName: "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf",
      verifiedAt: null
    };
    this.updateGuardianshipUI();

    // Reset Guardianship Setup Modal elements
    const gWardName = document.getElementById("guardModalWardName");
    const gWardId = document.getElementById("guardModalWardId");
    const gCourtCase = document.getElementById("guardModalCaseNum");
    if (gWardName) gWardName.value = "רחל ישראלי";
    if (gWardId) gWardId.value = "019283746";
    if (gCourtCase) gCourtCase.value = 'א"פ 42918-03-24';
    const gDropZone = document.getElementById("guardModalDropZone");
    const gFilePreview = document.getElementById("guardModalFilePreview");
    if (gDropZone) gDropZone.style.display = "block";
    if (gFilePreview) gFilePreview.style.display = "none";

    // 3. Reset Mock State Collections to Fresh Factory Defaults
    this.state.claims = JSON.parse(JSON.stringify(MOCK_DATA.claims));
    this.state.handlers = JSON.parse(JSON.stringify(MOCK_DATA.handlers));
    this.state.currentClaimId = "CLM-2026-8810";
    this.state.selectedProviderObj = null;
    this.state.customerUploadClaimId = null;
    this.state.customerUploadedDocReady = false;

    // 4. Reset Wizard State Object
    this.state.wizard = {
      currentStep: 1,
      beneficiary: "self",
      dependentData: {},
      selectedCategory: null,
      fields: {
        serviceDate: "28/09/2026",
        claimAmount: "",
        providerName: "",
        doctorName: ""
      },
      docs: {},
      varianceDismissed: false,
      varianceExplanation: "",
      lowConfidenceAccepted: false,
      highAmountAcknowledged: false,
      hasHighAmountWarning: false,
      willAttachPaymentProof: false,
      customerEdits: [],
      pendingDiscrepancyEdit: null,
      returnToStepAfterEdit: null,
      auditTrail: []
    };

    // 5. Save Fresh Defaults to Storage
    this.saveClaimsToStorage();

    // 6. Clean and Reset all Form Fields and Input Elements in the DOM
    const fieldsToReset = [
      { id: "wizardServiceDate", val: "28/09/2026" },
      { id: "wizardClaimAmount", val: "" },
      { id: "wizardProviderName", val: "" },
      { id: "wizardDoctorName", val: "" },
      { id: "depName", val: "" },
      { id: "depId", val: "" },
      { id: "depBirthDate", val: "" },
      { id: "depRelation", val: "child" },
      { id: "varianceNoteInput", val: "" },
      { id: "rejectionDetailText", val: "" },
      { id: "rejectionReasonSelect", val: "" },
      { id: "missingDocNameInput", val: "דו\"ח ניתוח חתום ע\"י המנתח" },
      { id: "missingDocExplanation", val: "שלום ישראל, לצורך השלמת הטיפול בתביעת הניתוח באסותא, אנא העלה את דו\"ח הניתוח הרשמי שנמסר לך בעת השחרור." },
      { id: "demoScenarioSelector", val: "" },
      { id: "guardianWardName", val: "רחל ישראלי" },
      { id: "guardianWardId", val: "019283746" },
      { id: "guardianCourtCase", val: 'א"פ 42918-03-24' }
    ];

    fieldsToReset.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) el.value = item.val;
    });

    // Reset Beneficiary Radios & Cards cleanly
    this.selectBeneficiary("self");
    document.querySelectorAll('input[name="claimBeneficiary"]').forEach(radio => {
      radio.checked = (radio.value === "self");
    });
    document.getElementById("routeSelfCard")?.classList.add("selected");
    document.getElementById("routeDependentCard")?.classList.remove("selected");
    const depSec = document.getElementById("dependentFieldsSection");
    if (depSec) depSec.style.display = "none";
    const guardNotice = document.getElementById("guardianActiveRelationNotice");
    if (guardNotice) guardNotice.style.display = "none";

    // Cancel all in-place single field edits in Step 4
    ['serviceDate', 'claimAmount', 'providerName', 'doctorName'].forEach(f => {
      if (typeof this.cancelEditSingleField === "function") {
        this.cancelEditSingleField(f);
      }
    });

    // Reset Checkboxes
    ["chkReviewId", "chkReviewAmount", "chkReviewPolicy"].forEach(id => {
      const chk = document.getElementById(id);
      if (chk) chk.checked = false;
    });

    // Reset Indicators & Dropzones
    const draftIndicator = document.getElementById("draftSavedIndicator");
    if (draftIndicator) {
      draftIndicator.innerHTML = `<i class="fa-solid fa-cloud-check text-success"></i> טיוטה אופסה`;
    }

    const custDropZone = document.getElementById("custModalDropZone");
    if (custDropZone) {
      custDropZone.style.display = "block";
      custDropZone.classList.remove("is-invalid");
    }
    const custFilePreview = document.getElementById("custModalFilePreview");
    if (custFilePreview) custFilePreview.style.display = "none";

    // 7. Clear All Active Validation Warnings, Badges and Error Banners
    this.clearValidationErrors();

    // 8. Re-render All View Modules
    this.renderCategoryGrid();
    this.renderWizardStep(1);
    this.renderCustomerClaims();
    this.renderHandlerInbox();
    this.renderManagerView();
    this.renderExecView();
    this.updateInspector("CLM-2026-8810");

    // 9. Ensure Views are at Clean State
    this.state.activeScenarioId = null;
    this.updateActiveScenarioUI();
    this.closeWizardAndShowDashboard();
    this.closeInspectorAndShowInbox();
    this.switchView("customer-view");

    this.showToast("כל הנתונים, הטיוטות והגדרות האפוטרופסות אופסו בהצלחה לערכי ברירת המחדל!", "success");
  },

  // Three-Dots Menu Controllers
  toggleHeaderMenu() {
    const menu = document.getElementById("headerDropdownMenu");
    const btn = document.getElementById("btnHeaderMenu");
    if (!menu) return;
    const isOpen = menu.classList.toggle("open");
    btn?.classList.toggle("open", isOpen);
  },

  closeHeaderMenu() {
    document.getElementById("headerDropdownMenu")?.classList.remove("open");
    document.getElementById("btnHeaderMenu")?.classList.remove("open");
  },

  confirmAndReset() {
    if (confirm("האם לאפס את כל הנתונים, הטיוטות והגדרות המערכת לברירת המחדל המקורית?")) {
      this.resetAllData();
    }
  },

  // Event Listeners Binding
  bindEvents() {
    // Role Switching
    document.querySelectorAll(".role-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const viewId = btn.getAttribute("data-view");
        this.switchView(viewId);
      });
    });

    // Three-Dots Menu Toggle
    document.getElementById("btnHeaderMenu")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleHeaderMenu();
    });

    // Close Three-Dots Menu on Click Outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".header-actions-wrapper")) {
        this.closeHeaderMenu();
      }
    });

    // Close Any Modal on Backdrop Click (Clicking outside modal window)
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("open");
        }
      });
    });

    // Close Modal / Menu on Escape Key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.open").forEach(modal => modal.classList.remove("open"));
        this.closeHeaderMenu();
      }
    });

    // Scenario Quick Selector (if present in DOM)
    const scenarioSelect = document.getElementById("demoScenarioSelector");
    if (scenarioSelect) {
      scenarioSelect.addEventListener("change", (e) => {
        this.loadScenario(e.target.value);
      });
    }

    // Reset Data Button
    document.getElementById("btnResetData")?.addEventListener("click", () => {
      this.confirmAndReset();
      this.closeHeaderMenu();
    });

    // Upfront Routing Radios (UX Rule #1)
    document.querySelectorAll('input[name="claimBeneficiary"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        const val = e.target.value;
        this.selectBeneficiary(val);
      });
    });

    // Wizard Form Inputs Change
    const inputIds = ["wizardServiceDate", "wizardClaimAmount", "wizardProviderName", "wizardDoctorName"];
    inputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", (e) => {
          const key = id.replace("wizard", "").toLowerCase();
          const map = {
            servicedate: "serviceDate",
            claimamount: "claimAmount",
            providername: "providerName",
            doctorname: "doctorName"
          };
          this.state.wizard.fields[map[key]] = e.target.value;
          this.saveDraftToStorage();
          this.updateStickyFooterCTA();
        });
      }
    });

    // Realtime field validation (on blur & immediate error dismissal)
    this.setupRealtimeFieldValidation();

    // Wizard Next & Prev Buttons
    document.getElementById("btnWizardNext")?.addEventListener("click", () => this.handleWizardNext());
    document.getElementById("btnWizardPrev")?.addEventListener("click", () => this.handleWizardPrev());

    // Fast Simulated Doc Upload Button
    document.getElementById("btnSimulateFastUpload")?.addEventListener("click", () => this.simulateDocumentUpload());

    // One-Click Sync in Soft Variance Modal
    document.getElementById("btnOneClickSync")?.addEventListener("click", () => this.executeOneClickSync());

    // Stepper item direct clicks
    document.querySelectorAll(".stepper-item").forEach(item => {
      item.addEventListener("click", () => {
        const stepNum = parseInt(item.getAttribute("data-step"));
        this.renderWizardStep(stepNum);
      });
    });

    // Handler Inbox Filter Pills
    document.querySelectorAll("#handlerInboxFilters .filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll("#handlerInboxFilters .filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.filterHandlerInbox(pill.getAttribute("data-filter"));
      });
    });

    // Handler Inspector Actions
    document.getElementById("btnCloseInspector")?.addEventListener("click", () => {
      document.getElementById("handlerClaimInspector").style.display = "none";
    });

    document.getElementById("btnApproveClaim")?.addEventListener("click", () => this.handleApproveClaim());
    document.getElementById("btnRejectClaimModal")?.addEventListener("click", () => this.openModal("modalRejection"));
    document.getElementById("btnConfirmRejection")?.addEventListener("click", () => this.handleConfirmRejection());
    document.getElementById("btnRequestInfoModal")?.addEventListener("click", () => this.openModal("modalRequestInfo"));
    document.getElementById("btnConfirmRequestInfo")?.addEventListener("click", () => this.handleConfirmRequestInfo());
    document.getElementById("btnViewAuditLog")?.addEventListener("click", () => this.openAuditTrailModal());

    // Handler Editable Field - Traceability (PRD Section 16)
    const editAmt = document.getElementById("handlerEditAmount");
    if (editAmt) {
      editAmt.addEventListener("change", (e) => {
        this.handleClaimFieldCorrection("סכום מאושר לתביעה", "₪16,800 (ערך מקורי OCR)", `₪${Number(e.target.value).toLocaleString()}`);
      });
    }

    // Setup Autocomplete for Medical Providers and Doctors
    this.setupProviderAutocomplete();
    this.setupDoctorAutocomplete();

    // Setup Israeli Date Picker and Masking
    this.setupIsraeliDateInputs();

    // Close Autocomplete Dropdowns on outside click
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#providerAutocompleteContainer")) {
        document.getElementById("providerDropdown")?.classList.remove("open");
      }
      if (!e.target.closest("#doctorAutocompleteContainer")) {
        document.getElementById("doctorDropdown")?.classList.remove("open");
      }
    });
  },

  // Israeli Date Formatter Helper (DD/MM/YYYY)
  formatToIsraeliDate(dateStr) {
    if (!dateStr) return "";
    // If already DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}/.test(dateStr)) return dateStr;
    // If YYYY-MM-DD
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})(.*)$/);
    if (match) {
      const timePart = match[4] ? match[4] : "";
      return `${match[3]}/${match[2]}/${match[1]}${timePart}`;
    }
    return dateStr;
  },

  // Setup Israeli Date Input with Auto-Masking (DD/MM/YYYY) and Calendar Picker
  setupIsraeliDateInputs() {
    const wizardDateInput = document.getElementById("wizardServiceDate");
    const pickerBtn = document.getElementById("btnOpenCalendarPicker");
    const hiddenPicker = document.getElementById("nativeHiddenDatePicker");

    if (wizardDateInput) {
      wizardDateInput.addEventListener("input", (e) => {
        let val = wizardDateInput.value.replace(/\D/g, "");
        if (val.length > 8) val = val.substring(0, 8);
        let formatted = "";
        if (val.length > 0) formatted = val.substring(0, 2);
        if (val.length >= 3) formatted += "/" + val.substring(2, 4);
        if (val.length >= 5) formatted += "/" + val.substring(4, 8);
        wizardDateInput.value = formatted;
        this.state.wizard.fields.serviceDate = formatted;
        this.saveDraftToStorage();
      });

      if (pickerBtn && hiddenPicker) {
        pickerBtn.addEventListener("click", () => {
          try {
            hiddenPicker.showPicker();
          } catch (err) {
            hiddenPicker.click();
          }
        });

        hiddenPicker.addEventListener("change", (e) => {
          if (e.target.value) {
            const parts = e.target.value.split("-"); // YYYY-MM-DD
            if (parts.length === 3) {
              const israeliFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
              wizardDateInput.value = israeliFormatted;
              this.state.wizard.fields.serviceDate = israeliFormatted;
              this.saveDraftToStorage();
            }
          }
        });
      }
    }

    const handlerDateInput = document.getElementById("handlerEditDate");
    if (handlerDateInput) {
      handlerDateInput.addEventListener("input", () => {
        let val = handlerDateInput.value.replace(/\D/g, "");
        if (val.length > 8) val = val.substring(0, 8);
        let formatted = "";
        if (val.length > 0) formatted = val.substring(0, 2);
        if (val.length >= 3) formatted += "/" + val.substring(2, 4);
        if (val.length >= 5) formatted += "/" + val.substring(4, 8);
        handlerDateInput.value = formatted;
      });
    }
  },

  // Interactive Israeli Medical Providers Autocomplete (Filtered by Category & Sorted א-ב)
  setupProviderAutocomplete() {
    const input = document.getElementById("wizardProviderName");
    const dropdown = document.getElementById("providerDropdown");
    if (!input || !dropdown) return;

    const renderList = (filterText = "") => {
      const cat = this.state.wizard.selectedCategory || "surgery";
      let list = (MOCK_DATA.medicalProviders || []).filter(p => p.categories.includes(cat) || p.categories.includes("all"));

      if (filterText.trim()) {
        const query = filterText.trim().toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(query) || p.city.toLowerCase().includes(query));
      }

      // Sort alphabetically by Hebrew
      list.sort((a, b) => a.name.localeCompare(b.name, 'he'));

      if (list.length === 0) {
        dropdown.innerHTML = `<div style="padding: 0.85rem; font-size: 0.82rem; color: var(--text-muted); text-align: center;">לא נמצאו מרכזים ברשימה - באפשרותך להקליד שם ידנית</div>`;
      } else {
        const categoryName = (MOCK_DATA.claimCategories.find(c => c.id === cat) || {}).name || "התמחות נבחרת";
        dropdown.innerHTML = `
          <div class="autocomplete-header-badge">
            <span><i class="fa-solid fa-list-check"></i> מרכזים מוכרים (${categoryName}) - לפי א-ב:</span>
            <span class="badge badge-primary">${list.length} תוצאות</span>
          </div>
          ${list.map((p, idx) => `
            <div class="autocomplete-item" data-provider-idx="${idx}">
              <div>
                <strong>${p.name}</strong>
                <small><i class="fa-solid fa-location-dot"></i> ${p.city} • ${p.doctors.length} רופאים מוכרים</small>
              </div>
              <div class="autocomplete-meta">
                <span class="badge badge-neutral" style="font-size: 0.72rem;">${p.license}</span>
              </div>
            </div>
          `).join("")}
        `;

        dropdown.querySelectorAll(".autocomplete-item").forEach(item => {
          item.addEventListener("mousedown", (e) => {
            e.preventDefault();
            const idx = parseInt(item.getAttribute("data-provider-idx"), 10);
            const p = list[idx];
            if (!p) return;
            input.value = p.name;
            this.state.wizard.fields.providerName = p.name;
            this.state.selectedProviderObj = p;
            this.clearFieldError("wizardProviderName");
            this.saveDraftToStorage();
            dropdown.classList.remove("open");

            // Focus on doctor input and automatically open doctor suggestions for this center
            const docInput = document.getElementById("wizardDoctorName");
            if (docInput) {
              docInput.focus();
              if (this.renderDoctorSuggestions) {
                this.renderDoctorSuggestions("");
              }
            }
          });
        });
      }
      dropdown.classList.add("open");
    };

    input.addEventListener("focus", () => {
      this.clearFieldError("wizardDoctorName");
      const docGroup = document.getElementById("wizardDoctorName")?.closest(".form-group");
      docGroup?.querySelector(".field-warning-feedback")?.remove();
      const docHint = document.getElementById("doctorHint");
      if (docHint) docHint.style.display = "block";
      renderList(input.value);
    });
    input.addEventListener("input", (e) => {
      this.state.wizard.fields.providerName = e.target.value;
      this.saveDraftToStorage();
      if (e.target.value.trim()) {
        const docGroup = document.getElementById("wizardDoctorName")?.closest(".form-group");
        docGroup?.querySelector(".field-warning-feedback")?.remove();
        const docHint = docGroup?.querySelector(".form-hint");
        if (docHint && !docGroup?.querySelector(".invalid-feedback")) docHint.style.display = "block";
      }
      renderList(e.target.value);
    });
  },

  // Interactive Doctors Autocomplete (Search by Doctor Name, Specialty, or Israeli Medical License Number)
  setupDoctorAutocomplete() {
    const input = document.getElementById("wizardDoctorName");
    const dropdown = document.getElementById("doctorDropdown");
    if (!input || !dropdown) return;

    this.renderDoctorSuggestions = (filterText = "") => {
      const providerInput = document.getElementById("wizardProviderName");
      const providerVal = (providerInput ? providerInput.value : this.state.wizard.fields.providerName) || "";

      if (!providerVal.trim()) {
        dropdown.classList.remove("open");

        const parent = input.closest(".form-group") || input.parentElement;
        parent.querySelector(".field-warning-feedback")?.remove();
        parent.querySelector(".invalid-feedback")?.remove();

        const hintEl = parent.querySelector(".form-hint");
        if (hintEl) hintEl.style.display = "none";

        const warningEl = document.createElement("div");
        warningEl.className = "field-warning-feedback";
        warningEl.id = "doctorProviderWarning";
        warningEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #d97706;"></i> <span>יש לבחור תחילה מקום טיפול</span>`;
        parent.appendChild(warningEl);
        return;
      } else {
        const parent = input.closest(".form-group") || input.parentElement;
        parent.querySelector(".field-warning-feedback")?.remove();
        const hintEl = parent.querySelector(".form-hint");
        if (hintEl && !parent.querySelector(".invalid-feedback")) hintEl.style.display = "block";
      }

      let docs = [];
      const chosenProv = this.state.selectedProviderObj || (MOCK_DATA.medicalProviders || []).find(p => p.name === providerVal.trim());

      if (chosenProv && chosenProv.doctors && chosenProv.doctors.length > 0) {
        docs = chosenProv.doctors.map(d => ({ ...d, hospitalName: chosenProv.name }));
      } else {
        // Collect doctors from all providers matching category
        const cat = this.state.wizard.selectedCategory || "surgery";
        const providers = (MOCK_DATA.medicalProviders || []).filter(p => p.categories.includes(cat));
        providers.forEach(p => {
          p.doctors.forEach(d => {
            if (!docs.some(x => x.name === d.name && x.license === d.license)) {
              docs.push({ ...d, hospitalName: p.name });
            }
          });
        });
      }

      if (filterText.trim()) {
        const query = filterText.trim().toLowerCase();
        const digitsOnly = query.replace(/\D/g, "");

        docs = docs.filter(d => {
          const nameMatch = d.name.toLowerCase().includes(query);
          const specialtyMatch = d.specialty && d.specialty.toLowerCase().includes(query);
          const licenseMatch = d.license && d.license.toLowerCase().includes(query);
          const licenseDigits = (d.license || "").replace(/\D/g, "");
          const digitMatch = digitsOnly.length >= 2 && licenseDigits.includes(digitsOnly);

          return nameMatch || specialtyMatch || licenseMatch || digitMatch;
        });
      }

      // Sort alphabetically by Hebrew name
      docs.sort((a, b) => a.name.localeCompare(b.name, 'he'));

      if (docs.length === 0) {
        dropdown.innerHTML = `<div style="padding: 0.85rem; font-size: 0.82rem; color: var(--text-muted); text-align: center;">לא נמצא רופא או מספר רישיון ברשימה - באפשרותך להקליד ידנית</div>`;
      } else {
        const headerTitle = chosenProv ? `רופאים ב-${chosenProv.name}:` : `רופאים מומחים (מקום טיפול: ${providerVal}):`;
        dropdown.innerHTML = `
          <div class="autocomplete-header-badge">
            <span><i class="fa-solid fa-user-doctor"></i> ${headerTitle}</span>
            <span class="badge badge-success">${docs.length} זמינים</span>
          </div>
          ${docs.map((d, idx) => `
            <div class="autocomplete-item" data-doc-idx="${idx}">
              <div>
                <strong>${d.name}</strong>
                <small><i class="fa-solid fa-stethoscope"></i> ${d.specialty}</small>
              </div>
              <div class="autocomplete-meta">
                <span class="badge badge-primary" style="font-size: 0.75rem; font-weight: 700; direction: ltr;">${d.license}</span>
                <small style="font-size: 0.7rem; color: var(--text-muted);">${d.hospitalName || ''}</small>
              </div>
            </div>
          `).join("")}
        `;

        dropdown.querySelectorAll(".autocomplete-item").forEach(item => {
          item.addEventListener("mousedown", (e) => {
            e.preventDefault();
            const idx = parseInt(item.getAttribute("data-doc-idx"), 10);
            const d = docs[idx];
            if (!d) return;
            input.value = `${d.name} (${d.license})`;
            this.state.wizard.fields.doctorName = input.value;
            this.clearFieldError("wizardDoctorName");
            this.saveDraftToStorage();
            dropdown.classList.remove("open");
          });
        });
      }
      dropdown.classList.add("open");
    };

    input.addEventListener("focus", () => this.renderDoctorSuggestions(input.value));
    input.addEventListener("input", (e) => {
      this.state.wizard.fields.doctorName = e.target.value;
      this.saveDraftToStorage();
      this.renderDoctorSuggestions(e.target.value);
    });
  },

  renderDoctorSuggestions(filterText = "") { },

  // Update Scenario Selection Highlight in Header Dropdown Menu
  updateActiveScenarioUI() {
    const activeId = this.state.activeScenarioId;
    document.querySelectorAll("[data-scenario-id]").forEach(el => {
      const scenarioId = el.getAttribute("data-scenario-id");
      const isCurrent = (scenarioId === activeId);
      el.classList.toggle("active", isCurrent);

      el.querySelectorAll(".active-scenario-badge").forEach(b => b.remove());

      if (isCurrent) {
        const badge = document.createElement("span");
        badge.className = "active-scenario-badge";
        badge.innerHTML = `<i class="fa-solid fa-check"></i> פעיל כעת`;
        el.appendChild(badge);
      }
    });
  },

  // Switch Active View
  switchView(viewId) {
    this.state.currentView = viewId;
    document.querySelectorAll(".role-tab-btn").forEach(btn => {
      const active = btn.getAttribute("data-view") === viewId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active);
    });

    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.toggle("active", sec.id === viewId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // Load Presets / Scenarios (End-to-End Prevention Engine & Demo Flows)
  loadScenario(scenarioId) {
    const sc = MOCK_DATA.demoScenarios.find(s => s.id === scenarioId);
    if (!sc) return;

    this.state.activeScenarioId = scenarioId;
    this.updateActiveScenarioUI();

    if (scenarioId === "guardian_claim") {
      const demoClaim = MOCK_DATA.guardianDemoClaim;
      if (demoClaim && !this.state.claims.some(c => c.id === demoClaim.id)) {
        this.state.claims.unshift(demoClaim);
        this.saveClaimsToStorage();
      }
      this.switchView("handler-view");
      this.renderHandlerInbox();
      if (demoClaim) {
        this.updateInspector(demoClaim.id);
      }
      this.showToast("נטענה תביעת אפוטרופוס לדוגמה עבור רחל ישראלי (א\"פ 42918-03-24). מוצגת כעת בבדיקת הרפרנט.", "primary");
      return;
    }

    // Switch to customer view and open wizard naturally from Step 1
    this.switchView("customer-view");
    this.openNewClaimWizard();

    // Configure scenario data into state without popping up modals immediately
    if (scenarioId === "duplicate_claim") {
      this.state.wizard.selectedCategory = "consultation";
      this.state.wizard.fields = {
        serviceDate: "01/10/2026",
        claimAmount: "1800",
        providerName: "קליניקה פרטית - ד\"ר אורי יוגב",
        doctorName: "ד\"ר אורי יוגב (נוירולוג)"
      };
    } else if (scenarioId === "uncovered_treatment") {
      this.state.wizard.selectedCategory = "alternative";
      this.state.wizard.fields = {
        serviceDate: "20/09/2026",
        claimAmount: "850",
        providerName: "מרכז רפואה משלימה",
        doctorName: "מטפל מוסמך"
      };
    } else if (scenarioId === "waiting_period") {
      this.state.wizard.selectedCategory = "dental";
      this.state.wizard.fields = {
        serviceDate: "15/09/2026",
        claimAmount: "6200",
        providerName: "מרפאת דנטל קייר",
        doctorName: "ד\"ר שאול רובינשטיין"
      };
    } else if (scenarioId === "coverage_added_later") {
      this.state.wizard.selectedCategory = "dental";
      this.state.wizard.fields = {
        serviceDate: "15/02/2025",
        claimAmount: "4500",
        providerName: "מרפאת שיניים אסותא",
        doctorName: "ד\"ר מיטל דיין"
      };
    } else if (scenarioId === "coverage_cancelled_early") {
      this.state.wizard.selectedCategory = "critical_care";
      this.state.wizard.fields = {
        serviceDate: "20/09/2026",
        claimAmount: "12000",
        providerName: "מרכז רפואי רמב\"ם",
        doctorName: "פרופ' אברהם שניפר"
      };
    } else if (scenarioId === "unreadable_doc") {
      this.state.wizard.selectedCategory = "surgery";
      this.state.wizard.fields = {
        serviceDate: "28/09/2026",
        claimAmount: "16800",
        providerName: "בי\"ח אסותא רמת החייל",
        doctorName: "פרופ' אהוד רז"
      };
    } else if (scenarioId === "low_confidence_doc") {
      this.state.wizard.selectedCategory = "surgery";
      this.state.wizard.fields = {
        serviceDate: "28/09/2026",
        claimAmount: "16800",
        providerName: "בי\"ח אסותא רמת החייל",
        doctorName: "פרופ' אהוד רז"
      };
    } else if (scenarioId === "mismatched_amount") {
      this.state.wizard.selectedCategory = "surgery";
      this.state.wizard.fields = {
        serviceDate: "28/09/2026",
        claimAmount: "18500",
        providerName: "בי\"ח אסותא רמת החייל",
        doctorName: "פרופ' אהוד רז"
      };
    } else if (scenarioId === "missing_mandatory_doc") {
      this.state.wizard.selectedCategory = "surgery";
      this.state.wizard.fields = {
        serviceDate: "28/09/2026",
        claimAmount: "18500",
        providerName: "בי\"ח אסותא רמת החייל",
        doctorName: "פרופ' אהוד רז"
      };
    } else if (scenarioId === "clean_fast_track") {
      this.state.wizard.selectedCategory = "imaging";
      this.state.wizard.fields = {
        serviceDate: "02/10/2026",
        claimAmount: "3400",
        providerName: "מכון מור - בני ברק",
        doctorName: "ד\"ר גלעד נוי"
      };
    }

    this.renderCategoryGrid();
    this.renderWizardStep(1);
    this.showToast(`נטען תרחיש: ${sc.title}. התחל בהגשת התביעה – הבדיקה תופעל בשלב הרלוונטי.`, "primary");
  },

  // =========================================================================
  // 1. CUSTOMER WIZARD LOGIC
  // =========================================================================

  renderCategoryGrid() {
    const grid = document.getElementById("claimCategoryGrid");
    if (!grid) return;

    grid.innerHTML = MOCK_DATA.claimCategories.map(cat => {
      const isSelected = this.state.wizard.selectedCategory === cat.id;
      const mandatoryCount = cat.requiredDocs.filter(d => d.mandatory).length;
      return `
        <div class="category-card ${isSelected ? 'selected' : ''}" data-cat-id="${cat.id}">
          <div class="category-icon">
            <i class="fa-solid ${cat.icon}"></i>
          </div>
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.25rem;">${cat.name}</strong>
          <span style="font-size: 0.76rem; color: var(--text-secondary); display: block; margin-bottom: 0.4rem;">${cat.description}</span>
          <div style="font-size: 0.72rem; color: var(--primary-dark); font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
            <i class="fa-solid fa-file-circle-check text-primary"></i> ${mandatoryCount} מסמכי חובה נדרשים
          </div>
        </div>
      `;
    }).join("");

    // Bind Category Selection & Trigger Required Documents Popup
    grid.querySelectorAll(".category-card").forEach(card => {
      card.addEventListener("click", () => {
        const catId = card.getAttribute("data-cat-id");
        this.openCategoryDocsModal(catId);
      });
    });
  },

  // Pre-Claim Required Documents Modal Dialog (Selects category immediately, checks pre-validation, then opens popup)
  openCategoryDocsModal(catId) {
    // 1. Upfront Pre-Validation Check for Category
    const preCheck = this.checkPreValidationRules({ category: catId });
    if (preCheck.blocked && preCheck.blockType === "uncovered") {
      this.showPreValidationBlockerModal(preCheck);
      return;
    }

    const cat = MOCK_DATA.claimCategories.find(c => c.id === catId) || MOCK_DATA.claimCategories[0];
    if (!cat) return;

    // 2. Apply category selection immediately to State and Grid UI
    this.state.wizard.selectedCategory = cat.id;
    this.state.pendingSelectedCategory = cat.id;
    this.state.selectedProviderObj = null;

    document.querySelectorAll("#claimCategoryGrid .category-card").forEach(card => {
      card.classList.toggle("selected", card.getAttribute("data-cat-id") === cat.id);
    });

    this.saveDraftToStorage();
    this.updateStickyFooterCTA();

    // 3. Populate and Open Modal
    const titleEl = document.getElementById("catModalTitle");
    const iconEl = document.getElementById("catModalIcon");
    const listEl = document.getElementById("catModalDocsList");

    if (titleEl) titleEl.innerText = cat.name;
    if (iconEl) iconEl.className = `fa-solid ${cat.icon} text-primary`;

    if (listEl) {
      listEl.innerHTML = cat.requiredDocs.map(doc => `
        <div class="doc-modal-row" style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem 1.1rem; border-right: 4px solid ${doc.mandatory ? '#ef4444' : '#0ea5e9'}; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; position: relative;">
          <div style="display: flex; align-items: center; gap: 0.65rem; flex: 1;">
            <i class="fa-solid ${doc.mandatory ? 'fa-file-circle-exclamation text-danger' : 'fa-file-lines text-primary'}" style="font-size: 1.15rem;"></i>
            <div style="display: inline-flex; align-items: center; gap: 2px; position: relative;">
              <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">${doc.name}</span>
              <span class="doc-info-trigger" tabindex="0" aria-label="מידע נוסף">
                ?
                <span class="doc-hover-tooltip">${doc.detail || 'מסמך נדרש לאימות הזכאות בבדיקת התביעה'}</span>
              </span>
            </div>
          </div>
          <span class="badge ${doc.mandatory ? 'badge-danger' : 'badge-neutral'}" style="font-size: 0.78rem; padding: 4px 10px; font-weight: 700;">
            ${doc.mandatory ? 'מסמך חובה' : 'מסמך רשות'}
          </span>
        </div>
      `).join("");
    }

    this.openModal("modalCategoryRequiredDocs");
  },

  // Confirm Category Selection from Popup
  confirmCategoryModal() {
    const catId = this.state.wizard.selectedCategory;
    if (!catId) return;

    this.closeModal("modalCategoryRequiredDocs");
    this.updateStickyFooterCTA();

    // Automatically navigate to Step 2 (UX ergonomics)
    if (this.validateStep1()) {
      this.renderWizardStep(2);
    }
  },

  renderWizardStep(stepNum) {
    this.state.wizard.currentStep = stepNum;

    // Update Stepper Nav
    document.querySelectorAll(".stepper-item").forEach(item => {
      const step = parseInt(item.getAttribute("data-step"));
      item.classList.toggle("active", step === stepNum);
      item.classList.toggle("completed", step < stepNum);
    });

    // Show/Hide Step Contents
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`stepContent${i}`);
      if (el) el.style.display = (i === stepNum) ? "block" : "none";
    }

    if (stepNum === 1) {
      this.updateGuardianshipUI();
    }

    // Populate Fields if step 2
    if (stepNum === 2) {
      document.getElementById("wizardServiceDate").value = this.formatToIsraeliDate(this.state.wizard.fields.serviceDate) || "28/09/2026";
      document.getElementById("wizardClaimAmount").value = this.state.wizard.fields.claimAmount || "";
      document.getElementById("wizardProviderName").value = this.state.wizard.fields.providerName || "";
      document.getElementById("wizardDoctorName").value = this.state.wizard.fields.doctorName || "";
    }

    // Render Docs if step 3
    if (stepNum === 3) {
      this.renderRequiredDocsList();
    }

    // Render Review Hub if step 4
    if (stepNum === 4) {
      this.renderReviewHub();
    }

    this.updateStickyFooterCTA();
  },

  renderRequiredDocsList() {
    const container = document.getElementById("requiredDocsContainer");
    if (!container) return;

    const cat = MOCK_DATA.claimCategories.find(c => c.id === this.state.wizard.selectedCategory) || MOCK_DATA.claimCategories[0];
    const formAmount = Number(this.state.wizard.fields.claimAmount || 0);

    container.innerHTML = cat.requiredDocs.map(doc => {
      const uploaded = this.state.wizard.docs[doc.id];
      const ocrAmount = (uploaded && uploaded.detectedAmount) ? Number(uploaded.detectedAmount) : null;
      const isDiscrepant = (ocrAmount !== null && formAmount > 0 && formAmount !== ocrAmount);

      if (uploaded) {
        uploaded.variance = isDiscrepant;
      }

      return `
        <div class="doc-card ${doc.mandatory ? 'mandatory' : ''}">
          <div class="doc-header">
            <div>
              <div class="doc-title" style="display: inline-flex; align-items: center; gap: 2px;">
                <span>${doc.name}</span>
                <span class="doc-info-trigger" tabindex="0" aria-label="פירוט שדות נדרשים">
                  ?
                  <span class="doc-hover-tooltip">${doc.detail || 'מסמך נדרש לאימות הזכאות בבדיקת התביעה'}</span>
                </span>
              </div>
              <span class="badge ${doc.mandatory ? 'badge-danger' : 'badge-neutral'}">
                ${doc.mandatory ? 'מסמך חובה' : 'מסמך רשות'}
              </span>
            </div>
            ${uploaded ? '<i class="fa-solid fa-circle-check text-success" style="font-size: 1.3rem;"></i>' : ''}
          </div>

          ${uploaded ? `
            <div class="ocr-feedback-box">
              <div class="ocr-item">
                <strong><i class="fa-solid fa-file-pdf"></i> ${uploaded.name}</strong>
                <span>${uploaded.size || '1.4MB'}</span>
              </div>
              <div class="ocr-item">
                <span>סטטוס אימות:</span>
                ${uploaded.status === 'unreadable' || (uploaded.ocrConfidence && uploaded.ocrConfidence < 0.5) ? `
                  <span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> מסמך לא קריא - נדרשת סריקה חוזרת</span>
                ` : (uploaded.ocrConfidence && uploaded.ocrConfidence < 0.85) ? `
                  <span class="badge badge-warning"><i class="fa-solid fa-circle-exclamation"></i> איכות סריקה נמוכה - מומלץ להעלות קובץ ברור</span>
                ` : `
                  <span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> נסרק ואומת בהצלחה</span>
                `}
              </div>
            </div>
          ` : `
            <div class="drop-zone" onclick="App.triggerSingleDocUpload('${doc.id}')">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <div style="font-size: 0.88rem; font-weight: 600;">גרור מסמך או לחץ להעלאה</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">PDF, JPG, PNG עד 15MB</div>
            </div>
          `}

          ${(uploaded && uploaded.variance && !this.state.wizard.varianceDismissed && isDiscrepant) ? `
            <div class="ocr-variance-alert">
              <div>
                <strong>אי-התאמה בסכום:</strong> בטופס ₪${formAmount.toLocaleString()} מול חשבונית (OCR) ₪${ocrAmount.toLocaleString()}
                <span style="font-size: 0.76rem; color: #9a3412; margin-right: 0.35rem;">(הפרש ₪${Math.abs(formAmount - ocrAmount).toLocaleString()})</span>
              </div>
              <button class="btn btn-warning" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;" onclick="App.openModal('modalSoftVariance')">
                השוואה וסנכרון
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");
  },

  triggerSingleDocUpload(docId) {
    const formAmount = Number(this.state.wizard.fields.claimAmount || 0);
    const ocrDetected = docId === "invoice" ? 16800 : null;
    const isVariance = (docId === "invoice" && formAmount > 0 && formAmount !== ocrDetected);

    this.state.wizard.docs[docId] = {
      name: `${docId}_מסמך_מאומת.pdf`,
      size: "1.2MB",
      ocrConfidence: 0.96,
      detectedAmount: ocrDetected,
      variance: isVariance
    };
    this.saveDraftToStorage();
    this.renderRequiredDocsList();
    this.updateStickyFooterCTA();

    if (isVariance && !this.state.wizard.varianceDismissed) {
      setTimeout(() => this.openModal("modalSoftVariance"), 400);
    }
  },

  simulateDocumentUpload(triggerVarianceModal = false) {
    const cat = MOCK_DATA.claimCategories.find(c => c.id === this.state.wizard.selectedCategory) || MOCK_DATA.claimCategories[0];
    const formAmount = Number(this.state.wizard.fields.claimAmount || 0);
    const scenario = this.state.activeScenarioId;

    cat.requiredDocs.forEach((doc, idx) => {
      // 1. Missing mandatory doc scenario: upload only invoice, leave others un-uploaded
      if (scenario === "missing_mandatory_doc" && doc.id !== "invoice") {
        delete this.state.wizard.docs[doc.id];
        return;
      }

      // 2. Unreadable doc scenario: only invoice is unreadable (<0.50), other docs are valid!
      if (scenario === "unreadable_doc" && doc.id === "invoice") {
        this.state.wizard.docs[doc.id] = {
          name: "חשבונית_סריקה_מטושטשת.pdf",
          size: "1.1MB",
          status: "unreadable",
          ocrConfidence: 0.35,
          detectedAmount: null,
          variance: false
        };
        return;
      }

      // 3. Low confidence doc scenario: only invoice is low confidence (0.68), others are valid!
      if (scenario === "low_confidence_doc" && doc.id === "invoice") {
        this.state.wizard.docs[doc.id] = {
          name: "חשבונית_סריקה_בינונית.pdf",
          size: "950KB",
          status: "low_confidence",
          ocrConfidence: 0.68,
          detectedAmount: 16800,
          variance: false
        };
        return;
      }

      // 4. Standard / Clean document simulation
      const ocrDetected = (doc.id === "invoice") ? 16800 : null;
      const isVariance = (doc.id === "invoice" && formAmount > 0 && formAmount !== ocrDetected);

      this.state.wizard.docs[doc.id] = {
        name: `${doc.name.split(' ')[0]}_נסרק_תקין.pdf`,
        size: `${(1.1 + idx * 0.4).toFixed(1)}MB`,
        ocrConfidence: 0.95 + idx * 0.02,
        detectedAmount: ocrDetected,
        variance: isVariance
      };
    });

    this.saveDraftToStorage();
    this.renderRequiredDocsList();
    this.updateStickyFooterCTA();
  },

  executeOneClickSync() {
    let targetAmt = 16800;
    const activeClaimId = this.state.activeClaimId;
    const claim = activeClaimId ? this.getClaims().find(c => c.id === activeClaimId) : null;

    if (claim) {
      if (claim.ocrDetectedAmount) targetAmt = Number(claim.ocrDetectedAmount);
      const invDoc = (claim.documents || []).find(d => d.type === "invoice" || (d.name && d.name.includes("חשבונית")));
      if (invDoc && invDoc.detectedAmount) targetAmt = Number(invDoc.detectedAmount);
      claim.amount = targetAmt;
      claim.claimAmount = targetAmt;
      claim.claimedAmount = targetAmt;
      claim.hasVariance = false;
    } else {
      const invoiceDoc = this.state.wizard.docs.invoice || Object.values(this.state.wizard.docs).find(d => d.detectedAmount);
      if (invoiceDoc && invoiceDoc.detectedAmount) targetAmt = Number(invoiceDoc.detectedAmount);
    }

    this.state.wizard.fields.claimAmount = String(targetAmt);
    const amtInput = document.getElementById("wizardClaimAmount");
    if (amtInput) amtInput.value = String(targetAmt);

    this.state.wizard.varianceDismissed = true;
    Object.values(this.state.wizard.docs).forEach(d => {
      d.variance = false;
    });

    this.saveDraftToStorage();
    this.closeModal("modalSoftVariance");
    this.renderRequiredDocsList();
    this.updateStickyFooterCTA();
    if (this.state.currentRole === "handler" && this.state.activeClaimId) {
      this.inspectClaim(this.state.activeClaimId);
    }
    this.showToast(`הסכום עודכן בטופס ל-₪${targetAmt.toLocaleString()} בהתאם לחשבונית המס!`, "success");
  },

  // Review Orchestration Hub (UX Rule #7)
  renderReviewHub() {
    const blockers = [];
    const cat = MOCK_DATA.claimCategories.find(c => c.id === this.state.wizard.selectedCategory) || MOCK_DATA.claimCategories[0];

    // Check mandatory docs
    cat.requiredDocs.filter(d => d.mandatory).forEach(d => {
      if (!this.state.wizard.docs[d.id]) {
        blockers.push({
          type: "missing_doc",
          title: `חסר מסמך חובה: ${d.name}`,
          step: 3,
          actionLabel: "לצירוף המסמך"
        });
      }
    });

    // Check mandatory fields
    if (!this.state.wizard.fields.serviceDate) {
      blockers.push({ type: "empty_field", title: "חסר תאריך ביצוע הטיפול", step: 2, actionLabel: "להזנת תאריך" });
    }
    if (!this.state.wizard.fields.claimAmount || Number(this.state.wizard.fields.claimAmount) <= 0) {
      blockers.push({ type: "empty_field", title: "חסר סכום הוצאה תקף", step: 2, actionLabel: "להזנת סכום" });
    }

    const blockersBanner = document.getElementById("reviewBlockersBanner");
    const blockersContainer = document.getElementById("blockerItemsContainer");

    if (blockers.length > 0) {
      blockersBanner.style.display = "block";
      blockersContainer.innerHTML = blockers.map(b => `
        <div class="blocker-item-row">
          <span><i class="fa-solid fa-circle-exclamation text-danger"></i> <strong>${b.title}</strong></span>
          <button class="btn-teleport" onclick="App.jumpToStep(${b.step})">
            ${b.actionLabel} <i class="fa-solid fa-location-arrow"></i>
          </button>
        </div>
      `).join("");
    } else {
      blockersBanner.style.display = "none";
    }

    // Update Overview Card Texts safely (with robust null-checks)
    const revBen = document.getElementById("revBeneficiary");
    if (revBen) {
      if (this.state.wizard.beneficiary === "self") {
        revBen.innerText = "ישראל ישראלי (עבורי)";
      } else if (this.state.wizard.isGuardian && this.state.guardianship) {
        revBen.innerText = `${this.state.guardianship.wardName} (באמצעות אפוטרופוס)`;
      } else {
        const dName = document.getElementById("depName")?.value;
        revBen.innerText = dName ? `${dName} (עבור אחרים)` : "בן/בת משפחה (תלוי/ה)";
      }
    }

    const revCat = document.getElementById("revCategory");
    if (revCat) revCat.innerText = cat.name;

    const pName = this.state.wizard.fields.providerName || 'אסותא מרכזים רפואיים';
    const dName = this.state.wizard.fields.doctorName || 'פרופ\' אהוד רז';

    const revProvOnly = document.getElementById("revProviderOnly");
    if (revProvOnly) revProvOnly.innerText = pName;

    const revDocOnly = document.getElementById("revDoctorOnly");
    if (revDocOnly) revDocOnly.innerText = dName;

    const revProv = document.getElementById("revProvider");
    if (revProv) revProv.innerText = `${pName} / ${dName}`;

    const revDate = document.getElementById("revServiceDate");
    if (revDate) revDate.innerText = this.formatToIsraeliDate(this.state.wizard.fields.serviceDate) || "28/09/2026";

    const revAmt = document.getElementById("revAmount");
    if (revAmt) revAmt.innerText = `₪${Number(this.state.wizard.fields.claimAmount || 0).toLocaleString()}`;

    // Render Attached Documents List in Step 4
    const docsListEl = document.getElementById("revDocsList");
    if (docsListEl) {
      const uploadedEntries = Object.keys(this.state.wizard.docs || {});
      if (uploadedEntries.length === 0) {
        docsListEl.innerHTML = `
          <div style="background: #fef2f2; border: 1px dashed #f87171; border-radius: var(--radius-sm); padding: 0.75rem 1rem; color: #dc2626; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.85rem;"><i class="fa-solid fa-triangle-exclamation"></i> טרם צורפו מסמכים לתביעה זו</span>
            <button type="button" class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.2rem 0.55rem;" onclick="App.jumpToStep(3)">
              <i class="fa-solid fa-arrow-right"></i> צרף מסמכים עכשיו
            </button>
          </div>
        `;
      } else {
        docsListEl.innerHTML = uploadedEntries.map(k => {
          const doc = this.state.wizard.docs[k];
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid #e2e8f0; margin-bottom: 0.35rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid fa-file-pdf text-danger" style="font-size: 1.2rem;"></i>
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.86rem; display: block;">${doc.name || k}</strong>
                  <span style="font-size: 0.74rem; color: var(--text-muted);">${doc.size || '1.4MB'} • נסרק במנוע OCR</span>
                </div>
              </div>
              <span class="badge badge-success" style="font-size: 0.72rem;">
                <i class="fa-solid fa-circle-check"></i> נסרק ואומת
              </span>
            </div>
          `;
        }).join("");
      }
    }
  },

  jumpToStep(stepNum) {
    if (stepNum > this.state.wizard.currentStep) {
      if (this.state.wizard.currentStep === 1 && !this.validateStep1()) return;
      if (this.state.wizard.currentStep === 2 && !this.validateStep2()) return;
      if (this.state.wizard.currentStep === 3 && !this.validateStep3()) return;
    }
    this.renderWizardStep(stepNum);
    window.scrollTo({ top: document.getElementById("wizardContainer").offsetTop - 80, behavior: "smooth" });
  },

  // Predictive Sticky Footer CTA (UX Rule #4)
  updateStickyFooterCTA() {
    const step = this.state.wizard.currentStep;
    const btnNext = document.getElementById("btnWizardNext");
    const btnPrev = document.getElementById("btnWizardPrev");

    if (!btnNext) return;

    if (btnPrev) {
      btnPrev.style.display = (step > 1) ? "inline-flex" : "none";
    }

    if (step === 1) {
      btnNext.innerHTML = `<span>ממשיכים לפרטי הטיפול</span> <i class="fa-solid fa-arrow-left"></i>`;
      btnNext.className = "btn btn-primary";
    } else if (step === 2) {
      btnNext.innerHTML = `<span>לצירוף המסמכים והאימות</span> <i class="fa-solid fa-arrow-left"></i>`;
      btnNext.className = "btn btn-primary";
    } else if (step === 3) {
      const hasDocs = Object.keys(this.state.wizard.docs).length > 0;
      if (hasDocs) {
        btnNext.innerHTML = `<span>למרכז הבקרה והסיכום</span> <i class="fa-solid fa-arrow-left"></i>`;
        btnNext.className = "btn btn-primary";
      } else {
        btnNext.innerHTML = `<span>לצירוף מסמך נדרש</span> <i class="fa-solid fa-arrow-left"></i>`;
        btnNext.className = "btn btn-primary";
      }
    } else if (step === 4) {
      btnNext.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>שליחת התביעה לבדיקת רפרנט</span>`;
      btnNext.className = "btn btn-success";
    }
  },

  // =========================================================================
  // 1. CUSTOMER WIZARD LOGIC & ADVANCED VALIDATION ENGINE
  // =========================================================================

  // Standard Israeli ID Validation Algorithm (Luhn Checksum Modulo 10)
  isValidIsraeliId(idStr) {
    if (!idStr) return false;
    let id = String(idStr).trim();
    if (!/^\d{8,9}$/.test(id)) return false;
    if (id.length < 9) id = id.padStart(9, "0");

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let num = Number(id[i]) * ((i % 2) + 1);
      if (num > 9) num -= 9;
      sum += num;
    }
    return sum % 10 === 0;
  },

  // Israeli Date Validation (DD/MM/YYYY) with Real Calendar Checks
  isValidIsraeliDate(dateStr, allowFuture = false) {
    if (!dateStr || typeof dateStr !== "string") return false;
    const match = dateStr.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month < 1 || month > 12) return false;
    if (year < 1920 || year > 2030) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    if (!allowFuture) {
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (inputDate > today) return false;
    }

    return true;
  },

  // Parse Israeli Date String (DD/MM/YYYY or YYYY-MM-DD) to Date Object
  parseIsraeliDate(dateStr) {
    if (!dateStr || typeof dateStr !== "string") return null;
    const match = dateStr.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      return new Date(parseInt(match[3], 10), parseInt(match[2], 10) - 1, parseInt(match[1], 10));
    }
    const isoMatch = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
    }
    return null;
  },

  // Parse Israeli Date (DD/MM/YYYY) to ISO (YYYY-MM-DD)
  parseIsraeliDateToISO(dateStr) {
    if (!dateStr || typeof dateStr !== "string") return "";
    const match = dateStr.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }
    const isoMatch = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return dateStr.trim();
    }
    return dateStr;
  },

  getClaims() {
    return this.state.claims || [];
  },

  inspectClaim(claimId) {
    return this.updateInspector(claimId);
  },

  // Core Pre-Validation Prevention Engine (Hard Blockers & Polite Guidance)
  checkPreValidationRules(opts = {}) {
    const catId = opts.category || this.state.wizard.selectedCategory;
    const serviceDateStr = opts.serviceDate || this.state.wizard.fields.serviceDate;
    const amount = Number(opts.amount || this.state.wizard.fields.claimAmount);
    const user = MOCK_DATA.users.customer;

    // 1. Check Uncovered Treatment
    if (catId && user.coverages && user.coverages[catId] && user.coverages[catId].covered === false) {
      return {
        blocked: true,
        blockType: "uncovered",
        title: "הטיפול אינו מכוסה בפוליסה שברשותך",
        badge: "החרגת כיסוי בפוליסה",
        message: `פוליסת הבריאות שברשותך ('${user.policyType}') אינה כוללת כיסוי עבור ${user.coverages[catId].name || 'סוג טיפול זה'}.`,
        solution: "",
        actionLabel: "בחירת סוג טיפול אחר",
        actionType: "change_category"
      };
    }

    // 2. Check Waiting Period Active
    if (catId && serviceDateStr && user.waitingPeriods && user.waitingPeriods[catId]) {
      const wp = user.waitingPeriods[catId];
      const sDate = this.parseIsraeliDate(serviceDateStr);
      const endDate = wp.endDate ? this.parseIsraeliDate(this.formatToIsraeliDate(wp.endDate)) : null;
      if (wp.completed === false && sDate && endDate && sDate < endDate) {
        const endFormatted = this.formatToIsraeliDate(wp.endDate);
        return {
          blocked: true,
          blockType: "waiting_period",
          title: "הטיפול בוצע במהלך תקופת אכשרה",
          badge: "תקופת אכשרה פעילה",
          message: `תאריך ביצוע הטיפול (${this.formatToIsraeliDate(serviceDateStr)}) חל בתוך תקופת האכשרה הנדרשת בפוליסה עבור כיסוי זה (${wp.monthsRequired || 12} חודשים ממועד ההצטרפות, שמסתיימת ב-${endFormatted}).`,
          solution: `באפשרותך להגיש תביעות להחזר כספי עבור טיפולים שיבוצעו החל מיום ${endFormatted} ואילך.`,
          actionLabel: "עדכון תאריך הטיפול",
          actionType: "edit_date"
        };
      }
    }

    // 3. Check Coverage Added Later (Treatment Date < Coverage Start Date)
    if (catId && serviceDateStr && user.coverages && user.coverages[catId] && user.coverages[catId].startDate) {
      const covStart = this.parseIsraeliDate(this.formatToIsraeliDate(user.coverages[catId].startDate));
      const sDate = this.parseIsraeliDate(serviceDateStr);
      if (sDate && covStart && sDate < covStart) {
        const startFormatted = this.formatToIsraeliDate(user.coverages[catId].startDate);
        return {
          blocked: true,
          blockType: "added_later",
          title: "הכיסוי נוסף לפוליסה לאחר מועד ביצוע הטיפול",
          badge: "תחולת כיסוי מאוחרת",
          message: `מועד ביצוע הטיפול המבוקש (${this.formatToIsraeliDate(serviceDateStr)}) קודם למועד הוספת נספח הכיסוי הרפואי לפוליסה שלך (${startFormatted}).`,
          solution: `באפשרותך להגיש תביעות עבור טיפולים ופרוצדורות שבוצעו החל מתאריך תחילת הכיסוי (${startFormatted}) ואילך.`,
          actionLabel: "עדכון תאריך הטיפול",
          actionType: "edit_date"
        };
      }
    }

    // 4. Check Coverage Cancelled Early (Treatment Date > Cancellation Date)
    if (catId && serviceDateStr && user.coverages && user.coverages[catId] && user.coverages[catId].cancelDate) {
      const covCancel = this.parseIsraeliDate(this.formatToIsraeliDate(user.coverages[catId].cancelDate));
      const sDate = this.parseIsraeliDate(serviceDateStr);
      if (sDate && covCancel && sDate > covCancel) {
        const cancelFormatted = this.formatToIsraeliDate(user.coverages[catId].cancelDate);
        return {
          blocked: true,
          blockType: "cancelled_early",
          title: "הכיסוי בוטל לפני מועד ביצוע הטיפול",
          badge: "כיסוי מבוטל בפוליסה",
          message: `מועד ביצוע הטיפול המבוקש (${this.formatToIsraeliDate(serviceDateStr)}) חל לאחר מועד ביטול הכיסוי הרפואי בפוליסה (בוטל ביום ${cancelFormatted}).`,
          solution: "באפשרותך לפנות לשירות הלקוחות בטלפון *6540 לבדיקת אפשרות לחידוש הכיסוי הרפואי או הגשת בקשה חריגה.",
          actionLabel: "מעבר לאזור האישי",
          actionType: "go_dashboard"
        };
      }
    }

    // 5. Check Duplicate Claim
    if (opts.forceDuplicate || (catId === "consultation" && serviceDateStr === "01/10/2026" && amount === 1800)) {
      return {
        blocked: true,
        blockType: "duplicate",
        title: "זוהתה תביעה כפולה במערכת",
        badge: "אזהרת תביעה כפולה",
        message: "זוהתה במערכת תביעה קודמת זהה שכבר הוגשה או נפרעה עבור טיפול זה (חשבונית מס' INV-771802 מיום 01/10/2026 על סך ₪1,800).",
        solution: "באפשרותך לעקוב אחר סטטוס הטיפול בתביעה הקיימת ואישורי התשלום בפורטל התביעות האישי שלך.",
        actionLabel: "מעבר לצפייה בתביעות שלי",
        actionType: "go_dashboard"
      };
    }

    return { blocked: false };
  },

  showPreValidationBlockerModal(res) {
    this.state.activeBlockerResult = res;

    const titleEl = document.getElementById("blockerModalTitle");
    const badgeEl = document.getElementById("blockerReasonBadge");
    const msgEl = document.getElementById("blockerMessageText");
    const solContainer = document.getElementById("blockerSolutionContainer");
    const solEl = document.getElementById("blockerSolutionText");
    const btnAction = document.getElementById("btnBlockerPrimaryAction");

    if (titleEl) titleEl.innerText = res.title || "הודעת מערכת: לא ניתן להגיש את הבקשה";
    if (badgeEl) badgeEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${res.badge || 'זיהוי חסימת אימות מקדים'}`;
    if (msgEl) msgEl.innerText = res.message || "";

    if (solContainer && solEl) {
      if (res.solution && res.solution.trim()) {
        solContainer.style.display = "block";
        solEl.innerText = res.solution;
      } else {
        solContainer.style.display = "none";
        solEl.innerText = "";
      }
    }

    if (btnAction) {
      btnAction.innerHTML = `<i class="fa-solid fa-arrow-left"></i> <span>${res.actionLabel || 'מעבר לאזור האישי'}</span>`;
    }

    this.openModal("modalPreValidationBlocker");
  },

  handleBlockerAction() {
    const res = this.state.activeBlockerResult;
    this.closeModal("modalPreValidationBlocker");

    if (!res) {
      this.closeWizardAndShowDashboard();
      return;
    }

    if (res.actionType === "change_category") {
      this.jumpToStep(1);
    } else if (res.actionType === "edit_date") {
      this.jumpToStep(2);
      setTimeout(() => document.getElementById("wizardServiceDate")?.focus(), 300);
    } else {
      this.closeWizardAndShowDashboard();
    }
  },

  proceedWithLowConfidenceDoc() {
    this.closeModal("modalLowConfidenceDoc");
    this.state.wizard.lowConfidenceAccepted = true;
    if (this.state.wizard.docs.invoice) {
      this.state.wizard.docs.invoice.manualReviewNeeded = true;
      this.state.wizard.docs.invoice.ocrConfidence = 0.68;
    }
    this.saveDraftToStorage();
    this.renderRequiredDocsList();
    this.updateStickyFooterCTA();
  },

  reuploadClearDoc() {
    this.closeModal("modalLowConfidenceDoc");
    this.simulateDocumentUpload(false);
  },

  // Inline Field Error Feedback
  showFieldError(inputId, errorText) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.classList.add("is-invalid");

    const parent = input.closest(".form-group") || input.parentElement;
    parent.querySelector(".invalid-feedback")?.remove();
    parent.querySelector(".field-warning-feedback")?.remove();

    // Hide field hint to show error tightly in its place
    const hint = parent.querySelector(".form-hint");
    if (hint) hint.style.display = "none";

    const feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    feedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${errorText}</span>`;
    parent.appendChild(feedback);
  },

  // Immediate Clear of a Single Field's Error
  clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.classList.remove("is-invalid");
    const parent = input.closest(".form-group") || input.parentElement;
    if (parent) {
      parent.querySelector(".invalid-feedback")?.remove();

      // Restore hint if no warning is active
      if (!parent.querySelector(".field-warning-feedback")) {
        const hint = parent.querySelector(".form-hint");
        if (hint) hint.style.display = "block";
      }
    }

    // Check if there are any remaining invalid fields in the current wizard step
    const currentStepEl = document.getElementById(`stepContent${this.state.wizard.currentStep}`);
    if (currentStepEl && !currentStepEl.querySelector(".is-invalid")) {
      currentStepEl.querySelector(".step-validation-banner")?.remove();
    }
  },

  // Setup Real-time Validation (On Blur: Flag if left empty/invalid; On Input/Select: Clear immediately)
  setupRealtimeFieldValidation() {
    // Step 1 - Dependent inputs
    const depName = document.getElementById("depName");
    depName?.addEventListener("blur", () => {
      if (this.state.wizard.beneficiary !== "dependent") return;
      const v = depName.value.trim();
      if (!v || v.length < 2) {
        this.showFieldError("depName", "חובה להזין שם מלא של בן/בת המשפחה (לפחות 2 אותיות)");
      } else {
        this.clearFieldError("depName");
      }
    });
    depName?.addEventListener("input", () => {
      if (depName.value.trim().length >= 2) this.clearFieldError("depName");
    });

    const depId = document.getElementById("depId");
    depId?.addEventListener("blur", () => {
      if (this.state.wizard.beneficiary !== "dependent") return;
      const v = depId.value.trim();
      if (!v || !this.isValidIsraeliId(v)) {
        this.showFieldError("depId", "מספר תעודת זהות אינו תקין (נדרש מספר ת.ז. ישראלי תקין בן 9 ספרות)");
      } else {
        this.clearFieldError("depId");
      }
    });
    depId?.addEventListener("input", () => {
      if (this.isValidIsraeliId(depId.value.trim())) this.clearFieldError("depId");
    });

    const depBirth = document.getElementById("depBirthDate");
    depBirth?.addEventListener("blur", () => {
      if (this.state.wizard.beneficiary !== "dependent") return;
      const v = depBirth.value.trim();
      if (!v || !this.isValidIsraeliDate(v, false)) {
        this.showFieldError("depBirthDate", "תאריך לידה אינו תקין (נדרש תאריך עבר תקף: DD/MM/YYYY)");
      } else {
        this.clearFieldError("depBirthDate");
      }
    });
    depBirth?.addEventListener("input", () => {
      if (this.isValidIsraeliDate(depBirth.value.trim(), false)) this.clearFieldError("depBirthDate");
    });

    // Step 2 - Medical Details
    const serviceDate = document.getElementById("wizardServiceDate");
    serviceDate?.addEventListener("blur", () => {
      const v = serviceDate.value.trim();
      if (!v) {
        this.showFieldError("wizardServiceDate", "חובה להזין את תאריך ביצוע הטיפול (DD/MM/YYYY)");
      } else if (!this.isValidIsraeliDate(v, false)) {
        this.showFieldError("wizardServiceDate", "תאריך טיפול שגוי. יש להזין תאריך עבר תקף בפורמט DD/MM/YYYY (למשל: 28/09/2026)");
      } else {
        this.clearFieldError("wizardServiceDate");
      }
    });
    serviceDate?.addEventListener("input", () => {
      const v = serviceDate.value.trim();
      if (v && this.isValidIsraeliDate(v, false)) {
        this.clearFieldError("wizardServiceDate");
      }
    });

    const claimAmount = document.getElementById("wizardClaimAmount");
    claimAmount?.addEventListener("blur", () => {
      const v = claimAmount.value.trim();
      if (!v || isNaN(Number(v)) || Number(v) <= 0) {
        this.showFieldError("wizardClaimAmount", "חובה להזין סכום תביעה חיובי ותקף בש\"ח (גדול מ-0 ₪)");
      } else {
        this.clearFieldError("wizardClaimAmount");
      }
    });
    claimAmount?.addEventListener("input", () => {
      const v = claimAmount.value.trim();
      if (v && !isNaN(Number(v)) && Number(v) > 0) {
        this.clearFieldError("wizardClaimAmount");
      }
    });

    const providerName = document.getElementById("wizardProviderName");
    providerName?.addEventListener("focus", () => {
      this.clearFieldError("wizardDoctorName");
      const docGroup = document.getElementById("wizardDoctorName")?.closest(".form-group");
      docGroup?.querySelector(".field-warning-feedback")?.remove();
      const docHint = docGroup?.querySelector(".form-hint");
      if (docHint) docHint.style.display = "block";
    });
    providerName?.addEventListener("blur", () => {
      setTimeout(() => {
        const v = providerName.value.trim();
        if (!v || v.length < 2) {
          this.showFieldError("wizardProviderName", "חובה לבחור או להקליד שם מרכז רפואי / בית חולים / מרפאה");
        } else {
          this.clearFieldError("wizardProviderName");
        }
      }, 250);
    });
    providerName?.addEventListener("input", () => {
      const v = providerName.value.trim();
      if (v && v.length >= 2) {
        this.clearFieldError("wizardProviderName");
        this.clearFieldError("wizardDoctorName");
      }
    });

    const doctorName = document.getElementById("wizardDoctorName");
    doctorName?.addEventListener("blur", () => {
      setTimeout(() => {
        const pVal = document.getElementById("wizardProviderName")?.value.trim();
        // If provider is not filled, do NOT flag doctor field with red error
        if (!pVal) {
          this.clearFieldError("wizardDoctorName");
          return;
        }

        const v = doctorName.value.trim();
        if (!v || v.length < 2) {
          this.showFieldError("wizardDoctorName", "חובה לבחור או להקליד שם רופא/ה מטפל/ת או מספר רישיון משרד הבריאות");
        } else {
          this.clearFieldError("wizardDoctorName");
        }
      }, 250);
    });
    doctorName?.addEventListener("input", () => {
      const v = doctorName.value.trim();
      if (v && v.length >= 2) {
        this.clearFieldError("wizardDoctorName");
      }
    });
  },

  // Step Top Validation Alert Banner
  showStepValidationBanner(stepNum, title, issuesList = []) {
    const stepContent = document.getElementById(`stepContent${stepNum}`);
    if (!stepContent) return;

    // Remove old banner
    stepContent.querySelector(".step-validation-banner")?.remove();

    const banner = document.createElement("div");
    banner.className = "step-validation-banner";
    banner.innerHTML = `
      <h4><i class="fa-solid fa-triangle-exclamation"></i> ${title}</h4>
      ${issuesList.length > 0 ? `<ul>${issuesList.map(item => `<li>${item}</li>`).join("")}</ul>` : ''}
    `;

    stepContent.prepend(banner);
    window.scrollTo({ top: banner.offsetTop - 90, behavior: "smooth" });
  },

  clearValidationErrors() {
    document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
    document.querySelectorAll(".invalid-feedback").forEach(el => el.remove());
    document.querySelectorAll(".field-warning-feedback").forEach(el => el.remove());
    document.querySelectorAll(".form-hint").forEach(hint => hint.style.display = "block");
    document.querySelectorAll(".step-validation-banner").forEach(el => el.remove());
    document.querySelectorAll(".doc-card.missing-error").forEach(el => el.classList.remove("missing-error"));
    document.querySelectorAll(".missing-error-badge").forEach(el => el.remove());
  },

  // Step 1 Validation (Beneficiary & Category)
  validateStep1() {
    this.clearValidationErrors();
    let isValid = true;
    const issues = [];

    if (this.state.wizard.beneficiary === "dependent") {
      const nameInput = document.getElementById("depName");
      const idInput = document.getElementById("depId");
      const birthInput = document.getElementById("depBirthDate");

      const fullName = nameInput?.value.trim();
      const idNum = idInput?.value.trim();
      const birthDate = birthInput?.value.trim();

      if (!fullName || fullName.length < 2) {
        this.showFieldError("depName", "חובה להזין שם מלא של בן/בת המשפחה (לפחות 2 אותיות)");
        issues.push("חסר שם מלא של בן/בת המשפחה");
        isValid = false;
      }

      if (!this.isValidIsraeliId(idNum)) {
        this.showFieldError("depId", "מספר תעודת זהות אינו תקין (נדרש מספר ת.ז. ישראלי תקין בן 9 ספרות כולל ספרת ביקורת)");
        issues.push("מספר תעודת זהות של בן/בת המשפחה אינו תקין");
        isValid = false;
      }

      if (!this.isValidIsraeliDate(birthDate, false)) {
        this.showFieldError("depBirthDate", "תאריך לידה אינו תקין (נדרש תאריך עבר בפורמט ישראלי: DD/MM/YYYY)");
        issues.push("תאריך הלידה אינו תקין או שחל בעתיד");
        isValid = false;
      }

      const relation = document.getElementById("depRelation")?.value || "child";
      if (relation === "guardian") {
        this.state.wizard.isGuardian = true;
      }
      this.state.wizard.dependentData = {
        fullName,
        idNum,
        birthDate,
        relation
      };
    }

    if (!this.state.wizard.selectedCategory) {
      this.showToast("חובה לבחור את סוג התביעה מתוך הרשימה", "danger");
      issues.push("לא נבחר סוג תביעה");
      isValid = false;
    }

    if (!isValid) {
      this.showStepValidationBanner(1, "לא ניתן להמשיך לשלב הבא עקב שדות חסרים או שגויים:", issues);
    }

    return isValid;
  },

  // Step 2 Validation (Date and Amount Only - Provider & Doctor auto-extracted via OCR)
  validateStep2() {
    this.clearValidationErrors();
    let isValid = true;
    const issues = [];

    const dateVal = document.getElementById("wizardServiceDate")?.value.trim();
    const amountVal = document.getElementById("wizardClaimAmount")?.value.trim();

    // 1. Service Date Validation (Israeli DD/MM/YYYY, Not Future)
    if (!dateVal) {
      this.showFieldError("wizardServiceDate", "חובה להזין את תאריך ביצוע הטיפול (DD/MM/YYYY)");
      issues.push("חסר תאריך ביצוע הטיפול");
      isValid = false;
    } else if (!this.isValidIsraeliDate(dateVal, false)) {
      this.showFieldError("wizardServiceDate", "תאריך טיפול שגוי. יש להזין תאריך עבר תקף בפורמט ישראלי: DD/MM/YYYY (למשל: 28/09/2026)");
      issues.push("תאריך ביצוע הטיפול אינו תקין או שחל בעתיד");
      isValid = false;
    }

    // 2. Claim Amount Validation
    if (!amountVal || isNaN(Number(amountVal)) || Number(amountVal) <= 0) {
      this.showFieldError("wizardClaimAmount", "חובה להזין סכום תביעה חיובי ותקף בש\"ח (גדול מ-0 ₪)");
      issues.push("חסר סכום תביעה כספי תקף בש\"ח");
      isValid = false;
    }

    if (!isValid) {
      this.showStepValidationBanner(2, "לא ניתן להתקדם לשלב המסמכים עקב נתונים חסרים או לא תקינים:", issues);
      return false;
    }

    // Update wizard state
    this.state.wizard.fields.serviceDate = this.parseIsraeliDateToISO(dateVal) || dateVal;
    this.state.wizard.fields.claimAmount = amountVal;

    // 3. Intelligent Pre-Validation Checks (Waiting Period, Coverage Dates, Duplicate Claim)
    const preCheck = this.checkPreValidationRules({
      category: this.state.wizard.selectedCategory,
      serviceDate: dateVal,
      amount: Number(amountVal)
    });

    if (preCheck.blocked) {
      this.showPreValidationBlockerModal(preCheck);
      return false;
    }

    return true;
  },

  // Step 3 Validation (Mandatory Documents, Readability Scores & Discrepancies)
  validateStep3() {
    this.clearValidationErrors();
    const cat = MOCK_DATA.claimCategories.find(c => c.id === this.state.wizard.selectedCategory) || MOCK_DATA.claimCategories[0];
    const mandatoryDocs = cat.requiredDocs.filter(d => d.mandatory);
    const missingDocs = mandatoryDocs.filter(d => !this.state.wizard.docs[d.id]);
    const issues = [];

    if (missingDocs.length > 0) {
      missingDocs.forEach(d => {
        issues.push(`חסר מסמך חובה: <strong>${d.name}</strong>`);
      });

      // Highlight missing doc cards
      document.querySelectorAll(".doc-card.mandatory").forEach(card => {
        const titleEl = card.querySelector(".doc-title");
        if (titleEl) {
          const matchingMissing = missingDocs.find(d => d.name === titleEl.innerText.trim());
          if (matchingMissing) {
            card.classList.add("missing-error");
            if (!card.querySelector(".missing-error-badge")) {
              const badge = document.createElement("div");
              badge.className = "missing-error-badge";
              badge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> מסמך חובה - חובה להעלות להמשך`;
              card.querySelector(".doc-header")?.after(badge);
            }
          }
        }
      });

      this.showStepValidationBanner(3, "לא ניתן להמשיך לסיכום התביעה: חסרים מסמכי חובה נדרשים:", issues);
      this.showToast(`חסרים ${missingDocs.length} מסמכי חובה. יש להעלותם לפני המעבר לשלב הבא!`, "danger");
      return false;
    }

    // Check Document Readability / OCR Clarity
    const invoiceDoc = this.state.wizard.docs.invoice;
    if (invoiceDoc) {
      if (invoiceDoc.ocrConfidence && invoiceDoc.ocrConfidence < 0.50) {
        this.showStepValidationBanner(3, "קובץ החשבונית נדחה עקב איכות לא קריאה:", [
          "המסמך שהועלה מטושטש, חשוך או חתוך בצורה שאינה מאפשרת פענוח OCR",
          "נדרש להעלות צילום או סריקה ברורה ומוארת היטב כדי להמשיך בתהליך"
        ]);
        this.showToast("המסמך שהועלה מטושטש ואינו קריא. חובה להעלות עותק ברור!", "danger");
        return false;
      }

      if (invoiceDoc.ocrConfidence && invoiceDoc.ocrConfidence >= 0.50 && invoiceDoc.ocrConfidence < 0.85 && !this.state.wizard.lowConfidenceAccepted) {
        const badge = document.getElementById("lowConfScoreBadge");
        if (badge) badge.innerText = `${Math.round(invoiceDoc.ocrConfidence * 100)}%`;
        this.openModal("modalLowConfidenceDoc");
        return false;
      }
    }

    // Check Data Discrepancy (אי-תאימות במידע בין טופס למסמך)
    const formAmount = Number(this.state.wizard.fields.claimAmount);
    if (invoiceDoc && invoiceDoc.detectedAmount && formAmount && invoiceDoc.detectedAmount !== formAmount && !this.state.wizard.varianceDismissed && !this.state.wizard.varianceExplanation) {
      this.openModal("modalSoftVariance");
      this.showToast("זוהתה אי-התאמה בין הסכום שהוזן לבין החשבונית הסרוקה", "warning");
      return false;
    }

    return true;
  },

  handleWizardNext() {
    const step = this.state.wizard.currentStep;

    if (step === 1) {
      if (!this.validateStep1()) return;
      this.renderWizardStep(2);
    } else if (step === 2) {
      if (!this.validateStep2()) return;
      this.renderWizardStep(3);
    } else if (step === 3) {
      if (!this.validateStep3()) return;
      this.renderWizardStep(4);
    } else if (step === 4) {
      this.submitNewClaim();
    }
  },

  handleWizardPrev() {
    const step = this.state.wizard.currentStep;
    if (step > 1) {
      this.clearValidationErrors();
      this.renderWizardStep(step - 1);
    }
  },

  submitNewClaim() {
    // Pre-flight validation on all previous steps
    if (!this.validateStep1()) {
      this.jumpToStep(1);
      return;
    }
    if (!this.validateStep2()) {
      this.jumpToStep(2);
      return;
    }
    if (!this.validateStep3()) {
      this.jumpToStep(3);
      return;
    }

    // Final Pre-Flight Hard Block Check
    const preCheck = this.checkPreValidationRules({
      category: this.state.wizard.selectedCategory,
      serviceDate: this.state.wizard.fields.serviceDate,
      amount: Number(this.state.wizard.fields.claimAmount),
      provider: this.state.wizard.fields.providerName
    });

    if (preCheck.blocked) {
      this.showPreValidationBlockerModal(preCheck);
      return;
    }

    const cat = MOCK_DATA.claimCategories.find(c => c.id === this.state.wizard.selectedCategory) || MOCK_DATA.claimCategories[0];
    const newClaimId = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const isGuardian = this.state.wizard.beneficiary === "guardian" || Boolean(this.state.wizard.isGuardian) || (this.state.wizard.dependentData && this.state.wizard.dependentData.relation === "guardian");
    const isDep = this.state.wizard.beneficiary === "dependent" && !isGuardian;
    let custName = "ישראל ישראלי";
    let custId = "028475913";

    if (isDep) {
      custName = this.state.wizard.dependentData.fullName || "בן משפחה";
      custId = this.state.wizard.dependentData.idNum || "039281745";
    } else if (isGuardian) {
      const gData = this.state.guardianship || {};
      custName = `${gData.wardName || 'רחל ישראלי'} (אפוטרופוס: ישראל ישראלי)`;
      custId = gData.wardId || "019283746";
    }

    const preValidationChecks = [
      { code: "CHK-COV", name: "בדיקת תוקף פוליסה", passed: true, detail: "פוליסה פעילה" },
      { code: "CHK-WAIT", name: "בדיקת תקופת אכשרה", passed: true, detail: "תקופת אכשרה הסתיימה" },
      { code: "CHK-DUP", name: "סריקת כפילויות", passed: true, detail: "לא אותרה כפילות" },
      { code: "CHK-AMT", name: "אימות סכום", passed: true, detail: `סכום ₪${Number(this.state.wizard.fields.claimAmount).toLocaleString()} אומת מול החשבונית` },
      { code: "CHK-DOCS", name: "שלמות מסמכים", passed: true, detail: "כל המסמכים צורפו" }
    ];

    if (isGuardian) {
      const gCase = (this.state.guardianship && this.state.guardianship.courtCase) || 'א"פ 42918-03-24';
      preValidationChecks.unshift({
        code: "CHK-LEGAL",
        name: "בדיקת כשרות משפטית וצו אפוטרופסות",
        passed: true,
        detail: `צו שיפוטי בתוקף (${gCase}), סמכות רפואית מאומתת עפ"י חוק הכשרות המשפטית`
      });
    }

    const newClaim = {
      id: newClaimId,
      customerName: custName,
      customerId: custId,
      policyNumber: "POL-773291-IL",
      claimType: cat.id,
      claimTypeName: cat.name,
      submissionDate: this.formatToIsraeliDate(new Date().toISOString().replace('T', ' ').substring(0, 16)),
      serviceDate: this.formatToIsraeliDate(this.state.wizard.fields.serviceDate) || "28/09/2026",
      claimedAmount: Number(this.state.wizard.fields.claimAmount) || 16800,
      providerName: this.state.wizard.fields.providerName || "בי\"ח אסותא",
      doctorName: this.state.wizard.fields.doctorName || "פרופ' אהוד רז",
      status: "Under Human Review",
      assignedHandlerId: "HND-04",
      assignedHandlerName: "רונית לוי",
      riskScore: "Low",
      aiConfidence: 0.94,
      isGuardian: isGuardian,
      guardianData: isGuardian ? { ...this.state.guardianship } : null,
      preValidation: {
        summary: isGuardian
          ? `תביעה מכוח אפוטרופסות הוגשה עבור ${(this.state.guardianship && this.state.guardianship.wardName) || 'המיוצג/ת'}. צו בימ"ש אומת אוטומטית.`
          : "תביעה חדשה הוגשה ואומתה אוטומטית על ידי מנוע ה-AI.",
        checks: preValidationChecks,
        explainability: isGuardian
          ? `התביעה מוגשת כדין ע"י האפוטרופוס הממונה ישראל ישראלי עבור ${(this.state.guardianship && this.state.guardianship.wardName) || 'המיוצג/ת'} (צו ${(this.state.guardianship && this.state.guardianship.courtCase) || 'בימ"ש'}). הועברה לבדיקת רפרנט.`
          : "התביעה הוגשה בהצלחה ונשלחה ישירות לתור הרפרנטית רונית לוי לקבלת החלטת אישור סופית."
      },
      hasVariance: this.state.wizard.fields.claimAmount !== "16800" && Object.keys(this.state.wizard.docs).some(k => this.state.wizard.docs[k].variance),
      varianceExplanation: this.state.wizard.varianceExplanation || (document.getElementById("varianceNoteInput") ? document.getElementById("varianceNoteInput").value : "ההפרש בסך ₪1,700 שולם ישירות לחברת השתלים (חשבונית מקדמה צורפה)"),
      documents: Object.keys(this.state.wizard.docs).map(k => ({
        id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
        type: k,
        name: this.state.wizard.docs[k].name,
        size: this.state.wizard.docs[k].size || "1.2MB",
        uploadDate: "כרגע",
        status: "Verified",
        ocrConfidence: this.state.wizard.docs[k].ocrConfidence || 0.95
      })),
      auditTrail: [
        { timestamp: new Date().toLocaleTimeString('he-IL'), user: "פורטל מבוטחים", action: `התביעה הוגשה בהצלחה על ידי המבוטח (${custName})` },
        { timestamp: new Date().toLocaleTimeString('he-IL'), user: "מנוע AI", action: "אימות מקדים הושלם. דירוג סיכון: נמוך." }
      ]
    };

    this.state.claims.unshift(newClaim);
    this.saveClaimsToStorage();
    localStorage.removeItem("ofek_wizard_draft");

    this.showToast(`תביעה מס' ${newClaimId} הוגשה בהצלחה! תוכל לעקוב אחר הסטטוס באזור האישי.`, "success");
    this.closeWizardAndShowDashboard();
    this.renderCustomerClaims();
    this.renderHandlerInbox();
    this.renderManagerView();
    this.renderExecView();
  },

  // Customer Portal View State Controllers (Question 3)
  openNewClaimWizard() {
    const dashPanel = document.getElementById("customerDashboardPanel");
    const wizPanel = document.getElementById("customerWizardPanel");
    if (dashPanel) dashPanel.style.display = "none";
    if (wizPanel) wizPanel.style.display = "block";
    this.renderWizardStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  closeWizardAndShowDashboard() {
    const dashPanel = document.getElementById("customerDashboardPanel");
    const wizPanel = document.getElementById("customerWizardPanel");
    if (dashPanel) dashPanel.style.display = "block";
    if (wizPanel) wizPanel.style.display = "none";
    this.renderCustomerClaims();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderCustomerClaims() {
    const tbody = document.querySelector("#customerClaimsTable tbody");
    if (!tbody) return;

    tbody.innerHTML = this.state.claims.map(c => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td>${c.claimTypeName}</td>
        <td>${this.formatToIsraeliDate(c.submissionDate)}</td>
        <td>₪${c.claimedAmount.toLocaleString()}</td>
        <td>${this.renderStatusBadge(c.status)}</td>
        <td>
          ${c.status === "Waiting for Customer"
            ? `<button class="btn btn-warning" style="font-size: 0.78rem; padding: 0.3rem 0.75rem; display: inline-flex; align-items: center; gap: 0.4rem;" onclick="App.openCustomerUploadDocModal('${c.id}')"><i class="fa-solid fa-cloud-arrow-up"></i> השלמת מסמך חסר</button>`
            : `<span style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4;">${c.preValidation.summary}</span>`}
        </td>
      </tr>
    `).join("");
  },

  openCustomerUploadDocModal(claimId) {
    const claim = this.state.claims.find(c => c.id === claimId);
    if (!claim) return;

    this.state.customerUploadClaimId = claimId;
    document.getElementById("custUploadClaimId").innerText = claim.id;

    // Find missing doc
    const missingDoc = claim.documents.find(d => d.status === "Missing") || { name: "צילומי רנטגן ותוכנית טיפול" };
    document.getElementById("custUploadDocName").innerText = missingDoc.name;

    // Update explanation
    const lastAudit = claim.auditTrail.slice().reverse().find(a => a.action.includes("נשלחה הודעת") || a.action.includes("SMS")) || {
      action: "שלום, לצורך השלמת הטיפול בתביעה נדרש צירוף המסמך החסר."
    };
    document.getElementById("custUploadExplanation").innerText = lastAudit.action;

    // Reset preview
    document.getElementById("custModalFilePreview").style.display = "none";
    document.getElementById("custModalDropZone").style.display = "block";
    document.getElementById("custModalDropZone").classList.remove("is-invalid");
    this.state.customerUploadedDocReady = false;

    this.openModal("modalCustomerUploadDoc");
  },

  simulateCustomerModalFileUpload() {
    const claimId = this.state.customerUploadClaimId;
    const claim = this.state.claims.find(c => c.id === claimId);
    const missingDoc = claim ? claim.documents.find(d => d.status === "Missing") : null;
    const docName = missingDoc ? missingDoc.name : "מסמך_השלמה.pdf";

    document.getElementById("custModalUploadedFileName").innerText = `${docName.replace(/\s+/g, '_')}_סרוק.pdf`;
    document.getElementById("custModalFilePreview").style.display = "block";
    document.getElementById("custModalDropZone").style.display = "none";
    document.getElementById("custModalDropZone").classList.remove("is-invalid");
    this.state.customerUploadedDocReady = true;
  },

  handleCustomerDocSubmit() {
    if (!this.state.customerUploadedDocReady) {
      document.getElementById("custModalDropZone")?.classList.add("is-invalid");
      this.showToast("חובה לבחור או לגרור קובץ מסמך להעלאה לפני השליחה!", "danger");
      return;
    }

    const claimId = this.state.customerUploadClaimId;
    const claim = this.state.claims.find(c => c.id === claimId);
    if (!claim) return;

    // Update missing doc status
    const missingDoc = claim.documents.find(d => d.status === "Missing");
    if (missingDoc) {
      missingDoc.status = "Verified";
      missingDoc.name = `${missingDoc.name.replace(/\s+/g, '_')}_הושלם_ע_י_מבוטח.pdf`;
      missingDoc.size = "1.5MB";
      missingDoc.uploadDate = "כרגע";
    }

    // Update claim status back to review
    claim.status = "Under Human Review";
    claim.preValidation.summary = "המבוטח השלים את המסמכים החסרים. התביעה הוחזרה לבדיקת רפרנט.";
    claim.auditTrail.push({
      timestamp: new Date().toLocaleTimeString('he-IL'),
      user: "פורטל מבוטח",
      action: `המבוטח העלה בהצלחה את המסמך החסר: ${missingDoc ? missingDoc.name : 'מסמך משלים'}`
    });

    this.saveClaimsToStorage();
    this.closeModal("modalCustomerUploadDoc");
    this.showToast(`המסמך נשלח בהצלחה! התביעה הועברה להמשך טיפול רפרנט.`, "success");

    this.renderCustomerClaims();
    this.renderHandlerInbox();
    this.renderManagerView();
    this.renderExecView();
    this.updateInspector(claim.id);
  },

  // =========================================================================
  // 2. CLAIMS HANDLER WORKSPACE LOGIC (Human-In-The-Loop)
  // =========================================================================

  renderHandlerInbox(filter = "all") {

    const tbody = document.querySelector("#handlerClaimsTable tbody");
    if (!tbody) return;

    let list = this.state.claims;
    if (filter === "Under Human Review") {
      list = list.filter(c => c.status === "Under Human Review");
    } else if (filter === "Waiting for Customer") {
      list = list.filter(c => c.status === "Waiting for Customer");
    } else if (filter === "Fast Track") {
      list = list.filter(c => c.riskScore === "Low");
    } else if (filter === "Duplicate Alert") {
      list = list.filter(c => c.riskScore === "High" || c.id === "CLM-2026-8812");
    } else if (filter === "Guardian Claim") {
      list = list.filter(c => c.isGuardian || !!c.guardianData);
    }

    const guardianFilterCount = document.getElementById("guardianFilterCount");
    if (guardianFilterCount) {
      guardianFilterCount.innerText = this.state.claims.filter(c => c.isGuardian || !!c.guardianData).length;
    }

    tbody.innerHTML = list.map(c => `
      <tr onclick="App.updateInspector('${c.id}')" style="${this.state.currentClaimId === c.id ? 'background: #f0f9ff;' : ''}">
          <td><strong>${c.id}</strong></td>
          <td>
            ${c.customerName}
            ${c.isGuardian ? `<br><span class="badge badge-info" style="font-size: 0.72rem; padding: 0.15rem 0.45rem; margin-top: 0.2rem; display: inline-flex; align-items: center; gap: 0.25rem; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;"><i class="fa-solid fa-scale-balanced"></i>  אפוטרופוס</span>` : ''}
          </td>
          <td>${c.claimTypeName}</td>
        <td>₪${c.claimedAmount.toLocaleString()}</td>
        <td>
          <span class="badge ${c.riskScore === 'Low' ? 'badge-success' : c.riskScore === 'Medium' ? 'badge-warning' : 'badge-danger'}">
            ${c.riskScore === 'Low' ? 'נמוך (אישור מהיר)' : c.riskScore === 'Medium' ? 'בינוני (אי-התאמה)' : 'גבוה (חריגה/כפילות)'}
          </span>
        </td>
        <td>${this.renderStatusBadge(c.status)}</td>
        <td style="max-width: 260px; font-size: 0.8rem; color: var(--text-secondary);">${c.preValidation.summary}</td>
        <td>
          <button class="btn btn-secondary" style="font-size: 0.78rem; padding: 0.3rem 0.6rem;">
            בדיקה <i class="fa-solid fa-arrow-left"></i>
          </button>
        </td>
      </tr>
    `).join("");

    const queueCountBadge = document.getElementById("handlerQueueCount");
    if (queueCountBadge) {
      queueCountBadge.innerText = this.state.claims.filter(c => c.status === "Under Human Review" || c.status === "Initial Validation").length;
    }
  },

  filterHandlerInbox(filter) {
    this.renderHandlerInbox(filter);
  },

  updateInspector(claimId) {
    this.state.currentClaimId = claimId;
    const claim = this.state.claims.find(c => c.id === claimId) || this.state.claims[0];
    if (!claim) return;

    // Show only Inspector and hide Queue Table (Question 2)
    const queueCard = document.getElementById("handlerQueueCard");
    const inspector = document.getElementById("handlerClaimInspector");
    if (queueCard) queueCard.style.display = "none";
    if (inspector) inspector.style.display = "block";

    document.getElementById("inspectClaimTitle").innerText = `בדיקת תביעה: ${claim.id} • ${claim.customerName}`;
    document.getElementById("inspectClaimSubtitle").innerText = `פוליסה: ${claim.policyNumber} | תאריך טיפול: ${this.formatToIsraeliDate(claim.serviceDate)} | מבוטח/ת: ${claim.customerId}`;

    // Risk badge
    const riskBadge = document.getElementById("inspectRiskBadge");
    if (riskBadge) {
      riskBadge.className = `badge ${claim.riskScore === 'Low' ? 'badge-success' : claim.riskScore === 'Medium' ? 'badge-warning' : 'badge-danger'}`;
      riskBadge.innerText = `רמת סיכון AI: ${claim.riskScore} (${claim.aiConfidence})`;
    }

    // Pre-validation checks collapsible card reset to closed by default
    const checksCard = document.getElementById("cardInspectAiChecks");
    if (checksCard) {
      const header = checksCard.querySelector(".collapsible-header");
      const content = checksCard.querySelector(".collapsible-content");
      if (header) header.classList.remove("open");
      if (content) content.classList.remove("open");
    }

    const checksList = document.getElementById("inspectChecksList");
    if (checksList) {
      checksList.innerHTML = claim.preValidation.checks.map(chk => `
        <div class="check-item">
          <i class="fa-solid ${chk.passed ? 'fa-circle-check check-status-icon passed' : chk.severity === 'soft_variance' ? 'fa-triangle-exclamation check-status-icon warning' : 'fa-circle-xmark check-status-icon failed'}"></i>
          <div>
            <strong style="font-size: 0.88rem;">${chk.name}</strong>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">${chk.detail}</p>
          </div>
        </div>
      `).join("");
    }

    // Prominent Highlight for Discrepancy & Customer Explanation (Question 1)
    const varianceBannerEl = document.getElementById("inspectVarianceBannerContainer");
    if (varianceBannerEl) {
      const hasVariance = claim.hasVariance || (claim.id === "CLM-2026-8810") || (claim.preValidation && claim.preValidation.checks.some(c => c.severity === 'soft_variance'));
      if (hasVariance) {
        const explanation = claim.varianceExplanation || "ההפרש בסך ₪1,700 שולם כמקדמה ישירה לחברת השתלים (חשבונית מקדמה צורפה).";
        varianceBannerEl.innerHTML = `
          <div class="variance-callout-banner">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap;">
              <div style="display: flex; gap: 0.6rem; align-items: flex-start;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.4rem; color: #d97706; margin-top: 0.15rem;"></i>
                <div>
                  <strong style="color: #92400e; font-size: 0.95rem; display: block;">
                    זוהתה אי-התאמה בסכום (פער של ₪1,700): הוזן ₪18,500 מול ₪16,800 בחשבונית
                  </strong>
                  <div style="background: #ffffff; border: 1px dashed #f59e0b; border-radius: var(--radius-sm); padding: 0.65rem 0.9rem; margin-top: 0.45rem;">
                    <strong style="font-size: 0.82rem; color: #b45309; display: flex; align-items: center; gap: 0.35rem;">
                      <i class="fa-solid fa-quote-right"></i> הסבר המבוטח שנמסר בעת ההגשה:
                    </strong>
                    <p style="font-size: 0.88rem; color: #1e293b; margin: 0.3rem 0 0 0; font-style: italic; font-weight: 500;">
                      "${explanation}"
                    </p>
                  </div>
                </div>
              </div>
              <button class="btn btn-warning" style="font-size: 0.76rem; padding: 0.35rem 0.65rem; white-space: nowrap;" onclick="App.openModal('modalSoftVariance')">
                <i class="fa-solid fa-scale-unbalanced"></i> צפה בהשוואת OCR
              </button>
            </div>
          </div>
        `;
      } else {
        varianceBannerEl.innerHTML = "";
      }
    }

    // -------------------------------------------------------------------------
    // Prominent Guardianship Legal Status & Referent Decision Box
    // -------------------------------------------------------------------------
    const guardBanner = document.getElementById("inspectGuardianshipBannerContainer");
    if (guardBanner) {
      const isGuard = claim.isGuardian || !!claim.guardianData;
      if (isGuard) {
        guardBanner.style.display = "block";
        const gData = claim.guardianData || (this.state.guardianship && this.state.guardianship.isApproved ? this.state.guardianship : {
          wardName: "רחל ישראלי",
          wardId: "019283746",
          guardianName: "ישראל ישראלי",
          guardianId: "028475913",
          courtCase: 'א"פ 42918-03-24',
          scope: "עניינים רפואיים, ביטוחיים ואישיים"
        });

        const wardNameEl = document.getElementById("inspectWardNameText");
        const wardIdEl = document.getElementById("inspectWardIdText");
        const gNameEl = document.getElementById("inspectGuardianNameText");
        const courtEl = document.getElementById("inspectCourtCaseText");
        const scopeEl = document.getElementById("inspectScopeText");
        const badgeContainer = document.getElementById("inspectGuardianshipStatusBadgeContainer");
        const stampEl = document.getElementById("referentGuardianshipStamp");
        const btnApprove = document.getElementById("btnApproveGuardianReferent");
        const btnReject = document.getElementById("btnRejectGuardianReferent");

        if (wardNameEl) wardNameEl.innerText = gData.wardName || "רחל ישראלי";
        if (wardIdEl) wardIdEl.innerText = gData.wardId || "019283746";
        if (gNameEl) gNameEl.innerText = gData.guardianName || "ישראל ישראלי";
        if (courtEl) courtEl.innerText = gData.courtCase || 'א"פ 42918-03-24';
        if (scopeEl) scopeEl.innerText = gData.scope || "עניינים רפואיים, ביטוחיים ואישיים";

        const isApprovedByRef = !!claim.guardianApprovedByReferent;
        if (isApprovedByRef) {
          if (badgeContainer) {
            badgeContainer.innerHTML = `
              <span class="badge badge-success" style="font-size: 0.8rem; font-weight: 700;">
                <i class="fa-solid fa-circle-check"></i> אושר ע"י רפרנטית רונית לוי
              </span>
            `;
          }
          if (stampEl) {
            stampEl.innerHTML = `
              <div style="color: #166534; font-weight: 700; font-size: 0.86rem; display: flex; align-items: center; gap: 0.4rem;">
                <i class="fa-solid fa-stamp" style="font-size: 1.15rem;"></i>
                <span>תוקף הצו נבדק ואושר כדין ע"י רונית לוי • ${claim.guardianApprovedAt || 'מאושר לרישום'}</span>
              </div>
            `;
          }
          if (btnApprove) {
            btnApprove.innerHTML = `<i class="fa-solid fa-rotate-left"></i> ביטול אישור`;
            btnApprove.className = "btn btn-secondary";
            btnApprove.style.fontSize = "0.78rem";
          }
          if (btnReject) btnReject.style.display = "none";
        } else {
          if (badgeContainer) {
            badgeContainer.innerHTML = `
              <span class="badge badge-warning" style="font-size: 0.8rem; font-weight: 700;">
                <i class="fa-solid fa-clock"></i> ממתין לבדיקת והחלטת רפרנט
              </span>
            `;
          }
          if (stampEl) {
            stampEl.innerHTML = `
              <div style="color: #92400e; font-size: 0.84rem; display: flex; align-items: center; gap: 0.4rem;">
                <i class="fa-solid fa-triangle-exclamation text-warning"></i>
                <span>נדרש אישור תוקף צו שיפוטי ע"י רפרנט טרם אישור סופי של התביעה</span>
              </div>
            `;
          }
          if (btnApprove) {
            btnApprove.innerHTML = `<i class="fa-solid fa-check-double"></i> אשר תוקף אפוטרופסות לתביעה זו`;
            btnApprove.className = "btn btn-success";
            btnApprove.style.fontSize = "0.8rem";
          }
          if (btnReject) btnReject.style.display = "inline-flex";
        }
      } else {
        guardBanner.style.display = "none";
      }
    }

    // Dynamic Multi-Document Viewer with Tabs (Question 5)
    this.renderDocumentViewer(claim, 0);

    // Explainability
    document.getElementById("inspectExplainability").innerText = claim.preValidation.explainability || claim.preValidation.summary;

    // Dynamic Multi-Document Viewer with Tabs (Renders document preview & dynamic extracted fields)
    this.renderDocumentViewer(claim, 0);

    // Reset Checklist
    if (document.getElementById("chkReviewId")) document.getElementById("chkReviewId").checked = false;
    if (document.getElementById("chkReviewProvider")) document.getElementById("chkReviewProvider").checked = false;
    if (document.getElementById("chkReviewAmount")) document.getElementById("chkReviewAmount").checked = false;
    if (document.getElementById("chkReviewPolicy")) document.getElementById("chkReviewPolicy").checked = false;

    // Scroll smoothly to top of inspector
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // Handler View State Controller (Question 2)
  closeInspectorAndShowInbox() {
    const queueCard = document.getElementById("handlerQueueCard");
    const inspector = document.getElementById("handlerClaimInspector");
    if (queueCard) queueCard.style.display = "block";
    if (inspector) inspector.style.display = "none";
    this.renderHandlerInbox();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // Dynamic Multi-Document Viewer Renderer (Populates Document Simulation & Extracted Fields on Left Panel)
  renderDocumentViewer(claim, activeDocIndex = 0) {
    const tabsContainer = document.getElementById("docViewerTabs");
    const contentBox = document.getElementById("mockDocContent");
    const metaFileName = document.getElementById("inspectDocFileName");
    const metaConfidence = document.getElementById("inspectDocConfidence");
    const activeDocNameEl = document.getElementById("handlerActiveDocName");
    const docFieldsBadgeEl = document.getElementById("handlerDocFieldsBadge");
    const fieldsGrid = document.getElementById("handlerExtractedFieldsGrid");
    if (!tabsContainer || !contentBox) return;

    const docs = (claim.documents && claim.documents.length > 0) ? claim.documents : [
      { id: "DOC-101", type: "invoice", name: "חשבונית_אסותא_ספטמבר.pdf", size: "1.4MB", status: "Verified", uploadDate: "2026-10-06 09:30" }
    ];

    const currentDoc = docs[activeDocIndex] || docs[0];

    // Render Document Switcher Tabs
    tabsContainer.innerHTML = docs.map((doc, idx) => `
      <button class="doc-tab-btn ${idx === activeDocIndex ? 'active' : ''}" onclick="App.renderDocumentViewer(App.state.claims.find(c => c.id === '${claim.id}'), ${idx})">
        <i class="fa-solid ${doc.type === 'invoice' ? 'fa-file-invoice-dollar' : doc.type === 'discharge' ? 'fa-file-medical' : doc.type === 'op_report' ? 'fa-file-signature' : doc.type === 'xray' ? 'fa-x-ray' : doc.type === 'prescription' ? 'fa-prescription-bottle' : 'fa-file-lines'}"></i>
        ${doc.name.replace(/\.pdf$/i, '').substring(0, 22)}
        ${doc.status === 'Missing' ? '<span class="badge badge-danger" style="font-size: 0.65rem; padding: 1px 4px;">חסר</span>' : ''}
      </button>
    `).join("");

    if (metaFileName) metaFileName.innerText = currentDoc.name;
    if (metaConfidence) metaConfidence.innerText = currentDoc.status === "Missing" ? "טרם הועלה" : `${Math.round((currentDoc.ocrConfidence || 0.96) * 100)}%`;
    if (activeDocNameEl) activeDocNameEl.innerText = `קובץ פעיל: ${currentDoc.name} (${currentDoc.status === 'Missing' ? 'מסמך חסר' : 'נסרק בהצלחה'})`;

    // Render Document Body simulation based on type
    if (currentDoc.status === "Missing") {
      contentBox.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: #dc2626;">
          <i class="fa-solid fa-file-circle-xmark" style="font-size: 3rem; margin-bottom: 0.75rem;"></i>
          <h4 style="margin: 0 0 0.5rem 0;">${currentDoc.name} - מסמך חסר בתיק</h4>
          <p style="font-size: 0.88rem; color: #64748b;">
            המבוטח טרם העלה את המסמך החיוני. ניתן לשלוח דרישת השלמה ישירה בלחיצה על הכפתור למטה.
          </p>
          <button class="btn btn-warning" style="margin-top: 0.75rem; font-size: 0.82rem;" onclick="App.openModal('modalRequestInfo')">
            <i class="fa-solid fa-envelope-open-text"></i> שליחת בקשת השלמת מסמך למבוטח
          </button>
        </div>
      `;
    } else if (currentDoc.type === "invoice" || currentDoc.name.includes("חשבונית") || currentDoc.name.includes("קבלה")) {
      const amt = (claim.preValidation && claim.preValidation.extractedOcrData && claim.preValidation.extractedOcrData.invoice) ? claim.preValidation.extractedOcrData.invoice.detectedAmount : 16800;
      contentBox.innerHTML = `
        <div style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
          <h4 style="margin: 0;">${claim.providerName || "אסותא מרכזים רפואיים בע\"מ"}</h4>
          <small>קבלה / חשבונית מס מקור: INV-992014-A • קובץ: ${currentDoc.name}</small>
        </div>
        <p><strong>לכבוד:</strong> <span class="doc-ocr-bounding-box" title="זוהה ב-OCR (99% ביטחון)">${claim.customerName}</span> (ת.ז: <span class="doc-ocr-bounding-box">${claim.customerId}</span>)</p>
        <p><strong>תאריך השירות:</strong> <span class="doc-ocr-bounding-box">${this.formatToIsraeliDate(claim.serviceDate)}</span></p>
        <p><strong>פירוט פרוצדורה / טיפול:</strong> <span class="doc-ocr-bounding-box">${claim.claimTypeName} (${claim.doctorName || 'פרופ\' אהוד רז'})</span></p>
        <div style="margin-top: 1rem; border-top: 1px dashed #999; padding-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span>סך הכל לתשלום ששולם בפועל:</span>
          <strong class="doc-ocr-bounding-box" style="font-size: 1.15rem; color: #b45309;" title="חולץ ע&quot;י מנוע AI: ₪${amt.toLocaleString()}">₪${amt.toLocaleString()}.00</strong>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #64748b; text-align: left; direction: ltr;">
          Payment Confirmation: APPROVED_TRANS_49182 • POS_TERMINAL_02
        </div>
      `;
    } else if (currentDoc.type === "discharge" || currentDoc.name.includes("שחרור") || currentDoc.name.includes("סיכום")) {
      contentBox.innerHTML = `
        <div style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
          <h4 style="margin: 0;">מכתב שחרור וסיכום אשפוז כירורגי</h4>
          <small>${claim.providerName || "בי\"ח אסותא רמת החייל"} • מחלקה כירורגית</small>
        </div>
        <p><strong>שם מטופל:</strong> <span class="doc-ocr-bounding-box">${claim.customerName}</span> (ת.ז: ${claim.customerId})</p>
        <p><strong>תאריכי אשפוז:</strong> <span class="doc-ocr-bounding-box">${this.formatToIsraeliDate(claim.serviceDate)}</span> עד ${this.formatToIsraeliDate(claim.serviceDate)}</p>
        <p><strong>אבחנה קלינית (Diagnosis):</strong> <span class="doc-ocr-bounding-box" style="color: #1e40af; font-weight: 700;">Inguinal Hernia Repair with Prolene Mesh</span></p>
        <p><strong>מהלך הטיפול:</strong> בוצע ניתוח לפרוסקופי ללא סיבוכים. הומלץ על מנוחה למשך שבועיים וביקורת מרפאה.</p>
        <div style="margin-top: 1rem; border-top: 1px dashed #999; padding-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span>חתימת רופא מנתח: <strong class="doc-ocr-bounding-box">${claim.doctorName || "פרופ' אהוד רז (מ.ר. 18294)"}</strong></span>
          <span style="color: #059669; font-weight: 700;"><i class="fa-solid fa-certificate"></i> חתום דיגיטלית</span>
        </div>
      `;
    } else {
      contentBox.innerHTML = `
        <div style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
          <h4 style="margin: 0;">${currentDoc.name}</h4>
          <small>מסמך רפואי מאומת • ${claim.providerName || "מרכז מומחים"}</small>
        </div>
        <p><strong>מבוטח:</strong> <span class="doc-ocr-bounding-box">${claim.customerName}</span> | <strong>ת.ז:</strong> ${claim.customerId}</p>
        <p><strong>תאריך:</strong> <span class="doc-ocr-bounding-box">${this.formatToIsraeliDate(claim.serviceDate)}</span></p>
        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #475569;">
          <span>סטטוס אימות: <strong class="badge badge-success">Verified</strong></span>
          <span>גודל קובץ: ${currentDoc.size || '1.2MB'}</span>
        </div>
      `;
    }

    // Populate Left Panel Dynamic Extracted Fields (In Document Order with Confidence Scores)
    if (fieldsGrid) {
      if (currentDoc.status === "Missing") {
        if (docFieldsBadgeEl) docFieldsBadgeEl.innerHTML = `<span class="badge badge-danger">מסמך חסר בתיק</span>`;
        fieldsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 1.75rem 1rem; text-align: center; color: #dc2626; background: #fef2f2; border: 1px dashed #f87171; border-radius: var(--radius-sm);">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.75rem; margin-bottom: 0.5rem; display: block; color: #ef4444;"></i>
            <strong style="font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">מסמך זה חסר בתיק התביעה וטרם הועלה על ידי המבוטח</strong>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b;">
              לא חולצו שדות עבור מסמך זה. ניתן לשלוח דרישת השלמה ישירה למבוטח באמצעות הכפתור בתחתית הדף.
            </p>
          </div>
        `;
      } else {
        let fieldsList = [];
        const isLowConf = currentDoc.ocrConfidence && currentDoc.ocrConfidence < 0.85;
        const confFactor = isLowConf ? 0.72 : (currentDoc.ocrConfidence || 0.96);

        if (currentDoc.type === "invoice" || currentDoc.name.includes("חשבונית") || currentDoc.name.includes("קבלה")) {
          const amt = (claim.preValidation && claim.preValidation.extractedOcrData && claim.preValidation.extractedOcrData.invoice) ? claim.preValidation.extractedOcrData.invoice.detectedAmount : 16800;
          const isAmtDiff = amt !== claim.claimedAmount;

          fieldsList = [
            { order: 1, key: "provider", name: "שם המוסד הרפואי / עוסק מורשה", value: claim.providerName || "אסותא מרכזים רפואיים בע\"מ", score: Math.round(confFactor * 100), match: "תואם לספק הרשום" },
            { order: 2, key: "invoice_num", name: "מספר קבלה / חשבונית מס", value: "INV-992014-A", score: Math.min(99, Math.round((confFactor + 0.01) * 100)), match: "מספר אסמכתא תקין" },
            { order: 3, key: "customer_name", name: "שם המבוטח / לקוח (לכבוד)", value: claim.customerName, score: Math.min(99, Math.round((confFactor + 0.02) * 100)), match: "תואם לפוליסה" },
            { order: 4, key: "customer_id", name: "מספר תעודת זהות מבוטח", value: claim.customerId, score: Math.min(99, Math.round((confFactor + 0.01) * 100)), match: "תואם לפוליסה" },
            { order: 5, key: "service_date", name: "תאריך ביצוע השירות / הטיפול", value: this.formatToIsraeliDate(claim.serviceDate), score: Math.round((confFactor - 0.02) * 100), match: "תואם לתאריך הטיפול" },
            { order: 6, key: "treatment_desc", name: "פירוט הפרוצדורה / הטיפול הרפואי", value: `${claim.claimTypeName} (${claim.doctorName || 'פרופ\' אהוד רז'})`, score: Math.round((confFactor - 0.01) * 100), match: "תואם לסוג התביעה" },
            { order: 7, key: "amount", name: "סך הכל ששולם בפועל (בש\"ח) *", value: amt, score: Math.round(confFactor * 100), match: isAmtDiff ? `אי-התאמה: הוזן בטופס ₪${claim.claimedAmount.toLocaleString()} מול ₪${amt.toLocaleString()} במסמך` : "תואם במלואו לסכום הנתבע" },
            { order: 8, key: "payment_ref", name: "אישור סליקה / אמצעי תשלום", value: "APPROVED_TRANS_49182 (כרטיס אשראי)", score: Math.min(99, Math.round((confFactor + 0.02) * 100)), match: "סליקה מאומתת" }
          ];
        } else if (currentDoc.type === "discharge" || currentDoc.name.includes("שחרור") || currentDoc.name.includes("סיכום")) {
          fieldsList = [
            { order: 1, key: "facility", name: "מוסד ומחלקה רפואית", value: `${claim.providerName || "בי\"ח אסותא רמת החייל"} • מחלקה כירורגית`, score: Math.round(confFactor * 100), match: "תואם" },
            { order: 2, key: "patient_name", name: "שם המטופל/ת", value: claim.customerName, score: Math.min(99, Math.round((confFactor + 0.02) * 100)), match: "תואם" },
            { order: 3, key: "patient_id", name: "מספר תעודת זהות", value: claim.customerId, score: Math.min(99, Math.round((confFactor + 0.01) * 100)), match: "תואם" },
            { order: 4, key: "stay_dates", name: "תאריכי אשפוז וקליטה", value: `${this.formatToIsraeliDate(claim.serviceDate)} עד ${this.formatToIsraeliDate(claim.serviceDate)}`, score: Math.round((confFactor - 0.02) * 100), match: "תואם לתאריך הטיפול" },
            { order: 5, key: "diagnosis", name: "אבחנה רפואית ראשית (Diagnosis)", value: "Inguinal Hernia Repair with Prolene Mesh", score: Math.round((confFactor - 0.03) * 100), match: "מכוסה בפוליסה" },
            { order: 6, key: "procedure_notes", name: "מהלך הטיפול והמלצות", value: "ניתוח לפרוסקופי ללא סיבוכים, מנוחה שבועיים", score: Math.round((confFactor - 0.04) * 100), match: "תקין" },
            { order: 7, key: "surgeon_name", name: "שם רופא מנתח / מטפל", value: claim.doctorName || "פרופ' אהוד רז", score: Math.round((confFactor - 0.01) * 100), match: "תואם" },
            { order: 8, key: "license", name: "רישיון רופא וחתימה דיגיטלית", value: `${claim.providerLicense || 'מ.ר. 18294'} • חתום דיגיטלית ומאומת`, score: Math.min(99, Math.round((confFactor + 0.01) * 100)), match: "חתימה מאומתת" }
          ];
        } else if (currentDoc.type === "op_report" || currentDoc.name.includes("דו\"ח") || currentDoc.name.includes("ניתוח")) {
          fieldsList = [
            { order: 1, key: "center", name: "מרכז כירורגי / חדר ניתוח", value: claim.providerName || "אסותא רמת החייל", score: Math.round(confFactor * 100), match: "תואם" },
            { order: 2, key: "patient", name: "שם המנותח/ת ות.ז.", value: `${claim.customerName} (ת.ז. ${claim.customerId})`, score: Math.min(99, Math.round((confFactor + 0.02) * 100)), match: "תואם" },
            { order: 3, key: "op_date", name: "תאריך ושעת ביצוע הניתוח", value: this.formatToIsraeliDate(claim.serviceDate), score: Math.round((confFactor - 0.01) * 100), match: "תואם" },
            { order: 4, key: "surgical_team", name: "צוות מנתח ומרדים", value: `${claim.doctorName || 'פרופ\' אהוד רז'} (מנתח ראשי), ד"ר ד. כץ (מרדים)`, score: Math.round((confFactor - 0.02) * 100), match: "תואם" },
            { order: 5, key: "anesthesia", name: "סוג ההרדמה ומהלך הניתוח", value: "הרדמה כללית, מהלך ניתוחי תקין ללא אירועים חריגים", score: Math.round((confFactor - 0.03) * 100), match: "תקין" },
            { order: 6, key: "signature", name: "חתימת מנתח ומספר רישיון", value: "פרופ' אהוד רז (מ.ר. 18294) - חתום דיגיטלית", score: Math.min(99, Math.round((confFactor + 0.01) * 100)), match: "מאומת" }
          ];
        } else {
          fieldsList = [
            { order: 1, key: "issuer", name: "גוף מנפיק / מוסד רפואי", value: claim.providerName || "מרכז רפואי מורשה", score: Math.round(confFactor * 100), match: "תואם" },
            { order: 2, key: "subject", name: "שם המטופל/ת ות.ז.", value: `${claim.customerName} (ת.ז. ${claim.customerId})`, score: Math.min(99, Math.round((confFactor + 0.02) * 100)), match: "תואם" },
            { order: 3, key: "doc_date", name: "תאריך המסמך", value: this.formatToIsraeliDate(claim.serviceDate), score: Math.round((confFactor - 0.02) * 100), match: "תואם" },
            { order: 4, key: "service_detail", name: "סוג השירות / פירוט קליני", value: `${claim.claimTypeName} - מסמך קליני מאומת`, score: Math.round((confFactor - 0.02) * 100), match: "תקין" },
            { order: 5, key: "verification", name: "חתימה ואימות מסמך", value: "חתימה אלקטרונית מאושרת ומאומתת", score: Math.min(99, Math.round((confFactor + 0.01) * 100)), match: "Verified" }
          ];
        }

        if (docFieldsBadgeEl) {
          docFieldsBadgeEl.innerHTML = `<i class="fa-solid fa-robot"></i> ${fieldsList.length} שדות חולצו בהצלחה`;
        }

        const escapeAttr = (s) => String(s ?? "").replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        fieldsGrid.innerHTML = fieldsList.map((f, i) => {
          const isAmountField = f.key === "amount" || f.name.includes("סכום") || f.name.includes("לתשלום");
          const isDateField = f.key === "service_date" || f.key === "stay_dates" || f.key === "op_date" || f.name.includes("תאריך");
          const inputId = `handlerDocField_${activeDocIndex}_${i}`;
          const isDiff = f.match && f.match.includes("אי-התאמה");

          return `
            <div class="form-group" style="${isAmountField || isDiff ? 'border-right: 3px solid #f59e0b; padding-right: 0.5rem;' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                <label class="form-label" style="margin: 0; font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem;">
                  <span class="field-order-badge" style="width: 20px; height: 20px; font-size: 0.7rem;">${f.order}</span>
                  <span>${f.name}</span>
                </label>
                <span class="badge ${f.score >= 90 ? 'badge-success' : f.score >= 75 ? 'badge-warning' : 'badge-danger'}" style="font-size: 0.72rem; padding: 2px 7px;">
                  <i class="fa-solid ${f.score >= 90 ? 'fa-check-double' : 'fa-triangle-exclamation'}"></i> ${f.score}% ביטחון AI
                </span>
              </div>
              <input type="text" class="form-input ${isAmountField || isDateField ? 'input-num-ergonomic' : ''}" id="${inputId}" value="${escapeAttr(f.value)}" data-doc-name="${escapeAttr(currentDoc.name)}" data-field-name="${escapeAttr(f.name)}" style="${isDiff ? 'border-color: #f59e0b; background: #fffbeb;' : ''}">
              <span class="form-hint" style="font-size: 0.76rem; margin-top: 0.2rem; display: block;">
                ${isDiff ? `<strong style="color: #b45309;"><i class="fa-solid fa-triangle-exclamation"></i> ${f.match}</strong>` : `<span style="color: #059669;"><i class="fa-solid fa-check"></i> ${f.match}</span>`}
              </span>
            </div>
          `;
        }).join("");

        // Attach modification listeners to log corrections into Audit Trail
        fieldsList.forEach((f, i) => {
          const inputEl = document.getElementById(`handlerDocField_${activeDocIndex}_${i}`);
          inputEl?.addEventListener("change", (e) => {
            this.handleClaimFieldCorrection(`${currentDoc.name} - ${f.name}`, f.value, e.target.value);
          });
        });
      }
    }
  },

  handleClaimFieldCorrection(fieldName, oldVal, newVal) {
    const claim = this.state.claims.find(c => c.id === this.state.currentClaimId);
    if (!claim) return;

    const entry = {
      timestamp: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: "רונית לוי (רפרנטית)",
      action: `תיקון ערך אנושי ב-${fieldName}: שונה מ-${oldVal} ל-${newVal}`
    };

    claim.auditTrail.push(entry);
    this.saveClaimsToStorage();
    this.showToast(`תיקון ערך תועד ב-Audit Trail: ${fieldName}`, "primary");
  },

  handleApproveClaim() {
    const chk1 = document.getElementById("chkReviewId")?.checked;
    const chk2 = document.getElementById("chkReviewProvider") ? document.getElementById("chkReviewProvider").checked : true;
    const chk3 = document.getElementById("chkReviewAmount")?.checked;
    const chk4 = document.getElementById("chkReviewPolicy")?.checked;

    // Mandatory Human Review Check (PRD Section 15)
    if (!chk1 || !chk2 || !chk3 || !chk4) {
      this.showToast("חובת בדיקה אנושית: עליך לסמן ולאמת את כל 4 סעיפי הצ'קליסט (כולל אימות מוסד ורופא בהסדר) לפני אישור התביעה לתשלום!", "danger");
      return;
    }

    const claim = this.state.claims.find(c => c.id === this.state.currentClaimId);
    if (!claim) return;

    claim.status = "Approved";
    claim.approvedAmount = Number(document.getElementById("handlerEditAmount").value);
    claim.approvalDate = new Date().toISOString().substring(0, 10);
    claim.auditTrail.push({
      timestamp: new Date().toLocaleTimeString('he-IL'),
      user: "רונית לוי (רפרנטית מוסמכת)",
      action: `התביעה אושרה לתשלום מלא על סך ₪${claim.approvedAmount.toLocaleString()} לאחר בדיקה אנושית מלאה.`
    });

    this.saveClaimsToStorage();
    this.showToast(`תביעה ${claim.id} אושרה לתשלום בהצלחה!`, "success");
    this.renderHandlerInbox();
    this.renderCustomerClaims();
    this.renderManagerView();
    this.renderExecView();
    this.updateInspector(claim.id);
  },

  setupRejectionModal() {
    const select = document.getElementById("rejectionReasonSelect");
    const detail = document.getElementById("rejectionDetailText");
    if (!select) return;

    select.innerHTML = `
      <option value="" disabled selected>בחר סיבת דחייה מוגדרת מתוך הרשימה...</option>
      ${MOCK_DATA.rejectionReasons.map(r => `
        <option value="${r.code}">${r.code}: ${r.title} (${r.category})</option>
      `).join("")}
    `;

    select.addEventListener("change", (e) => {
      this.clearFieldError("rejectionReasonSelect");
      const selected = MOCK_DATA.rejectionReasons.find(r => r.code === e.target.value);
      if (selected && detail && !detail.value.trim()) {
        const templates = {
          "REJ-01": "התביעה נדחתה מאחר שמועד הטיפול המבוקש קדם למועד תחילת הכיסוי הביטוחי בפוליסה.",
          "REJ-02": "התביעה נדחתה מאחר שהאירוע/הטיפול הרפואי התרחש במהלך תקופת האכשרה המוגדרת בפוליסה.",
          "REJ-03": "התביעה נדחתה בהתאם לנספח החרגות הפוליסה, המפרט כי שירות זה אינו נכלל במסגרת הכיסוי.",
          "REJ-04": "התביעה נדחתה עקב אי-המצאת מסמכי סף רפואיים מהותיים הנדרשים לבחינת הזכאות.",
          "REJ-05": "התביעה נדחתה עקב פערים ואי-התאמות מהותיות בין הנתונים שהוצהרו למסמכים שצורפו.",
          "REJ-06": "התביעה נדחתה עקב זיהוי כפילות של קבלה/הוצאה רפואית שכבר נתבעה או שולמה בעבר.",
          "REJ-07": "התביעה נדחתה מאחר שהספק או הרופא המטפל אינו עומד בתנאי הרישוי או ההסכם הנדרשים."
        };
        detail.value = templates[selected.code] || `התביעה נדחתה בעילת ${selected.title}.`;
        this.clearFieldError("rejectionDetailText");
      }
    });

    detail?.addEventListener("input", () => {
      if (detail.value.trim()) {
        this.clearFieldError("rejectionDetailText");
      }
    });
  },

  handleConfirmRejection() {
    this.clearValidationErrors();
    const reasonEl = document.getElementById("rejectionReasonSelect");
    const detailEl = document.getElementById("rejectionDetailText");

    const reasonCode = reasonEl?.value;
    const detail = detailEl?.value?.trim();
    let hasErr = false;

    if (!reasonCode) {
      this.showFieldError("rejectionReasonSelect", "חובה לבחור עילת דחייה מוגדרת מתוך הרשימה");
      hasErr = true;
    }
    if (!detail) {
      this.showFieldError("rejectionDetailText", "חובה להזין נימוק מפורט בהתאם לסעיפי הפוליסה");
      hasErr = true;
    }

    if (hasErr) {
      this.showToast("יש למלא את כל שדות החובה בטופס הדחייה", "danger");
      return;
    }

    const claim = this.state.claims.find(c => c.id === this.state.currentClaimId);
    if (!claim) return;

    claim.status = "Rejected";
    claim.rejectionReason = reasonCode;
    claim.rejectionDetail = detail;
    claim.auditTrail.push({
      timestamp: new Date().toLocaleTimeString('he-IL'),
      user: "רונית לוי (רפרנטית תביעות)",
      action: `התביעה נדחתה בעילה: ${reasonCode} - ${detail}`
    });

    this.saveClaimsToStorage();
    this.closeModal("modalRejection");
    this.showToast(`תביעה ${claim.id} נדחתה. מכתב מנומק הופק למבוטח.`, "danger");
    this.renderHandlerInbox();
    this.renderCustomerClaims();
    this.renderManagerView();
    this.renderExecView();
    this.updateInspector(claim.id);
  },

  handleConfirmRequestInfo() {
    this.clearValidationErrors();
    const docNameEl = document.getElementById("missingDocNameInput");
    const explanationEl = document.getElementById("missingDocExplanation");

    const docName = docNameEl?.value?.trim();
    const explanation = explanationEl?.value?.trim();
    let hasErr = false;

    if (!docName) {
      this.showFieldError("missingDocNameInput", "חובה לציין את שם המסמך החסר להשלמה");
      hasErr = true;
    }
    if (!explanation) {
      this.showFieldError("missingDocExplanation", "חובה להזין הנחיות והסבר למבוטח");
      hasErr = true;
    }

    if (hasErr) {
      this.showToast("יש למלא את כל שדות הבקשה להשלמת מידע", "danger");
      return;
    }

    const claim = this.state.claims.find(c => c.id === this.state.currentClaimId);
    if (!claim) return;

    claim.status = "Waiting for Customer";
    claim.auditTrail.push({
      timestamp: new Date().toLocaleTimeString('he-IL'),
      user: "רונית לוי (רפרנטית תביעות)",
      action: `נשלחה הודעת דרישת מסמך חסר (${docName}) למבוטח: ${explanation}`
    });

    this.saveClaimsToStorage();
    this.closeModal("modalRequestInfo");
    this.showToast(`בקשה להשלמת ${docName} נשלחה למבוטח בהצלחה`, "warning");
    this.renderHandlerInbox();
    this.renderCustomerClaims();
    this.updateInspector(claim.id);
  },

  openAuditTrailModal() {
    const claim = this.state.claims.find(c => c.id === this.state.currentClaimId);
    if (!claim) return;

    const listEl = document.getElementById("auditTrailList");
    listEl.innerHTML = (claim.auditTrail || []).map(a => {
      const isUserEdit = a.user && a.user.includes("מבוטח");
      const isAi = a.user && (a.user.includes("AI") || a.user.includes("מערכת"));
      const icon = isUserEdit ? "fa-pen-to-square text-warning" : isAi ? "fa-robot text-primary" : "fa-user-shield text-success";
      const borderStyle = isUserEdit ? "border-right: 4px solid #f59e0b;" : isAi ? "border-right: 4px solid #0284c7;" : "border-right: 4px solid #10b981;";

      return `
          <div style="background: #ffffff; border: 1px solid var(--border-color); ${borderStyle} border-radius: var(--radius-sm); padding: 0.85rem 1rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.25rem;">
              <strong><i class="fa-solid ${icon}"></i> ${a.user}</strong>
              <span style="font-family: monospace; color: var(--text-muted);">${a.timestamp}</span>
            </div>
            <div style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.45;">${a.action}</div>
          </div>
        `;
    }).join("");

    this.openModal("modalAuditTrail");
  },

  // =========================================================================
  // 3. DEPARTMENT MANAGER DASHBOARD (Workload & 18 Handlers)
  // =========================================================================

  renderManagerView() {
    const grid = document.getElementById("handlersWorkloadGrid");
    if (!grid) return;

    grid.innerHTML = this.state.handlers.map(h => {
      const loadPercent = Math.min(100, Math.round((h.activeClaims / 25) * 100));
      const isHighLoad = loadPercent > 70;
      return `
        <div class="handler-card">
          <div class="handler-card-header">
            <strong>${h.name}</strong>
            <span class="badge ${h.status === 'online' ? 'badge-success' : h.status === 'busy' ? 'badge-warning' : 'badge-neutral'}">
              ${h.status === 'online' ? 'זמין' : h.status === 'busy' ? 'בעומס' : 'בהפסקה'}
            </span>
          </div>

          <div style="font-size: 0.78rem; color: var(--text-secondary);">
            התמחות: ${h.specializations.join(", ")}
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
              <span>עומס: ${h.activeClaims}/25 תביעות</span>
              <strong>${loadPercent}%</strong>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${loadPercent}%; background: ${isHighLoad ? 'var(--warning)' : 'var(--primary)'};"></div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; color: var(--text-muted);">
            <span>זמן ממוצע: <strong>${h.avgHandleTimeMin} דק'</strong></span>
            <span>בבדיקה: <strong>${h.pendingReview}</strong></span>
          </div>

          <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.3rem;" onclick="App.reassignHandlerWorkload('${h.id}')">
            <i class="fa-solid fa-arrows-split-up-and-left"></i> איזון עומס / העברת תביעות
          </button>
        </div>
      `;
    }).join("");

    this.renderManagerGuardianshipTable();
  },

  // Real-Time Handler Workload Balancing (Question 2: Transferees & Transferors)
  reassignHandlerWorkload(handlerId) {
    const source = this.state.handlers.find(x => x.id === handlerId);
    if (!source) return;

    if (source.activeClaims <= 5) {
      this.showToast(`העומס אצל ${source.name} כבר תקין ונמוך (${source.activeClaims} תביעות)`, "neutral");
      return;
    }

    // Find the available handler with lowest active claims
    const candidates = this.state.handlers
      .filter(h => h.id !== handlerId && h.status !== 'break')
      .sort((a, b) => a.activeClaims - b.activeClaims);

    if (candidates.length === 0) return;
    const target = candidates[0];

    const transferCount = Math.min(3, source.activeClaims - 5);
    source.activeClaims -= transferCount;
    target.activeClaims += transferCount;

    if (source.pendingReview > 2) source.pendingReview = Math.max(1, source.pendingReview - 1);
    target.pendingReview += 1;

    this.showToast(`איזון עומס בוצע בהצלחה: ${transferCount} תביעות הועברו מ-${source.name} (ירד ל-${source.activeClaims}) אל ${target.name} (עלה ל-${target.activeClaims})`, "success");
    this.renderManagerView();
  },

  // Department-Wide Smart Auto-Balancing (All 18 Handlers)
  autoBalanceAllHandlers() {
    const totalClaims = this.state.handlers.reduce((sum, h) => sum + h.activeClaims, 0);
    const avg = Math.round(totalClaims / this.state.handlers.length);
    let totalMoved = 0;

    this.state.handlers.forEach(source => {
      if (source.activeClaims > avg + 2) {
        const diff = source.activeClaims - avg;
        const targets = this.state.handlers.filter(h => h.activeClaims < avg && h.status !== 'break').sort((a, b) => a.activeClaims - b.activeClaims);
        if (targets.length > 0) {
          const target = targets[0];
          source.activeClaims -= diff;
          target.activeClaims += diff;
          totalMoved += diff;
        }
      }
    });

    this.showToast(`איזון עומסים מחלקתי הושלם! ${totalMoved} תביעות פוזרו מחדש באופן אופטימלי בין 18 הרפרנטים (ממוצע ~${avg} תביעות לרפרנט).`, "success");
    this.renderManagerView();
  },

  // Collapsible Accordion Controller (Question 3: Executive Distributions)
  toggleCollapsible(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    const header = card.querySelector(".collapsible-header");
    const content = card.querySelector(".collapsible-content");
    if (header && content) {
      header.classList.toggle("open");
      content.classList.toggle("open");
    }
  },

  // =========================================================================
  // 4. EXECUTIVE MANAGEMENT DASHBOARD
  // =========================================================================

  renderExecView() {
    const statusContainer = document.getElementById("execStatusBreakdown");
    if (statusContainer) {
      const statuses = MOCK_DATA.metrics.claimsByStatus;
      const total = Object.values(statuses).reduce((a, b) => a + b, 0);

      const statusMapHebrew = {
        "Submitted": "הוגשה במערכת (חדשה)",
        "Initial Validation": "אימות ראשוני AI",
        "Waiting for Customer": "ממתין להשלמת מבוטח",
        "Under Human Review": "בבדיקת רפרנט",
        "Approved": "אושרה לתשלום",
        "Rejected": "נדחתה"
      };

      statusContainer.innerHTML = Object.entries(statuses).map(([name, count]) => {
        const pct = Math.round((count / total) * 100);
        const hebName = statusMapHebrew[name] || name;
        return `
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
              <span>${hebName}</span>
              <strong>${count} (${pct}%)</strong>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    const rejContainer = document.getElementById("execRejectionBreakdown");
    if (rejContainer) {
      const rejReasons = MOCK_DATA.metrics.rejectionsByCategory;
      const totalRej = Object.values(rejReasons).reduce((a, b) => a + b, 0);

      rejContainer.innerHTML = Object.entries(rejReasons).map(([cat, count]) => {
        const pct = Math.round((count / totalRej) * 100);
        return `
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
              <span>${cat}</span>
              <strong>${count} תביעות (${pct}%)</strong>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${pct}%; background: var(--danger);"></div>
            </div>
          </div>
        `;
      }).join("");
    }
  },

  // =========================================================================
  // UTILITIES & HELPERS
  // =========================================================================

  renderStatusBadge(status) {
    switch (status) {
      case "Approved": return `<span class="badge badge-success"><i class="fa-solid fa-check"></i> אושרה לתשלום</span>`;
      case "Rejected": return `<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> נדחתה</span>`;
      case "Waiting for Customer": return `<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> ממתין למבוטח</span>`;
      case "Under Human Review": return `<span class="badge badge-primary"><i class="fa-solid fa-user-check"></i> בבדיקת רפרנט</span>`;
      case "Initial Validation": return `<span class="badge badge-neutral"><i class="fa-solid fa-microchip"></i> אימות ראשוני AI</span>`;
      default: return `<span class="badge badge-neutral">${status}</span>`;
    }
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === "modalSoftVariance") {
      let formAmt = Number(this.state.wizard.fields.claimAmount || 0);
      let ocrAmt = 16800;
      let docName = "חשבונית_אסותא.pdf";

      // If we are currently in handler view inspecting a claim:
      const activeClaimId = this.state.activeClaimId;
      const claim = activeClaimId ? this.getClaims().find(c => c.id === activeClaimId) : null;

      if (claim) {
        formAmt = Number(claim.claimAmount || claim.amount || claim.claimedAmount || formAmt || 18500);
        if (claim.ocrDetectedAmount) {
          ocrAmt = Number(claim.ocrDetectedAmount);
        }
        const invDoc = (claim.documents || []).find(d => d.type === "invoice" || (d.name && d.name.includes("חשבונית")));
        if (invDoc) {
          if (invDoc.detectedAmount) ocrAmt = Number(invDoc.detectedAmount);
          if (invDoc.name) docName = invDoc.name;
        }
      } else {
        const invoiceDoc = this.state.wizard.docs.invoice || Object.values(this.state.wizard.docs).find(d => d.detectedAmount);
        ocrAmt = (invoiceDoc && invoiceDoc.detectedAmount) ? Number(invoiceDoc.detectedAmount) : 16800;
        if (invoiceDoc && invoiceDoc.name) docName = invoiceDoc.name;
        if (!formAmt || formAmt <= 0) {
          formAmt = 18500;
        }
      }

      // If amounts are genuinely equal, do not display variance modal
      if (formAmt > 0 && ocrAmt > 0 && formAmt === ocrAmt) {
        return;
      }

      const formValEl = document.getElementById("varianceFormValue");
      const ocrValEl = document.getElementById("varianceOcrValue");
      const syncBtn = document.getElementById("btnOneClickSync");
      const noteInput = document.getElementById("varianceNoteInput");
      const docBadge = document.querySelector("#modalSoftVariance .comparison-col.ocr .badge");

      if (formValEl) formValEl.innerText = `₪${formAmt.toLocaleString()}`;
      if (ocrValEl) ocrValEl.innerText = `₪${ocrAmt.toLocaleString()}`;
      if (docBadge) docBadge.innerText = `קובץ: ${docName}`;
      if (syncBtn) {
        syncBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> עדכון בטופס לפי המסמך (₪${ocrAmt.toLocaleString()})`;
      }
      if (noteInput && formAmt > 0 && ocrAmt > 0) {
        const diff = Math.abs(formAmt - ocrAmt);
        noteInput.placeholder = `לדוגמה: ההפרש בסך ₪${diff.toLocaleString()} שולם כמקדמה ישירה לחברת השתלים`;
      }
    }

    modal.classList.add("open");
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
  },

  showToast(message, type = "primary") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconClass = "fa-circle-info";
    if (type === "success") iconClass = "fa-circle-check";
    else if (type === "warning") iconClass = "fa-triangle-exclamation";
    else if (type === "danger") iconClass = "fa-circle-xmark";
    else if (type === "neutral") iconClass = "fa-bell";

    toast.innerHTML = `
      <div class="toast-content-wrapper">
        <div class="toast-icon-badge">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="toast-message-text">${message}</div>
      </div>
      <button class="toast-close-btn" aria-label="סגירה" title="סגירה">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    const closeBtn = toast.querySelector(".toast-close-btn");
    closeBtn?.addEventListener("click", () => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 250);
    });

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      if (toast.isConnected) {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 250);
      }
    }, 4000);
  },

  // =========================================================================
  // GUARDIANSHIP / LEGAL CUSTODIANSHIP CONTROLLERS (Israeli Law Compliance)
  // =========================================================================

  updateGuardianshipUI() {
    let list = this.state.guardianships || [];
    // Synchronize single state.guardianship if approved
    if (list.length === 0 && this.state.guardianship && this.state.guardianship.isApproved) {
      list.push({ ...this.state.guardianship });
      this.state.guardianships = list;
    }
    const count = list.length;
    const isApproved = count > 0;
    const primaryWard = list[0] || (this.state.guardianship && this.state.guardianship.isApproved ? this.state.guardianship : null);
    const wardName = primaryWard ? primaryWard.wardName : "רחל ישראלי";
    const caseNum = primaryWard ? primaryWard.courtCase : 'א"פ 42918-03-24';

    // 1. Update Personal Area Dashboard Button & Badge
    const btnText = document.getElementById("btnCustomerGuardianshipText");
    const badgeStatus = document.getElementById("badgeCustomerGuardianshipStatus");
    if (btnText) {
      if (count === 0) {
        btnText.innerText = "הגדרת אפוטרופסות / ייפוי כוח";
      } else if (count === 1) {
        btnText.innerText = `אפוטרופסות: ${list[0].wardName}`;
      } else {
        btnText.innerText = `אפוטרופסות (${count} מיוצגים)`;
      }
    }
    if (badgeStatus) {
      if (isApproved) {
        badgeStatus.className = "badge badge-success";
        badgeStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> מאושר בתוקף`;
      } else {
        badgeStatus.className = "badge badge-neutral";
        badgeStatus.innerText = "לא הוגדר";
      }
    }

    // 2. Update Customer Dashboard Tabs Badges (Recent Claims & Guardianships)
    const claimsTabBadge = document.getElementById("customerClaimsTabBadge");
    if (claimsTabBadge) {
      claimsTabBadge.innerText = (this.state.claims && this.state.claims.length) || 5;
    }
    const guardTabBadge = document.getElementById("customerGuardianshipsTabBadge");
    if (guardTabBadge) {
      guardTabBadge.innerText = count;
      guardTabBadge.className = count > 0 ? "badge badge-primary" : "badge badge-neutral";
    }

    // 3. Update Relationship Dropdown in Step 1 (עבור אחרים):
    // "ושם בדרופדאון יהיה שורת אפוטרופוס רק אם הוא כבר קיבל אישר לאפוטרופסות. אחרת לא יציג כלום בנושא אפוטרופסות."
    const depRelationSelect = document.getElementById("depRelation");
    if (depRelationSelect) {
      const existingGuardianOption = depRelationSelect.querySelector('option[value="guardian"]');
      if (isApproved) {
        let labelText = ` אפוטרופוס / מיופה כוח מאושר (עבור ${list[0].wardName})`;
        if (count > 1) {
          labelText = ` אפוטרופוס / מיופה כוח מאושר (בחירת מיוצג/ת...)`;
        }
        if (!existingGuardianOption) {
          const opt = document.createElement("option");
          opt.value = "guardian";
          opt.innerText = labelText;
          depRelationSelect.appendChild(opt);
        } else {
          existingGuardianOption.innerText = labelText;
        }
      } else {
        if (existingGuardianOption) {
          existingGuardianOption.remove();
        }
        if (depRelationSelect.value === "guardian") {
          depRelationSelect.value = "child";
          this.handleRelationChange("child");
        }
      }
    }

    // 4. Update active guardian notice texts if present
    const noticeCase = document.getElementById("noticeCourtCase");
    const noticeDoc = document.getElementById("noticeDocName");
    if (noticeCase && primaryWard) noticeCase.innerText = primaryWard.courtCase;
    if (noticeDoc && primaryWard) noticeDoc.innerText = primaryWard.documentName || "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf";

    // 5. Re-render Guardianships Table in dedicated Dashboard Tab
    this.renderCustomerGuardianshipsTable();
  },

  handleRelationChange(val) {
    const isGuardian = (val === "guardian");
    const noticeEl = document.getElementById("guardianActiveRelationNotice");
    const multiPicker = document.getElementById("guardianMultiWardPicker");
    const depName = document.getElementById("depName");
    const depId = document.getElementById("depId");
    const depBirthDate = document.getElementById("depBirthDate");
    const list = this.state.guardianships || [];

    if (isGuardian) {
      if (list.length === 1) {
        // Single approved guardianship: Autofill automatically (Requirement 2)
        const ward = list[0];
        this.state.wizard.isGuardian = true;
        this.state.guardianship = ward;

        if (multiPicker) multiPicker.style.display = "none";
        if (depName) {
          depName.value = ward.wardName;
          this.clearFieldError("depName");
        }
        if (depId) {
          depId.value = ward.wardId;
          this.clearFieldError("depId");
        }
        if (depBirthDate) {
          depBirthDate.value = ward.wardDob || "12/05/1954";
          this.clearFieldError("depBirthDate");
        }

        const noticeCase = document.getElementById("noticeCourtCase");
        const noticeDoc = document.getElementById("noticeDocName");
        if (noticeCase) noticeCase.innerText = ward.courtCase;
        if (noticeDoc) noticeDoc.innerText = ward.documentName || "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf";
        if (noticeEl) noticeEl.style.display = "block";

        this.showToast(`נטענו פרטי המיוצג/ת המאושר/ת ${ward.wardName} מכוח צו האפוטרופסות`, "primary");
      } else if (list.length > 1) {
        // Multiple approved guardianships: User must pick which one (Requirement 2)
        this.state.wizard.isGuardian = false;
        if (noticeEl) noticeEl.style.display = "none";

        if (multiPicker) {
          multiPicker.style.display = "block";
          const selectEl = document.getElementById("selectGuardianWard");
          if (selectEl) {
            selectEl.innerHTML = `<option value="">-- בחר מיוצג/ת מתוך ${list.length} אישורים מאושרים --</option>` +
              list.map((w, i) => `<option value="${i}">${w.wardName} (ת.ז. ${w.wardId}) — תיק ${w.courtCase}</option>`).join("");
            selectEl.value = "";
          }
        }

        // Leave fields clean until user selects specific ward
        if (depName) depName.value = "";
        if (depId) depId.value = "";
        if (depBirthDate) depBirthDate.value = "";

        this.showToast(`קיימים ${list.length} אישורי אפוטרופסות מאושרים — אנא בחר/י מיוצג/ת מהרשימה`, "primary");
      } else {
        // 0 guardianships: Fallback prompt
        this.state.wizard.isGuardian = false;
        if (noticeEl) noticeEl.style.display = "none";
        if (multiPicker) multiPicker.style.display = "none";
        this.showToast("לא נמצא אישור אפוטרופסות מאושר במערכת", "warning");
        this.openGuardianshipModal();
      }
    } else {
      this.state.wizard.isGuardian = false;
      if (noticeEl) noticeEl.style.display = "none";
      if (multiPicker) multiPicker.style.display = "none";

      // If fields currently hold one of the wards' details, clear them
      if (depName && list.some(w => w.wardName === depName.value)) {
        depName.value = "";
      }
      if (depId && list.some(w => w.wardId === depId.value)) {
        depId.value = "";
      }
    }

    this.saveDraftToStorage();
    this.updateStickyFooterCTA();
  },

  handleGuardianWardSelect(idxVal) {
    const noticeEl = document.getElementById("guardianActiveRelationNotice");
    const depName = document.getElementById("depName");
    const depId = document.getElementById("depId");
    const depBirthDate = document.getElementById("depBirthDate");

    if (idxVal === "" || idxVal === null || idxVal === undefined) {
      if (depName) depName.value = "";
      if (depId) depId.value = "";
      if (depBirthDate) depBirthDate.value = "";
      if (noticeEl) noticeEl.style.display = "none";
      this.state.wizard.isGuardian = false;
      return;
    }

    const idx = parseInt(idxVal, 10);
    const ward = (this.state.guardianships || [])[idx];
    if (!ward) return;

    this.state.wizard.isGuardian = true;
    this.state.guardianship = ward;

    if (depName) {
      depName.value = ward.wardName;
      this.clearFieldError("depName");
    }
    if (depId) {
      depId.value = ward.wardId;
      this.clearFieldError("depId");
    }
    if (depBirthDate) {
      depBirthDate.value = ward.wardDob || "12/05/1954";
      this.clearFieldError("depBirthDate");
    }

    const noticeCase = document.getElementById("noticeCourtCase");
    const noticeDoc = document.getElementById("noticeDocName");
    if (noticeCase) noticeCase.innerText = ward.courtCase;
    if (noticeDoc) noticeDoc.innerText = ward.documentName || "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf";
    if (noticeEl) noticeEl.style.display = "block";

    this.showToast(`נבחר/ה המיוצג/ת ${ward.wardName} (ת.ז. ${ward.wardId}) — הנתונים נטענו אוטומטית`, "success");
    this.saveDraftToStorage();
    this.updateStickyFooterCTA();
  },

  openGuardianshipModal(isSecond = false) {
    const isApproved = Boolean(this.state.guardianship && this.state.guardianship.isApproved);
    const dropZone = document.getElementById("guardModalDropZone");
    const scanState = document.getElementById("guardModalScanningState");
    const extractedState = document.getElementById("guardModalExtractedState");
    const approveBtn = document.getElementById("btnSubmitGuardianshipApproval");

    if (scanState) scanState.style.display = "none";

    if (isApproved && !isSecond) {
      if (dropZone) dropZone.style.display = "none";
      if (extractedState) extractedState.style.display = "block";
      if (approveBtn) {
        approveBtn.disabled = false;
        approveBtn.style.opacity = "1";
      }
    } else {
      if (dropZone) dropZone.style.display = "block";
      if (extractedState) extractedState.style.display = "none";
      if (approveBtn) {
        approveBtn.disabled = true;
        approveBtn.style.opacity = "0.5";
      }
    }

    if (this.state.guardianship && !isSecond) {
      const nameInput = document.getElementById("guardModalWardName");
      const idInput = document.getElementById("guardModalWardId");
      const caseInput = document.getElementById("guardModalCaseNum");
      if (nameInput) nameInput.value = this.state.guardianship.wardName || "רחל ישראלי";
      if (idInput) idInput.value = this.state.guardianship.wardId || "019283746";
      if (caseInput) caseInput.value = this.state.guardianship.courtCase || 'א"פ 42918-03-24';
    }

    this.openModal("modalGuardianshipSetup");
  },

  simulateGuardianshipDocUpload() {
    const dropZone = document.getElementById("guardModalDropZone");
    const scanState = document.getElementById("guardModalScanningState");
    const extractedState = document.getElementById("guardModalExtractedState");
    const approveBtn = document.getElementById("btnSubmitGuardianshipApproval");

    if (dropZone) dropZone.style.display = "none";
    if (extractedState) extractedState.style.display = "none";
    if (scanState) scanState.style.display = "block";

    this.showToast("המסמך נטען. מבצע סריקת OCR וחילוץ נתונים אוטומטי...", "primary");

    setTimeout(() => {
      if (scanState) scanState.style.display = "none";
      if (extractedState) extractedState.style.display = "block";

      const nameInput = document.getElementById("guardModalWardName");
      const idInput = document.getElementById("guardModalWardId");
      const caseInput = document.getElementById("guardModalCaseNum");
      const fileBadge = document.getElementById("guardModalUploadedFileName");

      // Alternate demo ward if Rachel Israeli already exists in list
      const hasRachel = (this.state.guardianships || []).some(g => g.wardId === "019283746");
      if (hasRachel) {
        if (nameInput) nameInput.value = "יעקב כהן";
        if (idInput) idInput.value = "038192847";
        if (caseInput) caseInput.value = 'א"פ 11842-07-25';
        if (fileBadge) fileBadge.innerText = "צו_מינוי_אפוטרופוס_יעקב_כהן_חתום.pdf";
      } else {
        if (nameInput) nameInput.value = "רחל ישראלי";
        if (idInput) idInput.value = "019283746";
        if (caseInput) caseInput.value = 'א"פ 42918-03-24';
        if (fileBadge) fileBadge.innerText = "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf";
      }

      if (approveBtn) {
        approveBtn.disabled = false;
        approveBtn.style.opacity = "1";
        approveBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      this.showToast("הנתונים חולצו בהצלחה מתוך צו בית המשפט! אנא בדוק את הפרטים ולחץ 'מאשר/ת את צו האפוטרופסות'.", "success");
    }, 850);
  },

  resetGuardModalUpload() {
    const dropZone = document.getElementById("guardModalDropZone");
    const scanState = document.getElementById("guardModalScanningState");
    const extractedState = document.getElementById("guardModalExtractedState");
    const approveBtn = document.getElementById("btnSubmitGuardianshipApproval");

    if (dropZone) dropZone.style.display = "block";
    if (scanState) scanState.style.display = "none";
    if (extractedState) extractedState.style.display = "none";
    if (approveBtn) {
      approveBtn.disabled = true;
      approveBtn.style.opacity = "0.5";
    }
  },

  simulateGuardianshipApproval() {
    const nameInput = document.getElementById("guardModalWardName");
    const idInput = document.getElementById("guardModalWardId");
    const caseInput = document.getElementById("guardModalCaseNum");

    const wardName = nameInput ? nameInput.value.trim() : "רחל ישראלי";
    const wardId = idInput ? idInput.value.trim() : "019283746";
    const courtCase = caseInput ? caseInput.value.trim() : 'א"פ 42918-03-24';

    if (!wardName) {
      this.showToast("נא להזין שם מלא של החסוי/מיוצג", "danger");
      nameInput?.focus();
      return;
    }

    if (!wardId || wardId.length < 8) {
      this.showToast("נא להזין מספר תעודת זהות תקין של החסוי/מיוצג (9 ספרות)", "danger");
      idInput?.focus();
      return;
    }

    if (!courtCase) {
      this.showToast("נא להזין מספר תיק שיפוטי / מספר הפקדה", "danger");
      caseInput?.focus();
      return;
    }

    const wardDob = (wardId === "038192847") ? "05/11/1962" : "12/05/1954";
    const docName = (wardId === "038192847") ? "צו_מינוי_אפוטרופוס_יעקב_כהן_חתום.pdf" : "צו_מינוי_אפוטרופוס_בימש_משפחה_חתום.pdf";

    // Update / Append in guardianships list
    const newWard = {
      id: `guard_${wardId}`,
      isApproved: true,
      wardName,
      wardId,
      wardDob,
      guardianName: "ישראל ישראלי",
      guardianId: "028475913",
      courtCase,
      courtName: "בית המשפט לענייני משפחה - מחוז תל אביב",
      appointmentType: "צו מינוי אפוטרופוס מבית המשפט לענייני משפחה",
      scope: "עניינים רפואיים, ביטוחיים, אישיים ורכושיים",
      approvalDate: new Date().toLocaleDateString('he-IL'),
      documentName: docName,
      verifiedAt: new Date().toISOString()
    };

    if (!this.state.guardianships) this.state.guardianships = [];
    const existingIndex = this.state.guardianships.findIndex(g => g.wardId === wardId);
    if (existingIndex >= 0) {
      this.state.guardianships[existingIndex] = newWard;
    } else {
      this.state.guardianships.push(newWard);
    }

    this.state.guardianship = newWard;

    localStorage.setItem("ofek_guardianship_data", JSON.stringify(this.state.guardianship));
    localStorage.setItem("ofek_guardianships_list", JSON.stringify(this.state.guardianships));

    this.updateGuardianshipUI();
    this.closeModal("modalGuardianshipSetup");

    this.showToast(`צו האפוטרופסות עבור ${wardName} אושר בהצלחה! האפשרות זמינה כעת בבחירת הקשר עבור אחרים.`, "success");
  },

  selectBeneficiary(val) {
    this.state.wizard.beneficiary = val;

    const selfCard = document.getElementById("routeSelfCard");
    const depCard = document.getElementById("routeDependentCard");
    const depSec = document.getElementById("dependentFieldsSection");

    const selfRadio = document.querySelector('input[name="claimBeneficiary"][value="self"]');
    const depRadio = document.querySelector('input[name="claimBeneficiary"][value="dependent"]');

    if (selfRadio) selfRadio.checked = (val === "self");
    if (depRadio) depRadio.checked = (val === "dependent");

    if (selfCard) selfCard.classList.toggle("selected", val === "self");
    if (depCard) depCard.classList.toggle("selected", val === "dependent");

    if (depSec) depSec.style.display = (val === "dependent") ? "block" : "none";

    const noticeEl = document.getElementById("guardianActiveRelationNotice");
    const multiPicker = document.getElementById("guardianMultiWardPicker");

    if (val === "self") {
      this.state.wizard.isGuardian = false;
      if (noticeEl) noticeEl.style.display = "none";
      if (multiPicker) multiPicker.style.display = "none";
    } else if (val === "dependent") {
      // User requirement 2: "כשיש לי אישור אפוטרופסות, כשאני בוחר אחר, לא יציג מיד אפוטרופסות, רק יתן לי את 4 השדות"
      // Keep relation as default child or whatever user chose, do NOT force guardian automatically
      const depRel = document.getElementById("depRelation");
      if (depRel && (!depRel.value || depRel.value === "guardian")) {
        depRel.value = "child";
      }
      this.state.wizard.isGuardian = false;
      if (noticeEl) noticeEl.style.display = "none";
      if (multiPicker) multiPicker.style.display = "none";
    }

    this.saveDraftToStorage();
    this.updateStickyFooterCTA();
  },

  switchCustomerDashboardTab(tabName) {
    const claimsBtn = document.getElementById("tabBtnCustomerClaims");
    const guardBtn = document.getElementById("tabBtnCustomerGuardianships");
    const claimsContent = document.getElementById("tabContentCustomerClaims");
    const guardContent = document.getElementById("tabContentCustomerGuardianships");

    if (tabName === "claims") {
      if (claimsBtn) {
        claimsBtn.classList.add("active");
        claimsBtn.style.fontWeight = "700";
        claimsBtn.style.color = "var(--primary)";
        claimsBtn.style.borderBottom = "3px solid var(--primary)";
      }
      if (guardBtn) {
        guardBtn.classList.remove("active");
        guardBtn.style.fontWeight = "600";
        guardBtn.style.color = "var(--text-secondary)";
        guardBtn.style.borderBottom = "3px solid transparent";
      }
      if (claimsContent) claimsContent.style.display = "block";
      if (guardContent) guardContent.style.display = "none";
    } else if (tabName === "guardianships") {
      if (guardBtn) {
        guardBtn.classList.add("active");
        guardBtn.style.fontWeight = "700";
        guardBtn.style.color = "var(--primary)";
        guardBtn.style.borderBottom = "3px solid var(--primary)";
      }
      if (claimsBtn) {
        claimsBtn.classList.remove("active");
        claimsBtn.style.fontWeight = "600";
        claimsBtn.style.color = "var(--text-secondary)";
        claimsBtn.style.borderBottom = "3px solid transparent";
      }
      if (claimsContent) claimsContent.style.display = "none";
      if (guardContent) guardContent.style.display = "block";
      this.renderCustomerGuardianshipsTable();
    }
  },

  renderCustomerGuardianshipsTable() {
    const tbody = document.getElementById("customerGuardianshipsTableBody");
    const emptyState = document.getElementById("customerGuardianshipsEmptyState");
    const tableContainer = document.getElementById("customerGuardianshipsTableContainer");
    const tabBadge = document.getElementById("customerGuardianshipsTabBadge");
    const subText = document.getElementById("customerGuardianshipsSubText");

    const list = this.state.guardianships || [];
    const count = list.length;

    if (tabBadge) {
      tabBadge.innerText = count;
      tabBadge.className = count > 0 ? "badge badge-primary" : "badge badge-neutral";
    }
    if (subText) {
      subText.innerText = count > 0
        ? `(סך הכל ${count} אישורי מינוי שיפוטיים בתוקף)`
        : "ניהול מיוצגים חוקיים וצפייה בצווי מינוי שיפוטיים מאושרים";
    }

    if (count === 0) {
      if (emptyState) emptyState.style.display = "block";
      if (tableContainer) tableContainer.style.display = "none";
      if (tbody) tbody.innerHTML = "";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (tableContainer) tableContainer.style.display = "block";

    if (tbody) {
      tbody.innerHTML = list.map((g, idx) => `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.45rem;">
              <i class="fa-solid fa-user-shield text-primary"></i> ${g.wardName}
            </div>
            <span style="font-size: 0.76rem; color: var(--text-muted);">תאריך לידה: ${g.wardDob || "12/05/1954"}</span>
          </td>
          <td>
            <span class="mono-num" style="font-weight: 600;">${g.wardId}</span>
          </td>
          <td>
            <div style="font-weight: 600; color: #1e40af;">${g.courtCase}</div>
            <span style="font-size: 0.74rem; color: var(--text-muted);">${g.courtName || "בית המשפט לענייני משפחה"}</span>
          </td>
          <td>
            <div style="font-size: 0.82rem; color: var(--text-secondary); max-width: 220px;">
              ${g.scope || "עניינים רפואיים, ביטוחיים ואישיים"}
            </div>
          </td>
          <td>
            <span style="font-size: 0.82rem;">${g.approvalDate || new Date().toLocaleDateString('he-IL')}</span>
          </td>
          <td>
            <span class="badge badge-success" style="font-size: 0.78rem;">
              <i class="fa-solid fa-circle-check"></i> מאושר בתוקף
            </span>
          </td>
          <td>
            <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.55rem;" onclick="App.openGuardianshipProofModalByIndex(${idx})">
                <i class="fa-solid fa-file-pdf text-danger"></i> צפייה בצו
              </button>
              <button type="button" class="btn btn-primary" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;" onclick="App.startClaimForWard(${idx})">
                <i class="fa-solid fa-file-circle-plus"></i> הגש תביעה
              </button>
            </div>
          </td>
        </tr>
      `).join("");
    }
  },

  startClaimForWard(wardIndex) {
    this.openNewClaimWizard();
    this.selectBeneficiary("dependent");
    const depRelation = document.getElementById("depRelation");
    if (depRelation) {
      depRelation.value = "guardian";
      this.handleRelationChange("guardian");
      if (this.state.guardianships && this.state.guardianships.length > 1) {
        const picker = document.getElementById("selectGuardianWard");
        if (picker) picker.value = String(wardIndex);
        this.handleGuardianWardSelect(wardIndex);
      }
    }
  },

  openGuardianshipProofModalByIndex(idx) {
    const list = this.state.guardianships || [];
    const ward = list[idx] || this.state.guardianship;
    this.openGuardianshipProofModal(null, ward);
  },

  openGuardianshipProofModal(claimId = null, directData = null) {
    let data = directData || this.state.guardianship;
    if (!directData && claimId) {
      const claim = this.state.claims.find(c => c.id === claimId);
      if (claim && claim.guardianData) {
        data = claim.guardianData;
      }
    } else if (!directData && this.state.currentClaimId) {
      const claim = this.state.claims.find(c => c.id === this.state.currentClaimId);
      if (claim && claim.guardianData) {
        data = claim.guardianData;
      }
    }

    const gNameEl = document.getElementById("proofGuardianName");
    const gIdEl = document.getElementById("proofGuardianId");
    const wNameEl = document.getElementById("proofWardName");
    const wIdEl = document.getElementById("proofWardId");
    const caseEl = document.getElementById("proofCaseNumber");

    if (gNameEl) gNameEl.innerText = (data && data.guardianName) || "ישראל ישראלי";
    if (gIdEl) gIdEl.innerText = (data && data.guardianId) || "028475913";
    if (wNameEl) wNameEl.innerText = (data && data.wardName) || "רחל ישראלי";
    if (wIdEl) wIdEl.innerText = (data && data.wardId) || "019283746";
    if (caseEl) caseEl.innerText = (data && data.courtCase) || 'א"פ 42918-03-24';

    this.openModal("modalGuardianshipProof");
  },

  // Referent Guardianship Decision & Action Handler
  approveGuardianshipAsReferent() {
    const claim = this.state.claims.find(c => c.id === this.state.currentClaimId);
    if (!claim) return;

    if (claim.guardianApprovedByReferent) {
      // Toggle off / reset
      claim.guardianApprovedByReferent = false;
      delete claim.guardianApprovedAt;
      this.showToast("אישור האפוטרופסות בוטל", "neutral");
    } else {
      // Approve
      claim.guardianApprovedByReferent = true;
      claim.guardianApprovedAt = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) + " (היום)";
      if (!claim.auditTrail) claim.auditTrail = [];
      claim.auditTrail.push({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: "רונית לוי (רפרנטית תביעות)",
        action: `אושר תוקף צו אפוטרופסות עבור ${claim.guardianData?.wardName || 'המיוצג/ת'} מול מרשם משרד המשפטים`
      });
      this.showToast(`תוקף צו האפוטרופסות אושר בהצלחה ע"י רפרנטית רונית לוי!`, "success");
    }

    this.updateInspector(claim.id);
    this.renderHandlerInbox();
    this.renderManagerView();
  },

  requestGuardianDocUpdate() {
    this.openModal("modalRequestInfo");
    const noteEl = document.getElementById("reqInfoCustomNote");
    if (noteEl) {
      noteEl.value = "שלום רב, לצורך המשך הטיפול בתביעה, נדרש לצרף העתק ברור ועדכני של צו מינוי האפוטרופוס / אישור הפקדת ייפוי כוח מתמשך בתוקף מהאפוטרופוס הכללי.";
    }
  },

  managerApproveGuardianship(claimId) {
    const claim = this.state.claims.find(c => c.id === claimId);
    if (!claim) return;

    claim.guardianApprovedByReferent = true;
    claim.guardianApprovedByManager = true;
    claim.guardianApprovedAt = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) + " (אישור מנהל - דן כרמלי)";
    if (!claim.auditTrail) claim.auditTrail = [];
    claim.auditTrail.push({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: "דן כרמלי (מנהל מחלקה)",
      action: `אישור מנהל (Supervisor Override) ניתן לתוקף צו האפוטרופסות בתיק ${claim.id}`
    });

    this.showToast(`אישור מנהל ניתן בהצלחה לתביעת אפוטרופוס ${claim.id}!`, "success");
    this.renderManagerView();
    if (this.state.currentClaimId === claimId) {
      this.updateInspector(claimId);
    }
  },

  renderManagerGuardianshipTable() {
    const tbody = document.getElementById("managerGuardianshipTableBody");
    const totalEl = document.getElementById("mgrGuardianTotalCount");
    const approvedEl = document.getElementById("mgrGuardianApprovedCount");
    const pendingEl = document.getElementById("mgrGuardianPendingCount");

    const guardianClaims = this.state.claims.filter(c => c.isGuardian || !!c.guardianData);

    const total = guardianClaims.length;
    const approved = guardianClaims.filter(c => !!c.guardianApprovedByReferent).length;
    const pending = total - approved;

    if (totalEl) totalEl.innerText = total;
    if (approvedEl) approvedEl.innerText = approved;
    if (pendingEl) pendingEl.innerText = pending;

    if (tbody) {
      if (guardianClaims.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">אין כרגע תביעות אפוטרופוס פעילות במחלקה</td></tr>`;
        return;
      }

      tbody.innerHTML = guardianClaims.map(c => {
        const g = c.guardianData || (this.state.guardianship && this.state.guardianship.isApproved ? this.state.guardianship : {
          wardName: "רחל ישראלי",
          wardId: "019283746",
          guardianName: "ישראל ישראלי",
          guardianId: "028475913",
          courtCase: 'א"פ 42918-03-24'
        });
        const isAppr = !!c.guardianApprovedByReferent;

        return `
          <tr>
            <td>
              <strong>${c.id}</strong>
              <div style="font-size: 0.74rem; color: var(--text-muted);">${c.submissionDate || 'היום'}</div>
            </td>
            <td>
              <div style="font-weight: 600; color: var(--text-primary);">${g.guardianName || 'ישראל ישראלי'}</div>
              <span style="font-size: 0.74rem; color: var(--text-muted);">ת.ז. ${g.guardianId || '028475913'}</span>
            </td>
            <td>
              <div style="font-weight: 600; color: #1e40af;"><i class="fa-solid fa-user-shield"></i> ${g.wardName || 'רחל ישראלי'}</div>
              <span style="font-size: 0.74rem; color: var(--text-muted);">ת.ז. ${g.wardId || '019283746'}</span>
            </td>
            <td>
              <span class="mono-num" style="font-weight: 600;">${g.courtCase || 'א"פ 42918-03-24'}</span>
            </td>
            <td><strong>₪${(c.claimedAmount || 1800).toLocaleString()}</strong></td>
            <td>
              <span class="badge badge-neutral" style="font-size: 0.76rem;">${c.assignedHandlerName || 'רונית לוי'}</span>
            </td>
            <td>
              ${isAppr ? `
                <span class="badge badge-success" style="font-size: 0.76rem;">
                  <i class="fa-solid fa-circle-check"></i> אושר ע"י רפרנט
                </span>
                <div style="font-size: 0.72rem; color: #166534; margin-top: 0.2rem;">${c.guardianApprovedAt || 'בתוקף'}</div>
              ` : `
                <span class="badge badge-warning" style="font-size: 0.76rem;">
                  <i class="fa-solid fa-clock"></i> ממתין לבדיקה
                </span>
              `}
            </td>
            <td>
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="App.openGuardianshipProofModal('${c.id}')">
                  <i class="fa-solid fa-eye text-primary"></i> צפייה בצו
                </button>
                ${!isAppr ? `
                  <button type="button" class="btn btn-primary" style="font-size: 0.72rem; padding: 0.25rem 0.55rem;" onclick="App.managerApproveGuardianship('${c.id}')" title="אישור מנהל ישיר">
                    <i class="fa-solid fa-stamp"></i> אישור מנהל
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
