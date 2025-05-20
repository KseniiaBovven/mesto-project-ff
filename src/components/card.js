export function createCard(cardData, deleteCallback, imageClickCallback, likeCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;
  
  cardElement.querySelector(".card__delete-button")
    .addEventListener("click", () => deleteCallback(cardElement));
  
  cardImage.addEventListener("click", () => imageClickCallback(cardData.name, cardData.link));
  likeButton.addEventListener("click", likeCallback);

  return cardElement;
}

export function handleDeleteCard(cardElement) {
  cardElement.remove();
}

export function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}