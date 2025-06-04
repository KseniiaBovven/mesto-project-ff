import "./pages/index.css";
import { initialCards } from "./components/cards.js";
import { createCard, handleDeleteCard, handleLikeClick } from "./components/card.js";
import { openPopup, closePopup, setupPopupCloseListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getInitialCards,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
  addCard,
  putLike,
  removeLike,
} from './components/api.js';

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
const profileTitle = document.querySelector('.profile__title');
const profileAvatar = document.querySelector('.profile__image');
const newCardFormName = newCardForm.elements['place-name'];
const newCardFormLink = newCardForm.elements.link;
const editProfileFormName = profileForm.elements.name;
const editProfileFormDescription = profileForm.elements.description;
const updateUserAvatarForm = document.forms['update-avatar'];
const saving = 'Сохранение...';
const avatarEditButton = document.querySelector('.profile__image-overlay');


const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);
clearValidation(form, validationConfig);


Promise.all([getUserInfo(), getInitialCards()])
  .then((results) => {
    const userData = results[0];
    const cardList = results[1];
    if (userData) {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
    }
    if (cardList.length > 0) {
      cardList.forEach((element) => {
        const newCard = createCard(
  element,
  {
    handleDeleteCard,
    handleImageClick,
    handleLikeCard,
  },
  userData._id
);
        cardsContainer.append(newCard);
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });

function handleLikeCard(likeButton, likeCounter, cardId) {
  // Определяем текущее состояние и соответствующее действие
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const likeAction = isLiked ? removeLike : putLike;

  // Выполняем запрос
  likeAction(cardId)
    .then((updatedCardData) => {
      likeCounter.textContent = updatedCardData.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch((err) => {
      console.error('Ошибка при обновлении лайка:', err);
    });
}

function handleEditForm(evt) {
  evt.preventDefault();
  const formButton = profileForm.querySelector(validationConfig.submitButtonSelector);
  const buttonOrigText = formButton.textContent;
  formButton.textContent = saving;
  updateUserInfo(editProfileFormName.value, editProfileFormDescription.value)
    .then((updatedUserInfo) => {
      profileTitle.textContent = updatedUserInfo.name;
      profileDescription.textContent = updatedUserInfo.about;
      closePopup(popupEdit);
    })
    .finally(() => {
      formButton.textContent = buttonOrigText;
    });
}

function handleNewPlaceForm(evt) {
  evt.preventDefault();
  
  const submitButton = newCardForm.querySelector(validationConfig.submitButtonSelector);
  const buttonOriginalText = submitButton.textContent;
  submitButton.textContent = saving;

  const cardData = {
    name: newCardFormName.value,
    link: newCardFormLink.value
  };

  addCard(cardData.name, cardData.link)
    .then((serverCardData) => {
      const cardOptions = {
        handleDeleteCard,
        handleImageClick,
        handleLikeCard: (likeBtn, likeCounter) => 
          handleLikeCard(likeBtn, likeCounter, serverCardData._id)
      };

      const newCard = createCard(
        serverCardData,
        cardOptions,
        serverCardData.owner._id
      );

      cardsContainer.prepend(newCard);
      resetForm();
    })
    .catch((err) => {
      console.error('Ошибка при создании карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = buttonOriginalText;
    });

  function resetForm() {
    newCardForm.reset();
    closePopup(popupNewCard);
    clearValidation(newCardForm, validationConfig);
  }
}

function handleAvatarForm(evt) {
  evt.preventDefault();
  const avatarUrl = updateUserAvatarForm.elements.link.value;
  const formButton = updateUserAvatarForm.querySelector(
    validationConfig.submitButtonSelector
  );
  const buttonOrigText = formButton.textContent;
  formButton.textContent = saving;
  fetch(avatarUrl, { method: 'HEAD' })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(`${res.status}`);
      }
      const contentType = res.headers.get('Content-Type');
      if (!contentType || !contentType.startsWith('image/')) {
        return Promise.reject('ссылка не является изображением');
      }
      return updateUserAvatar(avatarUrl);
    })
    .then(() => {
      profileAvatar.style.backgroundImage = `url('${avatarUrl}')`;
      closePopup(popupUpdateAvatar);
      updateUserAvatarForm.reset();
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => {
      formButton.textContent = buttonOrigText;
    });
}



profileForm.addEventListener('submit', handleEditForm);
newCardForm.addEventListener('submit', handleNewPlaceForm);
updateUserAvatarForm.addEventListener('submit', handleAvatarForm);

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
  clearValidation(form, validationConfig);
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
  avatarEditButton.addEventListener('click', () => openPopup(popupUpdateAvatar));
}

init();