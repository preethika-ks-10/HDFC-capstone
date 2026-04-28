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

/* timer function */
/**
 * @param {scope} globals
 */
function startOtpTimer(globals) {
  debugger;
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
 
    if (seconds >= 10) {
      globals.functions.setProperty(timerField, {
        value: `00:${seconds}`,
      });
    } else if (seconds >= 0) {
      globals.functions.setProperty(timerField, {
        value: `00:0${seconds}`,
      });
    }
 
    if (seconds <= 0) {
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
  const timerField =globals.form.otp_verification.timer;
 
  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval);
    window.otpTimerInterval = null;
  }
}
 

/* EMI calculation logic */
/**
 * @param {scope} globals
 */
function calculateEMI(principal, annualRate, tenureMonths) {

  const monthlyRate = annualRate / (12 * 100);

  if (!principal || !tenureMonths) {
    return 0;
  }

  const emi =
    principal *
    monthlyRate *
    Math.pow(1 + monthlyRate, tenureMonths) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi);
}


/* Format currency */

function formatINR(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}


/* Main update function */

function updateLoanDetails(globals) {

  /* INPUT fields */

  const loanAmountField =
    globals.form.offer.loan_amount;

  const tenureField =
    globals.form.offer.loan_tenure;


  /* OUTPUT fields */

  const offerAmountField =
    globals.form.display.avail_express_loan_of;

  const emiField =
    globals.form.display.emi_amount;

  const roiField =
    globals.form.display.rate_of_interest;

  const taxesField =
    globals.form.display.taxes;


  /* Get values */

  const loanAmount =
    Number(loanAmountField.value || 0);

  const tenure =
    Number(tenureField.value || 0);


  /* Fixed values */

  const annualInterestRate = 10.97;

  const taxes = 4000;


  /* EMI Calculation */

  const emi =
    calculateEMI(
      loanAmount,
      annualInterestRate,
      tenure
    );


  /* Update UI */

  globals.functions.setProperty(
    offerAmountField,
    {
      value: formatINR(loanAmount)
    }
  );


  globals.functions.setProperty(
    emiField,
    {
      value: formatINR(emi)
    }
  );


  globals.functions.setProperty(
    roiField,
    {
      value: annualInterestRate + "%"
    }
  );


  globals.functions.setProperty(
    taxesField,
    {
      value: formatINR(taxes)
    }
  );

}


// eslint-disable-next-line import/prefer-default-export
export {
  getFullName, days, submitFormArrayToString, maskMobileNumber,startOtpTimer, stopOtpTimer, calculateEMI,
};


export {
  updateLoanDetails
};