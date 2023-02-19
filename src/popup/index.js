export class Popup {
  #newDiv;

  constructor(gridItem) {
    this.gridItem = gridItem;

    this.#newDiv = document.createElement('div');
  }

  createPopup(text) {
    this.#newDiv.classList.add('popup');
    this.#newDiv.id = 'popup';
    this.#newDiv.innerText = text;
    // const html = `<div class="popup" id="popup">${text}</div>`;

    this.gridItem.insertAdjacentHTML('beforeend', this.#newDiv.outerHTML);
  }
}
