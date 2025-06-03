// Показать ошибку валидации
const showInputError = (formElement, inputElement, errorMessage, { inputErrorClass, errorClass }) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
};

// Скрыть ошибку валидации
const hideInputError = (formElement, inputElement, { inputErrorClass, errorClass }) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(errorClass);
};

// Проверить на недопустимые символы
const hasInvalidChars = (inputElement) => {
  if (!inputElement.pattern) return false;
  const pattern = new RegExp(`^${inputElement.pattern}$`);
  return !pattern.test(inputElement.value);
};

// Проверить валидность поля
const checkInputValidity = (formElement, inputElement, config) => {
  if (inputElement.validity.valueMissing) {
    showInputError(
      formElement,
      inputElement,
      inputElement.dataset.errorRequired || 'Это поле обязательно',
      config
    );
    return false;
  }

  if (hasInvalidChars(inputElement)) {
    showInputError(
      formElement,
      inputElement,
      inputElement.dataset.errorMessage || 'Недопустимые символы',
      config
    );
    return false;
  }

  if (inputElement.validity.tooShort || inputElement.validity.tooLong) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
    return false;
  }

  hideInputError(formElement, inputElement, config);
  return true;
};

// Переключить состояние кнопки
const toggleButtonState = (inputList, buttonElement, { inactiveButtonClass }) => {
  const hasInvalidInput = inputList.some(inputElement => 
    !inputElement.validity.valid || hasInvalidChars(inputElement)
  );
  
  buttonElement.disabled = hasInvalidInput;
  buttonElement.classList.toggle(inactiveButtonClass, hasInvalidInput);
};

// Установить обработчики событий
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
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
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement, config);
    inputElement.value = '';
  });

  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};