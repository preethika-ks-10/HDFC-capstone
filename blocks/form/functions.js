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

function findField(obj, fieldName, visited) {
  if (!obj || typeof obj !== "object") {
    return null;
  }

  if (visited.has(obj)) {
    return null;
  }

  visited.add(obj);

  if (obj[fieldName]) {
    return obj[fieldName];
  }

  if (
    obj.name === fieldName ||
    obj.id === fieldName ||
    obj._name === fieldName
  ) {
    return obj;
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const found = findField(obj[key], fieldName, visited);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function updateLoanDetails(globals) {
  const loanAmountField = findField(
    globals.form,
    "loan_amount",
    new WeakSet()
  );

  const tenureField = findField(
    globals.form,
    "Loan Tenure",
    new WeakSet()
  );

  const loanDisplayField = findField(
    globals.form,
    "loandisplay",
    new WeakSet()
  );

  const emiField = findField(
    globals.form,
    "emi",
    new WeakSet()
  );

  const rateField = findField(
    globals.form,
    "rate",
    new WeakSet()
  );

  const taxField = findField(
    globals.form,
    "tax",
    new WeakSet()
  );

  const annualInterestRate = 10.97;
  const taxes = 4000;

  if (!loanAmountField || !tenureField) {
    console.log("Loan amount or tenure field not found");
    return "";
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
    "₹" + loanAmount.toLocaleString("en-IN");

  const formattedEMI =
    "₹" + emi.toLocaleString("en-IN");

  const formattedTaxes =
    "₹" + taxes.toLocaleString("en-IN");

  if (loanDisplayField) {
    globals.functions.setProperty(loanDisplayField, {
      value: formattedLoanAmount,
      text: formattedLoanAmount,
    });
  }

  if (emiField) {
    globals.functions.setProperty(emiField, {
      value: formattedEMI,
      text: formattedEMI,
    });
  }

  if (rateField) {
    globals.functions.setProperty(rateField, {
      value: annualInterestRate + "%",
      text: annualInterestRate + "%",
    });
  }

  if (taxField) {
    globals.functions.setProperty(taxField, {
      value: formattedTaxes,
      text: formattedTaxes,
    });
  }

  console.log("EMI calculated:", formattedEMI);

  return formattedEMI;
}

export {
  getFullName,
  days,
  submitFormArrayToString,
  maskMobileNumber,
  startOtpTimer,
  stopOtpTimer,
  updateLoanDetails,
};