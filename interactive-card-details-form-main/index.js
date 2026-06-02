// DOM elementi
const formElement = document.getElementById('card-form');
const successViewElement = document.getElementById('success-view');

const inputName = document.getElementById('cardholder-name');
const inputNumber = document.getElementById('card-number');
const inputMM = document.getElementById('card-mm');
const inputYY = document.getElementById('card-yy');
const inputCVC = document.getElementById('card-cvc');

const displayName = document.getElementById('display-name');
const displayNumber = document.getElementById('display-number');
const displayDate = document.getElementById('display-date');
const displayCVC = document.getElementById('display-cvc');

const btnContinue = document.getElementById('btn-continue');

// Pomoćna funkcija za formatiranje broja kartice
function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '');
  const parts = [];
  for (let i = 0; i < digits.length && i < 16; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
}

// Real-time ažuriranje
inputName.addEventListener('input', () => {
  const val = inputName.value.trim();
  displayName.textContent = val ? val.toUpperCase() : 'JANE APPLESEED';
});

inputNumber.addEventListener('input', (e) => {
  let formatted = formatCardNumber(e.target.value);
  e.target.value = formatted;
  displayNumber.textContent = formatted || '0000 0000 0000 0000';
});

function updateDateDisplay() {
  const mm = inputMM.value.padStart(2, '0').slice(0, 2);
  const yy = inputYY.value.padStart(2, '0').slice(0, 2);
  displayDate.textContent = `${mm}/${yy}`;
}

inputMM.addEventListener('input', updateDateDisplay);
inputYY.addEventListener('input', updateDateDisplay);

inputCVC.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '').slice(0, 3);
  e.target.value = val;
  displayCVC.textContent = val || '000';
});

// Greške
function setError(inputs, errorSpan, message) {
  errorSpan.textContent = message;
  if (Array.isArray(inputs)) {
    inputs.forEach(inp => inp.classList.add('invalid-border'));
  } else {
    inputs.classList.add('invalid-border');
  }
}

function clearError(inputs, errorSpan) {
  errorSpan.textContent = '';
  if (Array.isArray(inputs)) {
    inputs.forEach(inp => inp.classList.remove('invalid-border'));
  } else {
    inputs.classList.remove('invalid-border');
  }
}

// Validacija
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  // Ime
  if (!inputName.value.trim()) {
    setError(inputName, document.getElementById('error-name'), "Can't be blank");
    isValid = false;
  } else {
    clearError(inputName, document.getElementById('error-name'));
  }

  // Broj kartice
  const rawNumber = inputNumber.value.replace(/\s/g, '');
  if (!rawNumber) {
    setError(inputNumber, document.getElementById('error-number'), "Can't be blank");
    isValid = false;
  } else if (!/^\d{16}$/.test(rawNumber)) {
    setError(inputNumber, document.getElementById('error-number'), "Must be 16 digits");
    isValid = false;
  } else {
    clearError(inputNumber, document.getElementById('error-number'));
  }

  // Datum
  const mm = inputMM.value.trim();
  const yy = inputYY.value.trim();
  const mmNum = parseInt(mm, 10);
  const errorDateSpan = document.getElementById('error-date');

  if (!mm || !yy) {
    setError([inputMM, inputYY], errorDateSpan, "Can't be blank");
    isValid = false;
  } else if (mm.length !== 2 || yy.length !== 2 || isNaN(mmNum) || mmNum < 1 || mmNum > 12) {
    setError([inputMM, inputYY], errorDateSpan, "Invalid date (MM 01-12, YY 00-99)");
    isValid = false;
  } else {
    clearError([inputMM, inputYY], errorDateSpan);
  }

  // CVC
  const cvc = inputCVC.value.trim();
  if (!cvc) {
    setError(inputCVC, document.getElementById('error-cvc'), "Can't be blank");
    isValid = false;
  } else if (!/^\d{3}$/.test(cvc)) {
    setError(inputCVC, document.getElementById('error-cvc'), "Must be 3 digits");
    isValid = false;
  } else {
    clearError(inputCVC, document.getElementById('error-cvc'));
  }

  if (isValid) {
    formElement.classList.add('element-hidden');
    successViewElement.classList.remove('element-hidden');
  }
});

// Continue dugme
btnContinue.addEventListener('click', () => {
  formElement.reset();
  displayName.textContent = 'JANE APPLESEED';
  displayNumber.textContent = '0000 0000 0000 0000';
  displayDate.textContent = '00/00';
  displayCVC.textContent = '000';

  successViewElement.classList.add('element-hidden');
  formElement.classList.remove('element-hidden');

  document.querySelectorAll('.error-text').forEach(span => span.textContent = '');
  document.querySelectorAll('.invalid-border').forEach(input => input.classList.remove('invalid-border'));
});

