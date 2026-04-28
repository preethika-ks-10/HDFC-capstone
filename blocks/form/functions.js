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

/**
 * @param {scope} globals
 */
function stopOtpTimer(globals) {
  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }
}

/**
 * @param {scope} globals
 */
function updateLoanDetails(globals) {
  const loanAmountField = globals.form.offer.loan_amount;
  const tenureField = globals.form.offer.loan_tenure;

  const offerAmountField = globals.form.display.avail_express_loan_of;
  const emiField = globals.form.display.emi_amount;
  const roiField = globals.form.display.rate_of_interest;
  const taxesField = globals.form.display.taxes;

  const annualInterestRate = 10.97;
  const taxes = 4000;

  if (!loanAmountField || !tenureField) {
    return '';
  }

  const loanAmount = Number(loanAmountField.value || 0);
  const tenure = Number(tenureField.value || 0);

  let emi = 0;

  if (loanAmount > 0 && tenure > 0) {
    const monthlyRate = annualInterestRate / (12 * 100);

    emi =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    emi = Math.round(emi);
  }

  const formattedLoanAmount =
    '₹' + Number(loanAmount).toLocaleString('en-IN');

  const formattedEMI =
    '₹' + Number(emi).toLocaleString('en-IN');

  const formattedTaxes =
    '₹' + Number(taxes).toLocaleString('en-IN');

  if (offerAmountField) {
    globals.functions.setProperty(offerAmountField, {
      value: formattedLoanAmount,
    });
  }

  if (emiField) {
    globals.functions.setProperty(emiField, {
      value: formattedEMI,
    });
  }

  if (roiField) {
    globals.functions.setProperty(roiField, {
      value: annualInterestRate + '%',
    });
  }

  if (taxesField) {
    globals.functions.setProperty(taxesField, {
      value: formattedTaxes,
    });
  }

  return formattedEMI;
}

// eslint-disable-next-line import/prefer-default-export
export {
  getFullName,
  days,
  submitFormArrayToString,
  maskMobileNumber,
  startOtpTimer,
  stopOtpTimer,
  updateLoanDetails,
};