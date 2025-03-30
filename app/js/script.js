const formElement = document.querySelector('.contact__form');
const formGroups = document.querySelectorAll('.contact__form-group');
const radioDivs = document.querySelectorAll('.radio');
const successMessage = document.querySelector('.contact__wrapper-success');

formElement.setAttribute('novalidate', '');

// Helper function to toggle radio button background styling
const changeRadioBg = () => {
  radioDivs.forEach((radioDiv) => {
    const radio = radioDiv.querySelector('input');
    radioDiv.classList.toggle('radio-selected', radio.checked);
  });
};

// Display error messages by removing `.hidden`
const displayError = (formGroup, errorSelector) => {
  const errorMessage = formGroup.querySelector(errorSelector);
  if (errorMessage) {
    errorMessage.classList.remove('hidden');
    errorMessage.style.display = 'block';
  }
};

// Hide error messages by adding `.hidden`
const removeError = (formGroup) => {
  const errorMessages = formGroup.querySelectorAll('.contact__error');
  errorMessages.forEach((error) => {
    error.classList.add('hidden');
    error.style.display = 'none';
  });
};

// Validation logic for different field types
const validateGroup = (formGroup) => {
  const inputElement = formGroup.querySelector('input, textarea');
  if (!inputElement) return true;

  const inputType = inputElement.type || inputElement.tagName.toLowerCase();
  let isValid = true;

  switch (inputType) {
    case 'radio': {
      const radios = formGroup.querySelectorAll("input[type='radio']");
      const isChecked = Array.from(radios).some((radio) => radio.checked);

      if (!isChecked) {
        displayError(formGroup, '.contact__error');
        isValid = false;
      }
      break;
    }

    case 'checkbox':
      if (!inputElement.checked) {
        displayError(formGroup, '.contact__error');
        isValid = false;
      }
      break;

    case 'text':
    case 'textarea':
      if (inputElement.value.trim() === '') {
        displayError(formGroup, '.contact__error');
        isValid = false;
        inputElement.classList.add('error-border');
      } else {
        inputElement.classList.remove('error-border');
      }
      break;

    case 'email': {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (inputElement.value.trim() === '') {
        displayError(formGroup, '.empty');
        isValid = false;
        inputElement.classList.add('error-border');
      } else if (!emailPattern.test(inputElement.value)) {
        displayError(formGroup, '.valid');
        isValid = false;
        inputElement.classList.add('error-border');
      } else {
        inputElement.classList.remove('error-border');
      }
      break;
    }

    default:
      break;
  }

  return isValid;
};

// Function to validate all radio groups separately
const validateRadioGroups = () => {
  let allRadiosValid = true;

  const radioGroups = document.querySelectorAll(
    '.contact__form-group[data-type="radio"]'
  );
  console.log('validateRadioGroups called');

  radioGroups.forEach((radioGroup) => {
    const radios = radioGroup.querySelectorAll("input[type='radio']");
    const isChecked = Array.from(radios).some((radio) => radio.checked);

    if (!isChecked) {
      console.log('Radio group is invalid');
      // Find the error message which is a sibling of the form group
      const errorElement =
        radioGroup.parentElement.querySelector('.contact__error');
      if (errorElement) {
        errorElement.classList.remove('hidden');
        errorElement.style.display = 'block';
      }
      allRadiosValid = false;
    } else {
      console.log('Radio group is valid');
      // Find the error message and hide it
      const errorElement =
        radioGroup.parentElement.querySelector('.contact__error');
      if (errorElement && !errorElement.classList.contains('hidden')) {
        errorElement.classList.add('hidden');
        errorElement.style.display = 'none';
      }
    }
  });

  return allRadiosValid;
};

// Function to display success message
const displayMessage = () => {
  if (successMessage) {
    successMessage.classList.remove('hidden');
    successMessage.style.display = 'block';

    setTimeout(() => {
      successMessage.classList.add('hidden');
      successMessage.style.display = 'none';
    }, 4000);
  }
};

// Event listeners

// Handle success message from localStorage
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('showSuccessMessage') === 'true' && successMessage) {
    displayMessage();
    localStorage.removeItem('showSuccessMessage');
  }
});

// Handle radio button selection and background color change
radioDivs.forEach((radioDiv) => {
  radioDiv.addEventListener('click', () => {
    const radioInput = radioDiv.querySelector('input');
    if (radioInput) {
      radioInput.checked = true;
      changeRadioBg();
      removeError(radioDiv.closest('.contact__form-group'));
    }
  });
});

// Form submission handler
formElement.addEventListener('submit', (event) => {
  event.preventDefault();

  let formValid = true;

  formGroups.forEach((formGroup) => {
    const isGroupValid = validateGroup(formGroup);
    if (!isGroupValid) {
      formValid = false;
    }
  });

  const radiosValid = validateRadioGroups();
  formValid = formValid && radiosValid;

  if (formValid) {
    displayMessage();
    localStorage.setItem('showSuccessMessage', 'true');
    console.log('Form submitted successfully (client-side validation)');
    formElement.submit();
  }
});

// Input field validation on focus and blur
formGroups.forEach((formGroup) => {
  const inputs = formGroup.querySelectorAll('input, textarea');

  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      removeError(formGroup);
    });

    input.addEventListener('blur', () => {
      validateGroup(formGroup);
    });
  });
});

// Hide success message on click
if (successMessage) {
  successMessage.addEventListener('click', () => {
    successMessage.classList.add('hidden');
    successMessage.style.display = 'none';
  });
}
