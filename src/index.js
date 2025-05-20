import "./pages/index.css";
import { initialCards } from "./cards.js";
// @todo: переменные
const cardTemplate = document.querySelector("#card-template").content;
const cardsContainer = document.querySelector(".places__list");
const popups = document.querySelectorAll(".popup");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewcard = document.querySelector(".popup_type_new-card");
const editButton = document.querySelector(".profile__edit-button");
const closeButton = document.querySelectorAll(".popup__close");
const addButton = document.querySelector(".profile__add-button");
const formElement = document.querySelector(".popup__form");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const cardTitleInput = document.querySelector(".popup__input_type_card-name");
const cardUrlInput = document.querySelector(".popup__input_type_url");
const newCardForm = document.querySelector('.popup__form[name="new-place"]');
// @todo: Функция создания карточки
function handleLikeClick(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

function createCard(
  cardData,
  deleteCallback,
  imageClickCallback,
  likeCallback
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardElement
    .querySelector(".card__delete-button")
    .addEventListener("click", () => {
      deleteCallback(cardElement);
    });
  cardImage.addEventListener("click", () => {
    imageClickCallback(cardData.name, cardData.link);
  });
  likeButton.addEventListener("click", likeCallback);

  return cardElement;
}

function handleImageClick(name, link) {
  const popupImage = document.querySelector(".popup_type_image");
  const popupImgElement = popupImage.querySelector(".popup__image");
  const popupCaption = popupImage.querySelector(".popup__caption");

  popupImgElement.src = link;
  popupImgElement.alt = name;
  popupCaption.textContent = name;

  openPopup(popupImage);
}

// @todo: Функция удаления карточки
function handleDeleteCard(cardElement) {
  cardElement.remove();
}
// @todo: Вывести карточки на страницу
initialCards.forEach((cardData) => {
  const card = createCard(
    cardData,
    handleDeleteCard,
    handleImageClick,
    handleLikeClick
  );
  cardsContainer.append(card);
});

function openPopup(popupElement) {
  popupElement.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closePopup(popupElement) {
  popupElement.classList.remove("popup_is-opened");
  if (document.querySelectorAll(".popup_is-opened").length === 0) {
    document.removeEventListener("keydown", handleEscClose);
  }
}
//открытие с текстом
function openEditPopup() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupEdit);
}

editButton.addEventListener("click", openEditPopup);
//сохранение
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closePopup(popupEdit);
}

formElement.addEventListener("submit", handleFormSubmit);

addButton.addEventListener("click", function () {
  openPopup(popupNewcard);
});
// добавление
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardTitleInput.value,
    link: cardUrlInput.value,
  };
  const cardElement = createCard(
    newCardData,
    handleDeleteCard,
    handleImageClick,
    handleLikeClick
  );
  cardsContainer.prepend(cardElement);
  closePopup(popupNewcard);
  newCardForm.reset();
}

newCardForm.addEventListener("submit", handleAddCardSubmit);
// закрытие попапов
popups.forEach((popup) => {
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      closePopup(popup);
    }
  });
});

closeButton.forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openPopups = document.querySelectorAll(".popup_is-opened");
    if (openPopups.length > 0) {
      closePopup(openPopups[0]);
    }
  }
}
