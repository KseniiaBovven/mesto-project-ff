import "./pages/index.css";
import { createCard, handleDeleteCard } from "./components/card.js";
import {
  openPopup,
  closePopup,
  setupPopupCloseListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getInitialCards,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
  addCard,
  putLike,
  removeLike,
  deleteCard,
} from "./components/api.js";

const cardsContainer = document.querySelector(".places__list");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInput = profileForm.querySelector(".popup__input_type_name");
const jobInput = profileForm.querySelector(".popup__input_type_description");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const cardTitleInput = newCardForm.querySelector(
  ".popup__input_type_card-name"
);
const cardUrlInput = newCardForm.querySelector(".popup__input_type_url");
const form = document.querySelector(".popup__form");
const profileTitle = document.querySelector(".profile__title");
const profileAvatar = document.querySelector(".profile__image");
const editProfileFormName = profileForm.elements.name;
const editProfileFormDescription = profileForm.elements.description;
const updateUserAvatarForm = document.forms["update-avatar"];
const saving = "Сохранение...";
const avatarEditButton = document.querySelector(".profile__image-overlay");
const popupUpdateAvatar = document.querySelector(".popup_type_update-avatar");
const avatarInput = updateUserAvatarForm.elements["avatar-input"];

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

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
          deleteCardNew,
          handleImageClick,
          handleLikeCard,
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
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const likeAction = isLiked ? removeLike : putLike;
  likeAction(cardId)
    .then((updatedCardData) => {
      likeCounter.textContent = updatedCardData.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.error("Ошибка при обновлении лайка:", err);
    });
}

function handleEditForm(evt) {
  evt.preventDefault();
  const formButton = profileForm.querySelector(
    validationConfig.submitButtonSelector
  );
  const buttonOriginalText = formButton.textContent;
  formButton.textContent = saving;
  updateUserInfo(editProfileFormName.value, editProfileFormDescription.value)
    .then((updatedUserInfo) => {
      profileTitle.textContent = updatedUserInfo.name;
      profileDescription.textContent = updatedUserInfo.about;
      closePopup(popupEdit);
    })
    .finally(() => {
      formButton.textContent = buttonOriginalText;
    });
}

const handleAvatarForm = (evt) => {
  evt.preventDefault();
  const formButton = updateUserAvatarForm.querySelector(
    validationConfig.submitButtonSelector
  );
  const buttonOriginalText = formButton.textContent;
  formButton.textContent = "Сохранение...";
  updateUserAvatar(avatarInput.value)
    .then((data) => {
      document.querySelector(
        ".profile__image"
      ).style.backgroundImage = `url(${data.avatar})`;
      closePopup(popupUpdateAvatar);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => {
      formButton.textContent = buttonOriginalText;
    });
};

function openAvatarPopup() {
  updateUserAvatarForm.reset();
  clearValidation(updateUserAvatarForm, validationConfig);
  openPopup(popupUpdateAvatar);
}

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
  clearValidation(profileForm, validationConfig);
  openPopup(popupEdit);
}

function handleNewCardAddSubmit(evt) {
  evt.preventDefault();

  const formButton = newCardForm.querySelector(
    validationConfig.submitButtonSelector
  );
  const buttonOrigText = formButton.textContent;
  formButton.textContent = saving;

  const newCardData = {
    name: cardTitleInput.value,
    link: cardUrlInput.value,
  };

  addCard(newCardData.name, newCardData.link)
    .then((serverCardData) => {
      const cardElement = createCard(
        serverCardData,
        deleteCardNew,
        handleImageClick,
        handleLikeCard,
        serverCardData.owner._id
      );
      cardsContainer.prepend(cardElement);
      newCardForm.reset();
      clearValidation(newCardForm, validationConfig);
      closePopup(popupNewCard);
    })
    .catch((err) => {
      console.error("Ошибка при создании карточки:", err);
    })
    .finally(() => {
      formButton.textContent = buttonOrigText;
    });
}

updateUserAvatarForm.addEventListener("submit", handleAvatarForm);

function init() {
  editButton.addEventListener("click", openEditPopup);
  addButton.addEventListener("click", () => {
    openPopup(popupNewCard);
  });
  profileForm.addEventListener("submit", handleEditForm);
  newCardForm.addEventListener("submit", handleNewCardAddSubmit);
  setupPopupCloseListeners();
  avatarEditButton.addEventListener("click", openAvatarPopup);
}

init();

const deleteCardNew = (curCard, curCardId) => {
  deleteCard(curCardId)
    .then(() => {
      handleDeleteCard(curCard);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    });
};
