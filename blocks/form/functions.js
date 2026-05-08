/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
* Masks the first 5 digits of the mobile number with *
* @param {*} mobileNumber
* @returns {string} returns the mobile number with first 5 digits masked
*/
function maskMobileNumber(mobileNumber) {
  if (!mobileNumber) {
    return '';
  }
  const value = mobileNumber.toString();
  // Mask first 5 digits and keep the rest
  return ` ${'*'.repeat(5)}${value.substring(5)}`;
}

/**
 * @param {scope} globals
 */
function startOtpTimer(globals) {
  const timerField = globals.form.otp_verification.timer;
  debugger;
  let seconds = 30;

  if (!timerField) {
    return '00:30';
  }

  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }

  globals.functions.setProperty(timerField, {
    value: '00:30',
  });

  window.otpTimerInterval = setInterval(() => {
    seconds -= 1;

    const timerValue = seconds >= 10 ? `00:${seconds}` : `00:0${seconds}`;

    if (seconds > 0) {
      globals.functions.setProperty(timerField, {
        value: timerValue,
      });
    } else {
      clearInterval(window.otpTimerInterval);
      window.otpTimerInterval = null;

      globals.functions.setProperty(timerField, {
        value: 'Time expired',
      });
    }
  }, 1000);

  return '00:30';
}
/*883wr7t4*/
/**
 * Stop OTP Timer
 * @param {scope} globals
 */
function stopOtpTimer(globals) {
  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }

  const timerField = globals.form.otp_verification.timer;

  if (timerField) {
    globals.functions.setProperty(timerField, {
      value: '00:00',
    });
  }

  return '00:00';
}

/**
 * EMI Calculation
 * @param {scope} globals
 */
/**
 * EMI Calculation
 * @param {scope} globals
 */
function updateLoanDisplay(globals) {
  const data = globals.functions.exportData();

  const loanAmount =
    Number(data.loan_amount || 0) * 250000;

  return loanAmount > 0
    ? "₹" + loanAmount.toLocaleString("en-IN")
    : "";
}

function updateLoanDetails(globals) {
  const data = globals.functions.exportData();

  // Loan scaling already correct
  const loanAmount =
    Number(data.loan_amount || 0) * 250000;

  // Convert tenure step → months
  const tenureStep =
    Number(data["Loan Tenure"] || 0);

  // Map step to months (12–84)
  const tenure = tenureStep * 12;

  const rate = 10.97;
  const monthlyRate =
    rate / (12 * 100);

  let emi = 0;

  if (loanAmount > 0 && tenure > 0) {

    emi =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    emi = Math.round(emi);
  }

  return "₹" + emi.toLocaleString("en-IN");
}

function getRate() {
  return "10.97%";
}

function getTax() {
  return "₹4,000";
}



/* =====================
   OTP FRONTEND JS
===================== */

const OTP_BASE_URL = "https://writing-dimly-spout.ngrok-free.dev";

/* ---------- GET FORM ---------- */

function getForm(globals) {
  return globals && globals.form ? globals.form : null;
}

/* ---------- GET VALUE ---------- */

function getValue(globals, name) {
  try {
    if (globals && globals.functions && globals.functions.exportData) {
      const data = globals.functions.exportData();
      if (data && data[name]) return data[name];
    }

    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.value : "";
  } catch (e) {
    console.error("getValue Error:", e);
    return "";
  }
}

/* ---------- SET OTP VALUE ---------- */

