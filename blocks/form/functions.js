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



/**
 * OTP success handler
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpSuccess(globals) {
  const panel = globals.form.otp_verification;
 
  const validationMessage = panel.validation_message;
  const resendBtn = panel.resend_otp;
  const submitBtn = panel.otp_submit;
 
  stopOtpTimer(globals);
 
  window.otpResendAttemptsLeft = 3;
  window.otpTimerExpired = false;
 
  if (validationMessage) {
    globals.functions.setProperty(validationMessage, {
      value: "OTP validated successfully",
      visible: true
    });
  }
 
  if (resendBtn) {
    globals.functions.setProperty(resendBtn, {
      visible: false,
      enabled: false
    });
  }
 
  if (submitBtn) {
    globals.functions.setProperty(submitBtn, {
      enabled: true
    });
  }
 
  return "OTP validated successfully";
}
 
/**
 * OTP invalid handler
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpInvalid(globals) {
  const panel = globals.form.otp_verification;
 
  const validationMessage = panel.validation_message;
  const resendBtn = panel.resend_otp;
  const submitBtn = panel.otp_submit;
 
  // reduce attempts
  window.otpResendAttemptsLeft = window.otpResendAttemptsLeft || 3;
  if (window.otpResendAttemptsLeft > 0) {
    window.otpResendAttemptsLeft -= 1;
  }
 
  // show invalid message
  if (validationMessage) {
    globals.functions.setProperty(validationMessage, {
      value: "Invalid OTP",
      visible: true
    });
  }
 
  // disable submit if no attempts left
  if (submitBtn) {
    globals.functions.setProperty(submitBtn, {
      enabled: window.otpResendAttemptsLeft > 0
    });
  }
 
  // show resend if attempts still available
  if (resendBtn) {
    globals.functions.setProperty(resendBtn, {
      visible: window.otpResendAttemptsLeft > 0,
      enabled: window.otpResendAttemptsLeft > 0
    });
  }
 
  return "Invalid OTP";
}
 
 
/**
 * Resend OTP handler
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpResend(globals) {
  const panel = globals.form.otp_verification;
 
  const attemptInfo = panel.attempt_info;
  const validationMessage = panel.validation_message;
  const resendBtn = panel.resend_otp;
 
  window.otpResendAttemptsLeft = window.otpResendAttemptsLeft ?? 3;
 
  if (window.otpResendAttemptsLeft > 0) {
    window.otpResendAttemptsLeft -= 1;
  }
 
  if (attemptInfo) {
    globals.functions.setProperty(attemptInfo, {
      value: `${window.otpResendAttemptsLeft}/3 attempt(s) left`
    });
  }
 
  if (validationMessage) {
    globals.functions.setProperty(validationMessage, {
      value: "",
      visible: false
    });
  }
 
  if (resendBtn) {
    globals.functions.setProperty(resendBtn, {
      visible: false,
      enabled: false
    });
  }
 
  startOtpTimer(globals);
 
  return `${window.otpResendAttemptsLeft}/3 attempt(s) left`;
}
 
/**
 * 3/3 attempts
 * @param {scope} globals
 * @returns {string}
 */
function handleOtpGenerated(globals) {
  const panel = globals.form.otp_verification;
  const attemptInfo = panel.attempt_info;
 
  window.otpResendAttemptsLeft = 3;
 
  if (attemptInfo) {
    globals.functions.setProperty(attemptInfo, {
      value: "3/3 attempt(s) left"
    });
  }
 
  startOtpTimer(globals);
 
  return "OTP generated";
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
  handleOtpSuccess, handleOtpResend,
  handleOtpInvalid, handleOtpGenerated,
  fetchReviewDetailsAPI,
  handleProceedAPI,
};