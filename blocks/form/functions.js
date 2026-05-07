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



/*GENERATE OTP*/
/**
 * @param {scope} globals
 */
/* GENERATE OTP */
const OTP_BASE_URL = "https://writing-dimly-spout.ngrok-free.dev";

function getValue(globals, name) {
  try {
    if (globals && globals.functions && globals.functions.exportData) {
      const data = globals.functions.exportData();
      if (data && data[name]) return data[name];
    }

    if (
      globals &&
      globals.form &&
      globals.form.personal_loan_offer &&
      globals.form.personal_loan_offer[name]
    ) {
      return globals.form.personal_loan_offer[name].value || "";
    }

    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.value : "";
  } catch (e) {
    return "";
  }
}

function setOtpValue(globals, value) {
  try {
    if (
      globals &&
      globals.functions &&
      globals.functions.setProperty &&
      globals.form &&
      globals.form.otp_page &&
      globals.form.otp_page.otp_code
    ) {
      globals.functions.setProperty(globals.form.otp_page.otp_code, {
        value: value,
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

function setTextValue(globals, fieldName, value) {
  try {
    if (
      globals &&
      globals.functions &&
      globals.functions.setProperty &&
      globals.form &&
      globals.form.otp_page &&
      globals.form.otp_page[fieldName]
    ) {
      globals.functions.setProperty(globals.form.otp_page[fieldName], {
        value: value,
        text: value,
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

function runOtpCountdown(globals) {
  try {
    console.log("Timer started");

    let seconds = 10;

    if (window.otpTimerInterval) {
      clearInterval(window.otpTimerInterval);
      window.otpTimerInterval = null;
    }

    setButtonState(globals, "otp_resend_icon", false);

    function updateTimerText(text) {
      setTextValue(globals, "otp_resend_timer", text);

      const timerWrapper =
        document.querySelector('[name="otp_resend_timer"]') ||
        document.querySelector(".field-otp_resend_timer") ||
        document.querySelector(".field-otp-resend-timer");

      if (timerWrapper) {
        timerWrapper.value = text;
        timerWrapper.textContent = text;

        const innerNodes = timerWrapper.querySelectorAll("p, span, div, label");
        innerNodes.forEach(function (node) {
          node.textContent = text;
        });
      }
    }

    updateTimerText("Resend OTP in: 10 secs");

    window.otpTimerInterval = setInterval(function () {
      updateTimerText("Resend OTP in: " + seconds + " secs");
      seconds--;

      if (seconds < 0) {
        clearInterval(window.otpTimerInterval);
        window.otpTimerInterval = null;

        updateTimerText("Resend OTP");
        setButtonState(globals, "otp_resend_icon", true);
      }
    }, 1000);

    return "";
  } catch (e) {
    console.error("runOtpCountdown Error:", e);
    return "";
  }
}
/*GRNERATE OTP*/
function generateOTP(globals) {
  try {
    const payload = {
      mobile: getValue(globals, "aadhaar_linked_mobile_number"),
      dob: getValue(globals, "date_of_birth")
    };

    console.log("OTP PAYLOAD:", payload);

    if (!payload.mobile || !payload.dob) {
      console.error("Missing mobile or DOB", payload);
      return "";
    }

    fetch(OTP_BASE_URL + "/generate-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (result) {
        console.log("OTP RESULT:", result);

        if (result.status === "success" && result.otp) {
          window.otpValidationAttempts = 3;
          window.otpResendAttempts = 3;

          setOtpValue(globals, String(result.otp));

          setTimeout(function () {
            runOtpCountdown(globals);
          }, 500);
        }
      })
      .catch(function (err) {
        console.error("Generate OTP API Error:", err);
      });

    return "";
  } catch (e) {
    console.error("generateOTP Error:", e);
    return "";
  }
}
/*VALIDATE OTP*/
function validateOTP(globals) {
  const otpPanel = globals.form.otp_page;
  const offerPanel = globals.form.offer_panel;

  const mobile =
    document.querySelector('input[name="aadhaar_linked_mobile_number"]')?.value || "";

  const dob =
    document.querySelector('input[name="date_of_birth"]')?.value || "";

  const otp =
    document.querySelector('input[name="otp_code"]')?.value || "";

  if (!mobile || !dob || !otp) {
    globals.functions.setProperty(otpPanel["success failure msg"], {
      value: "Please enter mobile, DOB and OTP",
      visible: true
    });

    return "";
  }

  if (window.otpValidationAttempts === undefined) {
    window.otpValidationAttempts = 3;
  }

  if (window.otpValidationAttempts <= 0) {
    globals.functions.setProperty(otpPanel["success failure msg"], {
      value: "Maximum OTP attempts exceeded",
      visible: true
    });

    return "";
  }

  fetch(OTP_BASE_URL + "/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    },
    body: JSON.stringify({
      mobile,
      dob,
      otp
    })
  })
    .then((res) => res.json())
    .then((response) => {
      console.log("VERIFY RESPONSE", response);

      if (response.success !== true) {
        window.otpValidationAttempts--;

        globals.functions.setProperty(otpPanel["otp_attempts_left"], {
          value: window.otpValidationAttempts + "/3 attempt(s) left"
        });

        globals.functions.setProperty(otpPanel["success failure msg"], {
          value: response.message || "Invalid OTP",
          visible: true
        });

        if (window.otpValidationAttempts <= 0) {
          globals.functions.setProperty(otpPanel["success failure msg"], {
            value: "Maximum OTP attempts exceeded",
            visible: true
          });
        }

        return "";
      }

      globals.functions.setProperty(otpPanel["success failure msg"], {
        value: "OTP verified successfully",
        visible: true
      });

      globals.functions.setProperty(otpPanel, {
        visible: false
      });

      globals.functions.setProperty(offerPanel, {
        visible: true
      });
    })
    .catch((err) => {
      console.error("Verify OTP API Error:", err);
    });

  return "";
}
  /*RESEND OTP*/ 
  function resendOTP(globals) {
  try {
    const otpPanel = globals.form.otp_page;

    if (window.otpResendAttempts === undefined) {
      window.otpResendAttempts = 3;
    }

    if (window.otpResendAttempts <= 0) {
      globals.functions.setProperty(otpPanel["success failure msg"], {
        value: "Maximum resend attempts reached",
        visible: true
      });

      return "";
    }

    window.otpResendAttempts--;
    window.otpValidationAttempts = 3;

    globals.functions.setProperty(otpPanel.otp_attempts_left, {
      value: window.otpResendAttempts + "/3 resend(s) left"
    });

    globals.functions.setProperty(otpPanel.otp_code, {
      value: ""
    });

    globals.functions.setProperty(otpPanel["success failure msg"], {
      value: "",
      visible: true
    });

    generateOTP(globals);

    console.log("OTP resent");

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
  startOtpTimer,
  stopOtpTimer,
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