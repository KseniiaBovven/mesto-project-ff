function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openPopup = document.querySelector(".popup_is-opened");
    if (openPopup) {
      closePopup(openPopup);
    }
  }
}

export function openPopup(popupElement) {
  popupElement.classList.add("popup_is-opened");
  document.addEventListener('keydown', handleEscClose);
}

export function closePopup(popupElement) {
  popupElement.classList.remove("popup_is-opened");
  document.removeEventListener('keydown', handleEscClose);
}

export function setupPopupCloseListeners() {
  const popups = document.querySelectorAll(".popup");
  const closeButtons = document.querySelectorAll(".popup__close");
  
  popups.forEach((popup) => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        closePopup(popup);
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closePopup(button.closest(".popup"));
    });
  });
}