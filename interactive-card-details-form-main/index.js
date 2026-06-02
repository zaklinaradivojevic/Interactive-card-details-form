// Gather Interface Hook Pointers
const formElement = document.getElementById('card-form');
const successViewElement = document.getElementById('success-view');

const inputName = document.getElementById('cardholder-name');
const inputNumber = document.getElementById('card-number');
const inputMM = document.getElementById('card-mm');
const inputYY = document.getElementById('card-yy');
const inputCVC = document.getElementById('card-cvc');

const displayName = document.getElementById('display-name');
const displayNumber = document.getElementById('display-number');
const displayMM = document.getElementById('display-mm');
const displayYY = document.getElementById('display-yy');
const displayCVC = document.getElementById('display-cvc');

const btnContinue = document.getElementById('btn-continue');

// --- Real-time Mirror Synchronization Functions ---
inputName.addEventListener('input', () => {
  displayName.textContent = inputName.value ? inputName.value.toUpperCase() : "JANE APPLESEED";
});

inputNumber.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9E]/gi, ''); // Retains "101E" structure variant safely
  // Space values sequentially out into blocks of 4
  let structuredValue = value.match(/.{1,4}/g);
  e.target.value = structuredValue ? structuredValue.join(' ') : '';
  displayNumber.textContent = e.target.value ? e.target.value : "0000 0000 0000 0000";
});

inputMM.addEventListener('input', () => {
  displayMM.textContent = inputMM.value ? inputMM.value.padStart(2, '0') : "00";
});

inputYY.addEventListener('input', () => {
  displayYY.textContent = inputYY.value ? inputYY.value.padStart(2, '0') : "00";
});

inputCVC.addEventListener('input', () => {
  displayCVC.textContent = inputCVC.value ? inputCVC.value : "000";
});

// --- Execution Validation Error Logic ---
function throwError(inputs, displayTarget, textMessage) {
  displayTarget.textContent = textMessage;
  if (Array.isArray(inputs)) {
    inputs.forEach(targetNode => targetNode.classList.add('invalid-border'));
  } else {
    inputs.classList.add('invalid-border');
  }
}

function clearError(inputs, displayTarget) {
  displayTarget.textContent = "";
  if (Array.isArray(inputs)) {
    inputs.forEach(targetNode => targetNode.classList.remove('invalid-border'));
  } else {
    inputs.classList.remove('invalid-border');
  }
}

// --- Submit Submission Handler Validation ---
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  let submissionIsValid = true;

  // 1. Holder Name Rule Validation
  if (!inputName.value.trim()) {
    throwError(inputName, document.getElementById('error-name'), "Can't be blank");
    submissionIsValid = false;
  } else {
    clearError(inputName, document.getElementById('error-name'));
  }

  // 2. Card Number Rule Validation
  const nakedNum = inputNumber.value.replace(/\s/g, '');
  if (!inputNumber.value.trim()) {
    throwError(inputNumber, document.getElementById('error-number'), "Can't be blank");
    submissionIsValid = false;
  } else if (!/^[0-9E]+$/i.test(nakedNum)) { // Adapts matching rule criteria safely to accommodate mixed values like "101E" 
    throwError(inputNumber, document.getElementById('error-number'), "Wrong format, alphanumeric layout");
    submissionIsValid = false;
  } else if (nakedNum.length < 16) {
    throwError(inputNumber, document.getElementById('error-number'), "Must contain exactly 16 values");
    submissionIsValid = false;
  } else {
    clearError(inputNumber, document.getElementById('error-number'));
  }

  // 3. Expiry Month & Year Combination Validation
  const errorDateDisplay = document.getElementById('error-date');
  const mmInt = parseInt(inputMM.value, 10);
  
  if (!inputMM.value.trim() || !inputYY.value.trim()) {
    throwError([inputMM, inputYY], errorDateDisplay, "Can't be blank");
    submissionIsValid = false;
  } else if (isNaN(mmInt) || mmInt < 1 || mmInt > 12) {
    throwError([inputMM, inputYY], errorDateDisplay, "Must be a valid month (01-12)");
    submissionIsValid = false;
  } else {
    clearError([inputMM, inputYY], errorDateDisplay);
  }

  // 4. Verification Security Code (CVC) Validation
  if (!inputCVC.value.trim()) {
    throwError(inputCVC, document.getElementById('error-cvc'), "Can't be blank");
    submissionIsValid = false;
  } else if (inputCVC.value.length < 3 || isNaN(inputCVC.value)) {
    throwError(inputCVC, document.getElementById('error-cvc'), "Must be 3 numeric digits");
    submissionIsValid = false;
  } else {
    clearError(inputCVC, document.getElementById('error-cvc'));
  }

  // Swap visible interface nodes if everything passes validation check parameters
  if (submissionIsValid) {
    formElement.classList.add('element-hidden');
    successViewElement.classList.remove('element-hidden');
  }
});

// --- Application Return Initialization Loop ---
btnContinue.addEventListener('click', () => {
  formElement.reset();
  displayName.textContent = "JANE APPLESEED";
  displayNumber.textContent = "0000 0000 0000 0000";
  displayMM.textContent = "00";
  displayYY.textContent = "00";
  displayCVC.textContent = "000";
  
  successViewElement.classList.add('element-hidden');
  formElement.classList.remove('element-hidden');
});

 
