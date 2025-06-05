const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error, .${inputElement.name}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.style.display = 'block';
    inputElement.classList.add(config.inputErrorClass);
  }
};

const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error, .${inputElement.name}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    inputElement.classList.remove(config.inputErrorClass);
  }
};

// Паттерны и сообщения
const textInputPattern = /^[a-zA-Zа-яёА-ЯЁ\s-]+$/;
const urlInputPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
const textInputErrorMessage = "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
const urlInputErrorMessage = "Введите адрес сайта";

// Проверить валидность поля
const checkInputValidity = (inputElement, formElement, config) => {
  hideInputError(formElement, inputElement, config);
  
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
    return false;
  }

  if (inputElement.type === "url" && !urlInputPattern.test(inputElement.value)) {
    showInputError(formElement, inputElement, urlInputErrorMessage, config);
    return false;
  }

  if (inputElement.type === "text" && !textInputPattern.test(inputElement.value)) {
    showInputError(formElement, inputElement, textInputErrorMessage, config);
    return false;
  }

  return true;
};

// Переключить состояние кнопки
const toggleButtonState = (inputList, buttonElement, config) => {
  const hasInvalidInput = inputList.some(inputElement => {
    const isTextValid = inputElement.type === 'text' 
      ? textInputPattern.test(inputElement.value)
      : true;
    
    const isUrlValid = inputElement.type === 'url'
      ? urlInputPattern.test(inputElement.value)
      : true;
    
    return !inputElement.validity.valid || !isTextValid || !isUrlValid;
  });
  
  buttonElement.disabled = hasInvalidInput;
  buttonElement.classList.toggle(config.inactiveButtonClass, hasInvalidInput);
};

// Установить обработчики событий
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      const isValid = checkInputValidity(inputElement, formElement, config);
      toggleButtonState(inputList, buttonElement, config);
      
      if (inputElement.type === 'url') {
        if (urlInputPattern.test(inputElement.value)) {
          hideInputError(formElement, inputElement, config);
        }
      }
    });
    
    inputElement.addEventListener('blur', () => {
      checkInputValidity(inputElement, formElement, config);
    });
  });

  toggleButtonState(inputList, buttonElement, config);
};

// Включить валидацию всех форм
export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach(formElement => {
    setEventListeners(formElement, config);
  });
};

// Очистить валидацию формы
export const clearValidation = (formElement, config) => {
  if (!formElement) {
    console.error('Форма не найдена');
    return;
  }

  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    const errorSelector = `.${inputElement.name}-error, .${inputElement.id}-error`;
    const errorElement = formElement.querySelector(errorSelector);
    
    if (errorElement) {
      inputElement.classList.remove(config.inputErrorClass);
      errorElement.textContent = '';
      errorElement.classList.remove(config.errorClass);
    }
  });

    if (buttonElement) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const hasInvalidInput = inputList.some(inputElement => !inputElement.validity.valid);
    buttonElement.disabled = hasInvalidInput;
    buttonElement.classList.toggle(config.inactiveButtonClass, hasInvalidInput);
  }
};