function setOtpValue(globals, value) {
  try {
    const form = getForm(globals);

    if (
      form &&
      form.otp_page &&
      form.otp_page.otp_code &&
      globals.functions &&
      globals.functions.setProperty
    ) {
      globals.functions.setProperty(form.otp_page.otp_code, {
        value: value
      });
      return;
    }

    const el = document.querySelector(`[name="otp_code"]`);
    if (el) {
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  } catch (e) {
    console.error("setOtpValue Error:", e);
  }
}

/* ---------- SET TEXT VALUE ---------- */

function setTextValue(globals, fieldName, value) {
  try {
    const form = getForm(globals);

    if (
      form &&
      form.otp_page &&
      form.otp_page[fieldName] &&
      globals.functions &&
      globals.functions.setProperty
    ) {
      globals.functions.setProperty(form.otp_page[fieldName], {
        value: value,
        text: value
      });
      return;
    }

    const el = document.querySelector(`[name="${fieldName}"]`);
    if (el) {
      el.value = value;
      el.textContent = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  } catch (e) {
    console.error("setTextValue Error:", e);
  }
}

/* ---------- BUTTON ENABLE / DISABLE ---------- */

function setButtonState(globals, fieldName, enabled) {
  try {
    const form = getForm(globals);

    if (
      form &&
      form.otp_page &&
      form.otp_page[fieldName] &&
      globals.functions &&
      globals.functions.setProperty
    ) {
      globals.functions.setProperty(form.otp_page[fieldName], {
        enabled: enabled,
        disabled: !enabled,
        readOnly: !enabled
      });
    }

    const btn =
      document.querySelector(`[name="${fieldName}"]`) ||
      document.querySelector(`.field-${fieldName} button`) ||
      document.querySelector(`.field-${fieldName}`);

    if (btn) {
      btn.disabled = !enabled;
      btn.style.pointerEvents = enabled ? "auto" : "none";
      btn.style.opacity = enabled ? "1" : "0.5";
    }
  } catch (e) {
    console.error("setButtonState Error:", e);
  }
}

/* ---------- OTP TIMER ---------- */

function runOtpCountdown() {
  try {
    let seconds = 10;

    if (window.otpTimerInterval) {
      clearInterval(window.otpTimerInterval);
      window.otpTimerInterval = null;
    }

    const resendBtn =
      document.querySelector('[name="otp_resend_icon"]') ||
      document.querySelector('.field-otp_resend_icon button') ||
      document.querySelector('.field-otp_resend_icon');

    const timerEl =
      document.querySelector('[name="otp_resend_timer"]') ||
      document.querySelector('.field-otp_resend_timer') ||
      document.querySelector('.field-otp-resend-timer');

    function setTimerText(text) {
      if (timerEl) {
        timerEl.value = text;
        timerEl.textContent = text;

        const innerNodes = timerEl.querySelectorAll("p, span, div, label");
        innerNodes.forEach(function (node) {
          node.textContent = text;
        });
      }
    }

    function setResendState(enabled) {
      if (resendBtn) {
        resendBtn.disabled = !enabled;
        resendBtn.style.pointerEvents = enabled ? "auto" : "none";
        resendBtn.style.opacity = enabled ? "1" : "0.5";
      }
    }

    setResendState(false);
    setTimerText("Resend OTP in: 10 secs");

    window.otpTimerInterval = setInterval(function () {
      seconds--;

      if (seconds <= 0) {
        clearInterval(window.otpTimerInterval);
        window.otpTimerInterval = null;

        setTimerText("Resend OTP");
        setResendState(true);
        return;
      }

      setTimerText("Resend OTP in: " + seconds + " secs");
    }, 1000);

    return "";
  } catch (e) {
    console.error("runOtpCountdown Error:", e);
    return "";
  }
}
/* =====================
   GENERATE OTP
   Call in AEM rule: generateOTP(scope)
===================== */

function generateOTP() {
  try {
    const mobile =
      document.querySelector('[name="aadhaar_linked_mobile_number"]')?.value || "";

    const dob =
      document.querySelector('[name="date_of_birth"]')?.value || "";

    console.log("OTP PAYLOAD:", { mobile, dob });

    if (!mobile || !dob) {
      console.error("Mobile number and DOB are required");
      return "";
    }

    fetch("https://writing-dimly-spout.ngrok-free.dev/generate-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mobile, dob })
    })
      .then(res => res.json())
      .then(result => {
        console.log("OTP RESULT:", result);

        if (result.status === "success" && result.otp) {
          // reset only validation attempts
          window.otpValidationAttempts = 3;

          const otpInput = document.querySelector('[name="otp_code"]');
          if (otpInput) {
            otpInput.value = result.otp;
            otpInput.dispatchEvent(new Event("input", { bubbles: true }));
            otpInput.dispatchEvent(new Event("change", { bubbles: true }));
          }

          runOtpCountdown();

          console.log("OTP generated successfully:", result.otp);
        }
      })
      .catch(err => {
        console.error("Generate OTP API Error:", err);
      });

    return "";
  } catch (e) {
    console.error("generateOTP Error:", e);
    return "";
  }
}
function normalizeDOB(value) {
  if (!value) return "";

  const date = new Date(value);

  if (!isNaN(date.getTime())) {
    return date.toISOString().split("T")[0];
  }

  return String(value).trim();
}

/* =====================
   VERIFY OTP
   Required: mobile, dob, otp
===================== */

app.post("/verify-otp", (req, res) => {
  try {
    const { mobile, dob, otp } = req.body;

    if (!mobile || !dob || !otp) {
      return res.status(400).json({
        success: false,
        message: "mobile, dob and otp are required"
      });
    }

    const db = readDB();

    const record = [...db.otpRequests].reverse().find(
      item => String(item.mobile).trim() === String(mobile).trim()
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "OTP record not found"
      });
    }

    if (normalizeDOB(record.dob) !== normalizeDOB(dob)) {
      return res.status(400).json({
        success: false,
        message: "Invalid DOB"
      });
    }

    if (String(record.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (err) {
    console.error("Verify OTP error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal error"
    });
  }
});
/* =====================
   RESEND OTP
   Call in AEM rule: resendOTP(scope)
===================== */

function resendOTP() {
  try {
    if (window.otpResendAttempts === undefined) {
      window.otpResendAttempts = 3;
    }

    if (window.otpResendAttempts <= 0) {
      console.error("Maximum resend attempts reached");
      return "";
    }

    window.otpResendAttempts--;

    console.log(window.otpResendAttempts + "/3 resend(s) left");

    const otpInput = document.querySelector('[name="otp_code"]');
    if (otpInput) {
      otpInput.value = "";
      otpInput.dispatchEvent(new Event("input", { bubbles: true }));
      otpInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    generateOTP();

    return "";
  } catch (e) {
    console.error("resendOTP Error:", e);
    return "";
  }
}
/**
 * Fetch Review Details
 * @param {scope} globals
 */
/**
 * Fetch Review Details
 * @param {scope} globals
 */
function fetchReviewDetailsAPI(globals) {
  const mobile =
    document.querySelector('input[name="aadhaar_linked_mobile_number"]')?.value || "";

  console.log("Mobile sending:", mobile);

  if (!mobile) {
    console.error("Mobile number not found");
    return "Mobile missing";
  }

  fetch("https://writing-dimly-spout.ngrok-free.dev/proceed-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mobile: mobile })
  })
    .then((res) => res.json())
    .then((response) => {
      console.log("API response:", response);

      if (!response.success) return;

      const data = response.data;

      const loan_details =
        globals.form.review_details.form_accordion1776850397637.loan_details;

      const personal_details =
        globals.form.review_details.form_accordion1776850397637.personal_details;

      function setValue(field, value) {
        if (!field) {
          console.warn("Field not found");
          return;
        }

        globals.functions.setProperty(field, {
          value: value || ""
        });
      }

      /* LOAN DETAILS */

      setValue(loan_details.loandisplay, data.loanAmount);
      setValue(loan_details.emi, data.emiAmount);
      setValue(loan_details.tenure, data.tenure);
      setValue(loan_details.processing_fee, data.processingFees);
      setValue(loan_details.rate, data.rateOfInterest);
      setValue(loan_details.employer_name, data.employerName);
      setValue(loan_details.schedule_of_charges, data.scheduleOfCharges);
      setValue(loan_details.type_of_loan, data.typeOfLoan);

      /* PERSONAL DETAILS */

      setValue(personal_details.full_name, data.name);
      setValue(personal_details.mobile_number, data.mobileNumber);
      setValue(personal_details.date_of_birth, data.dob);
      setValue(personal_details.pan, data.pan);
      setValue(personal_details.current_address, data.currentAddress);
      setValue(personal_details.residence_type, data.residenceType);

      console.log("Proceed details populated");
    })
    .catch((err) => {
      console.error("API error:", err);
    });

  return "API called";
}


/*Loan application number*/
/**
 * /**
 * Proceed API
 * @param {scope} globals
 * @returns {string}
 */
function handleProceedAPI(globals) {
  const mobile =
    document.querySelector('input[name="aadhaar_linked_mobile_number"]')?.value || "";

  console.log("Mobile sending:", mobile);

  if (!mobile) {
    console.error("Mobile number missing");
    return "Mobile missing";
  }

  fetch("https://writing-dimly-spout.ngrok-free.dev/proceed-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mobile: mobile })
  })
    .then((res) => res.json())
    .then((response) => {
      console.log("Proceed Response:", response);

      if (!response.success) return;

      const applicationNumber = response.data.loanApplicationNumber;

      globals.functions.setProperty(
        globals.form.loan_application_summary.text_input1777269877834,
        {
          value: applicationNumber
        }
      );

      console.log("Application number set:", applicationNumber);
    })
    .catch((err) => {
      console.error("Proceed API error:", err);
    });

  return "Proceed API called";
}

export {
  getFullName,
  days,
  submitFormArrayToString,
  maskMobileNumber,
  updateLoanDetails,
  updateLoanDisplay,
  getRate,
  getTax,
  generateOTP,
  runOtpCountdown,
  validateOTP,
  resendOTP,
  fetchReviewDetailsAPI,
  handleProceedAPI,
};