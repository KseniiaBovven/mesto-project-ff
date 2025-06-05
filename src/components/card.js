export function createCard(
  cardData,
  deleteCallback,
  imageClickCallback,
  likeCallback,
  ownerId
) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likesNum = cardElement.querySelector('.card__likes');
   const deleteButton = cardElement.querySelector('.card__delete-button');
   if (cardData.owner._id !== ownerId) {
    deleteButton.style.display = 'none';
  }

  deleteButton.addEventListener('click', () =>
    deleteCallback(cardElement, cardData._id)
  );

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector('.card__title').textContent = cardData.name;

  likesNum.textContent = 0;

  if (cardData.likes) {
    likesNum.textContent = cardData.likes.length;

    if (cardData.likes.some((like) => like._id === ownerId)) {
      likeButton.classList.add('card__like-button_is-active');
    }
  }

  cardElement
    .querySelector('.card__delete-button')
    .addEventListener('click', () => deleteCallback(cardElement, cardData._id));

  cardImage.addEventListener('click', () =>
    imageClickCallback(cardData.name, cardData.link)
  );
  likeButton.addEventListener('click', () => likeCallback(likeButton, likesNum, cardData._id));

  return cardElement;
}

export function handleDeleteCard(cardElement) {
  cardElement.remove();
}

export function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}
