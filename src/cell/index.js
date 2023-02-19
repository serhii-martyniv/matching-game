import anime from "animejs";

export class Cell {
    #newDiv;

    constructor(value, index) {
        this.value = value;
        this.index = index;
        this.#newDiv = document.createElement('div');
    }

    static flip(element, back) {
        if (back) {
            anime({
                targets: element,
                translateX: "0",
                rotateY: "0",
                duration: 50,
            });      
    
        } else {
            anime({
                targets: element,
                translateX: "-100%",
                rotateY: "-180deg",
                duration: 50,
            });
        }
    }

    create() {
        this.#newDiv.classList.add('cardContainer');

        const html = `<div id="${this.index}" meta="${this.value}" class="cardContainerInner">
            <div class="card cardFront"></div>
            <div class="card cardBack">${this.value}</div>
        </div>`;

        this.#newDiv.innerHTML = html;

        return this.#newDiv.outerHTML;
    }
}
