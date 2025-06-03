import "./pages/index.css";
import { initialCards } from "./components/cards.js";
import { createCard, handleDeleteCard, handleLikeClick } from "./components/card.js";
import { openPopup, closePopup, setupPopupCloseListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";


const cardsContainer = document.querySelector(".places__list");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const cardTitleInput = newCardForm.querySelector('.popup__input_type_card-name');
const cardUrlInput = newCardForm.querySelector('.popup__input_type_url');
const form = document.querySelector('.popup__form');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);
clearValidation(form);

function handleImageClick(name, link) {
  const popupImgElement = popupImage.querySelector(".popup__image");
  const popupImgCaption = popupImage.querySelector(".popup__caption");

  popupImgElement.src = link;
  popupImgElement.alt = name;
  popupImgCaption.textContent = name;

  openPopup(popupImage);
}

function openEditPopup() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupEdit);
}

function handleProfileSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupEdit);
}

function handleNewCardAddSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardTitleInput.value,
    link: cardUrlInput.value
  };
  const cardElement = createCard(newCardData, handleDeleteCard, handleImageClick, handleLikeClick);
  cardsContainer.prepend(cardElement);
  closePopup(popupNewCard);
  newCardForm.reset();
}

function init() {
  initialCards.forEach((cardData) => {
    cardsContainer.append(createCard(cardData, handleDeleteCard, handleImageClick, handleLikeClick));
  });
  editButton.addEventListener('click', openEditPopup);
  addButton.addEventListener('click', () => openPopup(popupNewCard));
  profileForm.addEventListener('submit', handleProfileSubmit);
  newCardForm.addEventListener('submit', handleNewCardAddSubmit);
  setupPopupCloseListeners();
}

init();